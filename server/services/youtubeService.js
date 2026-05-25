const axios = require('axios');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_HANDLE = (process.env.YOUTUBE_CHANNEL_HANDLE || '@doublecheckbysanket').replace('@', '');
const BASE = 'https://www.googleapis.com/youtube/v3';

// Module-level cache — resolved once per process lifetime
let cachedChannelId = null;
let cachedUploadsPlaylistId = null;
let cachedChannelMeta = null;

function parseDuration(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  const h = parseInt(match[1] || 0);
  const m = parseInt(match[2] || 0);
  const s = parseInt(match[3] || 0);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatCount(raw) {
  const n = parseInt(raw || 0, 10);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

async function resolveChannel() {
  if (cachedChannelId) return;

  const res = await axios.get(`${BASE}/channels`, {
    params: {
      part: 'id,snippet,contentDetails,statistics,brandingSettings',
      forHandle: CHANNEL_HANDLE,
      key: API_KEY,
    },
  });

  const item = res.data.items?.[0];
  if (!item) throw new Error(`Channel not found for handle: ${CHANNEL_HANDLE}`);

  cachedChannelId = item.id;
  cachedUploadsPlaylistId = item.contentDetails.relatedPlaylists.uploads;

  cachedChannelMeta = {
    name: item.snippet.title,
    avatar: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
    banner: item.brandingSettings?.image?.bannerExternalUrl
      ? `${item.brandingSettings.image.bannerExternalUrl}=w2276-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj`
      : '',
    subscriberCount: formatCount(item.statistics.subscriberCount),
    videoCount: formatCount(item.statistics.videoCount),
  };
}

async function getChannelVideos(maxResults = 12, pageToken = '') {
  await resolveChannel();

  const params = {
    part: 'snippet,contentDetails',
    playlistId: cachedUploadsPlaylistId,
    maxResults,
    key: API_KEY,
  };
  if (pageToken) params.pageToken = pageToken;

  const listRes = await axios.get(`${BASE}/playlistItems`, { params });
  const items = listRes.data.items || [];
  const nextPageToken = listRes.data.nextPageToken || null;

  const videoIds = items.map(i => i.contentDetails.videoId).join(',');
  if (!videoIds) return { videos: [], nextPageToken: null };

  const detailRes = await axios.get(`${BASE}/videos`, {
    params: {
      part: 'snippet,statistics,contentDetails',
      id: videoIds,
      key: API_KEY,
    },
  });

  const detailMap = {};
  for (const v of detailRes.data.items || []) {
    detailMap[v.id] = v;
  }

  const videos = items.map(item => {
    const id = item.contentDetails.videoId;
    const detail = detailMap[id] || {};
    const snippet = detail.snippet || item.snippet || {};
    const stats = detail.statistics || {};
    const content = detail.contentDetails || {};

    const thumbs = snippet.thumbnails || {};
    const thumbnail =
      thumbs.maxres?.url || thumbs.high?.url || thumbs.medium?.url || thumbs.default?.url || '';

    return {
      id,
      title: snippet.title || '',
      description: (snippet.description || '').slice(0, 200),
      thumbnail,
      publishedAt: snippet.publishedAt || item.snippet?.publishedAt || '',
      duration: parseDuration(content.duration || 'PT0S'),
      viewCount: formatCount(stats.viewCount),
      likeCount: formatCount(stats.likeCount),
    };
  });

  return { videos, nextPageToken };
}

async function getChannelMeta() {
  await resolveChannel();
  return cachedChannelMeta;
}

module.exports = { getChannelVideos, getChannelMeta };
