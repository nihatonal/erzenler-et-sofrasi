"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

type ProductOption = {
  id: string;
  option_group: string;
  name_tr: string;
  name_en: string | null;
  name_ru: string | null;
  name_ar: string | null;
  price_difference_try: number | null;
  sort_order: number | null;
  is_active: boolean;
};

type ProductOptionsPanelProps = {
  productId: string;
  options: ProductOption[];
  createAction: (productId: string, formData: FormData) => Promise<void> | void;
  deleteAction: (productId: string, optionId: string) => Promise<void> | void;
};

export function ProductOptionsPanel({
  productId,
  options,
  createAction,
  deleteAction,
}: ProductOptionsPanelProps) {
  const [items, setItems] = useState(options);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const tempId = crypto.randomUUID();

    const optimisticItem: ProductOption = {
      id: tempId,
      option_group: String(formData.get("option_group") || "portion"),
      name_tr: String(formData.get("name_tr") || "").trim(),
      name_en: String(formData.get("name_en") || "").trim() || null,
      name_ru: String(formData.get("name_ru") || "").trim() || null,
      name_ar: String(formData.get("name_ar") || "").trim() || null,
      price_difference_try: Number(formData.get("price_difference_try") || 0),
      sort_order: Number(formData.get("sort_order") || 0),
      is_active: formData.get("is_active") === "on",
    };

    setItems((prev) => [...prev, optimisticItem]);
    form.reset();

    try {
      await createAction(productId, formData);
    } catch (error) {
      console.error(error);
      setItems((prev) => prev.filter((item) => item.id !== tempId));
      alert("Seçenek eklenemedi. Lütfen tekrar deneyin.");
    }
  }

  async function handleDelete(optionId: string) {
    const previousItems = items;

    setItems((current) => current.filter((item) => item.id !== optionId));

    try {
      await deleteAction(productId, optionId);
    } catch (error) {
      console.error(error);
      setItems(previousItems);
      alert("Seçenek silinemedi. Lütfen tekrar deneyin.");
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-brand-sand bg-brand-ivory p-6 lg:p-8">
      <div>
        <h2 className="text-2xl font-bold text-brand-green">
          Ürün Seçenekleri
        </h2>
        <p className="mt-2 text-sm text-brand-muted">
          Porsiyon, boyut veya ekstra seçenekleri buradan yönetin.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="mt-6 grid gap-4 rounded-2xl border border-brand-sand bg-white p-4"
      >
        <div className="grid gap-4 lg:grid-cols-4">
          <div>
            <label className="admin-label">Seçenek Tipi</label>
            <select
              name="option_group"
              defaultValue="portion"
              className="admin-input mt-2"
            >
              <option value="portion">Porsiyon</option>
              <option value="size">Boyut</option>
              <option value="extra">Ekstra</option>
            </select>
          </div>

          <div>
            <label className="admin-label">Ad TR *</label>
            <input
              name="name_tr"
              required
              placeholder="1.5 Porsiyon"
              className="admin-input mt-2"
            />
          </div>

          <div>
            <label className="admin-label">Ek Fiyat ₺</label>
            <input
              name="price_difference_try"
              type="number"
              step="0.01"
              defaultValue={0}
              className="admin-input mt-2"
            />
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

        <div className="grid gap-4 lg:grid-cols-3">
          <input name="name_en" placeholder="EN" className="admin-input" />
          <input name="name_ru" placeholder="RU" className="admin-input" />
          <input
            name="name_ar"
            placeholder="AR"
            dir="rtl"
            className="admin-input"
          />
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
            Seçenek Ekle
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-sand bg-brand-cream p-6 text-center text-sm text-brand-muted">
            Bu ürüne ait seçenek yok.
          </div>
        ) : (
          items.map((option) => (
            <div
              key={option.id}
              className="flex flex-col gap-4 rounded-2xl border border-brand-sand bg-white p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
                    {option.option_group}
                  </span>

                  {option.is_active ? (
                    <span className="rounded-full bg-status-active/10 px-3 py-1 text-xs font-semibold text-status-active">
                      Aktif
                    </span>
                  ) : (
                    <span className="rounded-full bg-status-inactive/10 px-3 py-1 text-xs font-semibold text-status-inactive">
                      Pasif
                    </span>
                  )}
                </div>

                <h3 className="mt-2 text-lg font-semibold text-brand-green">
                  {option.name_tr}
                </h3>

                <p className="mt-1 text-sm text-brand-muted">
                  Ek fiyat:{" "}
                  <span className="font-semibold text-brand-red">
                    ₺{Number(option.price_difference_try || 0).toFixed(2)}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(option.id)}
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