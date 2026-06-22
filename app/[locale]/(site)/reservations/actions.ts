'use server';

import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function createReservationAction(
  locale: string,
  formData: FormData
) {
  const supabase = await createSupabaseServerClient();

  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const reservationDate = String(formData.get('reservation_date') || '');
  const reservationTime = String(formData.get('reservation_time') || '');
  const guestCount = Number(formData.get('guest_count') || 2);
  const note = String(formData.get('note') || '').trim();

  if (!name || !phone || !reservationDate || !reservationTime) {
    throw new Error('Missing required reservation fields');
  }

  const { error } = await supabase.from('reservations').insert({
    name,
    phone,
    email: email || null,
    reservation_date: reservationDate,
    reservation_time: reservationTime,
    guest_count: guestCount,
    note: note || null,
    status: 'pending',
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/${locale}/reservations?success=1`);
}