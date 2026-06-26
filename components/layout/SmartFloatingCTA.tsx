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
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="relative mx-auto flex max-w-md items-center gap-2 border-t border-white/10 bg-black/80 px-3 py-2 backdrop-blur-xl">

        {/* WHATSAPP */}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          className="relative flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-3 text-xs font-bold text-white"
        >
          {/* pulse dot */}
          <span className="absolute right-2 top-2 h-2 w-2 animate-ping rounded-full bg-green-300" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-400" />

          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>

        {/* MENU */}
        <Link
          href={`/${locale}/menu`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-xs font-bold text-white"
        >
          <Utensils className="h-4 w-4" />
          Menü
        </Link>

        {/* CART */}
        <Link
          href={`/${locale}/checkout`}
          className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold text-white transition ${
            cartQuantity > 0
              ? "bg-brand-red animate-pulse shadow-lg shadow-red-500/30"
              : "bg-brand-red/40 pointer-events-none"
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          Sepet

          {cartQuantity > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-bounce items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-red">
              {cartQuantity}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
