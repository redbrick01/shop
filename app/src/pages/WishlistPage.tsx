import { Link } from "react-router-dom";
import { getProductById } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { useShop } from "../context/ShopContext";

export function WishlistPage() {
  const { wishlistIds } = useShop();
  const products = wishlistIds
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">위시리스트가 비어있습니다</h1>
        <p className="mt-2 text-sm text-slate-500">관심있는 그래픽카드를 담아보세요.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          상품 보러가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">위시리스트</h1>
      <p className="mt-1 text-sm text-slate-500">{products.length}개 상품 (이 브라우저에만 저장됩니다)</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
