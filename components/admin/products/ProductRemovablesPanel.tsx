"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

type ProductRemovable = {
  id: string;
  name_tr: string;
  name_en: string | null;
  name_ru: string | null;
  name_ar: string | null;
  sort_order: number | null;
  is_active: boolean;
};

type ProductRemovablesPanelProps = {
  productId: string;
  removables: ProductRemovable[];
  createAction: (productId: string, formData: FormData) => Promise<void> | void;
  deleteAction: (productId: string, removableId: string) => Promise<void> | void;
};

export function ProductRemovablesPanel({
  productId,
  removables,
  createAction,
  deleteAction,
}: ProductRemovablesPanelProps) {
  const [items, setItems] = useState(removables);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const tempId = crypto.randomUUID();

    const optimisticItem: ProductRemovable = {
      id: tempId,
      name_tr: String(formData.get("name_tr") || "").trim(),
      name_en: String(formData.get("name_en") || "").trim() || null,
      name_ru: String(formData.get("name_ru") || "").trim() || null,
      name_ar: String(formData.get("name_ar") || "").trim() || null,
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
      alert("Malzeme eklenemedi. Lütfen tekrar deneyin.");
    }
  }

  async function handleDelete(removableId: string) {
    const previousItems = items;

    setItems((current) => current.filter((item) => item.id !== removableId));

    try {
      await deleteAction(productId, removableId);
    } catch (error) {
      console.error(error);
      setItems(previousItems);
      alert("Malzeme silinemedi. Lütfen tekrar deneyin.");
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-brand-sand bg-brand-ivory p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-brand-green">
        Çıkarılabilir Malzemeler
      </h2>

      <p className="mt-2 text-sm text-brand-muted">
        Müşterinin sipariş verirken çıkarmak isteyebileceği malzemeleri yönetin.
      </p>

      <form
        onSubmit={handleCreate}
        className="mt-6 grid gap-4 rounded-2xl border border-brand-sand bg-white p-4"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_120px]">
          <div>
            <label className="admin-label">Malzeme Adı TR *</label>
            <input
              name="name_tr"
              required
              placeholder="Soğan"
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
            Malzeme Ekle
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-sand bg-brand-cream p-6 text-center text-sm text-brand-muted">
            Bu ürüne ait çıkarılabilir malzeme yok.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-brand-sand bg-white p-4"
            >
              <div>
                <h3 className="font-semibold text-brand-green">
                  {item.name_tr}
                </h3>

                <p className="mt-1 text-sm text-brand-muted">
                  Sıra: {item.sort_order ?? 0} ·{" "}
                  {item.is_active ? "Aktif" : "Pasif"}
                </p>
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