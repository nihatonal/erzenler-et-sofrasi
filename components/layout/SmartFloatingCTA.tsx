"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, ShoppingBag, Utensils } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/cart/card-store";

type Props = {
  locale: string;
  whatsappNumber: string;
};

export function SmartFloatingCTA({ locale, whatsappNumber }: Props) {
  const pathname = usePathname();
  const cartQuantity = useCartStore((s) => s.getTotalQuantity());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [visible, setVisible] = useState(true);
  const lastScroll = useRef(0);

  const isCheckout = pathname.includes("/checkout");

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll.current && current > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScroll.current = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isCheckout) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 hidden md:flex flex-col items-end gap-3 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      {/* WHATSAPP */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/30 transition hover:bg-green-700"
      >
        <span className="absolute right-2 top-2 h-2 w-2 animate-ping rounded-full bg-green-300" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-400" />
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </a>

      {/* MENU */}
      <Link
        href={`/${locale}/menu`}
        className="flex items-center gap-2 rounded-2xl bg-brand-green px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand-green/20 transition hover:opacity-90"
      >
        <Utensils className="h-4 w-4" />
        Menü
      </Link>

      {/* CART */}
      <Link
        href={`/${locale}/checkout`}
        className={`relative flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-lg transition ${
          isMounted && cartQuantity > 0
            ? "bg-brand-red shadow-red-500/30 animate-pulse"
            : "bg-brand-red/40 pointer-events-none"
        }`}
      >
        <ShoppingBag className="h-4 w-4" />
        Sepet
        {isMounted && cartQuantity > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 animate-bounce items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-red">
            {cartQuantity}
          </span>
        )}
      </Link>
    </div>
  );
}
