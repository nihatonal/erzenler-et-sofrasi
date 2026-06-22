import { EditProductClient } from "@/components/admin/products/EditProductClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type EditProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { productId } = await params;

  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID;

  if (!restaurantId) {
    throw new Error("NEXT_PUBLIC_RESTAURANT_ID env eksik.");
  }

  return (
    <main className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-green">Ürün Düzenle</h1>
        <p className="mt-2 text-sm text-brand-muted">
          Ürün bilgilerini güncelleyin.
        </p>
      </div>

      <EditProductClient productId={productId} restaurantId={restaurantId} />
    </main>
  );
}