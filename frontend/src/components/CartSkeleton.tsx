export function CartSkeleton() {
  return (
    <div className="pb-16" role="status" aria-label="Loading cart">
      <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="h-24 w-24 shrink-0 animate-pulse rounded-lg bg-slate-200" />
              <div className="flex-1 space-y-3 py-1">
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-10 w-36 animate-pulse rounded-lg bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-52 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  )
}