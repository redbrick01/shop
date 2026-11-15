import { useEffect } from "react";

const SITE_URL = "https://shop-tau-murex.vercel.app";
const SITE_NAME = "그래픽카드 전문몰 - GPU Shop";

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: object | object[];
}

function setMetaByName(name: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setMetaByProperty(property: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(href: string) {
  let tag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

const JSON_LD_ID = "page-json-ld";

function setJsonLd(data: object | object[] | undefined) {
  const existing = document.getElementById(JSON_LD_ID);
  if (existing) existing.remove();
  if (!data) return;

  const script = document.createElement("script");
  script.id = JSON_LD_ID;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function useSeo({ title, description, path, image, noindex, jsonLd }: SeoOptions) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMetaByName("description", description);
    setMetaByName(
      "robots",
      noindex ? "noindex, nofollow" : "index, follow",
    );

    const canonicalUrl = `${SITE_URL}${path}`;
    setCanonical(canonicalUrl);

    const ogImage = image ?? `${SITE_URL}/og-image.png`;
    setMetaByProperty("og:title", fullTitle);
    setMetaByProperty("og:description", description);
    setMetaByProperty("og:url", canonicalUrl);
    setMetaByProperty("og:image", ogImage);
    setMetaByProperty("og:type", "website");
    setMetaByProperty("og:site_name", SITE_NAME);
    setMetaByProperty("og:locale", "ko_KR");

    setMetaByName("twitter:card", "summary_large_image");
    setMetaByName("twitter:title", fullTitle);
    setMetaByName("twitter:description", description);
    setMetaByName("twitter:image", ogImage);

    setJsonLd(jsonLd);

    return () => {
      setJsonLd(undefined);
    };
  }, [title, description, path, image, noindex, jsonLd]);
}
