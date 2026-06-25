"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { type Locale } from "@/i18n";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { useCartStore } from "@/lib/cart/card-store";

type MobileAppHeaderProps = {
  locale: Locale;
};

export function MobileAppHeader({ locale }: MobileAppHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartQuantity = useCartStore((state) => state.getTotalQuantity());

  const navItems = [
    { label: "Anasayfa", href: `/${locale}` },
    { label: "Menü", href: `/${locale}/menu` },
    { label: "Siparişlerim", href: `/${locale}/orders` },
    { label: "İletişim", href: `/${locale}/contact` },
  ];

  return (
    <>
      <header className="sticky top-0 z-[80] border-b border-white/10 bg-brand-green px-4 py-1 text-white shadow-lg lg:hidden">
        <div className="grid grid-cols-[48px_1fr_48px] items-center">
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              setIsMenuOpen(true);
            }}
            className="relative z-20 flex h-12 w-12 touch-manipulation items-center justify-center rounded-full border border-white/15 bg-white/5"
            aria-label="Menüyü aç"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link
            href={`/${locale}`}
            className="relative z-10 mx-auto block h-16 w-[185px]"
          >
            <Image
              src="/images/erzenler-logo.png"
              alt="Erzenler Et Sofrası"
              fill
              priority
              className="object-contain"
            />
          </Link>

          <Link
            href={`/${locale}/checkout`}
            className="relative z-20 flex h-12 w-12 touch-manipulation items-center justify-center rounded-full border border-white/15 bg-white/5"
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
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navItems={navItems}
        locale={locale}
      >
        <div className="mt-6 border-t border-white/10 pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
            Dil
          </p>
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </MobileMenu>
    </>
  );
}
