export function ProductDetailsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading product details"
      className="pb-16"
    >
      <div className="flex items-center gap-2 py-6">
        <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-3 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-3 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="aspect-[4/3] animate-pulse rounded-xl bg-slate-200" />
        <div className="flex flex-col gap-4">
          <div className="h-6 w-28 animate-pulse rounded-full bg-slate-200" />
          <div className="h-9 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-8 w-44 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-12 w-full animate-pulse rounded-lg bg-slate-200 sm:w-72" />
        </div>
      </div>

      <div className="mt-12 border-t border-slate-200 pt-10">
        <div className="h-7 w-52 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </div>
  )
}