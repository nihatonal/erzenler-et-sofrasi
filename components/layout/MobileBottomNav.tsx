"use client";

import Link from "next/link";
import { ClipboardList, Home, MenuSquare, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Locale } from "@/i18n";

type MobileBottomNavProps = {
  locale: Locale;
};

export function MobileBottomNav({ locale }: MobileBottomNavProps) {
  const pathname = usePathname();

  const items = [
    {
      label: "Anasayfa",
      href: `/${locale}`,
      icon: Home,
    },
    {
      label: "Menü",
      href: `/${locale}/menu`,
      icon: MenuSquare,
    },
    {
      label: "Siparişlerim",
      href: `/${locale}/orders`,
      icon: ClipboardList,
    },
    {
      label: "İletişim",
      href: `/${locale}/contact`,
      icon: Phone,
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
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs font-medium transition",
                active
                  ? "text-brand-red"
                  : "text-brand-green/75 hover:text-brand-red",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
