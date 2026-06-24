"use server";

import { revalidatePath } from "next/cache";
import { getAdminRestaurant } from "@/lib/admin/get-admin-restaurant";

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function updateSettingsAction(formData: FormData) {
  const { supabase, restaurantId } = await getAdminRestaurant();

  const payload = {
    restaurant_name: String(formData.get("restaurant_name") || "").trim(),
    restaurant_description:
      String(formData.get("restaurant_description") || "").trim() || null,

    logo_url: String(formData.get("logo_url") || "").trim() || null,

    phone: String(formData.get("phone") || "").trim() || null,
    whatsapp: String(formData.get("whatsapp") || "").trim() || null,
    email: String(formData.get("email") || "").trim() || null,
    instagram_url: String(formData.get("instagram_url") || "").trim() || null,

    address: String(formData.get("address") || "").trim() || null,

    order_email: String(formData.get("order_email") || "").trim() || null,

    minimum_order_try: Number(formData.get("minimum_order_try") || 0),
    delivery_fee_try: Number(formData.get("delivery_fee_try") || 0),
    estimated_delivery_minutes: Number(
      formData.get("estimated_delivery_minutes") || 45,
    ),

    is_ordering_enabled: getBoolean(formData, "is_ordering_enabled"),
    is_qr_ordering_enabled: formData.get("is_qr_ordering_enabled") === "on",

    is_online_ordering_enabled:
      formData.get("is_online_ordering_enabled") === "on",

    is_reservation_enabled: formData.get("is_reservation_enabled") === "on",
    
    enabled_locales: [
      "tr",
      ...(formData.get("locale_en") === "on" ? ["en"] : []),
      ...(formData.get("locale_ru") === "on" ? ["ru"] : []),
      ...(formData.get("locale_ar") === "on" ? ["ar"] : []),
    ],

    qr_footer_text: String(formData.get("qr_footer_text") || "").trim() || null,
  };

  const { error } = await supabase
    .from("restaurant_settings")
    .update(payload)
    .eq("restaurant_id", restaurantId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/settings");
}
