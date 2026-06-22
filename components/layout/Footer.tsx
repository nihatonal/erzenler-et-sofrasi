import Link from "next/link";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/Container";

import { type Locale } from "@/i18n";

type FooterProps = {
  locale: Locale;
};

export function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer");

  return (
    <footer className="bg-dark-bg py-16 text-white">
      <Container>
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <Link href={`/${locale}`} className="inline-block">
              <div className="text-center leading-none">
                <div className="text-4xl font-display tracking-[0.18em]">
                  MIRA
                </div>

                <div className="mt-1 text-xs tracking-[0.35em] text-white/70">
                  BISTRO
                </div>
              </div>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-white/60">
              {t("tagline")}
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
              {t("quick_links")}
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-white/60">
              <li>
                <Link href={`/${locale}`}>{t("links.home")}</Link>
              </li>

              <li>
                <Link href={`/${locale}/menu`}>
                  {t("links.menu")}
                </Link>
              </li>

              <li>
                <Link href={`/${locale}/gallery`}>
                  {t("links.gallery")}
                </Link>
              </li>

              <li>
                <Link href={`/${locale}/contact`}>
                  {t("links.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* MENU */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
              {t("menu_label")}
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-white/60">
              <li>{t("menu.starters")}</li>
              <li>{t("menu.salads")}</li>
              <li>{t("menu.mains")}</li>
              <li>{t("menu.desserts")}</li>
              <li>{t("menu.drinks")}</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
              {t("contact_label")}
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-white/60">
              <li>{t("contact.street")}</li>
              <li>{t("contact.city")}</li>
              <li>{t("contact.phone")}</li>
              <li>{t("contact.email")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-center text-xs text-white/40">
          {t("copyright")}
        </div>
      </Container>
    </footer>
  );
}