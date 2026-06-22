export default async function AdminDashboardPage() {
  return (
    <main className="p-6 lg:p-10">
      <div>
        <h1 className="text-3xl font-bold text-brand-green">
          Yönetim Paneli
        </h1>

        <p className="mt-2 text-brand-muted">
          Siparişleri, ürünleri ve restoran ayarlarını buradan yönetin.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
          <p className="text-sm font-semibold text-brand-muted">
            Bugünkü Sipariş
          </p>
          <p className="mt-3 text-3xl font-bold text-brand-green">0</p>
        </div>

        <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
          <p className="text-sm font-semibold text-brand-muted">
            Aktif Ürün
          </p>
          <p className="mt-3 text-3xl font-bold text-brand-green">-</p>
        </div>

        <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
          <p className="text-sm font-semibold text-brand-muted">
            Bekleyen Sipariş
          </p>
          <p className="mt-3 text-3xl font-bold text-brand-red">0</p>
        </div>
      </div>
    </main>
  );
}