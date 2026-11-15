import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { PRODUCTS } from "../src/data/products";

const SITE_URL = "https://shop-tau-murex.vercel.app";

const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/products", priority: "0.9", changefreq: "daily" },
  { path: "/wishlist", priority: "0.1", changefreq: "monthly" },
  { path: "/faq", priority: "0.3", changefreq: "monthly" },
];

const productRoutes = PRODUCTS.map((product) => ({
  path: `/products/${product.id}`,
  priority: "0.8",
  changefreq: "weekly",
}));

const allRoutes = [...staticRoutes, ...productRoutes];

const today = new Date().toISOString().slice(0, 10);

const urlEntries = allRoutes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

const outPath = resolve(import.meta.dirname, "../public/sitemap.xml");
writeFileSync(outPath, sitemap, "utf-8");
console.log(`sitemap.xml written with ${allRoutes.length} URLs -> ${outPath}`);
