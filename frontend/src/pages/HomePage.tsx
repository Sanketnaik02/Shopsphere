import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/use-auth'
import { Navbar } from '../components/Navbar'
import { getCategories } from '../api/categories'
import type { Category } from '../types/category'

type CategoriesState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; items: Category[] }

function IconTag() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  )
}

function IconTruck() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

const benefits = [
  {
    title: 'Curated Selection',
    description: 'Quality electronics and everyday essentials from trusted brands.',
    icon: <IconTag />,
  },
  {
    title: 'Fast Delivery',
    description: 'Quick dispatch and reliable shipping to your doorstep.',
    icon: <IconTruck />,
  },
  {
    title: 'Secure Checkout',
    description: 'Simple, safe payments designed with your privacy in mind.',
    icon: <IconShield />,
  },
]

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-shadow duration-200 hover:shadow-md">
      <span
        aria-hidden="true"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600"
      >
        {category.name.charAt(0)}
      </span>
      <p className="mt-3 text-sm font-semibold text-slate-900">{category.name}</p>
    </div>
  )
}

function CategoryGridSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      role="status"
      aria-label="Loading categories"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-28 animate-pulse rounded-xl bg-slate-200" />
      ))}
    </div>
  )
}

function Hero({ user }: { user: ReturnType<typeof useAuth>['user'] }) {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Welcome to ShopSphere
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Shop smarter. Find what you need.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
          Discover quality technology, electronics, gaming gear and everyday essentials — all in one
          place.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            Explore Products
          </Link>
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              Go to Dashboard
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function WhyShopSphere() {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Why ShopSphere?
          </h2>
          <p className="mt-3 text-slate-600">A simple, trustworthy way to shop online.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600 text-white">
                {benefit.icon}
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<CategoriesState>({ status: 'loading' })

  const loadCategories = useCallback(async () => {
    setCategories({ status: 'loading' })
    try {
      const items = await getCategories()
      setCategories({ status: 'ready', items })
    } catch {
      setCategories({ status: 'error' })
    }
  }, [])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1">
        <Hero user={user} />

        {categories.status !== 'error' ? (
          <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Featured Categories
              </h2>
              <p className="mt-3 text-slate-600">Browse our departments</p>
            </div>
            <div className="mt-10">
              {categories.status === 'loading' ? <CategoryGridSkeleton /> : null}
              {categories.status === 'ready' && categories.items.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {categories.items.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        <WhyShopSphere />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 text-center text-sm text-slate-500">
          ShopSphere — E-Commerce System Under Test
        </div>
      </footer>
    </div>
  )
}