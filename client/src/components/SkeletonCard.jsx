export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="shimmer w-full" style={{ aspectRatio: '16/9' }} />
      <div className="p-3 space-y-2">
        <div className="shimmer h-4 rounded w-full" />
        <div className="shimmer h-4 rounded w-3/4" />
        <div className="shimmer h-3 rounded w-1/2 mt-1" />
      </div>
    </div>
  );
}
