export default function VideoPlayer({ video, onPrev, onNext, hasPrev, hasNext }) {
  if (!video) return (
    <div style={{ aspectRatio: '16/9', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#555' }}>Loading…</span>
    </div>
  );

  return (
    <div style={{ background: '#000' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ aspectRatio: '16/9', width: '100%' }}>
          <iframe
            key={video.id}
            src={`https://www.youtube.com/embed/${video.id}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </div>
        {hasPrev && (
          <button
            onClick={onPrev}
            aria-label="Previous video"
            style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '50%', width: 48, height: 48, cursor: 'pointer',
              color: '#fff', fontSize: 24, display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 10,
            }}
          >
            ‹
          </button>
        )}
        {hasNext && (
          <button
            onClick={onNext}
            aria-label="Next video"
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '50%', width: 48, height: 48, cursor: 'pointer',
              color: '#fff', fontSize: 24, display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 10,
            }}
          >
            ›
          </button>
        )}
      </div>
      <div style={{ padding: '12px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
          {video.title}
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
          {video.viewCount} views · {video.duration}
        </p>
      </div>
    </div>
  );
}
