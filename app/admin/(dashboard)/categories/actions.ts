"use server";

import { revalidatePath } from "next/cache";
import { getAdminRestaurant } from "@/lib/admin/get-admin-restaurant";

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

function getCategoryPayload(formData: FormData) {
  const nameTr = String(formData.get("name_tr") || "").trim();
  const slug = String(formData.get("slug") || "").trim() || toSlug(nameTr);

  return {
    slug,
    name_tr: nameTr,
    name_en: String(formData.get("name_en") || "").trim() || null,
    name_ru: String(formData.get("name_ru") || "").trim() || null,
    name_ar: String(formData.get("name_ar") || "").trim() || null,
    sort_order: Number(formData.get("sort_order") || 0),
    is_active: formData.get("is_active") === "on",
  };
}

export async function createCategoryAction(formData: FormData) {
  const { supabase, restaurantId } = await getAdminRestaurant();

  const payload = {
    restaurant_id: restaurantId,
    ...getCategoryPayload(formData),
  };

  const { error } = await supabase.from("categories").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
}

export async function updateCategoryAction(
  categoryId: string,
  formData: FormData
) {
  const { supabase, restaurantId } = await getAdminRestaurant();

  const { error } = await supabase
    .from("categories")
    .update(getCategoryPayload(formData))
    .eq("id", categoryId)
    .eq("restaurant_id", restaurantId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
}

export async function deleteCategoryAction(categoryId: string) {
  const { supabase, restaurantId } = await getAdminRestaurant();

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)
    .eq("restaurant_id", restaurantId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
}