"use client";

import { Trash2 } from "lucide-react";

import {
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/admin/(dashboard)/categories/actions";
import type { CategoryRow } from "./AdminCategoriesClient";

type CategoryCardProps = {
  category: CategoryRow;
  onOptimisticUpdate: (categoryId: string, category: CategoryRow) => void;
  onOptimisticDelete: (categoryId: string) => void;
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

export function CategoryCard({
  category,
  onOptimisticUpdate,
  onOptimisticDelete,
}: CategoryCardProps) {
  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const nameTr = String(formData.get("name_tr") || "").trim();
    const slug = String(formData.get("slug") || "").trim() || toSlug(nameTr);

    const updatedCategory: CategoryRow = {
      id: category.id,
      slug,
      name_tr: nameTr,
      name_en: String(formData.get("name_en") || "").trim() || null,
      name_ru: String(formData.get("name_ru") || "").trim() || null,
      name_ar: String(formData.get("name_ar") || "").trim() || null,
      sort_order: Number(formData.get("sort_order") || 0),
      is_active: formData.get("is_active") === "on",
    };

    onOptimisticUpdate(category.id, updatedCategory);

    try {
      await updateCategoryAction(category.id, formData);
    } catch (error) {
      console.error(error);
      alert("Kategori güncellenemedi. Sayfayı yenileyin.");
    }
  }

  async function handleDelete() {
    const confirmed = confirm("Bu kategoriyi silmek istediğinize emin misiniz?");
    if (!confirmed) return;

    onOptimisticDelete(category.id);

    try {
      await deleteCategoryAction(category.id);
    } catch (error) {
      console.error(error);
      alert("Kategori silinemedi. Sayfayı yenileyin.");
    }
  }

  return (
    <form
      onSubmit={handleUpdate}
      className="rounded-2xl border border-brand-sand bg-white p-4"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_90px_110px]">
        <div>
          <label className="admin-label">TR</label>
          <input
            name="name_tr"
            defaultValue={category.name_tr}
            required
            className="admin-input mt-2 bg-brand-greenLight/20"
          />
        </div>

        <div>
          <label className="admin-label">Slug</label>
          <input
            name="slug"
            defaultValue={category.slug}
            className="admin-input mt-2"
          />
        </div>

        <div>
          <label className="admin-label">Sıra</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={category.sort_order ?? 0}
            className="admin-input mt-2"
          />
        </div>

        <label className="mt-6 flex items-center gap-2 text-sm font-medium text-brand-green">
          <input
            name="is_active"
            type="checkbox"
            defaultChecked={category.is_active}
            className="h-4 w-4 accent-brand-red"
          />
          Aktif
        </label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <input
          name="name_en"
          defaultValue={category.name_en || ""}
          placeholder="EN"
          className="admin-input"
        />

        <input
          name="name_ru"
          defaultValue={category.name_ru || ""}
          placeholder="RU"
          className="admin-input"
        />

        <input
          name="name_ar"
          defaultValue={category.name_ar || ""}
          placeholder="AR"
          dir="rtl"
          className="admin-input"
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="submit"
          className="h-11 rounded-xl bg-brand-green px-5 text-sm font-semibold text-white transition hover:bg-brand-greenLight"
        >
          Kaydet
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-sand text-brand-red transition hover:border-brand-red"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}