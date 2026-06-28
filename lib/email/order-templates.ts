import { formatCurrency } from "@/lib/utils";

type OrderEmailItem = {
  product_name_tr: string | null;
  product_name: string | null;
  quantity: number;
  unit_price_try: number;
  total_price_try: number;
  item_note: string | null;
  order_item_options?: {
    option_name_tr: string | null;
    price_difference_try: number | null;
  }[];
  order_item_removables?: {
    removable_name_tr: string | null;
  }[];
};

type OrderEmailData = {
  id: string;
  order_number: string;
  order_type: string | null;
  customer_full_name: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  customer_address: string | null;

  address_city: string | null;
  address_district: string | null;
  address_neighborhood: string | null;
  address_street: string | null;
  address_building_no: string | null;
  address_floor: string | null;
  address_apartment_no: string | null;
  address_note: string | null;

  customer_note: string | null;
  subtotal_try: number;
  delivery_fee_try: number;
  total_try: number;
  created_at: string;

  order_items: OrderEmailItem[];
};

function escapeHtml(value: string | null | undefined) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCustomerName(order: OrderEmailData) {
  return order.customer_full_name || order.customer_name || "Müşteri";
}

function getAddress(order: OrderEmailData) {
  return (
    order.customer_address ||
    [
      order.address_city,
      order.address_district,
      order.address_neighborhood,
      order.address_street,
      order.address_building_no && `No: ${order.address_building_no}`,
      order.address_floor && `Kat: ${order.address_floor}`,
      order.address_apartment_no && `Daire: ${order.address_apartment_no}`,
    ]
      .filter(Boolean)
      .join(", ")
  );
}

function renderItems(order: OrderEmailData) {
  return order.order_items
    .map((item) => {
      const productName = item.product_name_tr || item.product_name || "Ürün";

      const options =
        item.order_item_options?.length
          ? `
            <div style="margin-top:6px;color:#6b7280;font-size:13px;">
              ${item.order_item_options
                .map(
                  (option) =>
                    `+ ${escapeHtml(option.option_name_tr)} ${
                      Number(option.price_difference_try || 0) > 0
                        ? `(${formatCurrency(
                            Number(option.price_difference_try),
                            "TRY",
                          )})`
                        : ""
                    }`,
                )
                .join("<br/>")}
            </div>
          `
          : "";

      const removables =
        item.order_item_removables?.length
          ? `
            <div style="margin-top:6px;color:#6b7280;font-size:13px;">
              ${item.order_item_removables
                .map(
                  (removable) =>
                    `Çıkar: ${escapeHtml(removable.removable_name_tr)}`,
                )
                .join("<br/>")}
            </div>
          `
          : "";

      const note = item.item_note
        ? `
          <div style="margin-top:6px;color:#6b7280;font-size:13px;">
            Not: ${escapeHtml(item.item_note)}
          </div>
        `
        : "";

      return `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #eee;">
            <strong>${item.quantity}x ${escapeHtml(productName)}</strong>
            ${options}
            ${removables}
            ${note}
          </td>
          <td style="padding:14px 0;border-bottom:1px solid #eee;text-align:right;font-weight:700;">
            ${formatCurrency(Number(item.total_price_try), "TRY")}
          </td>
        </tr>
      `;
    })
    .join("");
}

export function customerOrderCreatedTemplate(order: OrderEmailData) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#173f2a;">
      <h1 style="color:#173f2a;">Siparişiniz alındı ✅</h1>

      <p>Merhaba <strong>${escapeHtml(getCustomerName(order))}</strong>,</p>
      <p>Siparişiniz başarıyla alındı. En kısa sürede hazırlanacaktır.</p>

      <div style="background:#f7f1e7;border:1px solid #e5d8c8;border-radius:16px;padding:18px;margin:22px 0;">
        <p style="margin:0 0 8px;">Sipariş No: <strong>${escapeHtml(
          order.order_number,
        )}</strong></p>
        <p style="margin:0;">Sipariş Tipi: <strong>${
          order.order_type === "table" ? "Masa Siparişi" : "Online Teslimat"
        }</strong></p>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        ${renderItems(order)}
      </table>

      <div style="margin-top:22px;border-top:1px solid #eee;padding-top:16px;">
        <p style="display:flex;justify-content:space-between;margin:8px 0;">
          <span>Ara Toplam</span>
          <strong>${formatCurrency(Number(order.subtotal_try), "TRY")}</strong>
        </p>
        <p style="display:flex;justify-content:space-between;margin:8px 0;">
          <span>Teslimat</span>
          <strong>${formatCurrency(
            Number(order.delivery_fee_try),
            "TRY",
          )}</strong>
        </p>
        <p style="display:flex;justify-content:space-between;margin:14px 0;font-size:20px;color:#b91c1c;">
          <span>Toplam</span>
          <strong>${formatCurrency(Number(order.total_try), "TRY")}</strong>
        </p>
      </div>

      ${
        getAddress(order)
          ? `<p style="margin-top:18px;color:#6b7280;"><strong>Adres:</strong> ${escapeHtml(
              getAddress(order),
            )}</p>`
          : ""
      }

      ${
        order.customer_note
          ? `<p style="color:#6b7280;"><strong>Not:</strong> ${escapeHtml(
              order.customer_note,
            )}</p>`
          : ""
      }

      <p style="margin-top:28px;">Afiyet olsun.</p>
    </div>
  `;
}

export function adminOrderCreatedTemplate(order: OrderEmailData) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;color:#173f2a;">
      <h1 style="color:#b91c1c;">Yeni Sipariş 🚨</h1>

      <div style="background:#f7f1e7;border:1px solid #e5d8c8;border-radius:16px;padding:18px;margin:22px 0;">
        <p style="margin:0 0 8px;">Sipariş No: <strong>${escapeHtml(
          order.order_number,
        )}</strong></p>
        <p style="margin:0 0 8px;">Tip: <strong>${
          order.order_type === "table" ? "Masa Siparişi" : "Online Teslimat"
        }</strong></p>
        <p style="margin:0;">Toplam: <strong style="color:#b91c1c;">${formatCurrency(
          Number(order.total_try),
          "TRY",
        )}</strong></p>
      </div>

      <h2>Müşteri</h2>
      <p>
        <strong>${escapeHtml(getCustomerName(order))}</strong><br/>
        Telefon: ${escapeHtml(order.customer_phone)}<br/>
        Email: ${escapeHtml(order.customer_email)}
      </p>

      ${
        getAddress(order)
          ? `<p><strong>Adres:</strong> ${escapeHtml(getAddress(order))}</p>`
          : ""
      }

      <h2>Ürünler</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${renderItems(order)}
      </table>

      ${
        order.customer_note
          ? `<p style="margin-top:18px;"><strong>Müşteri Notu:</strong> ${escapeHtml(
              order.customer_note,
            )}</p>`
          : ""
      }
    </div>
  `;
}