import VideoCard from './VideoCard';
import SkeletonCard from './SkeletonCard';

export default function VideoGrid({ videos, isLoading, hasMore, onLoadMore, activeIndex, onSelect }) {
  const showInitialSkeleton = isLoading && videos.length === 0;
  const showLoadMoreSkeleton = isLoading && videos.length > 0;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 8 }}>
        {showInitialSkeleton
          ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
          : videos.map((video, idx) => (
              <VideoCard
                key={video.id}
                video={video}
                isActive={idx === activeIndex}
                onClick={() => onSelect(idx)}
              />
            ))}
        {showLoadMoreSkeleton &&
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`more-${i}`} />)}
      </div>

      {!isLoading && videos.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--text-secondary)' }}>
          <p className="text-lg">No videos match your search.</p>
        </div>
      )}

      {hasMore && !isLoading && (
        <div className="flex justify-center mt-10">
          <button
            onClick={onLoadMore}
            className="px-8 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-body)' }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
