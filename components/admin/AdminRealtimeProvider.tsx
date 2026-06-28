"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type AdminRealtimeProviderProps = {
  restaurantId: string;
};

type OrderNotification = {
  id: string;
  order_number: string | null;
  restaurant_id: string;
  total_try: number | null;
  created_at: string;
};

function playNotificationSound() {
  const audio = new Audio("/sounds/notification.mp3");
  audio.volume = 0.8;

  audio.play().catch((error) => {
    console.warn("NOTIFICATION_SOUND_BLOCKED:", error);
  });
}

export function AdminRealtimeProvider({
  restaurantId,
}: AdminRealtimeProviderProps) {
  const [message, setMessage] = useState("");

  const initializedRef = useRef(false);
  const latestOrderIdRef = useRef<string | null>(null);
  const notifiedIdsRef = useRef<Set<string>>(new Set());

  const notifyNewOrder = useCallback((order: OrderNotification) => {
    if (notifiedIdsRef.current.has(order.id)) return;

    notifiedIdsRef.current.add(order.id);
    latestOrderIdRef.current = order.id;

    setMessage(`Yeni sipariş geldi: ${order.order_number || "Sipariş"}`);

    window.dispatchEvent(
      new CustomEvent("admin:new-order", {
        detail: order,
      }),
    );

    playNotificationSound();
  }, []);

  const checkLatestOrder = useCallback(
    async (shouldNotify: boolean) => {
      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, restaurant_id, total_try, created_at")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) return;

      const latestOrder = data as OrderNotification;

      if (!initializedRef.current) {
        initializedRef.current = true;
        latestOrderIdRef.current = latestOrder.id;
        return;
      }

      if (shouldNotify && latestOrder.id !== latestOrderIdRef.current) {
        notifyNewOrder(latestOrder);
      }
    },
    [restaurantId, notifyNewOrder],
  );

  useEffect(() => {
    void checkLatestOrder(false);

    const interval = window.setInterval(() => {
      void checkLatestOrder(true);
    }, 7000);

    return () => {
      window.clearInterval(interval);
    };
  }, [checkLatestOrder]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const channel = supabase
      .channel(`admin-orders-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          const order = payload.new as OrderNotification;
          notifyNewOrder(order);
        },
      )
      .subscribe((status) => {
        console.log("ORDERS_REALTIME_STATUS:", status);
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [restaurantId, notifyNewOrder]);

  if (!message) return null;

  return (
    <div className="fixed right-5 top-5 z-[9999] w-[calc(100%-40px)] max-w-sm rounded-2xl border border-brand-sand bg-white p-4 shadow-2xl">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
          <Bell className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-bold text-brand-green">Yeni Sipariş</p>
          <p className="mt-1 text-sm text-brand-muted">{message}</p>
        </div>

        <button
          type="button"
          onClick={() => setMessage("")}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-sand text-brand-green"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
