import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

const PREVIEW_LENGTH = 120;

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
      className="group flex gap-3 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer p-2"
      style={{
        background: isActive ? 'var(--surface)' : 'transparent',
        border: isActive ? '2px solid var(--accent)' : '2px solid transparent',
      }}
    >
      {/* Thumbnail — ~30% width */}
      <div className="relative flex-shrink-0 overflow-hidden rounded" style={{ width: '30%', aspectRatio: '16/9', alignSelf: 'flex-start' }}>
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
            style={{ width: 28, height: 28, background: 'var(--accent)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {video.duration && (
          <span
            className="absolute bottom-1 right-1 text-white font-mono px-1 py-0.5 rounded"
            style={{ background: 'rgba(0,0,0,0.75)', fontSize: 10 }}
          >
            {video.duration}
          </span>
        )}
      </div>

      {/* Info — remaining width */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-semibold leading-snug mb-1"
          style={{
            fontSize: 13,
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
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>
          {video.viewCount} views · {publishedAgo}
        </p>
        {desc && (
          <div className="mt-1" onClick={e => e.stopPropagation()}>
            <p className="leading-relaxed whitespace-pre-line" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {displayDesc}
            </p>
            {isLong && (
              <button
                style={{ fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginTop: 2 }}
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
