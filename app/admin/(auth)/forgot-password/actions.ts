"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type Result = {
  success: boolean;
  message: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function forgotPasswordAction(
): Promise<Result> {
  const email = process.env.ADMIN_LOGIN_EMAIL;

  if (!email || !isValidEmail(email)) {
    return {
      success: false,
      message: "Geçerli bir email adresi girin.",
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/admin/reset-password`,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message:
      "Şifre sıfırlama bağlantısı gönderildi. Lütfen email kutunuzu kontrol edin.",
  };
}