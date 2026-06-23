"use server";

import { revalidatePath } from "next/cache";
import { getAdminRestaurant } from "@/lib/admin/get-admin-restaurant";

const allowedStatuses = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export async function updateOrderStatusAction(
  orderId: string,
  status: string
) {
  if (!allowedStatuses.includes(status)) {
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
}