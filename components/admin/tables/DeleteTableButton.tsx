'use client';

import { Trash2 } from 'lucide-react';

type DeleteTableButtonProps = {
  action: () => Promise<void>;
};

export function DeleteTableButton({
  action,
}: DeleteTableButtonProps) {
  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this table?'
    );

    if (!confirmed) return;

    await action();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="flex h-11 w-11 items-center justify-center border border-neutral-200 bg-white text-neutral-500 transition hover:border-status-inactive hover:text-status-inactive"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}