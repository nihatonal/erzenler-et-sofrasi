import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://erzenleretsofrasi.com.tr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/checkout",
          "/tr/checkout",
          "/en/checkout",
          "/ru/checkout",
          "/ar/checkout",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}