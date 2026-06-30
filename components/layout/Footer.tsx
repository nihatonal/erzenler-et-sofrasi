import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n";

type FooterProps = {
  locale: Locale;
};

// WhatsApp SVG ikonu (lucide'da yok)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.525 5.847L.057 23.571a.75.75 0 0 0 .921.921l5.724-1.468A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.726 9.726 0 0 1-4.964-1.358l-.356-.213-3.695.948.964-3.595-.233-.37A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
    </svg>
  );
}

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({
    locale,
    namespace: "footer",
  });

  const legalLinksByLocale = {
    tr: [
      ["Gizlilik Politikası", "/tr/gizlilik-politikasi"],
      ["Çerez Politikası", "/tr/cerez-politikasi"],
      ["KVKK", "/tr/kvkk"],
      ["Teslimat ve İade", "/tr/teslimat-ve-iade"],
      ["Mesafeli Satış Sözleşmesi", "/tr/mesafeli-satis-sozlesmesi"],
    ],
    en: [
      ["Privacy Policy", "/en/privacy-policy"],
      ["Cookie Policy", "/en/cookie-policy"],
      ["PDPL Notice", "/en/pdpl"],
      ["Delivery & Return", "/en/delivery-and-return"],
      ["Distance Sales Agreement", "/en/distance-sales-agreement"],
    ],
    ru: [
      ["Политика конфиденциальности", "/ru/politika-konfidencialnosti"],
      ["Политика cookie", "/ru/politika-cookie"],
      ["Закон о персональных данных", "/ru/zakon-o-personalnyh-dannyh"],
      ["Доставка и возврат", "/ru/dostavka-i-vozvrat"],
      ["Договор дистанционной продажи", "/ru/dogovor-distancionnoy-prodazhi"],
    ],
    ar: [
      ["سياسة الخصوصية", "/ar/siyasat-alkhususiya"],
      ["سياسة ملفات الارتباط", "/ar/siyasat-cookies"],
      ["إشعار حماية البيانات", "/ar/kvkk"],
      ["التوصيل والاسترجاع", "/ar/altawsil-walistirja"],
      ["اتفاقية البيع عن بعد", "/ar/aitifaqiyat-albay-ean-bued"],
    ],
  } as const;

  return (
    <footer className="bg-brand-green text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        {/* BRAND */}
        <div>
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

          <p className="mt-3 text-sm text-white/70 leading-6">
            {t("description")}
          </p>
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
            <Link href={`/${locale}/#story`} className="hover:text-white">
              {t("about")}
            </Link>
            <Link href={`/${locale}/#contact`} className="hover:text-white">
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
            <a
              href="tel:+902125964155"
              className="flex items-center gap-2 transition hover:text-white"
              target={"_blank"}
              rel="noopener noreferrer"
            >
              <Phone className="h-4 w-4" />
              0212 596 41 55
            </a>

            <a
              href="https://wa.me/905435182342"
              target={"_blank"}
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-white"
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0" />
              WhatsApp
            </a>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Erzenler+Et+Sofrasi+Esenyurt"
              target={"_blank"}
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-white"
            >
              <MapPin className="h-4 w-4" />
              Esenyurt / İstanbul
            </a>
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
      <div className="w-full flex items-center mb-4">
        <div className="mx-auto flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/60">
          {(legalLinksByLocale[locale] || legalLinksByLocale.tr).map(
            ([label, href]) => (
              <Link
                key={href}
                href={href}
                className="transition hover:text-white"
              >
                {label}
              </Link>
            ),
          )}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Erzenler Et Sofrası. All rights reserved.
      </div>
    </footer>
  );
}
