"use server";

import { revalidatePath } from "next/cache";
import { getAdminRestaurant } from "@/lib/admin/get-admin-restaurant";

const allowedStatuses = ["confirmed", "delivered", "cancelled"] as const;

export async function updateOrderStatusAction(orderId: string, status: string) {
  if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
    throw new Error("Geçersiz sipariş durumu.");
  }

  const { supabase, restaurantId } = await getAdminRestaurant();

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .eq("restaurant_id", restaurantId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/dashboard");
}