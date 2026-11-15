import { Link } from "react-router-dom";
import { PRODUCTS, averageRating } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { useSeo } from "../hooks/useSeo";

export function HomePage() {
  const featured = [...PRODUCTS].sort((a, b) => averageRating(b) - averageRating(a)).slice(0, 3);

  useSeo({
    title: "홈",
    description: "NVIDIA·AMD 그래픽카드를 스펙과 가격으로 한눈에 비교하고 구매할 수 있는 GPU 전문 쇼핑몰. 검색, 필터, 장바구니, 위시리스트까지 한 번에.",
    path: "/",
  });

  return (
    <div>
      <section className="bg-slate-900 py-16 text-center text-white">
        <h1 className="text-3xl font-bold">최신 그래픽카드, 한 곳에서 비교하고 구매하세요</h1>
        <p className="mt-3 text-slate-300">NVIDIA · AMD 주요 라인업을 스펙과 가격으로 한눈에</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
        >
          전체 상품 보기
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-bold text-slate-900">인기 상품</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
