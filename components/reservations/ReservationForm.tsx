'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

type ReservationFormProps = {
  action: (formData: FormData) => void;
};

export function ReservationForm({
  action,
}: ReservationFormProps) {
  const t = useTranslations('reservationPage.form');

  const searchParams = useSearchParams();

  const isSuccess = searchParams.get('success') === '1';

  return (
    <div className="border border-neutral-200 bg-white p-6 shadow-card md:p-10">
      {isSuccess && (
        <div className="mb-6 border border-status-active/20 bg-status-active/10 px-5 py-4 text-sm font-medium text-status-active">
          {t('success')}
        </div>
      )}

      <form action={action} className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              {t('name')}
            </label>

            <input
              name="name"
              type="text"
              required
              className="mt-3 h-13 w-full border border-neutral-200 bg-[#FAF8F3] px-4 text-sm outline-none transition focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              {t('phone')}
            </label>

            <input
              name="phone"
              type="tel"
              required
              className="mt-3 h-13 w-full border border-neutral-200 bg-[#FAF8F3] px-4 text-sm outline-none transition focus:border-brand-gold"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            {t('email')}
          </label>

          <input
            name="email"
            type="email"
            className="mt-3 h-13 w-full border border-neutral-200 bg-[#FAF8F3] px-4 text-sm outline-none transition focus:border-brand-gold"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              {t('date')}
            </label>

            <input
              name="reservation_date"
              type="date"
              required
              className="mt-3 h-13 w-full border border-neutral-200 bg-[#FAF8F3] px-4 text-sm outline-none transition focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              {t('time')}
            </label>

            <input
              name="reservation_time"
              type="time"
              required
              className="mt-3 h-13 w-full border border-neutral-200 bg-[#FAF8F3] px-4 text-sm outline-none transition focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              {t('guestCount')}
            </label>

            <input
              name="guest_count"
              type="number"
              min={1}
              max={20}
              defaultValue={2}
              required
              className="mt-3 h-13 w-full border border-neutral-200 bg-[#FAF8F3] px-4 text-sm outline-none transition focus:border-brand-gold"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            {t('note')}
          </label>

          <textarea
            name="note"
            rows={5}
            placeholder={t('notePlaceholder')}
            className="mt-3 w-full border border-neutral-200 bg-[#FAF8F3] px-4 py-4 text-sm outline-none transition focus:border-brand-gold"
          />
        </div>

        <button
          type="submit"
          className="flex h-14 items-center justify-center bg-brand-gold text-sm font-bold uppercase tracking-[0.14em] text-white shadow-gold transition hover:bg-brand-goldLight"
        >
          {t('submit')}
        </button>
      </form>
    </div>
  );
}