"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { ArrowLeft, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import { createCheckoutOrderAction } from "@/app/[locale]/(site)/checkout/actions";
import { CartItem, useCartStore } from "@/lib/cart/card-store";

type CheckoutClientProps = {
  locale: string;
  restaurantId: string;
};

function getCartItemName(item: CartItem, locale: string): string {
  if (locale === "en") return item.productName_en || item.productName;
  if (locale === "ru") return item.productName_ru || item.productName;
  if (locale === "ar") return item.productName_ar || item.productName;
  return item.productName;
}

function getLocalizedCartName(
  names: {
    name: string;
    name_en?: string | null;
    name_ru?: string | null;
    name_ar?: string | null;
  },
  locale: string,
): string {
  if (locale === "en") return names.name_en || names.name;
  if (locale === "ru") return names.name_ru || names.name;
  if (locale === "ar") return names.name_ar || names.name;
  return names.name;
}

export function CheckoutClient({ locale }: CheckoutClientProps) {
  const t = useTranslations("checkout");

  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const [isPending, startTransition] = useTransition();
  const [errorText, setErrorText] = useState("");
  const [successOrderNumber, setSuccessOrderNumber] = useState("");

  const orderMode = items[0]?.orderMode || "delivery";
  const isTableOrder = orderMode === "table";

  const subtotal = getSubtotal();

  const cartJson = useMemo(() => {
    return JSON.stringify(items);
  }, [items]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorText("");
    setSuccessOrderNumber("");

    const formData = new FormData(event.currentTarget);
    formData.set("cart_json", cartJson);

    startTransition(async () => {
      const result = await createCheckoutOrderAction(formData);

      if (!result.success) {
        setErrorText(result.message);
        window.scrollTo({ top: 0, behavior: "smooth" }); // ← hata durumunda da en üste git
        return;
      }

      clearCart();
      setSuccessOrderNumber(result.orderNumber);
      window.scrollTo({ top: 0, behavior: "smooth" }); // ← başarı durumunda
    });
  }

  if (successOrderNumber) {
    return (
      <main className="min-h-screen bg-brand-cream px-4 pt-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-brand-sand bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-brand-green">
            {t("success.title")}
          </h1>

          <p className="mt-3 text-sm text-brand-muted">
            {t("success.description")}
          </p>

          <p className="mt-5 rounded-xl bg-brand-cream px-4 py-3 text-lg font-bold text-brand-red">
            #{successOrderNumber}
          </p>

          <Link
            href={`/${locale}/menu`}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand-green px-5 text-sm font-bold text-white"
          >
            {t("success.backToMenu")}
          </Link>
        </div>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="min-h-screen bg-brand-cream px-4 pt-20 md:pt-28">
        <div className="mx-auto max-w-xl rounded-2xl border border-brand-sand bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-brand-green">
            {t("empty.title")}
          </h1>

          <p className="mt-3 text-sm text-brand-muted">
            {t("empty.description")}
          </p>

          <Link
            href={`/${locale}/menu`}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand-green px-5 text-sm font-bold text-white"
          >
            {t("empty.backToMenu")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream px-4 pt-20 md:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/${locale}/menu`}
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-red"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Link>

        <div className="mt-2 grid gap-6 lg:grid-cols-[1fr_420px]">
          <section className="rounded-2xl border border-brand-sand bg-white p-5">
            <h1 className="text-2xl font-bold text-brand-green">
              {t("title")}
            </h1>

            <div className="mt-5 grid gap-3">
              {items.map((item) => {
                const unitPrice =
                  Number(item.basePriceTry) +
                  Number(item.selectedOption?.priceDifferenceTry || 0);

                return (
                  <div
                    key={item.cartItemId}
                    className="grid grid-cols-[72px_1fr] gap-3 rounded-2xl border border-brand-sand bg-brand-cream p-3"
                  >
                    <div className="relative h-20 overflow-hidden rounded-xl bg-white">
                      <Image
                        src={
                          item.productImageUrl || "/images/menu/fettuccine.webp"
                        }
                        alt={getCartItemName(item, locale)}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="line-clamp-1 font-bold text-brand-green">
                            {getCartItemName(item, locale)}
                          </h2>

                          {item.selectedOption && (
                            <p className="mt-1 text-xs text-brand-muted">
                              {getLocalizedCartName(
                                item.selectedOption,
                                locale,
                              )}
                            </p>
                          )}

                          {item.removables.length > 0 && (
                            <p className="mt-1 text-xs text-brand-muted">
                              {t("without")}:{" "}
                              {item.removables
                                .map((r) => getLocalizedCartName(r, locale))
                                .join(", ")}
                            </p>
                          )}

                          {item.note && (
                            <p className="mt-1 text-xs text-brand-muted">
                              {t("note")}: {item.note}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-brand-red"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.cartItemId)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-sand bg-white"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          <span className="w-7 text-center text-sm font-bold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.cartItemId)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-sand bg-white"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <p className="font-bold text-brand-red">
                          {formatCurrency(unitPrice * item.quantity, "TRY")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex mt-6 px-2 justify-between text-sm">
              <span className="text-brand-muted">{t("summary.subtotal")}:</span>
              <span className="font-bold text-brand-green">
                {formatCurrency(subtotal, "TRY")}
              </span>
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-brand-sand bg-white p-5"
          >
            <h2 className="text-xl font-bold text-brand-green">
              {isTableOrder ? t("table.title") : t("delivery.title")}
            </h2>

            {isTableOrder && items[0]?.tableLabel && (
              <p className="mt-3 rounded-xl bg-brand-cream px-4 py-3 text-sm font-bold text-brand-green">
                {items[0].tableLabel}
              </p>
            )}

            <input type="hidden" name="cart_json" value={cartJson} />

            <div className="mt-5 grid gap-4">
              <div>
                <label className="admin-label">{t("fields.fullName")}</label>
                <input
                  name="customer_full_name"
                  required
                  className="admin-input mt-2"
                />
              </div>

              <div>
                <label className="admin-label">{t("fields.phone")}</label>
                <input
                  name="customer_phone"
                  required
                  className="admin-input mt-2"
                />
              </div>

              <div>
                <label className="admin-label">{t("fields.email")}</label>
                <input
                  name="customer_email"
                  type="email"
                  required
                  className="admin-input mt-2"
                />
              </div>

              {!isTableOrder && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="admin-label">{t("fields.city")}</label>
                      <input
                        name="address_city"
                        value={"Istanbul"}
                        defaultValue={"Istanbul"}
                        disabled
                        required
                        className="admin-input mt-2 text-brand-muted"
                      />
                    </div>
                    <div>
                      <label className="admin-label">
                        {t("fields.district")}
                      </label>
                      <input
                        name="address_district"
                        required
                        className="admin-input mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="admin-label">
                      {t("fields.neighborhood")}
                    </label>
                    <input
                      name="address_neighborhood"
                      required
                      className="admin-input mt-2"
                    />
                  </div>

                  <div>
                    <label className="admin-label">{t("fields.street")}</label>
                    <input
                      name="address_street"
                      required
                      className="admin-input mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="admin-label">
                        {t("fields.buildingNo")}
                      </label>
                      <input
                        name="address_building_no"
                        required
                        className="admin-input mt-2"
                      />
                    </div>
                    <div>
                      <label className="admin-label">{t("fields.floor")}</label>
                      <input
                        name="address_floor"
                        className="admin-input mt-2"
                      />
                    </div>
                    <div>
                      <label className="admin-label">
                        {t("fields.apartmentNo")}
                      </label>
                      <input
                        name="address_apartment_no"
                        className="admin-input mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="admin-label">
                      {t("fields.addressNote")}
                    </label>
                    <textarea
                      name="address_note"
                      rows={2}
                      className="admin-input mt-2 py-3"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="admin-label">
                  {t("fields.customerNote")}
                </label>
                <textarea
                  name="customer_note"
                  rows={3}
                  className="admin-input mt-2 py-3"
                />
              </div>
            </div>

            <div className="mt-6 border-t border-brand-sand pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">
                  {t("summary.subtotal")}
                </span>
                <span className="font-bold text-brand-green">
                  {formatCurrency(subtotal, "TRY")}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-lg">
                <span className="font-bold text-brand-green">
                  {t("summary.total")}
                </span>
                <span className="font-bold text-brand-red">
                  {formatCurrency(subtotal, "TRY")}
                </span>
              </div>
            </div>

            {errorText && (
              <p className="mt-4 rounded-xl bg-brand-red/10 px-4 py-3 text-sm font-semibold text-brand-red">
                {errorText}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-6 flex h-13 w-full items-center justify-center rounded-xl bg-brand-red text-sm font-bold uppercase tracking-[0.12em] text-white disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
