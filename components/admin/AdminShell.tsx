import { AdminMobileHeader } from "./AdminMobileHeader";
import { AdminRealtimeProvider } from "./AdminRealtimeProvider";
import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  children: React.ReactNode;
  restaurantId: string;
};

export function AdminShell({ children, restaurantId }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-green">
      <AdminRealtimeProvider restaurantId={restaurantId} />

      <AdminMobileHeader />

      <div className="lg:grid lg:grid-cols-[280px_1fr]">
        <AdminSidebar />

        <main className="min-h-screen lg:pl-0">{children}</main>
      </div>
    </div>
  );
}