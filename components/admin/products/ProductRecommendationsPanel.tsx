"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { SafeImage } from "@/components/ui/SafeImage";
import { formatCurrency } from "@/lib/utils";

type ProductRecommendation = {
  id: string;
  recommended_product_id: string;
  sort_order: number | null;
  is_active: boolean;
  products: {
    id: string;
    name_tr: string;
    price_try: number;
    image_url: string | null;
  } | null;
};

type RecommendationProductOption = {
  id: string;
  name_tr: string;
};

type ProductRecommendationsPanelProps = {
  productId: string;
  recommendations: ProductRecommendation[];
  products: RecommendationProductOption[];
  createAction: (productId: string, formData: FormData) => Promise<void> | void;
  deleteAction: (
    productId: string,
    recommendationId: string
  ) => Promise<void> | void;
};

export function ProductRecommendationsPanel({
  productId,
  recommendations,
  products,
  createAction,
  deleteAction,
}: ProductRecommendationsPanelProps) {
  const [items, setItems] = useState(recommendations);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const recommendedProductId = String(
      formData.get("recommended_product_id") || ""
    );

    if (!recommendedProductId) {
      alert("Lütfen önerilecek ürünü seçin.");
      return;
    }

    const selectedProduct = products.find(
      (product) => product.id === recommendedProductId
    );

    if (!selectedProduct) {
      alert("Seçilen ürün bulunamadı.");
      return;
    }

    const tempId = crypto.randomUUID();

    const optimisticItem: ProductRecommendation = {
      id: tempId,
      recommended_product_id: recommendedProductId,
      sort_order: Number(formData.get("sort_order") || 0),
      is_active: formData.get("is_active") === "on",
      products: {
        id: selectedProduct.id,
        name_tr: selectedProduct.name_tr,
        price_try: 0,
        image_url: null,
      },
    };

    setItems((prev) => [...prev, optimisticItem]);
    form.reset();

    try {
      await createAction(productId, formData);
    } catch (error) {
      console.error(error);
      setItems((prev) => prev.filter((item) => item.id !== tempId));
      alert("Öneri eklenemedi. Lütfen tekrar deneyin.");
    }
  }

  async function handleDelete(recommendationId: string) {
    const previousItems = items;

    setItems((current) =>
      current.filter((item) => item.id !== recommendationId)
    );

    try {
      await deleteAction(productId, recommendationId);
    } catch (error) {
      console.error(error);
      setItems(previousItems);
      alert("Öneri silinemedi. Lütfen tekrar deneyin.");
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-brand-sand bg-brand-ivory p-6 lg:p-8">
      <div>
        <h2 className="text-2xl font-bold text-brand-green">
          Yanında İyi Gider
        </h2>

        <p className="mt-2 text-sm text-brand-muted">
          Bu ürünle birlikte önerilecek diğer ürünleri seçin.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="mt-6 grid gap-4 rounded-2xl border border-brand-sand bg-white p-4"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_120px]">
          <div>
            <label className="admin-label">Önerilecek Ürün *</label>

            <select
              name="recommended_product_id"
              required
              className="admin-input mt-2"
            >
              <option value="">Ürün seçin</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name_tr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="admin-label">Sıra</label>

            <input
              name="sort_order"
              type="number"
              defaultValue={0}
              className="admin-input mt-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-3 text-sm font-medium text-brand-green">
            <input
              name="is_active"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 accent-brand-red"
            />
            Aktif
          </label>

          <button
            type="submit"
            className="h-11 rounded-xl bg-brand-red px-5 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-brand-redLight"
          >
            Öneri Ekle
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-sand bg-brand-cream p-6 text-center text-sm text-brand-muted">
            Bu ürün için öneri eklenmedi.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-brand-sand bg-white p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-20 overflow-hidden rounded-xl bg-brand-cream">
                  <SafeImage
                    src={item.products?.image_url || "/images/menu/fettuccine.webp"}
                    alt={item.products?.name_tr || "Ürün"}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-brand-green">
                    {item.products?.name_tr || "Ürün"}
                  </h3>

                  <p className="mt-1 text-sm text-brand-muted">
                    Sıra: {item.sort_order ?? 0} ·{" "}
                    {item.is_active ? "Aktif" : "Pasif"}
                  </p>

                  {item.products?.price_try ? (
                    <p className="mt-1 text-sm font-semibold text-brand-red">
                      {formatCurrency(Number(item.products.price_try), "TRY")}
                    </p>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-sand text-brand-red transition hover:border-brand-red"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}