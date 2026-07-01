export type OrderStatus = "confirmed" | "delivered" | "cancelled";

export const orderStatusOptions: {
  value: OrderStatus;
  label: string;
}[] = [
  { value: "confirmed", label: "Onaylandı" },
  { value: "delivered", label: "Teslim Edildi" },
  { value: "cancelled", label: "İptal Edildi" },
];

export function getOrderStatusLabel(status: string) {
  return (
    orderStatusOptions.find((item) => item.value === status)?.label ||
    "Onaylandı"
  );
}

export function getOrderStatusClass(status: string) {
  switch (status) {
    case "delivered":
      return "bg-status-active/10 text-status-active";
    case "cancelled":
      return "bg-status-inactive/10 text-status-inactive";
    case "confirmed":
    default:
      return "bg-brand-red/10 text-brand-red";
  }
}
