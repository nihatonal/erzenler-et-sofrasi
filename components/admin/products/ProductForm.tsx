"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { uploadProductImage } from "@/lib/supabase/upload-product-image";

type LocaleCode = "tr" | "en" | "ru" | "ar";

type Category = {
  id: string;
  name_tr: string;
};

type Product = {
  id: string;
  slug: string;
  category_id: string | null;
  sort_order: number | null;
  name_tr: string;
  name_en: string | null;
  name_ru: string | null;
  name_ar: string | null;

  description_tr: string | null;
  description_en: string | null;
  description_ru: string | null;
  description_ar: string | null;

  image_url: string | null;

  price_try: number;
  old_price_try: number | null;
  discount_percent: number | null;

  is_popular: boolean;
  is_recommended: boolean;
  is_new: boolean;
  is_discounted: boolean;

  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;

  is_active: boolean;
};

type ProductFormProps = {
  mode: "create" | "edit";
  product?: Product;
  categories: Category[];
  enabledLocales?: LocaleCode[];
  action: (formData: FormData) => void;
};


type SubmitButtonProps = {
  mode: "create" | "edit";
  isUploading: boolean;
};

export function SubmitButton({ mode, isUploading }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const disabled = pending || isUploading;

  let text = "";

  if (isUploading) {
    text = "Görsel Yükleniyor...";
  } else if (pending) {
    text = mode === "edit" ? "Ürün Güncelleniyor..." : "Ürün Oluşturuluyor...";
  } else {
    text = mode === "edit" ? "Ürünü Güncelle" : "Ürünü Oluştur";
  }

  return (
    <button
      type="submit"
      disabled={disabled}
      className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand-red text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-brand-redLight disabled:cursor-not-allowed disabled:opacity-60"
    >
      {disabled && <Loader2 className="h-5 w-5 animate-spin" />}

      {text}
    </button>
  );
}

export function ProductForm({
  mode,
  product,
  categories,
  enabledLocales,
  action,
}: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState(
    product?.image_url || "/images/menu/fettuccine.webp",
  );

  const [imageUrl, setImageUrl] = useState(product?.image_url || "");
  const [isUploading, setIsUploading] = useState(false);

  const activeLocales = enabledLocales || ["tr", "en", "ru", "ar"];

  const showEn = activeLocales.includes("en");
  const showRu = activeLocales.includes("ru");
  const showAr = activeLocales.includes("ar");

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      setIsUploading(true);

      const form = event.currentTarget.form;
      const slug =
        form?.querySelector<HTMLInputElement>('input[name="slug"]')?.value ||
        form
          ?.querySelector<HTMLInputElement>('input[name="name_tr"]')
          ?.value.toLowerCase()
          .trim()
          .replace(/\s+/g, "-") ||
        "product";

      const uploadedUrl = await uploadProductImage({
        file,
        slug,
      });

      setImageUrl(uploadedUrl);
      setPreviewUrl(uploadedUrl);
    } catch (error) {
      console.error(error);
      alert("Görsel yüklenemedi.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form className="grid gap-8 xl:grid-cols-[1fr_380px]" action={action}>
      <input type="hidden" name="image_url" value={imageUrl} />
      {!showEn && (
        <>
          <input type="hidden" name="name_en" value={product?.name_en || ""} />
          <input
            type="hidden"
            name="description_en"
            value={product?.description_en || ""}
          />
        </>
      )}

      {!showRu && (
        <>
          <input type="hidden" name="name_ru" value={product?.name_ru || ""} />
          <input
            type="hidden"
            name="description_ru"
            value={product?.description_ru || ""}
          />
        </>
      )}

      {!showAr && (
        <>
          <input type="hidden" name="name_ar" value={product?.name_ar || ""} />
          <input
            type="hidden"
            name="description_ar"
            value={product?.description_ar || ""}
          />
        </>
      )}
      <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-6 lg:p-8">
        <div className="mb-6">
          <Link
            href="/admin/products"
            prefetch={false}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red transition hover:text-brand-redDark"
          >
            <ArrowLeft className="h-4 w-4" />
            Ürünlere dön
          </Link>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2 ">
            <div>
              <label className="admin-label">Ürün Adı TR *</label>
              <input
                name="name_tr"
                required
                defaultValue={product?.name_tr || ""}
                className="admin-input mt-3"
              />
            </div>

            <div>
              <label className="admin-label">Slug</label>
              <input
                name="slug"
                defaultValue={product?.slug || ""}
                placeholder="otomatik oluşturulur"
                className="admin-input mt-3"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Açıklama TR</label>
            <textarea
              name="description_tr"
              rows={4}
              defaultValue={product?.description_tr || ""}
              className="admin-input mt-3 min-h-32 py-4"
            />
          </div>

          {(showEn || showRu || showAr) && (
            <div className="grid gap-6 md:grid-cols-3 bg-brand-greenLight/10 p-2 rounded-xl">
              {showEn && (
                <div>
                  <label className="admin-label">Ürün Adı EN</label>
                  <input
                    name="name_en"
                    defaultValue={product?.name_en || ""}
                    className="admin-input mt-3"
                  />
                </div>
              )}

              {showRu && (
                <div>
                  <label className="admin-label">Ürün Adı RU</label>
                  <input
                    name="name_ru"
                    defaultValue={product?.name_ru || ""}
                    className="admin-input mt-3"
                  />
                </div>
              )}

              {showAr && (
                <div>
                  <label className="admin-label">Ürün Adı AR</label>
                  <input
                    name="name_ar"
                    dir="rtl"
                    defaultValue={product?.name_ar || ""}
                    className="admin-input mt-3"
                  />
                </div>
              )}
            </div>
          )}

          {(showEn || showRu || showAr) && (
            <div className="grid gap-6 md:grid-cols-3 bg-brand-greenLight/10 p-2 rounded-xl">
              {showEn && (
                <div>
                  <label className="admin-label">Açıklama EN</label>
                  <textarea
                    name="description_en"
                    rows={4}
                    defaultValue={product?.description_en || ""}
                    className="admin-input mt-3 py-4"
                  />
                </div>
              )}

              {showRu && (
                <div>
                  <label className="admin-label">Açıklama RU</label>
                  <textarea
                    name="description_ru"
                    rows={4}
                    defaultValue={product?.description_ru || ""}
                    className="admin-input mt-3 py-4"
                  />
                </div>
              )}

              {showAr && (
                <div>
                  <label className="admin-label">Açıklama AR</label>
                  <textarea
                    name="description_ar"
                    rows={4}
                    dir="rtl"
                    defaultValue={product?.description_ar || ""}
                    className="admin-input mt-3 py-4"
                  />
                </div>
              )}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <label className="admin-label">Fiyat ₺ *</label>
              <input
                name="price_try"
                required
                type="number"
                step="0.01"
                defaultValue={product?.price_try ?? ""}
                className="admin-input mt-3"
              />
            </div>

            <div>
              <label className="admin-label">Eski Fiyat ₺</label>
              <input
                name="old_price_try"
                type="number"
                step="0.01"
                defaultValue={product?.old_price_try ?? ""}
                className="admin-input mt-3"
              />
            </div>

            <div>
              <label className="admin-label">İndirim %</label>
              <input
                name="discount_percent"
                type="number"
                defaultValue={product?.discount_percent ?? ""}
                className="admin-input mt-3"
              />
            </div>

            <div>
              <label className="admin-label">Sıralama</label>
              <input
                name="sort_order"
                type="number"
                defaultValue={product?.sort_order ?? 0}
                className="admin-input mt-3"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Kategori *</label>
            <select
              name="category_id"
              required
              defaultValue={product?.category_id || ""}
              className="admin-input mt-3"
            >
              <option value="">Kategori seçin</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name_tr}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["is_popular", "Popüler", product?.is_popular],
              ["is_recommended", "Şefin Önerisi", product?.is_recommended],
              ["is_new", "Yeni", product?.is_new],
              ["is_discounted", "İndirimli", product?.is_discounted],
              ["is_vegetarian", "Vejetaryen", product?.is_vegetarian],
              ["is_vegan", "Vegan", product?.is_vegan],
              ["is_gluten_free", "Glutensiz", product?.is_gluten_free],
              ["is_spicy", "Acılı", product?.is_spicy],
              ["is_active", "Aktif", product?.is_active ?? true],
            ].map(([name, label, checked]) => (
              <label
                key={String(name)}
                className="flex items-center gap-3 rounded-xl border border-brand-sand bg-brand-cream px-4 py-4 text-sm font-medium text-brand-green"
              >
                <input
                  name={String(name)}
                  type="checkbox"
                  defaultChecked={Boolean(checked)}
                  className="h-4 w-4 accent-brand-red"
                />

                {label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
          <h2 className="text-lg font-semibold text-brand-green">
            Ürün Görseli
          </h2>

          <div className="mt-6 rounded-2xl border border-dashed border-brand-sand bg-brand-cream p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />

            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                <ImagePlus className="h-8 w-8" />
              </div>

              <p className="mt-4 text-sm font-medium text-brand-green">
                Görsel yükle
              </p>

              <p className="mt-2 text-xs leading-6 text-brand-muted">
                PNG, JPG veya WEBP
              </p>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="mt-5 inline-flex h-11 items-center justify-center rounded-xl border border-brand-red px-5 text-sm font-semibold text-brand-red transition hover:bg-brand-red hover:text-white disabled:opacity-60"
              >
                {isUploading ? "Yükleniyor..." : "Dosya Seç"}
              </button>
            </div>
          </div>

          <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl border border-brand-sand bg-neutral-100">
            <Image
              src={previewUrl}
              alt="Ürün görseli"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>

        <SubmitButton mode={mode} isUploading={isUploading} />
      </div>
    </form>
  );
}
