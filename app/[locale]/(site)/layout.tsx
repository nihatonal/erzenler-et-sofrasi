import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileAppHeader } from "@/components/layout/MobileAppHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CookieBanner } from "@/components/public/CookieBanner";

import { type Locale } from "@/i18n";
import { AppProviders } from "@/components/providers/AppProviders";
import { SmartFloatingCTA } from "@/components/layout/SmartFloatingCTA";

type SiteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
};

export default async function SiteLayout({
  children,
  params,
}: SiteLayoutProps) {
  const { locale } = await params;
  const currentLocale = locale as Locale;

  return (
    <>
      <AppProviders locale={locale} whatsappNumber="905435182342">
        <Header locale={currentLocale} />
        <MobileAppHeader locale={currentLocale} />

        <div>{children}</div>
        <SmartFloatingCTA
          whatsappNumber="905435182342"
          locale={currentLocale}
        />

        <Footer locale={currentLocale} />
        
        <CookieBanner locale={currentLocale} />
      </AppProviders>

      <MobileBottomNav locale={currentLocale} />
    </>
  );
}
