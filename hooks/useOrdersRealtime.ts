"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type UseOrdersRealtimeArgs = {
  restaurantId: string;
  onNewOrder?: (order: any) => void;
  onOrderUpdate?: (order: any) => void;
};

export function useOrdersRealtime({
  restaurantId,
  onNewOrder,
  onOrderUpdate,
}: UseOrdersRealtimeArgs) {
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const channel = supabase
      .channel(`orders-live-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          onNewOrder?.(payload.new);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          onOrderUpdate?.(payload.new);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, onNewOrder, onOrderUpdate]);
}
