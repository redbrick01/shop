import type { Brand, Product, Review } from "../types/product";

interface SeriesSpec {
  brand: Brand;
  series: string;
  vramGb: number;
  cudaOrStreamCores: number;
  boostClockMhz: number;
  tdpWatts: number;
  basePrice: number;
  releaseYear: number;
}

const SERIES: SeriesSpec[] = [
  { brand: "NVIDIA", series: "RTX 4060", vramGb: 8, cudaOrStreamCores: 3072, boostClockMhz: 2460, tdpWatts: 115, basePrice: 399000, releaseYear: 2023 },
  { brand: "NVIDIA", series: "RTX 4060 Ti", vramGb: 8, cudaOrStreamCores: 4352, boostClockMhz: 2535, tdpWatts: 160, basePrice: 549000, releaseYear: 2023 },
  { brand: "NVIDIA", series: "RTX 4070", vramGb: 12, cudaOrStreamCores: 5888, boostClockMhz: 2475, tdpWatts: 200, basePrice: 729000, releaseYear: 2023 },
  { brand: "NVIDIA", series: "RTX 4070 Super", vramGb: 12, cudaOrStreamCores: 7168, boostClockMhz: 2475, tdpWatts: 220, basePrice: 859000, releaseYear: 2024 },
  { brand: "NVIDIA", series: "RTX 4070 Ti Super", vramGb: 16, cudaOrStreamCores: 8448, boostClockMhz: 2610, tdpWatts: 285, basePrice: 1099000, releaseYear: 2024 },
  { brand: "NVIDIA", series: "RTX 4080 Super", vramGb: 16, cudaOrStreamCores: 10240, boostClockMhz: 2550, tdpWatts: 320, basePrice: 1499000, releaseYear: 2024 },
  { brand: "NVIDIA", series: "RTX 4090", vramGb: 24, cudaOrStreamCores: 16384, boostClockMhz: 2520, tdpWatts: 450, basePrice: 2599000, releaseYear: 2022 },
  { brand: "AMD", series: "RX 7600", vramGb: 8, cudaOrStreamCores: 2048, boostClockMhz: 2655, tdpWatts: 165, basePrice: 329000, releaseYear: 2023 },
  { brand: "AMD", series: "RX 7700 XT", vramGb: 12, cudaOrStreamCores: 3456, boostClockMhz: 2544, tdpWatts: 245, basePrice: 599000, releaseYear: 2023 },
  { brand: "AMD", series: "RX 7800 XT", vramGb: 16, cudaOrStreamCores: 3840, boostClockMhz: 2430, tdpWatts: 263, basePrice: 729000, releaseYear: 2023 },
  { brand: "AMD", series: "RX 7900 GRE", vramGb: 16, cudaOrStreamCores: 5120, boostClockMhz: 2245, tdpWatts: 260, basePrice: 819000, releaseYear: 2024 },
  { brand: "AMD", series: "RX 7900 XT", vramGb: 20, cudaOrStreamCores: 5376, boostClockMhz: 2400, tdpWatts: 315, basePrice: 999000, releaseYear: 2023 },
  { brand: "AMD", series: "RX 7900 XTX", vramGb: 24, cudaOrStreamCores: 6144, boostClockMhz: 2500, tdpWatts: 355, basePrice: 1199000, releaseYear: 2022 },
];

const NVIDIA_MAKERS = ["ASUS", "MSI", "Gigabyte", "Zotac"];
const AMD_MAKERS = ["ASUS", "MSI", "Sapphire", "PowerColor"];

const COLOR_PALETTE = [
  "#1f2937", "#0f766e", "#7c3aed", "#b91c1c",
  "#0369a1", "#15803d", "#a16207", "#be185d",
];

const REVIEW_AUTHORS = ["민준", "서연", "도윤", "하은", "지호", "수아", "은우", "채원"];
const REVIEW_COMMENTS = [
  "발열 관리가 잘 되고 소음도 적어서 만족스럽습니다.",
  "가격 대비 성능이 훌륭해요. 추천합니다.",
  "쿨러가 조금 큰 편이라 케이스 호환성 확인이 필요해요.",
  "게임 프레임이 눈에 띄게 좋아졌습니다.",
  "박스 포장이 꼼꼼했고 배송도 빨랐어요.",
  "전력 소모가 생각보다 낮아서 좋았습니다.",
  "드라이버 설치 후 바로 안정적으로 작동했어요.",
  "RGB 조명이 예쁘고 커스터마이징이 쉬워요.",
];

function buildReviews(seed: number, count: number): Review[] {
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const idx = (seed + i) % REVIEW_AUTHORS.length;
    const commentIdx = (seed + i * 3) % REVIEW_COMMENTS.length;
    const rating = 3 + ((seed + i) % 3); // 3~5
    reviews.push({
      id: `r-${seed}-${i}`,
      author: REVIEW_AUTHORS[idx],
      rating,
      comment: REVIEW_COMMENTS[commentIdx],
      date: `2024-${String(((seed + i) % 12) + 1).padStart(2, "0")}-${String(((seed + i * 2) % 27) + 1).padStart(2, "0")}`,
    });
  }
  return reviews;
}

function buildCatalog(): Product[] {
  const products: Product[] = [];
  let seed = 0;

  for (const spec of SERIES) {
    const makers = spec.brand === "NVIDIA" ? NVIDIA_MAKERS : AMD_MAKERS;
    // pick 2 manufacturers per series to keep total SKUs in the 20-30 range
    const chosenMakers = makers.slice(0, 2);

    for (const maker of chosenMakers) {
      seed += 1;
      const priceVariance = 1 + (((seed * 37) % 11) - 5) / 100; // +/-5%
      const price = Math.round((spec.basePrice * priceVariance) / 1000) * 1000;
      const stock = (seed * 7) % 15; // 0~14, some out-of-stock cases
      const reviewCount = 1 + (seed % 4); // 1~4 reviews

      products.push({
        id: `${spec.brand.toLowerCase()}-${spec.series.toLowerCase().replace(/\s+/g, "-")}-${maker.toLowerCase()}`,
        brand: spec.brand,
        manufacturer: maker,
        name: `${maker} ${spec.series} ${maker === "ASUS" ? "TUF Gaming" : maker === "MSI" ? "Gaming X" : maker === "Gigabyte" ? "Gaming OC" : maker === "Zotac" ? "Trinity" : maker === "Sapphire" ? "Pulse" : "Hellhound"}`,
        series: spec.series,
        vramGb: spec.vramGb,
        cudaOrStreamCores: spec.cudaOrStreamCores,
        boostClockMhz: spec.boostClockMhz,
        tdpWatts: spec.tdpWatts,
        price,
        stock,
        imageColor: COLOR_PALETTE[seed % COLOR_PALETTE.length],
        releaseYear: spec.releaseYear,
        reviews: buildReviews(seed, reviewCount),
      });
    }
  }

  return products;
}

export const PRODUCTS: Product[] = buildCatalog();

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function averageRating(product: Product): number {
  if (product.reviews.length === 0) return 0;
  const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / product.reviews.length;
}
