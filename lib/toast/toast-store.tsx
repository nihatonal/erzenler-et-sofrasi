// lib/toast/toast-store.ts
import { create } from "zustand";

type ToastState = {
  toast: { title: string; subtitle?: string } | null;
  showToast: (title: string, subtitle?: string) => void;
};

let timer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  showToast: (title, subtitle) => {
    if (timer) clearTimeout(timer);
    set({ toast: { title, subtitle } });
    timer = setTimeout(() => set({ toast: null }), 2500);
  },
}));