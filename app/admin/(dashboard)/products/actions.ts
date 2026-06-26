"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

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

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

async function getAdminContext() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("restaurant_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.restaurant_id) {
    throw new Error("Restoran bağlantısı bulunamadı.");
  }

  return {
    supabase,
    user,
    restaurantId: profile.restaurant_id as string,
  };
}

function getNullableNumber(formData: FormData, key: string) {
  const value = formData.get(key);

  if (value === null || value === "") {
    return null;
  }

  return Number(value);
}

function getProductPayload(formData: FormData) {
  const nameTr = String(formData.get("name_tr") || "").trim();
  const slugValue = String(formData.get("slug") || "").trim() || toSlug(nameTr);

  return {
    category_id: String(formData.get("category_id") || ""),
    slug: slugValue,

    name_tr: nameTr,
    name_en: String(formData.get("name_en") || "").trim() || null,
    name_ru: String(formData.get("name_ru") || "").trim() || null,
    name_ar: String(formData.get("name_ar") || "").trim() || null,

    description_tr: String(formData.get("description_tr") || "").trim() || null,
    description_en: String(formData.get("description_en") || "").trim() || null,
    description_ru: String(formData.get("description_ru") || "").trim() || null,
    description_ar: String(formData.get("description_ar") || "").trim() || null,

    image_url: String(formData.get("image_url") || "").trim() || null,

    price_try: Number(formData.get("price_try") || 0),
    old_price_try: getNullableNumber(formData, "old_price_try"),
    discount_percent: getNullableNumber(formData, "discount_percent"),

    is_popular: getBoolean(formData, "is_popular"),
    is_recommended: getBoolean(formData, "is_recommended"),
    is_new: getBoolean(formData, "is_new"),
    is_discounted: getBoolean(formData, "is_discounted"),
    sort_order: Number(formData.get("sort_order") || 0),
    is_vegetarian: getBoolean(formData, "is_vegetarian"),
    is_vegan: getBoolean(formData, "is_vegan"),
    is_gluten_free: getBoolean(formData, "is_gluten_free"),
    is_spicy: getBoolean(formData, "is_spicy"),

    is_active: getBoolean(formData, "is_active"),
  };
}

export async function createProductAction(formData: FormData) {
  const { supabase, restaurantId } = await getAdminContext();

  const payload = {
    restaurant_id: restaurantId,
    ...getProductPayload(formData),
  };

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.id) {
    throw new Error("Ürün oluşturuldu ancak ürün ID alınamadı.");
  }

  revalidatePath("/admin/products");
  redirect(`/admin/products/${data.id}/edit`);
}

export async function updateProductAction(
  productId: string,
  formData: FormData,
) {
  const { supabase, restaurantId } = await getAdminContext();

  const { error } = await supabase
    .from("products")
    .update(getProductPayload(formData))
    .eq("id", productId)
    .eq("restaurant_id", restaurantId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductAction(productId: string) {
  const { supabase, restaurantId } = await getAdminContext();

  const { error, count } = await supabase
    .from("products")
    .delete({ count: "exact" })
    .eq("id", productId)
    .eq("restaurant_id", restaurantId);

  if (error) {
    throw new Error(error.message);
  }

  if (!count) {
    throw new Error("Ürün silinemedi veya yetkiniz yok.");
  }

  revalidatePath("/admin/products");
}

export async function createProductOptionAction(
  productId: string,
  formData: FormData,
) {
  const { supabase, restaurantId } = await getAdminContext();

  const payload = {
    restaurant_id: restaurantId,
    product_id: productId,

    option_group: String(formData.get("option_group") || "portion"),

    name_tr: String(formData.get("name_tr") || "").trim(),
    name_en: String(formData.get("name_en") || "").trim() || null,
    name_ru: String(formData.get("name_ru") || "").trim() || null,
    name_ar: String(formData.get("name_ar") || "").trim() || null,

    price_difference_try: Number(formData.get("price_difference_try") || 0),
    sort_order: Number(formData.get("sort_order") || 0),
    is_active: getBoolean(formData, "is_active"),
  };

  const { error } = await supabase.from("product_options").insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteProductOptionAction(
  productId: string,
  optionId: string,
) {
  const { supabase, restaurantId } = await getAdminContext();

  const { error } = await supabase
    .from("product_options")
    .delete()
    .eq("id", optionId)
    .eq("product_id", productId)
    .eq("restaurant_id", restaurantId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createProductRemovableAction(
  productId: string,
  formData: FormData,
) {
  const { supabase, restaurantId } = await getAdminContext();

  const payload = {
    restaurant_id: restaurantId,
    product_id: productId,

    name_tr: String(formData.get("name_tr") || "").trim(),
    name_en: String(formData.get("name_en") || "").trim() || null,
    name_ru: String(formData.get("name_ru") || "").trim() || null,
    name_ar: String(formData.get("name_ar") || "").trim() || null,

    sort_order: Number(formData.get("sort_order") || 0),
    is_active: getBoolean(formData, "is_active"),
  };

  const { error } = await supabase.from("product_removables").insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteProductRemovableAction(
  productId: string,
  removableId: string,
) {
  const { supabase, restaurantId } = await getAdminContext();

  const { error } = await supabase
    .from("product_removables")
    .delete()
    .eq("id", removableId)
    .eq("product_id", productId)
    .eq("restaurant_id", restaurantId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createProductRecommendationAction(
  productId: string,
  formData: FormData,
) {
  const { supabase, restaurantId } = await getAdminContext();

  const recommendedProductId = String(
    formData.get("recommended_product_id") || "",
  );

  if (!recommendedProductId) {
    throw new Error("Önerilen ürün seçilmedi.");
  }

  if (recommendedProductId === productId) {
    throw new Error("Ürün kendisine öneri olarak eklenemez.");
  }

  const payload = {
    restaurant_id: restaurantId,
    product_id: productId,
    recommended_product_id: recommendedProductId,
    sort_order: Number(formData.get("sort_order") || 0),
    is_active: getBoolean(formData, "is_active"),
  };

  const { error } = await supabase
    .from("product_recommendations")
    .insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteProductRecommendationAction(
  productId: string,
  recommendationId: string,
) {
  const { supabase, restaurantId } = await getAdminContext();

  const { error } = await supabase
    .from("product_recommendations")
    .delete()
    .eq("id", recommendationId)
    .eq("product_id", productId)
    .eq("restaurant_id", restaurantId);

  if (error) {
    throw new Error(error.message);
  }
}
