import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

const PREVIEW_LENGTH = 150;

export default function VideoCard({ video, isActive, onClick }) {
  const publishedAgo = video.publishedAt
    ? formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })
    : '';
  const [expanded, setExpanded] = useState(false);
  const desc = video.description || '';
  const isLong = desc.length > PREVIEW_LENGTH;
  const displayDesc = expanded || !isLong ? desc : desc.slice(0, PREVIEW_LENGTH) + '…';

  return (
    <div
      onClick={onClick}
      className="group block rounded-lg overflow-hidden transition-all duration-200 cursor-pointer"
      style={{
        background: 'var(--surface)',
        border: isActive ? '2px solid var(--accent)' : '2px solid transparent',
      }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'rgba(0,0,0,0.4)' }}
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 56, height: 56, background: 'var(--accent)' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {video.duration && (
          <span
            className="absolute bottom-2 right-2 text-white text-xs font-mono px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(0,0,0,0.75)' }}
          >
            {video.duration}
          </span>
        )}
      </div>

      <div className="p-3">
        <h3
          className="font-semibold text-sm leading-snug mb-1"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {video.title}
        </h3>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {video.viewCount} views · {publishedAgo}
        </p>
        {desc && (
          <div className="mt-2" onClick={e => e.stopPropagation()}>
            <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
              {displayDesc}
            </p>
            {isLong && (
              <button
                className="text-xs mt-1 font-medium"
                style={{ color: 'var(--accent)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                onClick={() => setExpanded(v => !v)}
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
