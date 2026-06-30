import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/admin/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Yeni Şifre Belirle | Erzenler Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-green px-5 py-12">
      <div className="w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </main>
  );
}