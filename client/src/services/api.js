import axios from 'axios';

const BASE_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';

const client = axios.create({ baseURL: BASE_URL });

export async function fetchVideos(maxResults = 12, pageToken = '') {
  const params = { maxResults };
  if (pageToken) params.pageToken = pageToken;
  const { data } = await client.get('/api/videos', { params });
  return data;
}

export async function fetchChannel() {
  const { data } = await client.get('/api/channel');
  return data;
}
