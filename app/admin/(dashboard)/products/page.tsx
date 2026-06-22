import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminProductsClient } from "@/components/admin/products/AdminProductsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function AdminProductsPage() {
  const restaurantId = process.env.NEXT_PUBLIC_RESTAURANT_ID;

  if (!restaurantId) {
    throw new Error("NEXT_PUBLIC_RESTAURANT_ID env eksik.");
  }

  return (
    <main className="flex-1 p-6 lg:p-10">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-green">Ürünler</h1>
          <p className="mt-2 text-sm text-brand-muted">
            Menü ürünlerini buradan yönetin.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          prefetch={false}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-red px-5 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-brand-redLight"
        >
          <Plus className="h-4 w-4" />
          Yeni Ürün
        </Link>
      </div>

      <AdminProductsClient restaurantId={restaurantId} />
    </main>
  );
}