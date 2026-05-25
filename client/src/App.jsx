import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import VideoGrid from './components/VideoGrid';
import { useVideos } from './hooks/useVideos';
import { fetchChannel } from './services/api';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [channel, setChannel] = useState(null);

  const { videos, isLoading, error, loadMore, hasMore } = useVideos();

  useEffect(() => {
    fetchChannel().then(setChannel).catch(() => {});
  }, []);

  const handleSearch = useCallback(q => setSearchQuery(q.trim()), []);

  const filteredVideos = searchQuery
    ? videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : videos;

  const showHasMore = !searchQuery && hasMore;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar channel={channel} onSearch={handleSearch} />

      {/* Hero: banner + channel info */}
      <div>
        {channel?.banner && (
          <div style={{ maxHeight: 180, overflow: 'hidden' }}>
            <img
              src={channel.banner}
              alt="Channel banner"
              className="w-full object-cover"
              style={{ maxHeight: 180, display: 'block' }}
            />
          </div>
        )}
        <div className="px-6 py-5 flex items-center gap-4" style={{ borderBottom: '1px solid var(--border)' }}>
          {channel?.avatar && (
            <img
              src={channel.avatar}
              alt={channel?.name}
              className="rounded-full object-cover flex-shrink-0"
              style={{ width: 72, height: 72, border: '3px solid var(--surface)' }}
            />
          )}
          <div>
            {channel?.name && (
              <h1
                className="text-5xl leading-none mb-1"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                {channel.name}
              </h1>
            )}
            {channel && (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {channel.subscriberCount} subscribers · {channel.videoCount} videos
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div
          className="mx-6 mt-6 p-4 rounded-lg flex items-center gap-3"
          style={{ background: '#fff3f3', border: '1px solid #ffc0c0' }}
        >
          <span style={{ color: 'var(--accent)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </span>
          <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
            Failed to load videos. Please check your connection.
          </span>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-semibold px-3 py-1 rounded"
            style={{ color: 'var(--accent)', background: 'transparent', border: '1px solid var(--accent)' }}
          >
            Try again
          </button>
        </div>
      )}

      {/* Video grid */}
      <main className="px-6 py-8">
        <VideoGrid
          videos={filteredVideos}
          isLoading={isLoading}
          hasMore={showHasMore}
          onLoadMore={loadMore}
        />
      </main>
    </div>
  );
}
