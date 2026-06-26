"use client";

import { ReactNode } from "react";
import { SmartFloatingCTA } from "@/components/layout/SmartFloatingCTA";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/components/ui/useToast";
import { useToastStore } from "@/lib/toast/toast-store";

type Props = {
  children: ReactNode;
  locale: string;
  whatsappNumber: string;
};

export function AppProviders({
  children,
  locale,
  whatsappNumber,
}: Props) {
 const toast = useToastStore((state) => state.toast);

  return (
    <>
      {children}

      {/* <SmartFloatingCTA
        locale={locale}
        whatsappNumber={whatsappNumber}
      /> */}

      <Toast toast={toast} />
    </>
  );
}
