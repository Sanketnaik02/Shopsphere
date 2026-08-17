export function WishlistSkeleton() {
  return (
    <div className="pb-16" role="status" aria-label="Loading wishlist">
      <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="aspect-[4/3] animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-4 space-y-3">
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}