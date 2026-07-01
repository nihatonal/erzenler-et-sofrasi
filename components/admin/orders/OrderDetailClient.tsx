"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, RefreshCw } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatCurrency } from "@/lib/utils";
import { updateOrderStatusAction } from "@/app/admin/(dashboard)/orders/actions";
import { OrderPrintButton } from "./OrdersPrintButton";

type OrderStatus = "confirmed" | "delivered" | "cancelled";

type OrderItem = {
  id: string;
  product_name_tr: string;
  quantity: number;
  unit_price_try: number;
  total_price_try: number;
  item_note: string | null;
  order_item_options: {
    id: string;
    option_name_tr: string;
    price_difference_try: number;
  }[];
  order_item_removables: {
    id: string;
    removable_name_tr: string;
  }[];
};

type OrderDetail = {
  id: string;
  order_number: string;
  customer_full_name: string;
  customer_phone: string;
  customer_email: string;
  address_city: string | null;
  address_district: string | null;
  address_neighborhood: string | null;
  address_street: string | null;
  address_building_no: string | null;
  address_floor: string | null;
  address_apartment_no: string | null;
  address_note: string | null;
  customer_note: string | null;
  status: OrderStatus;
  subtotal_try: number;
  delivery_fee_try: number;
  total_try: number;
  created_at: string;
  order_items: OrderItem[];
};

type OrderDetailClientProps = {
  orderId: string;
  restaurantId: string;
};

const statusLabels: Record<OrderStatus, string> = {
  confirmed: "Onaylandı",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

const statusClasses: Record<OrderStatus, string> = {
  confirmed: "bg-brand-red/10 text-brand-red",
  delivered: "bg-status-active/10 text-status-active",
  cancelled: "bg-status-inactive/10 text-status-inactive",
};

const statusOptions: OrderStatus[] = ["confirmed", "delivered", "cancelled"];

function normalizeStatus(status: string | null): OrderStatus {
  if (status === "delivered" || status === "cancelled") return status;
  return "confirmed";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getPhoneHref(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function OrderDetailClient({
  orderId,
  restaurantId,
}: OrderDetailClientProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorText, setErrorText] = useState("");

  const loadOrder = useCallback(
    async (showRefreshing = false) => {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

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
            address_city,
            address_district,
            address_neighborhood,
            address_street,
            address_building_no,
            address_floor,
            address_apartment_no,
            address_note,
            customer_note,
            status,
            subtotal_try,
            delivery_fee_try,
            total_try,
            created_at,
            order_items (
              id,
              product_name_tr,
              quantity,
              unit_price_try,
              total_price_try,
              item_note,
              order_item_options (
                id,
                option_name_tr,
                price_difference_try
              ),
              order_item_removables (
                id,
                removable_name_tr
              )
            )
          `,
          )
          .eq("id", orderId)
          .eq("restaurant_id", restaurantId)
          .single();

        if (error) throw error;

        setOrder({
          ...(data as OrderDetail),
          status: normalizeStatus(data.status),
        });
      } catch (error) {
        console.error(error);
        setErrorText("Sipariş detayı yüklenemedi.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [orderId, restaurantId],
  );

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  async function handleStatusChange(status: OrderStatus) {
    if (!order) return;

    const previous = order;
    setOrder({ ...order, status });

    try {
      await updateOrderStatusAction(order.id, status);
    } catch (error) {
      console.error(error);
      setOrder(previous);
      alert("Sipariş durumu güncellenemedi.");
    }
  }

  if (isLoading) {
    return (
      <div className="h-[520px] animate-pulse rounded-2xl bg-brand-cream" />
    );
  }

  if (errorText || !order) {
    return (
      <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-10 text-center">
        <h1 className="text-xl font-semibold text-brand-green">
          Sipariş yüklenemedi
        </h1>

        <p className="mt-2 text-sm text-brand-muted">{errorText}</p>

        <button
          type="button"
          onClick={() => void loadOrder(true)}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-red px-5 text-sm font-bold text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/admin/orders"
        prefetch={false}
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red"
      >
        <ArrowLeft className="h-4 w-4" />
        Siparişlere dön
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
          <div className="flex flex-col gap-4 border-b border-brand-sand pb-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
                  #{order.order_number}
                </p>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusClasses[order.status]
                  }`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-bold text-brand-green">
                Sipariş Detayı
              </h1>

              <p className="mt-2 text-sm text-brand-muted">
                {formatDate(order.created_at)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void loadOrder(true)}
                disabled={isRefreshing}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-sand bg-white text-brand-green transition hover:border-brand-red hover:text-brand-red disabled:opacity-60"
              >
                <RefreshCw
                  className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"}
                />
              </button>
              <OrderPrintButton
                orderId={orderId}
                restaurantId={restaurantId}
                initialOrder={order}
              />

              <div className="relative">
                <select
                  value={order.status}
                  onChange={(event) =>
                    handleStatusChange(event.target.value as OrderStatus)
                  }
                  className="h-10 cursor-pointer appearance-none rounded-xl border border-brand-sand bg-white px-3 pr-10 text-sm font-semibold text-brand-green outline-none"
                >
                  {statusOptions.map((value) => (
                    <option key={value} value={value}>
                      {statusLabels[value]}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-green" />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-brand-sand bg-white p-5"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-brand-green">
                      {item.quantity}x {item.product_name_tr}
                    </h2>

                    {item.order_item_options.length > 0 && (
                      <div className="mt-3 text-sm text-brand-muted">
                        <p className="font-semibold text-brand-green">
                          Seçenekler:
                        </p>

                        {item.order_item_options.map((option) => (
                          <p key={option.id}>
                            {option.option_name_tr}{" "}
                            {Number(option.price_difference_try) > 0
                              ? `(+${formatCurrency(
                                  Number(option.price_difference_try),
                                  "TRY",
                                )})`
                              : ""}
                          </p>
                        ))}
                      </div>
                    )}

                    {item.order_item_removables.length > 0 && (
                      <div className="mt-3 text-sm text-brand-muted">
                        <p className="font-semibold text-brand-green">Çıkar:</p>

                        {item.order_item_removables.map((removable) => (
                          <p key={removable.id}>
                            {removable.removable_name_tr}
                          </p>
                        ))}
                      </div>
                    )}

                    {item.item_note && (
                      <p className="mt-3 text-sm text-brand-muted">
                        Not: {item.item_note}
                      </p>
                    )}
                  </div>

                  <p className="font-bold text-brand-red">
                    {formatCurrency(Number(item.total_price_try), "TRY")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* <section className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
            <h2 className="text-xl font-semibold text-brand-green">Müşteri</h2>

            <p className="mt-4 font-semibold text-brand-green">
              {order.customer_full_name}
            </p>

            <a
              href={getPhoneHref(order.customer_phone)}
              className="mt-1 block text-sm text-brand-muted transition hover:text-brand-red"
            >
              {order.customer_phone}
            </a>

            <a
              href={`mailto:${order.customer_email}`}
              className="mt-1 block text-sm text-brand-muted transition hover:text-brand-red"
            >
              {order.customer_email}
            </a>
          </section> */}

          {/* <section className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
            <h2 className="text-xl font-semibold text-brand-green">Adres</h2>

            <p className="mt-4 text-sm leading-6 text-brand-muted">
              {[
                order.address_city,
                order.address_district,
                order.address_neighborhood,
                order.address_street,
                order.address_building_no && `No: ${order.address_building_no}`,
                order.address_floor && `Kat: ${order.address_floor}`,
                order.address_apartment_no &&
                  `Daire: ${order.address_apartment_no}`,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>

            {order.address_note && (
              <p className="mt-3 text-sm text-brand-muted">
                Adres Notu: {order.address_note}
              </p>
            )}
          </section> */}

          <section className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
            <h2 className="text-xl font-semibold text-brand-green">Özet</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-muted">Ara Toplam</span>
                <span className="font-semibold text-brand-green">
                  {formatCurrency(Number(order.subtotal_try), "TRY")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-muted">Teslimat</span>
                <span className="font-semibold text-brand-green">
                  {formatCurrency(Number(order.delivery_fee_try), "TRY")}
                </span>
              </div>

              <div className="flex justify-between border-t border-brand-sand pt-3 text-lg">
                <span className="font-bold text-brand-green">Toplam</span>
                <span className="font-bold text-brand-red">
                  {formatCurrency(Number(order.total_try), "TRY")}
                </span>
              </div>
            </div>

            {order.customer_note && (
              <p className="mt-5 text-sm leading-6 text-brand-muted">
                Müşteri Notu: {order.customer_note}
              </p>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
