"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Loader2, Lock } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function ResetPasswordForm() {
  const [message, setMessage] = useState("");
  const [canReset, setCanReset] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setCanReset(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setCanReset(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirm_password") || "");

    if (password.length < 8) {
      setIsSuccess(false);
      setMessage("Şifre en az 8 karakter olmalı.");
      return;
    }

    if (password !== confirmPassword) {
      setIsSuccess(false);
      setMessage("Şifreler eşleşmiyor.");
      return;
    }

    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setIsSuccess(false);
        setMessage(error.message);
        return;
      }

      setIsSuccess(true);
      setMessage("Şifreniz başarıyla güncellendi. Artık giriş yapabilirsiniz.");
      form.reset();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl md:p-8"
    >
      <h1 className="text-2xl font-bold text-white">Yeni Şifre Belirle</h1>

      <p className="mt-2 text-sm leading-6 text-white/60">
        Yeni admin şifrenizi belirleyin.
      </p>

      {!canReset && (
        <p className="mt-5 rounded-xl bg-brand-red/10 p-4 text-sm font-semibold text-brand-red">
          Şifre sıfırlama oturumu bekleniyor. Link geçersizse tekrar şifre
          sıfırlama talebi oluşturun.
        </p>
      )}

      <div className="mt-6">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
          Yeni Şifre
        </label>

        <div className="mt-3 flex h-14 items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4">
          <Lock className="h-5 w-5 text-brand-red" />
          <input
            name="password"
            type="password"
            minLength={8}
            required
            className="h-full w-full bg-transparent pl-2 text-sm text-white outline-none"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
          Yeni Şifre Tekrar
        </label>

        <div className="mt-3 flex h-14 items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4">
          <Lock className="h-5 w-5 text-brand-red" />
          <input
            name="confirm_password"
            type="password"
            minLength={8}
            required
            className="h-full w-full bg-transparent pl-2 text-sm text-white outline-none"
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
        disabled={isPending || !canReset}
        className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand-red text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-brand-redLight disabled:opacity-70"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Güncelleniyor...
          </>
        ) : (
          "Şifreyi Güncelle"
        )}
      </button>

      {isSuccess && (
        <Link
          href="/admin/login"
          className="mt-5 block text-center text-sm font-semibold text-white/60 transition hover:text-white"
        >
          Giriş ekranına dön
        </Link>
      )}
    </form>
  );
}