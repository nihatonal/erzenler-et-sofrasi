"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { TableForm } from "./TableForm";
import { TableCard } from "./TableCard";
import { TableDesignPreview } from "./TableDesignPreview";

export type RestaurantTableRow = {
  id: string;
  label: string;
  slug: string;
  capacity: number;
  status: "available" | "occupied" | "maintenance";
  qr_active: boolean;
  is_active: boolean;
  created_at: string;
};

type AdminTablesClientProps = {
  restaurantId: string;
};

export function AdminTablesClient({ restaurantId }: AdminTablesClientProps) {
  const [tables, setTables] = useState<RestaurantTableRow[]>([]);
  const [selectedTable, setSelectedTable] =
    useState<RestaurantTableRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const loadTables = useCallback(async () => {
    setIsLoading(true);
    setErrorText("");

    const supabase = createSupabaseBrowserClient();

    try {
      const { data, error } = await supabase
        .from("restaurant_tables")
        .select(
          "id, label, slug, capacity, status, qr_active, is_active, created_at",
        )
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const rows = (data || []) as RestaurantTableRow[];

      setTables(rows);

      setSelectedTable((current) => {
        if (!rows.length) return null;
        if (current && rows.some((row) => row.id === current.id)) {
          return rows.find((row) => row.id === current.id) || rows[0];
        }
        return rows[0];
      });
    } catch (error) {
      console.error(error);
      setErrorText("Masalar yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    void loadTables();
  }, [loadTables]);

  const filteredTables = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return tables;

    return tables.filter((table) => {
      return (
        table.label.toLowerCase().includes(query) ||
        table.slug.toLowerCase().includes(query) ||
        table.status.toLowerCase().includes(query)
      );
    });
  }, [tables, searchQuery]);

  function handleOptimisticDelete(tableId: string) {
    setTables((current) => current.filter((item) => item.id !== tableId));

    setSelectedTable((current) => {
      if (current?.id !== tableId) return current;

      const nextTable = tables.find((table) => table.id !== tableId);
      return nextTable || null;
    });
  }

  return (
    <div className="rounded-2xl border border-brand-sand bg-brand-ivory p-4 shadow-sm md:p-6">
      <div className="mb-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative xl:w-[360px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Masa ara..."
            className="h-11 w-full rounded-xl border border-brand-sand bg-white pl-10 pr-4 text-sm text-brand-green outline-none transition focus:border-brand-red"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadTables}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-brand-sand bg-white px-4 text-sm font-semibold text-brand-green transition hover:border-brand-red hover:text-brand-red"
          >
            <RefreshCw className="h-4 w-4" />
            Yenile
          </button>

          <button
            type="button"
            onClick={() => setIsCreating((value) => !value)}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-red px-4 text-sm font-bold text-white transition hover:bg-brand-redLight"
          >
            <Plus className="h-4 w-4" />
            Yeni Masa
          </button>
        </div>
      </div>

      {isCreating && (
        <div className="mb-6">
          <TableForm
            mode="create"
            onCreated={() => {
              setIsCreating(false);
              void loadTables();
            }}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-brand-cream"
              />
            ))}
          </div>

          <div className="h-[720px] animate-pulse rounded-2xl bg-brand-cream" />
        </div>
      ) : errorText ? (
        <div className="rounded-2xl border border-brand-sand bg-white p-8 text-center">
          <h2 className="font-semibold text-brand-green">Masalar yüklenemedi</h2>
          <p className="mt-2 text-sm text-brand-muted">{errorText}</p>
        </div>
      ) : !filteredTables.length ? (
        <div className="rounded-2xl border border-dashed border-brand-sand bg-brand-cream p-8 text-center">
          <h2 className="font-semibold text-brand-green">Masa bulunamadı</h2>
          <p className="mt-2 text-sm text-brand-muted">
            Yeni masa oluşturarak QR menü kodu hazırlayabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="space-y-4">
            {filteredTables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                isSelected={selectedTable?.id === table.id}
                onSelect={setSelectedTable}
                onDeleted={handleOptimisticDelete}
              />
            ))}
          </div>

          <TableDesignPreview table={selectedTable} />
        </div>
      )}
    </div>
  );
}