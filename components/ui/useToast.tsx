"use client";

import { useState, useCallback } from "react";

type ToastState = {
  title: string;
  subtitle?: string;
} | null;

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = useCallback((title: string, subtitle?: string) => {
    setToast({ title, subtitle });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  }, []);

  return {
    toast,
    showToast,
    setToast,
  };
}
