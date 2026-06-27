"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone, ShoppingBag } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { cn } from "@/lib/utils";
import { type Locale } from "@/i18n";
import Image from "next/image";
import { useCartStore } from "@/lib/cart/card-store";

type HeaderProps = {
  locale: Locale;
};

export function Header({ locale }: HeaderProps) {
  const t = useTranslations("nav");
  const cartQuantity = useCartStore((state) => state.getTotalQuantity());
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { label: t("home"), href: `/${locale}` },
    { label: t("menu"), href: `/${locale}/menu` },
    { label: t("about"), href: `/${locale}/#story` },
    { label: t("contact"), href: `/${locale}/#contact` },
  ];
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function isActive(href: string) {
    if (href === `/${locale}`) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <>
      <header
        className={cn(
          "fixed left-0 top-0 z-50 hidden w-full transition-all duration-300 lg:block",
          isHomePage
            ? isScrolled
              ? "border-b border-white/10 bg-dark-bg/70 shadow-lg backdrop-blur-xl"
              : "border-b border-transparent !bg-transparent !shadow-none !backdrop-blur-none"
            : "border-b border-white/10 bg-dark-bg shadow-lg",
        )}
      >
        <Container className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="relative block h-20 w-[160px] shrink-0"
          >
            <Image
              src="/images/erzenler-logo.webp"
              alt="Erzenler Et Sofrası"
              sizes="160px"
              fill
              priority
              className="object-contain object-left"
            />
          </Link>
          {/* Nav Items */}
          <nav className="flex items-center gap-9">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-xs font-bold uppercase tracking-[0.18em] transition",
                  isActive(item.href)
                    ? "text-brand-redLight"
                    : "text-brand-creamDark hover:text-brand-gold",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLocale={locale} />
            <div className="flex shrink-0 flex-col gap-1">
              <Link
                href="tel:+905445182342"
                className="flex items-center gap-1.5 text-xs font-semibold text-white/80 transition hover:text-white"
              >
                <Phone className="h-3 w-3" />
                0544 518 23 42
              </Link>
              <Link
                href="tel:+902125964155"
                className="flex items-center gap-1.5 text-xs font-semibold text-white/80 transition hover:text-white"
              >
                <Phone className="h-3 w-3" />
                0212 596 41 55
              </Link>
              <Link
                href="tel:+902125964142"
                className="flex items-center gap-1.5 text-xs font-semibold text-white/80 transition hover:text-white"
              >
                <Phone className="h-3 w-3" />
                0212 596 41 42
              </Link>
            </div>
            <Link
              href={`/${locale}/checkout`}
              className="relative flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border border-white/15 bg-white/5"
              aria-label="Sepet"
            >
              <ShoppingBag className="h-5 w-5 text-brand-creamDark" />

              {mounted && cartQuantity > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
                  {cartQuantity}
                </span>
              )}
            </Link>
          </div>
        </Container>
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navItems={navItems}
        locale={locale}
      />
    </>
  );
}
