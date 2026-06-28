"use client";
import { useState } from "react";
import { AdminMobileHeader } from "./AdminMobileHeader";
import { AdminRealtimeProvider } from "./AdminRealtimeProvider";
import { AdminSidebar } from "./AdminSidebar";
import { SoundPermissionModal } from "./SoundPermissionModal";

type AdminShellProps = {
  children: React.ReactNode;
  restaurantId: string;
};

export function AdminShell({ children, restaurantId }: AdminShellProps) {
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-brand-cream text-brand-green">
      <AdminRealtimeProvider restaurantId={restaurantId} />
      {!soundEnabled && (
        <SoundPermissionModal onEnable={() => setSoundEnabled(true)} />
      )}

      <AdminMobileHeader />

      <div className="lg:grid lg:grid-cols-[280px_1fr]">
        <AdminSidebar />

        <main className="min-h-screen lg:pl-0">{children}</main>
      </div>
    </div>
  );
}
