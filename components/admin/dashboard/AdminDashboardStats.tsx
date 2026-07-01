"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatCurrency } from "@/lib/utils";

type Props = {
  restaurantId: string;
};

type OrderStatus = "confirmed" | "delivered" | "cancelled";

type Stats = {
  todayOrders: number;
  activeProducts: number;
  activeOrders: number;
  todayRevenue: number;
  byStatus: Record<OrderStatus, number>;
};

const statusCards: {
  key: OrderStatus;
  label: string;
  className: string;
}[] = [
  {
    key: "confirmed",
    label: "Onaylandı",
    className: "bg-blue-500/10 text-blue-700",
  },
  {
    key: "delivered",
    label: "Teslim Edildi",
    className: "bg-status-active/10 text-status-active",
  },
  {
    key: "cancelled",
    label: "İptal Edildi",
    className: "bg-status-inactive/10 text-status-inactive",
  },
];

function getTodayStartIso() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

const initialStats: Stats = {
  todayOrders: 0,
  activeProducts: 0,
  activeOrders: 0,
  todayRevenue: 0,
  byStatus: {
    confirmed: 0,
    delivered: 0,
    cancelled: 0,
  },
};

export function AdminDashboardStats({ restaurantId }: Props) {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorText, setErrorText] = useState("");

  const loadStats = useCallback(
    async (showRefreshing = false) => {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setErrorText("");

      const supabase = createSupabaseBrowserClient();
      const todayStart = getTodayStartIso();

      try {
        const [todayOrdersResult, activeProductsResult, todayOrdersDataResult] =
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
              .select("status, total_try")
              .eq("restaurant_id", restaurantId)
              .gte("created_at", todayStart),
          ]);

        if (todayOrdersResult.error) throw todayOrdersResult.error;
        if (activeProductsResult.error) throw activeProductsResult.error;
        if (todayOrdersDataResult.error) throw todayOrdersDataResult.error;

        const todayOrders = todayOrdersDataResult.data || [];

        const byStatus = { ...initialStats.byStatus };

        let todayRevenue = 0;

        for (const order of todayOrders) {
          const status = order.status as OrderStatus;

          if (status in byStatus) {
            byStatus[status] += 1;
          }

          if (status !== "cancelled") {
            todayRevenue += Number(order.total_try || 0);
          }
        }

        const activeOrders = byStatus.confirmed;

        setStats({
          todayOrders: todayOrdersResult.count || 0,
          activeProducts: activeProductsResult.count || 0,
          activeOrders,
          todayRevenue,
          byStatus,
        });
      } catch (error) {
        console.error(error);
        setErrorText("Dashboard verileri yüklenemedi.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [restaurantId],
  );

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  useEffect(() => {
    function handleNewOrder() {
      void loadStats(true);
    }

    window.addEventListener("admin:new-order", handleNewOrder);

    return () => {
      window.removeEventListener("admin:new-order", handleNewOrder);
    };
  }, [loadStats]);

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-green">
            Dashboard Özeti
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            Bugünkü sipariş ve operasyon durumunu buradan takip edin.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadStats(true)}
          disabled={isRefreshing}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-brand-sand bg-white px-4 text-sm font-semibold text-brand-green transition hover:border-brand-red hover:text-brand-red disabled:opacity-60"
        >
          <RefreshCw
            className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"}
          />
          Yenile
        </button>
      </div>

      {errorText && (
        <div className="mb-4 rounded-2xl border border-brand-sand bg-white p-4 text-sm font-semibold text-brand-red">
          {errorText}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
          <p className="text-sm font-semibold text-brand-muted">
            Bugünkü Sipariş
          </p>
          <p className="mt-3 text-3xl font-bold text-brand-green">
            {isLoading ? "-" : stats.todayOrders}
          </p>
        </div>

        <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
          <p className="text-sm font-semibold text-brand-muted">
            Aktif Sipariş
          </p>
          <p className="mt-3 text-3xl font-bold text-brand-red">
            {isLoading ? "-" : stats.activeOrders}
          </p>
        </div>

        <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
          <p className="text-sm font-semibold text-brand-muted">Aktif Ürün</p>
          <p className="mt-3 text-3xl font-bold text-brand-green">
            {isLoading ? "-" : stats.activeProducts}
          </p>
        </div>

        <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
          <p className="text-sm font-semibold text-brand-muted">Bugünkü Ciro</p>
          <p className="mt-3 text-3xl font-bold text-brand-green">
            {isLoading ? "-" : formatCurrency(stats.todayRevenue, "TRY")}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {statusCards.map((item) => (
          <div
            key={item.key}
            className="rounded-2xl border border-brand-sand bg-white p-4"
          >
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${item.className}`}
            >
              {item.label}
            </span>

            <p className="mt-4 text-3xl font-bold text-brand-green">
              {isLoading ? "-" : stats.byStatus[item.key]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
