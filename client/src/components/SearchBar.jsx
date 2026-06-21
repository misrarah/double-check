import { useState, useEffect, useRef } from 'react';

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, 200);
    return () => clearTimeout(timerRef.current);
  }, [value, onSearch]);

  return (
    <div className="relative flex items-center">
      <svg
        className="absolute left-3 pointer-events-none"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ color: 'var(--text-secondary)' }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="Search videos…"
        value={value}
        onChange={e => setValue(e.target.value)}
        className="pl-9 pr-8 py-2 text-sm rounded-full outline-none transition-all"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
          width: '220px',
        }}
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 flex items-center justify-center"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Clear search"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
