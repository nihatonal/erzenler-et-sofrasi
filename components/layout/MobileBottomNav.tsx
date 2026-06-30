"use client";

import Link from "next/link";
import { ClipboardList, Home, MenuSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { type Locale } from "@/i18n";

type MobileBottomNavProps = {
  locale: Locale;
};

// WhatsApp SVG ikonu (lucide'da yok)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <div className="relative flex flex-1 items-center justify-center gap-2 rounded-xl  text-xs font-bold text-white">
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.525 5.847L.057 23.571a.75.75 0 0 0 .921.921l5.724-1.468A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.726 9.726 0 0 1-4.964-1.358l-.356-.213-3.695.948.964-3.595-.233-.37A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
      </svg>

      <span className="absolute -right-2 -top-1  h-8 w-8 animate-ping rounded-full bg-green-300/50" />
      <span className="absolute -right-2 -top-1  h-8 w-8 rounded-full bg-green-400/10" />
    </div>
  );
}

export function MobileBottomNav({ locale }: MobileBottomNavProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const whatsappNumber = "905435182342";
  const items = [
    {
      label: t("home"),
      href: `/${locale}`,
      icon: Home,
    },
    {
      label: t("menu"),
      href: `/${locale}/menu`,
      icon: MenuSquare,
    },
    {
      label: t("orders"),
      href: `/${locale}/checkout`,
      icon: ClipboardList,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/${whatsappNumber}`,
      icon: WhatsAppIcon,
      external: true,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-sand bg-brand-cream/95 px-4 pb-4 pt-2 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === `/${locale}`
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              target={item.label === "WhatsApp" ? "_blank" : ""}
              rel="noopener noreferrer"
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs font-medium transition",

                active
                  ? "text-brand-red"
                  : "text-brand-green/75 hover:text-brand-red",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  item.label === "WhatsApp" && "text-green-600",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
