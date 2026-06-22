'use client';

import { Trash2 } from 'lucide-react';

type DeleteCategoryButtonProps = {
  action: () => Promise<void>;
};

export function DeleteCategoryButton({
  action,
}: DeleteCategoryButtonProps) {
  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this category?'
    );

    if (!confirmed) return;

    await action();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="flex h-10 w-10 items-center justify-center border border-neutral-200 text-neutral-500 transition hover:border-status-inactive hover:text-status-inactive"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}