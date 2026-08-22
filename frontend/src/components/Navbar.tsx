import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/use-auth'
import { useCart } from '../context/use-cart'
import { useWishlist } from '../context/use-wishlist'

export function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const { wishlist } = useWishlist()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isHomeActive = pathname === '/'
  const isProductsActive = pathname === '/products' || pathname.startsWith('/products/')
  const isCartActive = pathname.startsWith('/cart') || pathname.startsWith('/checkout')
  const isWishlistActive = pathname.startsWith('/wishlist')
  const isOrdersActive = pathname === '/orders' || pathname.startsWith('/orders/')
  const isDashboardActive = pathname.startsWith('/dashboard')
  const isAdminActive = pathname.startsWith('/admin')
  const cartCount = cart?.totalQuantity ?? 0
  const wishlistCount = wishlist?.totalItems ?? 0

  const navItemClass = (active: boolean) =>
    `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-3 sm:px-6"
      >
        <Link to="/" aria-label="ShopSphere home" className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white"
          >
            S
          </span>
          <span className="text-base font-semibold tracking-tight text-slate-900">ShopSphere</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/"
            aria-current={isHomeActive ? 'page' : undefined}
            className={navItemClass(isHomeActive)}
          >
            Home
          </Link>
          <Link
            to="/products"
            aria-current={isProductsActive ? 'page' : undefined}
            className={navItemClass(isProductsActive)}
          >
            Products
          </Link>
          <Link
            to="/wishlist"
            aria-current={isWishlistActive ? 'page' : undefined}
            className={`${navItemClass(isWishlistActive)} flex items-center gap-1.5`}
          >
            Wishlist
            {wishlistCount > 0 ? (
              <span
                data-testid="wishlist-count"
                aria-label={`${wishlistCount} items in wishlist`}
                className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-semibold text-white"
              >
                {wishlistCount}
              </span>
            ) : null}
          </Link>
          <Link
            to="/cart"
            aria-current={isCartActive ? 'page' : undefined}
            className={`${navItemClass(isCartActive)} flex items-center gap-1.5`}
          >
            Cart
            {cartCount > 0 ? (
              <span
                data-testid="cart-count"
                aria-label={`${cartCount} items in cart`}
                className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-semibold text-white"
              >
                {cartCount}
              </span>
            ) : null}
          </Link>
          {user ? (
            <>
              <Link
                to="/orders"
                aria-current={isOrdersActive ? 'page' : undefined}
                className={navItemClass(isOrdersActive)}
              >
                Orders
              </Link>
              <Link
                to="/dashboard"
                aria-current={isDashboardActive ? 'page' : undefined}
                className={navItemClass(isDashboardActive)}
              >
                Dashboard
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  aria-current={isAdminActive ? 'page' : undefined}
                  className={navItemClass(isAdminActive)}
                  data-testid="admin-nav-link"
                >
                  Admin
                </Link>
              )}
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span
                data-testid="nav-role"
                className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:inline"
              >
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}