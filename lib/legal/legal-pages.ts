export type LegalPageKey =
  | "privacy"
  | "cookies"
  | "kvkk"
  | "delivery-return"
  | "distance-sales";

export const legalPages = [
  {
    key: "privacy",
    titleKey: "legal.privacy.title",
    descriptionKey: "legal.privacy.description",
    href: "/legal/privacy",
  },
  {
    key: "cookies",
    titleKey: "legal.cookies.title",
    descriptionKey: "legal.cookies.description",
    href: "/legal/cookies",
  },
  {
    key: "kvkk",
    titleKey: "legal.kvkk.title",
    descriptionKey: "legal.kvkk.description",
    href: "/legal/kvkk",
  },
  {
    key: "delivery-return",
    titleKey: "legal.deliveryReturn.title",
    descriptionKey: "legal.deliveryReturn.description",
    href: "/legal/delivery-return",
  },
  {
    key: "distance-sales",
    titleKey: "legal.distanceSales.title",
    descriptionKey: "legal.distanceSales.description",
    href: "/legal/distance-sales",
  },
] as const;
