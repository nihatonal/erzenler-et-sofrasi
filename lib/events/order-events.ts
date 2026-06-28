import { revalidatePath } from "next/cache";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  sendOrderCreatedEmail,
  sendOrderToAdminEmail,
} from "@/lib/email/order-emails";

export async function emitOrderCreated(orderId: string) {
  try {
    const supabase = createSupabaseAdminClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
        id,
        restaurant_id,
        order_number,
        order_type,
        customer_name,
        customer_full_name,
        customer_phone,
        customer_email,
        customer_address,
        address_city,
        address_district,
        address_neighborhood,
        address_street,
        address_building_no,
        address_floor,
        address_apartment_no,
        address_note,
        customer_note,
        subtotal_try,
        delivery_fee_try,
        total_try,
        created_at,
        order_items (
          id,
          product_name,
          product_name_tr,
          quantity,
          unit_price_try,
          total_price_try,
          item_note,
          order_item_options (
            id,
            option_name_tr,
            price_difference_try
          ),
          order_item_removables (
            id,
            removable_name_tr
          )
        )
      `,
      )
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("ORDER_EVENT_FETCH_ERROR:", orderError);
      return;
    }

    const { data: settings, error: settingsError } = await supabase
      .from("restaurant_settings")
      .select("restaurant_name, email, order_email")
      .eq("restaurant_id", order.restaurant_id)
      .maybeSingle();

    if (settingsError) {
      console.error("ORDER_SETTINGS_FETCH_ERROR:", settingsError);
    }

    const orderWithSettings = {
      ...order,
      restaurant_settings: settings || null,
    };

    const results = await Promise.allSettled([
      sendOrderCreatedEmail(orderWithSettings as any),
      sendOrderToAdminEmail(orderWithSettings as any),
    ]);

    console.log("ORDER_EMAIL_RESULTS:", results);

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
  } catch (error) {
    console.error("ORDER_CREATED_EVENT_ERROR:", error);
  }
}