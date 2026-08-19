export function OrdersSkeleton() {
  return (
    <div className="pb-16" role="status" aria-label="Loading orders">
      <div className="h-9 w-32 animate-pulse rounded bg-slate-200" />
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="mt-4 h-7 w-28 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-4 w-20 animate-pulse rounded bg-slate-200" />
            <div className="mt-5 h-9 w-full animate-pulse rounded-lg bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function OrderDetailsSkeleton() {
  return (
    <div className="pb-16" role="status" aria-label="Loading order details">
      <div className="h-9 w-56 animate-pulse rounded bg-slate-200" />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 space-y-3">
              <div className="h-4 animate-pulse rounded bg-slate-200" />
              <div className="h-4 animate-pulse rounded bg-slate-200" />
              <div className="h-4 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 space-y-3">
              <div className="h-12 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-12 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-12 animate-pulse rounded-lg bg-slate-200" />
            </div>
          </div>
        </div>
        <div className="h-fit rounded-xl border border-slate-200 bg-white p-6">
          <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 space-y-3">
            <div className="h-4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 animate-pulse rounded bg-slate-200" />
            <div className="h-6 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  )
}