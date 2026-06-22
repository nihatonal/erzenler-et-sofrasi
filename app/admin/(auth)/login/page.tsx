import Link from "next/link";
import { Lock, Mail } from "lucide-react";

import { loginAction } from "./actions";

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
                  MIRA
                </div>
                <div className="mt-2 text-xs tracking-[0.38em] text-white/70">
                  BISTRO
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

          <form
            action={loginAction}
            className="rounded-2xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl md:p-8"
          >
            <div>
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70"
              >
                Email
              </label>

              <div className="mt-3 flex h-14 items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4">
                <Mail className="h-5 w-5 text-brand-red" />
                <input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="admin@restaurant.com"
                  required
                  className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70"
              >
                Şifre
              </label>

              <div className="mt-3 flex h-14 items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4">
                <Lock className="h-5 w-5 text-brand-red" />
                <input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 flex h-14 w-full items-center justify-center rounded-xl bg-brand-red text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-brand-redLight active:bg-brand-redDark"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}