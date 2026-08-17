export function ProductGridSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading products"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="aspect-[4/3] animate-pulse bg-slate-200" />
          <div className="space-y-3 p-4 sm:p-5">
            <div className="h-2.5 w-1/3 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-slate-200" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200" />
            <div className="h-9 w-full animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  )
}