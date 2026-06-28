import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-green text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(165,22,26,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(47,93,66,0.22),transparent_30%)]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-16">
        <div className="w-full max-w-[460px]">
          <div className="mb-10 text-center">
            <Link href="/tr" className="inline-block">
              <div className="leading-none">
                <div className="font-display text-5xl tracking-[0.18em]">
                  ERZENLER
                </div>
                <div className="mt-2 text-xs tracking-[0.38em] text-white/70">
                  ET SOFRASI
                </div>
              </div>
            </Link>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">
              Yönetim Paneli
            </p>

            <h1 className="mt-4 font-display text-4xl font-semibold">
              Admin Girişi
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/60">
              Menü, sipariş ve restoran ayarlarını yönetmek için giriş yapın.
            </p>
          </div>

          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
