import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import VideoPlayer from './components/VideoPlayer';
import VideoGrid from './components/VideoGrid';
import SearchBar from './components/SearchBar';
import { useVideos } from './hooks/useVideos';
import { fetchChannel } from './services/api';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [channel, setChannel] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { videos, isLoading, error, loadMore, hasMore } = useVideos();

  useEffect(() => {
    fetchChannel().then(setChannel).catch(() => {});
  }, []);

  const handleSearch = useCallback(q => {
    setSearchQuery(q.trim());
    setActiveIndex(0);
  }, []);

  const filteredVideos = searchQuery
    ? videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : videos;

  const activeVideo = filteredVideos[activeIndex] || null;
  const showHasMore = !searchQuery && hasMore;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar channel={channel} />

      {channel?.banner && (
        <img
          src={channel.banner}
          alt="Channel banner"
          className="w-full"
          style={{ display: 'block', height: 'auto' }}
        />
      )}

      <VideoPlayer
        video={activeVideo}
        hasPrev={activeIndex > 0}
        hasNext={activeIndex < filteredVideos.length - 1}
        onPrev={() => setActiveIndex(i => i - 1)}
        onNext={() => setActiveIndex(i => i + 1)}
      />

      <div className="px-6 py-6">
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ background: '#1a0000', border: '1px solid var(--accent)' }}>
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

        <VideoGrid
          videos={filteredVideos}
          isLoading={isLoading}
          hasMore={showHasMore}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          onLoadMore={loadMore}
        />
      </div>
    </div>
  );
}
