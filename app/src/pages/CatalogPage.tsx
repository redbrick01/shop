import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PRODUCTS, averageRating } from "../data/products";
import type { Brand } from "../types/product";
import { ProductCard } from "../components/ProductCard";
import { useSeo } from "../hooks/useSeo";

type SortOption = "default" | "price-asc" | "price-desc" | "popular" | "newest";

const BRANDS: Brand[] = ["NVIDIA", "AMD"];
const MANUFACTURERS = Array.from(new Set(PRODUCTS.map((p) => p.manufacturer))).sort();
const VRAM_OPTIONS = Array.from(new Set(PRODUCTS.map((p) => p.vramGb))).sort((a, b) => a - b);
const PRICE_MAX = Math.max(...PRODUCTS.map((p) => p.price));

export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [brandFilter, setBrandFilter] = useState<Brand[]>([]);
  const [makerFilter, setMakerFilter] = useState<string[]>([]);
  const [vramFilter, setVramFilter] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("default");

  useSeo({
    title: "전체 상품",
    description: "NVIDIA·AMD 그래픽카드 전체 라인업을 브랜드, 제조사, 가격대, VRAM으로 필터링하고 가격·인기·신상품순으로 정렬해 비교할 수 있습니다.",
    path: "/products",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: PRODUCTS.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://shop-tau-murex.vercel.app/products/${product.id}`,
        name: product.name,
      })),
    },
  });

  function toggle<T>(list: T[], value: T, setter: (v: T[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const filtered = useMemo(() => {
    let result = PRODUCTS.filter((p) => {
      if (search.trim() && !p.name.toLowerCase().includes(search.trim().toLowerCase())) return false;
      if (brandFilter.length > 0 && !brandFilter.includes(p.brand)) return false;
      if (makerFilter.length > 0 && !makerFilter.includes(p.manufacturer)) return false;
      if (vramFilter.length > 0 && !vramFilter.includes(p.vramGb)) return false;
      if (p.price > maxPrice) return false;
      if (inStockOnly && p.stock === 0) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result = [...result].sort((a, b) => averageRating(b) - averageRating(a));
        break;
      case "newest":
        result = [...result].sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      default:
        break;
    }

    return result;
  }, [search, brandFilter, makerFilter, vramFilter, maxPrice, inStockOnly, sort]);

  function resetFilters() {
    setSearch("");
    setBrandFilter([]);
    setMakerFilter([]);
    setVramFilter([]);
    setMaxPrice(PRICE_MAX);
    setInStockOnly(false);
    setSort("default");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">전체 상품</h1>
      <p className="mt-1 text-sm text-slate-500">{filtered.length}개 상품</p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <aside className="space-y-6 rounded-xl border border-slate-200 bg-white p-4">
          <div>
            <label className="text-sm font-semibold text-slate-800">검색</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="모델명으로 검색"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">브랜드</p>
            <div className="mt-2 space-y-1">
              {BRANDS.map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={brandFilter.includes(brand)}
                    onChange={() => toggle(brandFilter, brand, setBrandFilter)}
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">제조사</p>
            <div className="mt-2 max-h-36 space-y-1 overflow-y-auto">
              {MANUFACTURERS.map((maker) => (
                <label key={maker} className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={makerFilter.includes(maker)}
                    onChange={() => toggle(makerFilter, maker, setMakerFilter)}
                  />
                  {maker}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">VRAM</p>
            <div className="mt-2 space-y-1">
              {VRAM_OPTIONS.map((vram) => (
                <label key={vram} className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={vramFilter.includes(vram)}
                    onChange={() => toggle(vramFilter, vram, setVramFilter)}
                  />
                  {vram}GB
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              최대 가격: {maxPrice.toLocaleString("ko-KR")}원
            </p>
            <input
              type="range"
              min={0}
              max={PRICE_MAX}
              step={10000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-2 w-full"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            재고 있는 상품만
          </label>

          <button
            onClick={resetFilters}
            className="w-full rounded-md border border-slate-300 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            필터 초기화
          </button>
        </aside>

        <div>
          <div className="mb-4 flex justify-end">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="default">기본 정렬</option>
              <option value="price-asc">가격 낮은순</option>
              <option value="price-desc">가격 높은순</option>
              <option value="popular">인기순</option>
              <option value="newest">신상품순</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-400">
              조건에 맞는 상품이 없습니다. 필터를 조정해보세요.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
