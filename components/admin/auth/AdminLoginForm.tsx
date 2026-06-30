"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Loader2, Lock } from "lucide-react";
import { loginAction } from "@/app/admin/(auth)/login/actions";

export function AdminLoginForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      await loginAction(formData);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl md:p-8"
    >
      <div>
        <label
          htmlFor="password"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70"
        >
          Admin Şifresi
        </label>

        <div className="mt-3 flex h-14 items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4">
          <Lock className="h-5 w-5 text-brand-red" />
          <input
            name="password"
            id="password"
            type="password"
            placeholder="••••••••"
            required
            className="h-full w-full bg-transparent pl-2 text-sm text-white outline-none placeholder:text-white/30"
          />
        </div>
      </div>

      <div className="mt-5 text-right">
        <Link
          href="/admin/forgot-password"
          className="text-sm font-semibold text-white/70 transition hover:text-white"
        >
          Şifremi unuttum
        </Link>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand-red text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-brand-redLight active:bg-brand-redDark disabled:opacity-70"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Giriş yapılıyor...
          </>
        ) : (
          "Giriş Yap"
        )}
      </button>
    </form>
  );
}