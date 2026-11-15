import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { averageRating } from "../data/products";
import { formatPrice } from "../utils/format";
import { StarRating } from "./StarRating";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder";
import { useShop } from "../context/ShopContext";

export function ProductCard({ product }: { product: Product }) {
  const { isWishlisted, toggleWishlist, addToCart } = useShop();
  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <button
        onClick={() => toggleWishlist(product.id)}
        aria-label={wishlisted ? "위시리스트에서 제거" : "위시리스트에 추가"}
        className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border text-lg transition ${
          wishlisted
            ? "border-rose-300 bg-rose-50 text-rose-500"
            : "border-slate-200 bg-white text-slate-400 hover:text-rose-400"
        }`}
      >
        {wishlisted ? "♥" : "♡"}
      </button>

      <Link to={`/products/${product.id}`} className="flex flex-col">
        <ProductImagePlaceholder
          color={product.imageColor}
          label={product.series}
          className="mb-3 h-36 text-sm"
        />
        <span className="text-xs font-medium text-slate-500">{product.brand} · {product.manufacturer}</span>
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-slate-900">{product.name}</h3>
        <div className="mt-1">
          <StarRating rating={averageRating(product)} />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</span>
        </div>
        <div className="mt-1 text-xs text-slate-500">
          VRAM {product.vramGb}GB · TDP {product.tdpWatts}W
        </div>
      </Link>

      <div className="mt-3 flex items-center justify-between">
        {outOfStock ? (
          <span className="text-xs font-semibold text-rose-500">품절</span>
        ) : (
          <span className="text-xs text-emerald-600">재고 {product.stock}개</span>
        )}
        <button
          onClick={() => addToCart(product.id, 1)}
          disabled={outOfStock}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          장바구니 담기
        </button>
      </div>
    </div>
  );
}
