import Link from "next/link";
import { useTranslations } from "next-intl";

import { formatCurrency } from "@/lib/utils";
import type { LocaleCode } from "../types";

type CartBarProps = {
  activeLocale: LocaleCode;
  cartQuantity: number;
  cartSubtotal: number;
};

export function CartBar({
  activeLocale,
  cartQuantity,
  cartSubtotal,
}: CartBarProps) {
  const t = useTranslations("menu");

  if (cartQuantity === 0) return null;

  return (
    <Link
      href={`/${activeLocale}/checkout`}
      className="md:fixed bottom-4 left-4 right-4 z-40 mx-auto flex h-14 max-w-xl items-center justify-between rounded-2xl bg-brand-green px-5 text-white shadow-2xl"
    >
      <span className="text-sm font-bold">
        {cartQuantity} {t("cart.items")}
      </span>

      <span className="text-sm font-bold">
        {formatCurrency(cartSubtotal, "TRY")}
      </span>

      <span className="text-sm font-bold">{t("cart.view")}</span>
    </Link>
  );
}
