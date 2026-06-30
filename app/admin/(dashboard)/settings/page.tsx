import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { getAdminRestaurant } from "@/lib/admin/get-admin-restaurant";
import { updateSettingsAction } from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminSettingsPage() {
  const { supabase, restaurantId } = await getAdminRestaurant();

  const { data: settings, error } = await supabase
    .from("restaurant_settings")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-green">Ayarlar</h1>
        <p className="mt-2 text-sm text-brand-muted">
          Restoran bilgileri, sipariş ayarları ve QR tasarım bilgilerini
          yönetin.
        </p>
      </div>

      <SettingsForm settings={settings} action={updateSettingsAction} />
      
    </main>
  );
}
