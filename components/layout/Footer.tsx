import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n";

type FooterProps = {
  locale: Locale;
};

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({
    locale,
    namespace: "footer",
  });

  return (
    <footer className="bg-brand-green text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        {/* BRAND */}
        <div>
          <div className="text-2xl font-bold tracking-[0.2em]">ERZENLER</div>

          <p className="mt-3 text-sm text-white/70 leading-6">
            {t("description")}
          </p>

          <div className="mt-5 flex gap-3">
            <a href="#" className="hover:text-brand-gold">
              {/* <Instagram className="h-5 w-5" /> */}
            </a>

            <a href="tel:+902125964155" className="hover:text-brand-gold">
              <Phone className="h-5 w-5" />
            </a>

            <a
              href="https://wa.me/905445182342"
              className="hover:text-brand-gold"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em]">
            {t("links")}
          </h3>

          <div className="mt-4 flex flex-col gap-2 text-sm text-white/70">
            <Link href={`/${locale}/#home-hero`} className="hover:text-white">
              {t("home")}
            </Link>
            <Link href={`/${locale}/menu`} className="hover:text-white">
              {t("menu")}
            </Link>
            <Link href={`/${locale}/#home-story`} className="hover:text-white">
              {t("about")}
            </Link>
            <Link
              href={`/${locale}/#home-contact`}
              className="hover:text-white"
            >
              {t("contact")}
            </Link>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em]">
            {t("contact")}
          </h3>

          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              0212 596 41 55
            </p>

            <p className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </p>

            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Esenyurt / İstanbul
            </p>
          </div>
        </div>

        {/* PLATFORM + PAYMENT */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em]">
            {t("order")}
          </h3>

          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p>Uber Eats</p>
            <p>Getir Yemek</p>
            <p>Migros Yemek</p>
          </div>

          <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.2em]">
            {t("payment")}
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {["Cash", "Card", "Sodexo", "Multinet"].map((item) => (
              <span
                key={item}
                className="rounded-full bg-white/10 px-3 py-1 text-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Erzenler Et Sofrası. All rights reserved.
      </div>
    </footer>
  );
}
