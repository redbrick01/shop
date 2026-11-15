import { Link, NavLink } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function navLinkClass(isActive: boolean) {
  return `text-sm font-medium transition ${
    isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
  }`;
}

export function Header() {
  const { cartCount, wishlistIds } = useShop();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="rounded bg-slate-900 px-2 py-1 text-sm text-white">GPU</span>
          그래픽카드 전문몰
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink to="/products" className={({ isActive }) => navLinkClass(isActive)}>
            전체 상품
          </NavLink>
          <NavLink to="/faq" className={({ isActive }) => navLinkClass(isActive)}>
            FAQ
          </NavLink>
          <NavLink to="/wishlist" className={({ isActive }) => navLinkClass(isActive)}>
            위시리스트
            {wishlistIds.length > 0 && (
              <span className="ml-1 rounded-full bg-rose-100 px-1.5 py-0.5 text-xs text-rose-600">
                {wishlistIds.length}
              </span>
            )}
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => navLinkClass(isActive)}>
            장바구니
            {cartCount > 0 && (
              <span className="ml-1 rounded-full bg-slate-900 px-1.5 py-0.5 text-xs text-white">
                {cartCount}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
