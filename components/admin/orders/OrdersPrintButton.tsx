"use client";

import { useState } from "react";
import { Printer } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatCurrency } from "@/lib/utils";

type OrderStatus = "confirmed" | "delivered" | "cancelled";

type OrderItem = {
  id: string;
  product_name_tr: string;
  quantity: number;
  total_price_try: number;
  item_note: string | null;
  order_item_options: {
    id: string;
    option_name_tr: string;
  }[];
  order_item_removables: {
    id: string;
    removable_name_tr: string;
  }[];
};

type PrintableOrder = {
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

type OrderPrintButtonProps = {
  orderId: string;
  restaurantId: string;
  initialOrder?: PrintableOrder | null;
};

const statusLabels: Record<OrderStatus, string> = {
  confirmed: "Onaylandı",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
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

function normalizeStatus(status: string | null): OrderStatus {
  if (status === "delivered" || status === "cancelled") return status;
  return "confirmed";
}

export function OrderPrintButton({
  orderId,
  restaurantId,
  initialOrder,
}: OrderPrintButtonProps) {
  const [order, setOrder] = useState<PrintableOrder | null>(
    initialOrder || null,
  );
  const [isLoading, setIsLoading] = useState(false);

  async function loadOrder() {
    if (order) return order;

    setIsLoading(true);

    const supabase = createSupabaseBrowserClient();

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
          total_price_try,
          item_note,
          order_item_options (
            id,
            option_name_tr
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

    setIsLoading(false);

    if (error || !data) {
      alert("Fiş bilgileri yüklenemedi.");
      return null;
    }

    const printableOrder = {
      ...(data as PrintableOrder),
      status: normalizeStatus(data.status),
    };

    setOrder(printableOrder);

    return printableOrder;
  }

  async function handlePrint() {
    const loadedOrder = await loadOrder();

    if (!loadedOrder) return;

    setTimeout(() => {
      window.print();
    }, 100);
  }

  return (
    <>
      <button
        type="button"
        onClick={handlePrint}
        disabled={isLoading}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-brand-sand bg-white px-4 text-sm font-semibold text-brand-green transition hover:border-brand-red hover:text-brand-red disabled:opacity-60 print:hidden"
      >
        <Printer className="h-4 w-4" />
        {isLoading ? "Hazırlanıyor..." : "Yazdır"}
      </button>

      {order && (
        <div className="hidden print:block">
          <div className="mx-auto w-[280px] bg-white p-4 text-black">
            <h1 className="text-center text-lg font-bold">
              ERZENLER ET SOFRASI
            </h1>

            <div className="mt-3 border-y border-black py-2 text-xs">
              <p>
                <strong>Sipariş:</strong> #{order.order_number}
              </p>
              <p>
                <strong>Tarih:</strong> {formatDate(order.created_at)}
              </p>
              <p>
                <strong>Durum:</strong> {statusLabels[order.status]}
              </p>
            </div>

            <div className="mt-3 text-xs">
              <p className="font-bold">MÜŞTERİ</p>
              <p>{order.customer_full_name}</p>
              <p>{order.customer_phone}</p>
              <p>{order.customer_email}</p>
            </div>

            <div className="mt-3 text-xs">
              <p className="font-bold">ADRES</p>
              <p>
                {[
                  order.address_city,
                  order.address_district,
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

              {order.address_note && <p>Adres Notu: {order.address_note}</p>}
            </div>

            <div className="mt-3 border-t border-black pt-2 text-xs">
              <p className="font-bold">ÜRÜNLER</p>

              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="mt-2 border-b border-dashed border-black pb-2"
                >
                  <div className="flex justify-between gap-2">
                    <span>
                      {item.quantity}x {item.product_name_tr}
                    </span>
                    <span>
                      {formatCurrency(Number(item.total_price_try), "TRY")}
                    </span>
                  </div>

                  {item.order_item_options.map((option) => (
                    <p key={option.id} className="pl-2">
                      + {option.option_name_tr}
                    </p>
                  ))}

                  {item.order_item_removables.map((removable) => (
                    <p key={removable.id} className="pl-2">
                      - {removable.removable_name_tr}
                    </p>
                  ))}

                  {item.item_note && (
                    <p className="pl-2">Not: {item.item_note}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 text-xs">
              <div className="flex justify-between">
                <span>Ara Toplam</span>
                <span>{formatCurrency(Number(order.subtotal_try), "TRY")}</span>
              </div>

              <div className="flex justify-between">
                <span>Teslimat</span>
                <span>
                  {formatCurrency(Number(order.delivery_fee_try), "TRY")}
                </span>
              </div>

              <div className="mt-2 flex justify-between border-t border-black pt-2 text-sm font-bold">
                <span>TOPLAM</span>
                <span>{formatCurrency(Number(order.total_try), "TRY")}</span>
              </div>
            </div>

            {order.customer_note && (
              <div className="mt-3 text-xs">
                <p className="font-bold">MÜŞTERİ NOTU</p>
                <p>{order.customer_note}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}