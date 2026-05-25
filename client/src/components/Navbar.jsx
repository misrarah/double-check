import { useEffect, useState, useCallback } from 'react';
import SearchBar from './SearchBar';

export default function Navbar({ channel, onSearch }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearch = useCallback(q => onSearch(q), [onSearch]);

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 h-14"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Left: avatar + channel name */}
      <div className="flex items-center gap-3">
        {channel?.avatar && (
          <img
            src={channel.avatar}
            alt={channel.name}
            className="rounded-full object-cover flex-shrink-0"
            style={{ width: 32, height: 32 }}
          />
        )}
        {channel?.name && (
          <span
            className="text-2xl leading-none tracking-wide"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
            }}
          >
            {channel.name}
          </span>
        )}
      </div>

      {/* Right: search */}
      <SearchBar onSearch={handleSearch} />
    </nav>
  );
}
