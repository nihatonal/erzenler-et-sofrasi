import { StaticQrPanel } from "@/components/admin/tables/StaticQrPanel";

export default function AdminTablesPage() {
  return (
    <main className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-green">QR Kodlar</h1>
        <p className="mt-2 text-sm text-brand-muted">
          Masa menüsü ve online sipariş için QR kodları buradan indirin.
        </p>
      </div>

      <StaticQrPanel locale="tr" />
    </main>
  );
}
