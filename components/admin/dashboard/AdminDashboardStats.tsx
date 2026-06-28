"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Props = {
  restaurantId: string;
};

type Stats = {
  todayOrders: number;
  activeProducts: number;
  pendingOrders: number;
};

function getTodayStartIso() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

export function AdminDashboardStats({ restaurantId }: Props) {
  const [stats, setStats] = useState<Stats>({
    todayOrders: 0,
    activeProducts: 0,
    pendingOrders: 0,
  });

  const loadStats = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    const todayStart = getTodayStartIso();

    const [todayOrdersResult, activeProductsResult, pendingOrdersResult] =
      await Promise.all([
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("restaurant_id", restaurantId)
          .gte("created_at", todayStart),

        supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("restaurant_id", restaurantId)
          .eq("is_active", true),

        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("restaurant_id", restaurantId)
          .in("status", ["pending", "confirmed", "preparing", "ready"]),
      ]);

    setStats({
      todayOrders: todayOrdersResult.count || 0,
      activeProducts: activeProductsResult.count || 0,
      pendingOrders: pendingOrdersResult.count || 0,
    });
  }, [restaurantId]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  useEffect(() => {
    function handleNewOrder() {
      void loadStats();
    }

    window.addEventListener("admin:new-order", handleNewOrder);

    return () => {
      window.removeEventListener("admin:new-order", handleNewOrder);
    };
  }, [loadStats]);

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
        <p className="text-sm font-semibold text-brand-muted">
          Bugünkü Sipariş
        </p>
        <p className="mt-3 text-3xl font-bold text-brand-green">
          {stats.todayOrders}
        </p>
      </div>

      <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
        <p className="text-sm font-semibold text-brand-muted">Aktif Ürün</p>
        <p className="mt-3 text-3xl font-bold text-brand-green">
          {stats.activeProducts}
        </p>
      </div>

      <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
        <p className="text-sm font-semibold text-brand-muted">
          Bekleyen Sipariş
        </p>
        <p className="mt-3 text-3xl font-bold text-brand-red">
          {stats.pendingOrders}
        </p>
      </div>
    </div>
  );
}