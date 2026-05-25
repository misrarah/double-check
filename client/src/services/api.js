import axios from 'axios';

const DIRECT_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YT = 'https://www.googleapis.com/youtube/v3';
const HANDLE = 'doublecheckbysanket';

const proxyClient = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:3001' : '',
});

// ── Direct YouTube API (used when VITE_YOUTUBE_API_KEY is set) ──────────────

function parseDuration(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return '0:00';
  const h = parseInt(m[1] || 0), min = parseInt(m[2] || 0), s = parseInt(m[3] || 0);
  if (h > 0) return `${h}:${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${min}:${String(s).padStart(2, '0')}`;
}

function formatCount(n) {
  n = parseInt(n || 0);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

let _channelId = null, _uploadsId = null, _meta = null;

async function resolveChannel() {
  if (_channelId) return;
  const { data } = await axios.get(`${YT}/channels`, {
    params: {
      part: 'id,snippet,contentDetails,statistics,brandingSettings',
      forHandle: HANDLE,
      key: DIRECT_KEY,
    },
  });
  const item = data.items?.[0];
  if (!item) throw new Error('Channel not found');
  _channelId = item.id;
  _uploadsId = item.contentDetails.relatedPlaylists.uploads;
  const bannerBase = item.brandingSettings?.image?.bannerExternalUrl;
  _meta = {
    name: item.snippet.title,
    avatar: item.snippet.thumbnails?.high?.url || '',
    banner: bannerBase
      ? `${bannerBase}=w2276-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj`
      : '',
    subscriberCount: formatCount(item.statistics.subscriberCount),
    videoCount: formatCount(item.statistics.videoCount),
  };
}

async function directFetchVideos(maxResults = 12, pageToken = '') {
  await resolveChannel();
  const params = {
    part: 'snippet,contentDetails',
    playlistId: _uploadsId,
    maxResults,
    key: DIRECT_KEY,
  };
  if (pageToken) params.pageToken = pageToken;
  const { data: list } = await axios.get(`${YT}/playlistItems`, { params });
  const items = list.items || [];
  const ids = items.map(i => i.contentDetails.videoId).join(',');
  if (!ids) return { videos: [], nextPageToken: null };
  const { data: details } = await axios.get(`${YT}/videos`, {
    params: { part: 'snippet,statistics,contentDetails', id: ids, key: DIRECT_KEY },
  });
  const detailMap = Object.fromEntries((details.items || []).map(v => [v.id, v]));
  const videos = items.map(item => {
    const id = item.contentDetails.videoId;
    const d = detailMap[id] || {};
    const sn = d.snippet || item.snippet || {};
    const st = d.statistics || {};
    const ct = d.contentDetails || {};
    const th = sn.thumbnails || {};
    return {
      id,
      title: sn.title || '',
      description: (sn.description || '').slice(0, 200),
      thumbnail: th.maxres?.url || th.high?.url || th.medium?.url || '',
      publishedAt: sn.publishedAt || '',
      duration: parseDuration(ct.duration || 'PT0S'),
      viewCount: formatCount(st.viewCount),
      likeCount: formatCount(st.likeCount),
    };
  });
  return { videos, nextPageToken: list.nextPageToken || null };
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function fetchVideos(maxResults = 12, pageToken = '') {
  if (DIRECT_KEY) return directFetchVideos(maxResults, pageToken);
  const params = { maxResults };
  if (pageToken) params.pageToken = pageToken;
  const { data } = await proxyClient.get('/api/videos', { params });
  return data;
}

export async function fetchChannel() {
  if (DIRECT_KEY) {
    await resolveChannel();
    return _meta;
  }
  const { data } = await proxyClient.get('/api/channel');
  return data;
}
