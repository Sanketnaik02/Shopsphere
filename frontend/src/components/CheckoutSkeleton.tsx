export function CheckoutSkeleton() {
  return (
    <div className="pb-16" role="status" aria-label="Loading checkout">
      <div className="h-9 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 space-y-4">
              <div className="h-28 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-28 animate-pulse rounded-lg bg-slate-200" />
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