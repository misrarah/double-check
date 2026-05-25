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
      {/* Left: logo */}
      <div className="flex items-center">
        <img
          src="/logo.png"
          alt="Double Check"
          className="flex-shrink-0"
          style={{ height: 36, width: 'auto' }}
        />
      </div>

      {/* Right: search */}
      <SearchBar onSearch={handleSearch} />
    </nav>
  );
}
