'use client';

import Link from 'next/link';
import { ArrowLeft, QrCode } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { type Locale } from '@/i18n';
import { type RestaurantTable } from '@/data/tables';

type TableFormProps = {
  locale: Locale;
  mode: 'create' | 'edit';
  table?: RestaurantTable;
  action?: (formData: FormData) => void;
};

export function TableForm({
  locale,
  mode,
  table,
  action,
}: TableFormProps) {
  const isEdit = mode === 'edit';

  const t = useTranslations('admin.tables.form');
  const common = useTranslations('admin.common');

  return (
    <main className="flex-1 p-6 lg:p-10">
      <div className="mb-6">
        <Link
          href={`/${locale}/admin/tables`}
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-brand-gold transition hover:text-brand-goldDark"
        >
          <ArrowLeft className="h-4 w-4" />
          {common('back')}
        </Link>
      </div>

      <form
        action={action}
        className="grid gap-8 xl:grid-cols-[1fr_360px]"
      >
        <div className="admin-card p-6 lg:p-8">
          <div className="grid gap-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                {t('tableName')}
              </label>

              <input
                name="label"
                type="text"
                defaultValue={table?.label ?? ''}
                placeholder="Table 1"
                className="mt-3 h-14 w-full border border-neutral-200 bg-[#FAF8F3] px-4 text-sm outline-none transition focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                {t('tableSlug')}
              </label>

              <input
                name="slug"
                type="text"
                defaultValue={table?.slug ?? ''}
                placeholder="table-1"
                className="mt-3 h-14 w-full border border-neutral-200 bg-[#FAF8F3] px-4 text-sm outline-none transition focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                {t('capacity')}
              </label>

              <input
                name="capacity"
                type="number"
                defaultValue={table?.capacity ?? ''}
                placeholder="4"
                className="mt-3 h-14 w-full border border-neutral-200 bg-[#FAF8F3] px-4 text-sm outline-none transition focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                {t('status')}
              </label>

              <select
                name="status"
                defaultValue={table?.status ?? 'available'}
                className="mt-3 h-14 w-full border border-neutral-200 bg-[#FAF8F3] px-4 text-sm outline-none transition focus:border-brand-gold"
              >
                <option value="available">
                  {t('statuses.available')}
                </option>

                <option value="occupied">
                  {t('statuses.occupied')}
                </option>

                <option value="maintenance">
                  {t('statuses.maintenance')}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="admin-card p-6">
            <h2 className="text-lg font-semibold text-dark-bg">
              {t('qrPreview')}
            </h2>

            <div className="mt-6 flex items-center justify-center border border-neutral-200 bg-[#FAF8F3] p-10">
              <div className="flex h-52 w-52 items-center justify-center border border-neutral-300 bg-white shadow-sm">
                <QrCode className="h-32 w-32 text-dark-bg" />
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-neutral-200 bg-[#FAF8F3] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                {t('qrUrl')}
              </p>

              <p className="mt-2 truncate text-sm font-medium text-dark-bg">
                /{locale}/qr/{table?.slug ?? 'table-id'}
              </p>
            </div>
          </div>

          <div className="admin-card p-6">
            <h2 className="text-lg font-semibold text-dark-bg">
              {t('visibility')}
            </h2>

            <div className="mt-5 space-y-4">
              <label className="flex items-center justify-between border border-neutral-200 bg-[#FAF8F3] px-4 py-4">
                <span className="text-sm font-medium text-dark-bg">
                  {t('qrActive')}
                </span>

                <input
                  name="qr_active"
                  type="checkbox"
                  defaultChecked={table?.qrActive ?? true}
                  className="h-4 w-4 accent-brand-gold"
                />
              </label>

              <label className="flex items-center justify-between border border-neutral-200 bg-[#FAF8F3] px-4 py-4">
                <span className="text-sm font-medium text-dark-bg">
                  {t('tableActive')}
                </span>

                <input
                  name="is_active"
                  type="checkbox"
                  defaultChecked={table?.isActive ?? true}
                  className="h-4 w-4 accent-brand-gold"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 flex h-14 w-full items-center justify-center bg-brand-gold text-sm font-bold uppercase tracking-[0.14em] text-white shadow-gold transition hover:bg-brand-goldLight"
            >
              {isEdit ? t('updateTable') : t('createTable')}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}