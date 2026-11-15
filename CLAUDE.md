# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

포트폴리오/학습 목적으로 만든 GPU(그래픽카드) 커머스 데모입니다. `app/` 폴더에 React + TypeScript + Vite 앱이 있고, 제품 요구사항은 `PRD.md`(한국어)에 정리되어 있습니다. 백엔드는 없습니다: 상품/리뷰 데이터는 클라이언트에서 생성되고, 장바구니/위시리스트는 `localStorage`에 저장되며, 결제는 실제 PG 연동 없이 Mock 주문 접수 플로우로 처리됩니다.

## 커맨드

모든 커맨드는 `app/`에서 실행합니다 (저장소 루트에는 `PRD.md`와 앱 폴더만 있음):

```bash
cd app
npm run dev              # Vite 개발 서버 실행
npm run build             # tsc -b && sitemap 생성 && vite build
npm run generate:sitemap  # PRODUCTS 데이터로 public/sitemap.xml 재생성
npm run lint               # oxlint
npm run preview            # 프로덕션 빌드 프리뷰
```

이 저장소에는 구성된 테스트 스위트가 없습니다.

## 아키텍처

- **단일 Context, 백엔드 없음.** `src/context/ShopContext.tsx`가 앱의 유일한 상태 관리 지점이며, 장바구니 아이템과 위시리스트 ID를 관리합니다. 각각 `useLocalStorageState`(`src/hooks/useLocalStorageState.ts`)를 통해 `gpu-shop:cart` / `gpu-shop:wishlist` 키로 영속화됩니다. 서버, 인증, API 레이어가 전혀 없으며 모든 조회는 정적 인메모리 카탈로그를 기준으로 처리됩니다.
- **카탈로그는 수작업이 아니라 자동 생성됩니다.** `src/data/products.ts`는 GPU 시리즈 스펙 테이블(`SERIES`)을 정의하고, 이를 제조사와 조합해 `buildCatalog`로 약 20~30개의 SKU를 결정적으로(deterministic) 생성합니다. `seed` 카운터를 기반으로 가격 변동/재고/리뷰를 계산합니다. 상품 ID는 `${brand}-${series}-${maker}` 형태의 슬러그로 만들어집니다. `getProductById`와 `averageRating`이 다른 곳에서 쓰이는 조회 헬퍼이므로, 다른 곳에서 이 로직을 다시 만들지 말고 재사용하세요.
- **라우팅** (`src/App.tsx`): `/` → `/products`(카탈로그) → `/products/:id`(상세) → 장바구니/위시리스트 → `/checkout` → `/order-complete`. `CheckoutPage`와 `OrderCompletePage`는 fetch 가능한 리소스가 아니라 인메모리 상태에 의존하기 때문에, 해당 상태가 없으면 `<Navigate>`로 다른 페이지로 리다이렉트됩니다.
- **결제는 의도적으로 제외되어 있습니다.** `CheckoutPage`는 클라이언트에서 `Order` 객체를 생성(주문번호는 `src/utils/format.ts`의 `generateOrderNumber()`로 Mock 생성)하고, 이를 영속 스토어가 아니라 라우터 `state`를 통해 `OrderCompletePage`로 전달합니다 — 따라서 해당 페이지를 새로고침하면 주문 정보가 사라집니다. 이는 PRD에서 명시한, 추후 결제 모듈을 끼워 넣기 쉽도록 주문서 제출과 결제 단계를 분리한 설계 결정을 반영한 것입니다.
- **SEO는 페이지별로 수동 처리됩니다.** `src/hooks/useSeo.ts`는 `react-helmet` 없이 `document.title`, 메타 태그, canonical 링크, JSON-LD를 마운트/업데이트 시 명령형으로 설정합니다. 모든 페이지 컴포넌트는 `useSeo({ title, description, path, jsonLd? })`를 호출합니다. 새 페이지를 추가할 때는 이 호출을 빠뜨리지 말고 반드시 연결하세요. sitemap(`scripts/generate-sitemap.ts`)은 `PRODUCTS`를 직접 import해서 정적 라우트와 상품별 `<url>`을 생성하며, `npm run build`의 일부로 실행됩니다.
- **새 페이지 추가 체크리스트** (라우트 테이블에서 자동 파생되지 않아 수동 동기화 필요): ① `src/App.tsx`에 `<Route>` 추가, ② 페이지 컴포넌트에서 `useSeo()` 호출, ③ 필요 시 `src/components/Header.tsx`에 네비게이션 링크 추가, ④ `scripts/generate-sitemap.ts`의 `staticRoutes` 배열에 경로 추가.
- **스타일링**은 `@tailwindcss/vite`를 통한 Tailwind v4입니다 (`tailwind.config.js` 없음 — v4는 Vite 플러그인을 직접 사용). 상품 썸네일은 실제 이미지가 아니라 단색 placeholder(`ProductImagePlaceholder`)입니다.
- **린트**는 ESLint가 아니라 oxlint를 사용합니다; 설정은 `app/.oxlintrc.json`에 있습니다. TypeScript는 경로 참조 방식의 프로젝트 구성(`tsconfig.json` → `tsconfig.app.json` / `tsconfig.node.json`)이며, `noUnusedLocals`/`noUnusedParameters`가 활성화되어 있습니다 — `tsc -b`는 `npm run build`의 일부로 실행됩니다.
