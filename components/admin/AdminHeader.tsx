import { Bell } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "../language/LanguageSwitcher";
import { type Locale } from "@/i18n";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/[locale]/(auth)/admin/login/actions";
import { AdminMobileMenu } from "./AdminMobileMenu";

type AdminHeaderProps = {
  title: string;
  description?: string;
  locale: Locale;
};

export async function AdminHeader({
  title,
  description,
  locale,
}: AdminHeaderProps) {
  const currentLocale = locale as Locale;
  const t = await getTranslations({
    locale: currentLocale,
    namespace: "admin.header",
  });
  const logout = logoutAction.bind(null, locale);
  return (
    <header className="flex h-24 max-w-full items-center overflow-x-hidden border-b border-neutral-200 bg-white px-4 lg:px-10">
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl line-clamp-2 font-semibold text-dark-bg md:text-3xl">
            {title}
          </h1>

          {description && (
            <p className="mt-2 hidden truncate text-sm text-neutral-500 md:block">
              {description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-4">
          <div className="hidden lg:flex">
            <LanguageSwitcher currentLocale={locale} variant="light" />
          </div>

          <button
            type="button"
            className="relative flex h-12 w-12 items-center justify-center border border-neutral-200 bg-[#FAF8F3] transition hover:border-brand-gold"
          >
            <Bell className="h-5 w-5 text-dark-bg" />
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-brand-gold" />
          </button>
          <form action={logout}>
            <button
              type="submit"
              className="flex h-12 w-12 items-center justify-center border border-neutral-200
               bg-[#FAF8F3] text-neutral-500 transition hover:border-red-400 hover:text-red-500"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </form>

          <div className="hidden md:flex items-center gap-3 border border-neutral-200 bg-[#FAF8F3] px-4 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold text-sm font-bold text-white">
              A
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold text-dark-bg">
                {t("adminName")}
              </p>

              <p className="text-xs text-neutral-500">{t("adminRole")}</p>
            </div>
          </div>

          <AdminMobileMenu locale={locale as Locale} />
        </div>
      </div>
    </header>
  );
}
