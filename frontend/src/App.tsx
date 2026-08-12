function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4" aria-label="Main navigation">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white"
              aria-hidden="true"
            >
              S
            </span>
            <span className="text-lg font-semibold tracking-tight">ShopSphere</span>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
            Phase 1
          </span>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          ShopSphere
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          E-Commerce System Under Test
        </p>
        <div className="mt-8 flex flex-col items-center gap-2">
          <span
            className="inline-flex h-3 w-3 rounded-full bg-emerald-500"
            aria-hidden="true"
          ></span>
          <p className="font-medium text-emerald-700">
            Application is running successfully.
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 text-center text-sm text-slate-500">
          ShopSphere — E-Commerce System Under Test
        </div>
      </footer>
    </div>
  )
}

export default App
