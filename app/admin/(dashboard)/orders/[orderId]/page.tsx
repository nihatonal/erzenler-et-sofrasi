import { OrderDetailClient } from "@/components/admin/orders/OrderDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type OrderDetailPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params;

  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID;

  if (!restaurantId) {
    throw new Error("NEXT_PUBLIC_RESTAURANT_ID env eksik.");
  }

  return (
    <main className="p-6 lg:p-10">
      <OrderDetailClient orderId={orderId} restaurantId={restaurantId} />
    </main>
  );
}