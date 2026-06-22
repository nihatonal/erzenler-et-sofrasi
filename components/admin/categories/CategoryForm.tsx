"use client";

import { createCategoryAction } from "@/app/admin/(dashboard)/categories/actions";
import type { CategoryRow } from "./AdminCategoriesClient";

type CategoryFormProps = {
  onOptimisticCreate: (category: CategoryRow) => void;
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoryForm({ onOptimisticCreate }: CategoryFormProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const nameTr = String(formData.get("name_tr") || "").trim();
    const slug = String(formData.get("slug") || "").trim() || toSlug(nameTr);

    const tempCategory: CategoryRow = {
      id: crypto.randomUUID(),
      slug,
      name_tr: nameTr,
      name_en: String(formData.get("name_en") || "").trim() || null,
      name_ru: String(formData.get("name_ru") || "").trim() || null,
      name_ar: String(formData.get("name_ar") || "").trim() || null,
      sort_order: Number(formData.get("sort_order") || 0),
      is_active: formData.get("is_active") === "on",
    };

    onOptimisticCreate(tempCategory);
    form.reset();

    try {
      await createCategoryAction(formData);
    } catch (error) {
      console.error(error);
      alert("Kategori eklenemedi. Sayfayı yenileyin.");
    }
  }

  return (
    <section className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
      <h2 className="text-xl font-semibold text-brand-green">Yeni Kategori</h2>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div>
          <label className="admin-label">Kategori Adı TR *</label>
          <input name="name_tr" required className="admin-input mt-2" />
        </div>

        <div>
          <label className="admin-label">Slug</label>
          <input
            name="slug"
            placeholder="otomatik oluşturulur"
            className="admin-input mt-2"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
          <div>
            <label className="admin-label">Ad EN</label>
            <input name="name_en" className="admin-input mt-2" />
          </div>

          <div>
            <label className="admin-label">Ad RU</label>
            <input name="name_ru" className="admin-input mt-2" />
          </div>

          <div>
            <label className="admin-label">Ad AR</label>
            <input name="name_ar" dir="rtl" className="admin-input mt-2" />
          </div>
        </div>

        <div>
          <label className="admin-label">Sıralama</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={0}
            className="admin-input mt-2"
          />
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-brand-sand bg-brand-cream px-4 py-4 text-sm font-medium text-brand-green">
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
          className="h-12 rounded-xl bg-brand-red px-5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-brand-redLight"
        >
          Kategori Ekle
        </button>
      </form>
    </section>
  );
}