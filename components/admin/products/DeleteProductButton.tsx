"use client";

import { Trash2 } from "lucide-react";

type DeleteProductButtonProps = {
  action: () => void;
};

export function DeleteProductButton({ action }: DeleteProductButtonProps) {
  return (
    <form action={action}>
      <button
        type="submit"
        onClick={(event) => {
          if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
            event.preventDefault();
          }
        }}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-sand text-brand-red transition hover:border-brand-red hover:bg-brand-red/5"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}