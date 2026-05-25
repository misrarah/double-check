import { useState, useEffect } from 'react';
import { fetchVideos } from '../services/api';

export function useVideos() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState('');
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchVideos(12)
      .then(data => {
        if (cancelled) return;
        setVideos(data.videos);
        setNextPageToken(data.nextPageToken || '');
        setHasMore(!!data.nextPageToken);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message || 'Failed to load videos');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  async function loadMore() {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      const data = await fetchVideos(12, nextPageToken);
      setVideos(prev => [...prev, ...data.videos]);
      setNextPageToken(data.nextPageToken || '');
      setHasMore(!!data.nextPageToken);
    } catch (err) {
      setError(err.message || 'Failed to load more videos');
    } finally {
      setIsLoading(false);
    }
  }

  return { videos, isLoading, error, loadMore, hasMore };
}
