"use client";

import { useState, useTransition } from "react";

import { createTableAction } from "@/app/admin/(dashboard)/tables/actions";

type TableFormProps = {
  mode: "create";
  onCreated: () => void;
  onCancel: () => void;
};

export function TableForm({ onCreated, onCancel }: TableFormProps) {
  const [isPending, startTransition] = useTransition();
  const [label, setLabel] = useState("");
  const [capacity, setCapacity] = useState(4);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData();

    formData.append("label", label);
    formData.append("capacity", String(capacity));
    formData.append("status", "available");
    formData.append("qr_active", "on");
    formData.append("is_active", "on");

    startTransition(async () => {
      try {
        await createTableAction(formData);

        setLabel("");
        setCapacity(4);
        onCreated();
      } catch (error) {
        console.error(error);
        alert("Masa oluşturulamadı.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-brand-sand bg-white p-5"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="admin-label">Masa Adı</label>
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className="admin-input mt-2"
            placeholder="Masa 1"
            required
          />
        </div>

        <div>
          <label className="admin-label">Kapasite</label>
          <input
            type="number"
            min={1}
            value={capacity}
            onChange={(event) => setCapacity(Number(event.target.value))}
            className="admin-input mt-2"
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-xl border border-brand-sand px-5 text-sm font-semibold text-brand-green"
        >
          Vazgeç
        </button>

        <button
          disabled={isPending}
          type="submit"
          className="h-11 rounded-xl bg-brand-red px-5 text-sm font-bold text-white disabled:opacity-60"
        >
          {isPending ? "Oluşturuluyor..." : "Masa Oluştur"}
        </button>
      </div>
    </form>
  );
}