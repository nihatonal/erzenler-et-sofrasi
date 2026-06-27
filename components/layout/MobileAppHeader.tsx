"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { type Locale } from "@/i18n";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { useCartStore } from "@/lib/cart/card-store";

type MobileAppHeaderProps = {
  locale: Locale;
};

export function MobileAppHeader({ locale }: MobileAppHeaderProps) {
  const cartQuantity = useCartStore((state) => state.getTotalQuantity());
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY;
      setHidden(currentY > lastY && currentY > 60);
      setLastY(currentY);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[80] border-b border-white/10 bg-brand-green py-2 text-white shadow-lg transition-transform duration-300 lg:hidden ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex items-center justify-between px-2">
        <Link
          href={`/${locale}`}
          className="relative block h-14 w-[140px] shrink-0"
        >
          <Image
            src="/images/erzenler-logo.webp"
            alt="Erzenler Et Sofrası"
            sizes="140px"
            fill
            priority
            className="object-contain object-left"
          />
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLocale={locale} />

          <Link
            href={`/${locale}/checkout`}
            className="relative flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border border-white/15 bg-white/5"
            aria-label="Sepet"
          >
            <ShoppingBag className="h-5 w-5" />

            {cartQuantity > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
                {cartQuantity}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}