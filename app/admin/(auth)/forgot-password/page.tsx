import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/admin/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Şifremi Unuttum | Erzenler Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-green px-5 py-12">
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}