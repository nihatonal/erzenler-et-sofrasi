"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CookieBannerProps = {
  locale: string;
};

const cookieLinks: Record<string, string> = {
  tr: "/tr/cerez-politikasi",
  en: "/en/cookie-policy",
  ru: "/ru/politika-cookie",
  ar: "/ar/siyasat-cookies",
};

export function CookieBanner({ locale }: CookieBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("erzenler-cookie-consent");
    if (!accepted) setVisible(true);
  }, []);

  function acceptCookies() {
    localStorage.setItem("erzenler-cookie-consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-5 right-5 z-[9999] rounded-2xl border border-brand-sand bg-white p-5 shadow-2xl md:left-auto md:max-w-md">
      <h2 className="font-bold text-brand-green">
        {locale === "tr"
          ? "Çerez Kullanımı"
          : locale === "ru"
            ? "Использование cookies"
            : locale === "ar"
              ? "استخدام ملفات تعريف الارتباط"
              : "Cookie Usage"}
      </h2>

      <p className="mt-2 text-sm leading-6 text-brand-muted">
        {locale === "tr"
          ? "Bu site, temel işlevlerin çalışması ve deneyimin iyileştirilmesi için çerezler kullanır."
          : locale === "ru"
            ? "Этот сайт использует cookies для работы основных функций и улучшения пользовательского опыта."
            : locale === "ar"
              ? "يستخدم هذا الموقع ملفات تعريف الارتباط لتشغيل الوظائف الأساسية وتحسين التجربة."
              : "This site uses cookies for essential functionality and improving the experience."}
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={acceptCookies}
          className="h-11 rounded-xl bg-brand-red px-5 text-sm font-bold text-white"
        >
          {locale === "tr"
            ? "Anladım"
            : locale === "ru"
              ? "Понятно"
              : locale === "ar"
                ? "فهمت"
                : "Got it"}
        </button>

        <Link
          href={cookieLinks[locale] || cookieLinks.tr}
          className="flex h-11 items-center justify-center rounded-xl border border-brand-sand px-5 text-sm font-semibold text-brand-green"
        >
          {locale === "tr"
            ? "Çerez Politikası"
            : locale === "ru"
              ? "Политика cookies"
              : locale === "ar"
                ? "سياسة ملفات الارتباط"
                : "Cookie Policy"}
        </Link>
      </div>
    </div>
  );
}