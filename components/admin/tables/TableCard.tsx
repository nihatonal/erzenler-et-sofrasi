"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Download, ExternalLink, Trash2 } from "lucide-react";

import { deleteTableAction } from "@/app/admin/(dashboard)/tables/actions";
import type { RestaurantTableRow } from "./AdminTablesClient";
import { TableQrCode } from "./TableQrCode";
import { downloadLocalizedQrOnly } from "./download-table-qr";

type LocaleCode = "tr" | "en" | "ru" | "ar";

type TableCardProps = {
  table: RestaurantTableRow;
  onDeleted: (tableId: string) => void;
};

const locales: {
  code: LocaleCode;
  label: string;
  nativeLabel: string;
}[] = [
  { code: "tr", label: "Türkçe", nativeLabel: "TR" },
  { code: "en", label: "İngilizce", nativeLabel: "EN" },
  { code: "ru", label: "Rusça", nativeLabel: "RU" },
  { code: "ar", label: "Arapça", nativeLabel: "AR" },
];

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  );
}

function getQrUrl(locale: LocaleCode, slug: string) {
  return `${getSiteUrl()}/${locale}/menu?table=${encodeURIComponent(slug)}`;
}

export function TableCard({ table, onDeleted }: TableCardProps) {
  const isActive = table.is_active && table.qr_active;
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    const confirmed = confirm("Bu masayı silmek istediğinize emin misiniz?");
    if (!confirmed) return;

    onDeleted(table.id);

    try {
      await deleteTableAction(table.id);
    } catch (error) {
      console.error(error);
      alert("Masa silinemedi. Sayfayı yenileyin.");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-sand bg-white shadow-sm">
      {/* Accordion Header — her zaman görünür */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-4 bg-brand-cream px-5 py-4 text-left transition hover:bg-brand-sand/40"
      >
        {/* Sol: isim + badge */}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <span className="text-xl font-bold text-brand-green">
            {table.label}
          </span>

          <span
            className={
              isActive
                ? "rounded-full bg-status-active/10 px-3 py-0.5 text-xs font-semibold text-status-active"
                : "rounded-full bg-status-inactive/10 px-3 py-0.5 text-xs font-semibold text-status-inactive"
            }
          >
            {isActive ? "Aktif" : "Pasif"}
          </span>

          <span className="text-sm text-brand-muted">
            · Slug:{" "}
            <span className="font-semibold text-brand-green">{table.slug}</span>{" "}
            · Kapasite:{" "}
            <span className="font-semibold text-brand-green">
              {table.capacity}
            </span>
          </span>
        </div>

        {/* Sağ: sil + chevron */}
        <div className="flex shrink-0 items-center gap-2">
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                handleDelete();
              }
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-sand text-brand-red transition hover:border-brand-red"
          >
            <Trash2 className="h-4 w-4" />
          </div>

          <ChevronDown
            className={`h-5 w-5 text-brand-muted transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Accordion Body */}
      {open && (
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          {locales.map((locale) => {
            const qrUrl = getQrUrl(locale.code, table.slug);

            return (
              <div
                key={locale.code}
                className="rounded-2xl border border-brand-sand bg-brand-ivory p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-brand-green">
                      {locale.label}
                    </p>
                    <p className="mt-0.5 text-xs text-brand-muted">
                      /{locale.code}/menu?table={table.slug}
                    </p>
                  </div>

                  <span className="rounded-full bg-brand-green/10 px-2.5 py-1 text-xs font-bold text-brand-green">
                    {locale.nativeLabel}
                  </span>
                </div>

                <TableQrCode url={qrUrl} />

                <div className="mt-4 grid gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      downloadLocalizedQrOnly({
                        tableLabel: table.label,
                        locale: locale.code,
                        qrUrl,
                      })
                    }
                    className="flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-red px-4 text-xs font-bold text-white transition hover:bg-brand-redLight"
                  >
                    <Download className="h-4 w-4" />
                    QR İndir
                  </button>

                  <Link
                    href={`/${locale.code}/menu?table=${encodeURIComponent(table.slug)}`}
                    target="_blank"
                    prefetch={false}
                    className="flex h-10 items-center justify-center gap-2 rounded-xl border border-brand-sand bg-white px-4 text-xs font-semibold text-brand-green transition hover:border-brand-red hover:text-brand-red"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Aç
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
