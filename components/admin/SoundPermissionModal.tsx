"use client";

import { useState } from "react";

export function SoundPermissionModal({
  onEnable,
}: {
  onEnable: () => void;
}) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <div className="w-[420px] rounded-2xl bg-white p-6 text-center shadow-xl">
        <h2 className="text-xl font-bold text-brand-green">
          🔔 Bildirim Sesini Aktifleştir
        </h2>

        <p className="mt-3 text-sm text-gray-500">
          Yeni siparişleri sesli olarak almak için izin vermen gerekiyor.
        </p>

        <button
          onClick={() => {
            const audio = new Audio("/sounds/notification.mp3");

            audio.play()
              .then(() => {
                audio.pause();
                audio.currentTime = 0;

                onEnable();
                setOpen(false);
              })
              .catch(() => {
                alert("Tarayıcı ses iznini engelledi, tekrar dene.");
              });
          }}
          className="mt-5 h-12 w-full rounded-xl bg-brand-red text-white font-semibold"
        >
          Bildirimi Aktifleştir
        </button>
      </div>
    </div>
  );
}