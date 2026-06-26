"use client";

type ToastProps = {
  toast: {
    title: string;
    subtitle?: string;
  } | null;
};

export function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 animate-bounce rounded-2xl bg-black/90 px-4 py-3 text-center text-white shadow-xl backdrop-blur">
      <p className="text-sm font-bold">{toast.title}</p>
      {toast.subtitle && (
        <p className="text-xs text-white/70">{toast.subtitle}</p>
      )}
    </div>
  );
}
