import { resend, resendFromEmail } from "@/lib/email/resend";
import {
  adminOrderCreatedTemplate,
  customerOrderCreatedTemplate,
} from "@/lib/email/order-templates";

type OrderEmailPayload = Parameters<typeof customerOrderCreatedTemplate>[0] & {
  restaurant_settings?: {
    order_email: string | null;
    email: string | null;
    restaurant_name: string | null;
  } | null;
};

export async function sendOrderCreatedEmail(order: OrderEmailPayload) {
  if (!order.customer_email) {
    console.warn("CUSTOMER_EMAIL_EMPTY");
    return;
  }

  const result = await resend.emails.send({
    from: resendFromEmail,
    to: order.customer_email,
    subject: `Siparişiniz alındı - ${order.order_number}`,
    html: customerOrderCreatedTemplate(order),
  });

  console.log("CUSTOMER_EMAIL_RESULT:", result);
}

export async function sendOrderToAdminEmail(order: OrderEmailPayload) {
  const adminEmail =
    order.restaurant_settings?.order_email ||
    order.restaurant_settings?.email ||
    process.env.RESTAURANT_ORDER_EMAIL;

  if (!adminEmail) {
    console.warn("ADMIN_EMAIL_EMPTY");
    return;
  }

  const result = await resend.emails.send({
    from: resendFromEmail,
    to: adminEmail,
    subject: `Yeni Sipariş - ${order.order_number}`,
    html: adminOrderCreatedTemplate(order),
  });

  console.log("ADMIN_EMAIL_RESULT:", result);
}