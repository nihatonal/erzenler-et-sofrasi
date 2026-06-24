"use client";

import { Edit, Eye, Trash2, Users } from "lucide-react";

import { deleteTableAction } from "@/app/admin/(dashboard)/tables/actions";
import type { RestaurantTableRow } from "./AdminTablesClient";

type TableCardProps = {
  table: RestaurantTableRow;
  isSelected: boolean;
  onSelect: (table: RestaurantTableRow) => void;
  onDeleted: (id: string) => void;
};

export function TableCard({
  table,
  isSelected,
  onSelect,
  onDeleted,
}: TableCardProps) {
  const isActive = table.is_active && table.qr_active;

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    const confirmed = confirm(
      `"${table.label}" masasını silmek istiyor musunuz?`,
    );
    if (!confirmed) return;

    try {
      await deleteTableAction(table.id);
      onDeleted(table.id);
    } catch (error) {
      console.error(error);
      alert("Masa silinemedi.");
    }
  }

  return (
    <div
      role="button"
      onClick={() => onSelect(table)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(table);
        }
      }}
      className={
        isSelected
          ? "w-full rounded-2xl border border-brand-green bg-white p-4 text-left shadow-sm ring-1 ring-brand-green"
          : "w-full rounded-2xl border border-brand-sand bg-white p-4 text-left shadow-sm transition hover:border-brand-green"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-brand-green">{table.label}</h3>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-brand-muted">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {table.capacity} Kişilik
            </span>

            <span className="inline-flex items-center gap-1.5">
              <span
                className={
                  isActive
                    ? "h-2 w-2 rounded-full bg-status-active"
                    : "h-2 w-2 rounded-full bg-status-inactive"
                }
              />
              {isActive ? "Aktif" : "Pasif"}
            </span>
          </div>
        </div>

        <div className="flex gap-1.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-sand text-brand-green">
            <Eye className="h-4 w-4" />
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-sand text-brand-green opacity-50">
            <Edit className="h-4 w-4" />
          </span>

          <button
            type="button"
            onClick={handleDelete}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-sand text-brand-red transition hover:border-brand-red"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
