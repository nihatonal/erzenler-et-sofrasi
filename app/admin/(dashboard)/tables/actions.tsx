"use server";

import { revalidatePath } from "next/cache";
import { getAdminRestaurant } from "@/lib/admin/get-admin-restaurant";

function slugify(value: string) {
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

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function createTableAction(formData: FormData) {
  const { supabase, restaurantId } = await getAdminRestaurant();

  const label = String(formData.get("label") || "").trim();
  const slug = String(formData.get("slug") || "").trim() || slugify(label);

  const { error } = await supabase.from("restaurant_tables").insert({
    restaurant_id: restaurantId,
    label,
    slug,
    capacity: Number(formData.get("capacity") || 1),
    status: String(formData.get("status") || "available"),
    qr_active: getBoolean(formData, "qr_active"),
    is_active: getBoolean(formData, "is_active"),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/tables");
}

export async function updateTableAction(tableId: string, formData: FormData) {
  const { supabase, restaurantId } = await getAdminRestaurant();

  const label = String(formData.get("label") || "").trim();
  const slug = String(formData.get("slug") || "").trim() || slugify(label);

  const { error } = await supabase
    .from("restaurant_tables")
    .update({
      label,
      slug,
      capacity: Number(formData.get("capacity") || 1),
      status: String(formData.get("status") || "available"),
      qr_active: getBoolean(formData, "qr_active"),
      is_active: getBoolean(formData, "is_active"),
    })
    .eq("id", tableId)
    .eq("restaurant_id", restaurantId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/tables");
}

export async function deleteTableAction(tableId: string) {
  const { supabase, restaurantId } = await getAdminRestaurant();

  const { error } = await supabase
    .from("restaurant_tables")
    .delete()
    .eq("id", tableId)
    .eq("restaurant_id", restaurantId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/tables");
}