"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { ChangePasswordForm } from "../auth/ChangePasswordForm";

type RestaurantSettings = {
  restaurant_name: string | null;
  restaurant_description: string | null;
  logo_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram_url: string | null;
  address: string | null;
  order_email: string | null;
  minimum_order_try: number | null;
  delivery_fee_try: number | null;
  estimated_delivery_minutes: number | null;

  is_ordering_enabled: boolean;
  is_qr_ordering_enabled: boolean;
  is_online_ordering_enabled: boolean;
  is_reservation_enabled: boolean;

  enabled_locales: string[] | null;
  qr_footer_text: string | null;
};

type SettingsFormProps = {
  settings: RestaurantSettings;
  action: (formData: FormData) => Promise<void> | void;
};

export function SettingsForm({ settings, action }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [successText, setSuccessText] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    setSuccessText("");

    startTransition(async () => {
      try {
        await action(formData);
        setSuccessText("Ayarlar başarıyla kaydedildi.");
      } catch (error) {
        console.error(error);
        alert("Ayarlar kaydedilemedi.");
      }
    });
  }
  const enabledLocales = settings.enabled_locales || ["tr", "en", "ru", "ar"];
  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 xl:grid-cols-[1fr_380px]"
    >
      <div className="space-y-8">
        <section className="rounded-2xl border border-brand-sand bg-brand-ivory p-6 lg:p-8">
          <h2 className="text-2xl font-bold text-brand-green">
            Restoran Bilgileri
          </h2>

          <div className="mt-6 grid gap-5">
            <div>
              <label className="admin-label">Restoran Adı</label>
              <input
                name="restaurant_name"
                defaultValue={settings.restaurant_name || ""}
                className="admin-input mt-2"
              />
            </div>

            {/* <div>
              <label className="admin-label">Kısa Açıklama</label>
              <textarea
                name="restaurant_description"
                rows={4}
                defaultValue={settings.restaurant_description || ""}
                className="admin-input mt-2 min-h-28 py-4"
              />
            </div> */}

            {/* <div>
              <label className="admin-label">Logo URL</label>
              <input
                name="logo_url"
                defaultValue={settings.logo_url || ""}
                placeholder="/images/erzenler-logo.png"
                className="admin-input mt-2"
              />
            </div> */}

            {/* <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="admin-label">Telefon</label>
                <input
                  name="phone"
                  defaultValue={settings.phone || ""}
                  className="admin-input mt-2"
                />
              </div>

              <div>
                <label className="admin-label">WhatsApp</label>
                <input
                  name="whatsapp"
                  defaultValue={settings.whatsapp || ""}
                  className="admin-input mt-2"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="admin-label">Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={settings.email || ""}
                  className="admin-input mt-2"
                />
              </div>

              <div>
                <label className="admin-label">Instagram URL</label>
                <input
                  name="instagram_url"
                  defaultValue={settings.instagram_url || ""}
                  className="admin-input mt-2"
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Adres</label>
              <textarea
                name="address"
                rows={3}
                defaultValue={settings.address || ""}
                className="admin-input mt-2 min-h-24 py-4"
              />
            </div> */}
          </div>
        </section>

        <section className="rounded-2xl border border-brand-sand bg-brand-ivory p-6 lg:p-8">
          <h2 className="text-2xl font-bold text-brand-green">
            Sipariş Ayarları
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div>
              <label className="admin-label">Minimum Sipariş ₺</label>
              <input
                name="minimum_order_try"
                type="number"
                step="0.01"
                defaultValue={Number(settings.minimum_order_try || 0)}
                className="admin-input mt-2"
              />
            </div>

            <div>
              <label className="admin-label">Teslimat Ücreti ₺</label>
              <input
                name="delivery_fee_try"
                type="number"
                step="0.01"
                defaultValue={Number(settings.delivery_fee_try || 0)}
                className="admin-input mt-2"
              />
            </div>

            <div>
              <label className="admin-label">Tahmini Süre / dk</label>
              <input
                name="estimated_delivery_minutes"
                type="number"
                defaultValue={Number(settings.estimated_delivery_minutes || 45)}
                className="admin-input mt-2"
              />
            </div>
          </div>

          <label className="mt-6 flex items-center justify-between rounded-xl border border-brand-sand bg-white px-4 py-4 text-sm font-medium text-brand-green">
            Online sipariş aktif
            <input
              name="is_ordering_enabled"
              type="checkbox"
              defaultChecked={settings.is_ordering_enabled}
              className="h-4 w-4 accent-brand-red"
            />
          </label>
        </section>
        <div className="rounded-2xl border border-brand-sand bg-brand-cream p-5">
          <h3 className="text-lg font-semibold text-brand-green">
            Sipariş Yönetimi
          </h3>

          <div className="mt-5 space-y-4">
            <label className="flex items-center justify-between rounded-xl border border-brand-sand bg-white px-4 py-4">
              <div>
                <p className="font-semibold text-brand-green">
                  QR Menü Siparişi
                </p>

                <p className="mt-1 text-xs text-brand-muted">
                  Masadaki QR kod üzerinden sipariş alınsın.
                </p>
              </div>

              <input
                type="checkbox"
                name="is_qr_ordering_enabled"
                defaultChecked={settings.is_qr_ordering_enabled}
                className="h-5 w-5 accent-brand-red"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-brand-sand bg-white px-4 py-4">
              <div>
                <p className="font-semibold text-brand-green">Online Sipariş</p>

                <p className="mt-1 text-xs text-brand-muted">
                  Web sitesi üzerinden sipariş alınsın.
                </p>
              </div>

              <input
                type="checkbox"
                name="is_online_ordering_enabled"
                defaultChecked={settings.is_online_ordering_enabled}
                className="h-5 w-5 accent-brand-red"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-brand-sand bg-white px-4 py-4">
              <div>
                <p className="font-semibold text-brand-green">
                  Rezervasyon Sistemi
                </p>

                <p className="mt-1 text-xs text-brand-muted">
                  Müşteriler rezervasyon oluşturabilsin.
                </p>
              </div>

              <input
                type="checkbox"
                name="is_reservation_enabled"
                defaultChecked={settings.is_reservation_enabled}
                className="h-5 w-5 accent-brand-red"
              />
            </label>
          </div>
        </div>
      </div>
      {/* dil yonetimi */}
      <section className="rounded-2xl border border-brand-sand bg-brand-ivory p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-brand-green">Dil Yönetimi</h2>

        <p className="mt-2 text-sm text-brand-muted">
          Aktif dilleri buradan yönetin. Türkçe ana dil olduğu için kapatılamaz.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex items-center justify-between rounded-xl border border-brand-sand bg-white px-4 py-4 text-sm font-medium text-brand-green opacity-70">
            Türkçe
            <input
              type="checkbox"
              checked
              disabled
              className="h-4 w-4 accent-brand-red"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-brand-sand bg-white px-4 py-4 text-sm font-medium text-brand-green">
            İngilizce
            <input
              name="locale_en"
              type="checkbox"
              defaultChecked={enabledLocales.includes("en")}
              className="h-4 w-4 accent-brand-red"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-brand-sand bg-white px-4 py-4 text-sm font-medium text-brand-green">
            Rusça
            <input
              name="locale_ru"
              type="checkbox"
              defaultChecked={enabledLocales.includes("ru")}
              className="h-4 w-4 accent-brand-red"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-brand-sand bg-white px-4 py-4 text-sm font-medium text-brand-green">
            Arapça
            <input
              name="locale_ar"
              type="checkbox"
              defaultChecked={enabledLocales.includes("ar")}
              className="h-4 w-4 accent-brand-red"
            />
          </label>
        </div>
        <ChangePasswordForm />
      </section>
      {/* bildirim ayarlari */}
      <aside className="space-y-8">
        {/* <section className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
          <h2 className="text-xl font-bold text-brand-green">
            Bildirim Ayarları
          </h2>

          <div className="mt-5">
            <label className="admin-label">Sipariş Bildirim Emaili</label>
            <input
              name="order_email"
              type="email"
              defaultValue={settings.order_email || ""}
              className="admin-input mt-2"
            />
          </div>
        </section> */}

        {/* <section className="rounded-2xl border border-brand-sand bg-brand-ivory p-6">
          <h2 className="text-xl font-bold text-brand-green">QR Tasarımı</h2>

          <div className="mt-5">
            <label className="admin-label">QR Alt Yazısı</label>
            <textarea
              name="qr_footer_text"
              rows={4}
              defaultValue={settings.qr_footer_text || ""}
              className="admin-input mt-2 min-h-28 py-4"
            />
          </div>
        </section> */}

        <button
          type="submit"
          disabled={isPending}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand-red text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-brand-redLight disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>

        {successText && (
          <p className="rounded-xl bg-status-active/10 px-4 py-3 text-sm font-semibold text-status-active">
            {successText}
          </p>
        )}
      </aside>
    </form>
  );
}
