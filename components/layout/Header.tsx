"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { cn } from "@/lib/utils";
import { type Locale } from "@/i18n";

type HeaderProps = {
  locale: Locale;
};

export function Header({ locale }: HeaderProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHomePage = pathname === `/${locale}`;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { label: t("home"), href: `/${locale}` },
    { label: t("menu"), href: `/${locale}/menu` },
    { label: t("gallery"), href: `/${locale}/gallery` },
    { label: t("contact"), href: `/${locale}/contact` },
  ];

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function isActive(href: string) {
    if (href === `/${locale}`) {
      return pathname === href;
    }

    return pathname.startsWith(href);
  }

  return (
    <>
      <header
        className={cn(
          "fixed left-0 top-0 z-50 w-full border-b transition duration-300",
          isHomePage
            ? isScrolled
              ? "border-white/10 bg-dark-bg/90 shadow-lg backdrop-blur-xl"
              : "border-white/10 bg-black/10 backdrop-blur-sm"
            : "border-white/10 bg-dark-bg shadow-lg",
        )}
      >
        <Container className="flex h-24 items-center justify-between">
          <Link href={`/${locale}`} className="group">
            <div className="text-center leading-none text-white">
              <div className="font-display text-4xl tracking-[0.18em] transition group-hover:text-brand-gold">
                ERZENLER
              </div>
              <div className="mt-1 text-xs tracking-[0.35em] text-white/80">
                ET SOFRASI
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-xs font-bold uppercase tracking-[0.18em] transition",
                  isActive(item.href)
                    ? "text-brand-gold"
                    : "text-white/80 hover:text-brand-gold",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <LanguageSwitcher currentLocale={locale} />
            <Button href={`/${locale}/reservations`} variant="dark" size="sm">
              {t("reservation")}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur transition hover:border-brand-gold lg:hidden"
            aria-label="Open menu"
          >
            <span className="absolute h-[1.5px] w-5 -translate-y-2 bg-current transition duration-300 group-hover:w-6 group-hover:text-brand-gold" />
            <span className="absolute h-[1.5px] w-4 bg-current transition duration-300 group-hover:w-6 group-hover:text-brand-gold" />
            <span className="absolute h-[1.5px] w-5 translate-y-2 bg-current transition duration-300 group-hover:w-6 group-hover:text-brand-gold" />
          </button>
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
