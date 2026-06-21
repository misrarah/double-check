import { useEffect, useState } from 'react';

export default function Navbar({ channel }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 flex items-center px-6 h-14"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.5)' : 'none',
        transition: 'box-shadow 0.2s',
      }}
    >
    </nav>
  );
}
