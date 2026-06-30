"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Loader2, Mail } from "lucide-react";

import { forgotPasswordAction } from "@/app/admin/(auth)/forgot-password/actions";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await forgotPasswordAction();
      setMessage(result.message);
      setIsSuccess(result.success);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl md:p-8"
    >
      <h1 className="text-2xl font-bold text-white">Şifremi Unuttum</h1>

      <p className="mt-2 text-sm leading-6 text-white/60">
        Admin email adresinizi girin. Size şifre sıfırlama bağlantısı
        göndereceğiz.
      </p>

      <div className="mt-6">
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
            className="h-full w-full bg-transparent pl-2 text-sm text-white outline-none placeholder:text-white/30"
          />
        </div>
      </div>

      {message && (
        <p
          className={
            isSuccess
              ? "mt-5 rounded-xl bg-status-active/10 p-4 text-sm font-semibold text-status-active"
              : "mt-5 rounded-xl bg-brand-red/10 p-4 text-sm font-semibold text-brand-red"
          }
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand-red text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-brand-redLight disabled:opacity-70"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Gönderiliyor...
          </>
        ) : (
          "Sıfırlama Linki Gönder"
        )}
      </button>

      <Link
        href="/admin/login"
        className="mt-5 block text-center text-sm font-semibold text-white/60 transition hover:text-white"
      >
        Giriş ekranına dön
      </Link>
    </form>
  );
}