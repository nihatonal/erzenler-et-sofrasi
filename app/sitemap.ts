import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://erzenleretsofrasi.com.tr";

const locales = ["tr", "en", "ru", "ar"] as const;



const localizedLegalPaths = {
  tr: [
    "/gizlilik-politikasi",
    "/cerez-politikasi",
    "/kvkk",
    "/teslimat-ve-iade",
    "/mesafeli-satis-sozlesmesi",
  ],
  en: [
    "/privacy-policy",
    "/cookie-policy",
    "/pdpl",
    "/delivery-and-return",
    "/distance-sales-agreement",
  ],
  ru: [
    "/politika-konfidencialnosti",
    "/politika-cookie",
    "/zakon-o-personalnyh-dannyh",
    "/dostavka-i-vozvrat",
    "/dogovor-distancionnoy-prodazhi",
  ],
  ar: [
    "/siyasat-alkhususiya",
    "/siyasat-cookies",
    "/kvkk",
    "/altawsil-walistirja",
    "/aitifaqiyat-albay-ean-bued",
  ],
};

const mainPaths = ["", "/menu", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const urls: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of mainPaths) {
      urls.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "daily",
        priority: path === "" ? 1 : 0.8,
      });
    }

    for (const path of localizedLegalPaths[locale]) {
      urls.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.3,
      });
    }
  }

  return urls;
}