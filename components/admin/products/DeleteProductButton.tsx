"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

type DeleteProductButtonProps = {
  action: () => Promise<void> | void;
  onDeleted?: () => void;
};

export function DeleteProductButton({
  action,
  onDeleted,
}: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = confirm("Bu ürünü silmek istediğinize emin misiniz?");
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await action();
        onDeleted?.();
      } catch (error) {
        console.error(error);
        alert("Ürün silinemedi. Bu ürün siparişlerde veya önerilerde kullanılıyor olabilir.");
      }
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleDelete}
      className="flex h-11 w-11 items-center justify-center rounded-lg border border-brand-sand text-brand-red transition hover:border-brand-red disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Ürünü sil"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}