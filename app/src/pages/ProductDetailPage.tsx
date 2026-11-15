import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById, averageRating } from "../data/products";
import { formatPrice } from "../utils/format";
import { StarRating } from "../components/StarRating";
import { ProductImagePlaceholder } from "../components/ProductImagePlaceholder";
import { useShop } from "../context/ShopContext";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-slate-600">상품을 찾을 수 없습니다.</p>
        <Link to="/products" className="mt-4 inline-block text-slate-900 underline">
          전체 상품으로 돌아가기
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock === 0;
  const wishlisted = isWishlisted(product.id);
  const rating = averageRating(product);

  function handleAddToCart() {
    addToCart(product!.id, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/products" className="text-sm text-slate-500 hover:text-slate-800">
        ← 전체 상품
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
        <ProductImagePlaceholder
          color={product.imageColor}
          label={product.series}
          className="h-72 text-lg"
        />

        <div>
          <span className="text-sm font-medium text-slate-500">
            {product.brand} · {product.manufacturer}
          </span>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{product.name}</h1>
          <div className="mt-2">
            <StarRating rating={rating} size="md" />
            <span className="ml-2 text-sm text-slate-400">({product.reviews.length}개 리뷰)</span>
          </div>

          <p className="mt-4 text-3xl font-bold text-slate-900">{formatPrice(product.price)}</p>

          <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-4 text-sm">
            <Spec label="VRAM" value={`${product.vramGb}GB`} />
            <Spec label="코어 수" value={product.cudaOrStreamCores.toLocaleString("ko-KR")} />
            <Spec label="부스트 클럭" value={`${product.boostClockMhz}MHz`} />
            <Spec label="TDP" value={`${product.tdpWatts}W`} />
            <Spec label="출시년도" value={`${product.releaseYear}`} />
            <Spec label="재고" value={outOfStock ? "품절" : `${product.stock}개`} />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-md border border-slate-300">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-slate-600 hover:bg-slate-50"
                disabled={outOfStock}
              >
                −
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-2 text-slate-600 hover:bg-slate-50"
                disabled={outOfStock}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {outOfStock ? "품절" : justAdded ? "장바구니에 담았습니다 ✓" : "장바구니 담기"}
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="위시리스트 토글"
              className={`flex h-10 w-10 items-center justify-center rounded-md border text-lg ${
                wishlisted
                  ? "border-rose-300 bg-rose-50 text-rose-500"
                  : "border-slate-300 text-slate-400 hover:text-rose-400"
              }`}
            >
              {wishlisted ? "♥" : "♡"}
            </button>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-bold text-slate-900">리뷰 ({product.reviews.length})</h2>
        <div className="mt-4 space-y-4">
          {product.reviews.map((review) => (
            <div key={review.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">{review.author}</span>
                <span className="text-xs text-slate-400">{review.date}</span>
              </div>
              <StarRating rating={review.rating} />
              <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-semibold text-slate-800">{value}</p>
    </div>
  );
}
