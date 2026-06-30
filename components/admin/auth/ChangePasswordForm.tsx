"use client";

import { useState, useTransition } from "react";
import { Loader2, Lock } from "lucide-react";
import { changeAdminPasswordAction } from "@/app/admin/(auth)/login/actions";

export function ChangePasswordForm() {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await changeAdminPasswordAction(formData);
      setMessage(result.message);

      if (result.success) {
        form.reset();
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-2xl border border-brand-sand bg-brand-ivory p-6"
    >
      <h2 className="text-xl font-semibold text-brand-green">Şifre Değiştir</h2>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Yeni Şifre</label>
          <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-brand-sand bg-white px-4">
            <Lock className="h-4 w-4 text-brand-red" />
            <input
              name="new_password"
              type="password"
              minLength={8}
              required
              className="h-full w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="admin-label">Yeni Şifre Tekrar</label>
          <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-brand-sand bg-white px-4">
            <Lock className="h-4 w-4 text-brand-red" />
            <input
              name="confirm_password"
              type="password"
              minLength={8}
              required
              className="h-full w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {message && (
        <p className="mt-4 text-sm font-semibold text-brand-green">{message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-red text-sm font-bold text-white disabled:opacity-60"
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
    </form>
  );
}
