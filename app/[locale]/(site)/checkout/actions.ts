"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type CartOrderMode = "table" | "delivery";

type CheckoutCartItem = {
  productId: string;
  productName: string;
  quantity: number;
  basePriceTry: number;
  selectedOption: {
    id: string;
    name: string;
    priceDifferenceTry: number;
  } | null;
  removables: {
    id: string;
    name: string;
  }[];
  note: string | null;
  orderMode: CartOrderMode;
  tableId: string | null;
  tableLabel: string | null;
};

type CreateOrderResult =
  | {
      success: true;
      orderId: string;
      orderNumber: string;
    }
  | {
      success: false;
      message: string;
    };

function createOrderNumber() {
  const date = new Date();
  const iso = date.toISOString(); // "2024-01-15T10:30:45.123Z"
  const stamp = iso
    .replace(/\D/g, "") // tüm non-digit karakterleri sil
    .slice(0, 14);

  const random = Math.floor(1000 + Math.random() * 9000);

  return `ORD-${stamp}-${random}`;
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function createCheckoutOrderAction(
  formData: FormData,
): Promise<CreateOrderResult> {
  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID;

  if (!restaurantId) {
    return {
      success: false,
      message: "Restaurant id bulunamadı.",
    };
  }

  const cartJson = String(formData.get("cart_json") || "[]");

  let items: CheckoutCartItem[] = [];

  try {
    items = JSON.parse(cartJson) as CheckoutCartItem[];
  } catch {
    return {
      success: false,
      message: "Sepet verisi okunamadı.",
    };
  }

  if (!items.length) {
    return {
      success: false,
      message: "Sepet boş.",
    };
  }

  const orderMode = items[0]?.orderMode;

  if (orderMode !== "table" && orderMode !== "delivery") {
    return {
      success: false,
      message: "Sipariş tipi geçersiz.",
    };
  }

  if (orderMode === "table" && !items[0]?.tableId) {
    return {
      success: false,
      message: "Masa bilgisi bulunamadı.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data: settings, error: settingsError } = await supabase
    .from("restaurant_settings")
    .select(
      `
      is_qr_ordering_enabled,
      is_online_ordering_enabled,
      delivery_fee_try,
      minimum_order_try
    `,
    )
    .eq("restaurant_id", restaurantId)
    .single();

  if (settingsError || !settings) {
    return {
      success: false,
      message: "Restoran ayarları okunamadı.",
    };
  }

  if (orderMode === "table" && !settings.is_qr_ordering_enabled) {
    return {
      success: false,
      message: "Masa siparişi şu anda aktif değil.",
    };
  }

  if (orderMode === "delivery" && !settings.is_online_ordering_enabled) {
    return {
      success: false,
      message: "Online sipariş şu anda aktif değil.",
    };
  }

  const subtotalTry = items.reduce((total, item) => {
    const optionPrice = Number(item.selectedOption?.priceDifferenceTry || 0);
    return total + (Number(item.basePriceTry) + optionPrice) * item.quantity;
  }, 0);

  const deliveryFeeTry =
    orderMode === "delivery" ? Number(settings.delivery_fee_try || 0) : 0;

  const minimumOrderTry = Number(settings.minimum_order_try || 0);

  if (orderMode === "delivery" && subtotalTry < minimumOrderTry) {
    return {
      success: false,
      message: "Minimum sipariş tutarı karşılanmadı.",
    };
  }

  const totalTry = subtotalTry + deliveryFeeTry;

  const customerFullName = getString(formData, "customer_full_name");
  const customerPhone = getString(formData, "customer_phone");
  const customerEmail = getString(formData, "customer_email");

  if (!customerFullName || !customerPhone || !customerEmail) {
    return {
      success: false,
      message: "Müşteri bilgileri eksik.",
    };
  }

  const addressCity = getString(formData, "address_city");
  const addressDistrict = getString(formData, "address_district");
  const addressNeighborhood = getString(formData, "address_neighborhood");
  const addressStreet = getString(formData, "address_street");
  const addressBuildingNo = getString(formData, "address_building_no");
  const addressFloor = getString(formData, "address_floor");
  const addressApartmentNo = getString(formData, "address_apartment_no");
  const addressNote = getString(formData, "address_note");
  const customerNote = getString(formData, "customer_note");

  if (
    orderMode === "delivery" &&
    (!addressCity ||
      !addressDistrict ||
      !addressNeighborhood ||
      !addressStreet ||
      !addressBuildingNo)
  ) {
    return {
      success: false,
      message: "Adres bilgileri eksik.",
    };
  }

  const customerAddress = [
    addressCity,
    addressDistrict,
    addressNeighborhood,
    addressStreet,
    addressBuildingNo && `No: ${addressBuildingNo}`,
    addressFloor && `Kat: ${addressFloor}`,
    addressApartmentNo && `Daire: ${addressApartmentNo}`,
  ]
    .filter(Boolean)
    .join(", ");

  const orderNumber = createOrderNumber();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      restaurant_id: restaurantId,
      order_number: orderNumber,

      customer_name: customerFullName,
      customer_full_name: customerFullName,
      customer_phone: customerPhone,
      customer_email: customerEmail,

      customer_address: customerAddress || null,

      order_type: orderMode === "table" ? "table" : "delivery",
      // table_id: orderMode === "table" ? items[0].tableId : null,

      address_city: orderMode === "delivery" ? addressCity : null,
      address_district: orderMode === "delivery" ? addressDistrict : null,
      address_neighborhood:
        orderMode === "delivery" ? addressNeighborhood : null,
      address_street: orderMode === "delivery" ? addressStreet : null,
      address_building_no: orderMode === "delivery" ? addressBuildingNo : null,
      address_floor: orderMode === "delivery" ? addressFloor || null : null,
      address_apartment_no:
        orderMode === "delivery" ? addressApartmentNo || null : null,
      address_note: orderMode === "delivery" ? addressNote || null : null,

      customer_note: customerNote || null,

      status: "pending",

      subtotal_try: subtotalTry,
      delivery_fee_try: deliveryFeeTry,
      total_try: totalTry,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return {
      success: false,
      message: orderError?.message || "Sipariş oluşturulamadı.",
    };
  }

  for (const item of items) {
    const optionPrice = Number(item.selectedOption?.priceDifferenceTry || 0);
    const unitPrice = Number(item.basePriceTry) + optionPrice;
    const itemTotal = unitPrice * item.quantity;

    const selectedOptions = item.selectedOption
      ? [
          {
            id: item.selectedOption.id,
            name: item.selectedOption.name,
            price_difference_try: item.selectedOption.priceDifferenceTry,
          },
        ]
      : [];

    const removedIngredients = item.removables.map((removable) => ({
      id: removable.id,
      name: removable.name,
    }));

    const { data: orderItem, error: orderItemError } = await supabase
      .from("order_items")
      .insert({
        restaurant_id: restaurantId,
        order_id: order.id,
        product_id: item.productId,

        product_name: item.productName,
        product_name_tr: item.productName,

        quantity: item.quantity,
        unit_price_try: unitPrice,
        total_price_try: itemTotal,

        selected_options: selectedOptions,
        removed_ingredients: removedIngredients,
        note: item.note || null,
        item_note: item.note || null,
      })
      .select("id")
      .single();

    if (orderItemError || !orderItem) {
      return {
        success: false,
        message: orderItemError?.message || "Sipariş ürünü eklenemedi.",
      };
    }

    if (item.selectedOption) {
      const { error: optionError } = await supabase
        .from("order_item_options")
        .insert({
          order_item_id: orderItem.id,
          product_option_id: item.selectedOption.id,
          option_name_tr: item.selectedOption.name,
          price_difference_try: item.selectedOption.priceDifferenceTry,
        });

      if (optionError) {
        return {
          success: false,
          message: optionError.message,
        };
      }
    }

    if (item.removables.length > 0) {
      const { error: removableError } = await supabase
        .from("order_item_removables")
        .insert(
          item.removables.map((removable) => ({
            order_item_id: orderItem.id,
            product_removable_id: removable.id,
            removable_name_tr: removable.name,
          })),
        );

      if (removableError) {
        return {
          success: false,
          message: removableError.message,
        };
      }
    }
  }

  return {
    success: true,
    orderId: order.id,
    orderNumber: order.order_number,
  };
}
