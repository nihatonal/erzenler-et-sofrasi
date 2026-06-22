import { AdminMobileHeader } from "./AdminMobileHeader";
import { AdminSidebar } from "./AdminSidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-green">
      <AdminMobileHeader />

      <div className="lg:grid lg:grid-cols-[280px_1fr]">
        <AdminSidebar />

        <main className="min-h-screen lg:pl-0">
          {children}
        </main>
      </div>
    </div>
  );
}