"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Grid3X3,
  LayoutDashboard,
  LogOut,
  QrCode,
  Settings,
  ShoppingBag,
  Utensils,
} from "lucide-react";

import { logoutAction } from "@/app/admin/(auth)/login/actions";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Siparişler",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    label: "Ürünler",
    href: "/admin/products",
    icon: Utensils,
  },
  {
    label: "Kategoriler",
    href: "/admin/categories",
    icon: Grid3X3,
  },
  {
    label: "Rezervasyonlar",
    href: "/admin/reservations",
    icon: ShoppingBag,
  },
  {
    label: "Masalar / QR",
    href: "/admin/tables",
    icon: QrCode,
  },
  {
    label: "Ayarlar",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen border-r border-brand-sand bg-brand-green text-white lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-7 py-7">
        <Link href="/admin/dashboard" prefetch={false} className="block leading-none">
          <div className="font-display text-3xl tracking-[0.18em]">
            ERZENLER
          </div>
          <div className="mt-2 text-[10px] tracking-[0.34em] text-white/60">
            ET SOFRASI / ADMIN
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={
                isActive
                  ? "flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-brand-green shadow-sm"
                  : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              }
            >
              <Icon
                className={
                  isActive ? "h-5 w-5 text-brand-red" : "h-5 w-5"
                }
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutAction} className="border-t border-white/10 p-4">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-brand-red hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Çıkış Yap
        </button>
      </form>
    </aside>
  );
}