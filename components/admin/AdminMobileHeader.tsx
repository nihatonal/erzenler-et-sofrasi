"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BarChart3,
  ClipboardList,
  Grid3X3,
  LayoutDashboard,
  LogOut,
  Menu,
  QrCode,
  Settings,
  ShoppingBag,
  Utensils,
  X,
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
    label: "Raporlar",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    label: "Ayarlar",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminMobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-brand-sand bg-brand-ivory/95 px-4 backdrop-blur lg:hidden">
        <Link href="/admin/dashboard" className="leading-none text-brand-green">
          <div className="font-display text-2xl tracking-[0.16em]">ERZENLER ET SOFRASI</div>
          <div className="mt-1 text-[9px] tracking-[0.28em] text-brand-muted">
            ADMIN
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-sand text-brand-green"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          <aside className="relative h-full w-[86%] max-w-[340px] bg-brand-green text-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
              <div className="leading-none">
                <div className="font-display text-2xl tracking-[0.16em]">
                  MIRA
                </div>
                <div className="mt-1 text-[9px] tracking-[0.28em] text-white/60">
                  ADMIN
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-1 px-4 py-5">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <form
              action={logoutAction}
              className="absolute inset-x-0 bottom-0 border-t border-white/10 p-4"
            >
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/75 transition hover:bg-brand-red hover:text-white"
              >
                <LogOut className="h-5 w-5" />
                Çıkış Yap
              </button>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
