"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, ChevronDown } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatCurrency } from "@/lib/utils";
import { updateOrderStatusAction } from "@/app/admin/(dashboard)/orders/actions";
import Link from "next/link";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

type OrderRow = {
  id: string;
  order_number: string;
  customer_full_name: string;
  customer_phone: string;
  customer_email: string;
  address_neighborhood: string | null;
  address_street: string | null;
  address_building_no: string | null;
  address_floor: string | null;
  address_apartment_no: string | null;
  status: OrderStatus;
  total_try: number;
  created_at: string;
};

type AdminOrdersClientProps = {
  restaurantId: string;
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Bekliyor",
  confirmed: "Onaylandı",
  preparing: "Hazırlanıyor",
  out_for_delivery: "Yolda",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

const statusClasses: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AdminOrdersClient({ restaurantId }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setErrorText("");

    const supabase = createSupabaseBrowserClient();

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          order_number,
          customer_full_name,
          customer_phone,
          customer_email,
          address_neighborhood,
          address_street,
          address_building_no,
          address_floor,
          address_apartment_no,
          status,
          total_try,
          created_at
        `,
        )
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrders((data || []) as OrderRow[]);
    } catch (error) {
      console.error(error);
      setErrorText("Siparişler yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    const previousOrders = orders;

    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );

    try {
      await updateOrderStatusAction(orderId, status);
    } catch (error) {
      console.error(error);
      setOrders(previousOrders);
      alert("Sipariş durumu güncellenemedi.");
    }
  }
  function getPhoneHref(phone: string) {
    return `tel:${phone.replace(/\s+/g, "")}`;
  }

  return (
    <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-brand-green">
            Gelen Siparişler
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            Son siparişler en üstte görünür.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-sand text-brand-green transition hover:border-brand-red hover:text-brand-red"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-2xl bg-brand-cream"
            />
          ))}
        </div>
      ) : errorText ? (
        <div className="rounded-2xl border border-brand-sand bg-white p-8 text-center">
          <h3 className="font-semibold text-brand-green">
            Siparişler yüklenemedi
          </h3>
          <p className="mt-2 text-sm text-brand-muted">{errorText}</p>
        </div>
      ) : !orders.length ? (
        <div className="rounded-2xl border border-dashed border-brand-sand bg-brand-cream p-8 text-center">
          <h3 className="font-semibold text-brand-green">Henüz sipariş yok</h3>
          <p className="mt-2 text-sm text-brand-muted">
            Online siparişler burada görünecek.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-brand-sand bg-white p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
                      #{order.order_number}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusClasses[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-semibold text-brand-green">
                    {order.customer_full_name}
                  </h3>

                  <div className="mt-1 flex flex-wrap gap-2 text-sm text-brand-muted">
                    <a
                      href={getPhoneHref(order.customer_phone)}
                      className="transition hover:text-brand-red"
                    >
                      {order.customer_phone}
                    </a>

                    <span>·</span>

                    <a
                      href={`mailto:${order.customer_email}`}
                      className="transition hover:text-brand-red"
                    >
                      {order.customer_email}
                    </a>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-brand-muted">
                    {[
                      order.address_neighborhood,
                      order.address_street,
                      order.address_building_no &&
                        `No: ${order.address_building_no}`,
                      order.address_floor && `Kat: ${order.address_floor}`,
                      order.address_apartment_no &&
                        `Daire: ${order.address_apartment_no}`,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>

                <div className="text-left lg:text-right">
                  <p className="text-sm text-brand-muted">
                    {formatDate(order.created_at)}
                  </p>

                  <p className="mt-3 text-2xl font-bold text-brand-red">
                    {formatCurrency(Number(order.total_try), "TRY")}
                  </p>
                  <div className="mt-4 flex flex-wrap justify-start gap-2 lg:justify-end">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      prefetch={false}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-brand-sand px-4 text-sm font-semibold text-brand-green transition hover:border-brand-red hover:text-brand-red"
                    >
                      Detayı Gör
                    </Link>

                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(event) =>
                          handleStatusChange(
                            order.id,
                            event.target.value as OrderStatus,
                          )
                        }
                        className="
        h-10 appearance-none rounded-xl
        border border-brand-sand bg-white
        px-3 pr-10 text-sm font-semibold
        text-brand-green outline-none cursor-pointer
      "
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option
                            key={value}
                            value={value}
                            className="cursor-pointer"
                          >
                            {label}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        className="
        pointer-events-none absolute
        right-3 top-1/2 h-4 w-4
        -translate-y-1/2 text-brand-green
      "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
