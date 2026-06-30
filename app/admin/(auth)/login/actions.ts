"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") || "");

  const email = process.env.ADMIN_LOGIN_EMAIL;

  if (!email) {
    throw new Error("ADMIN_LOGIN_EMAIL env eksik.");
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error("Email veya şifre hatalı.");
  }

  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  redirect("/admin/login");
}

export async function changeAdminPasswordAction(formData: FormData) {
  const newPassword = String(formData.get("new_password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");

  if (!newPassword || newPassword.length < 8) {
    return {
      success: false,
      message: "Şifre en az 8 karakter olmalı.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: "Şifreler eşleşmiyor.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Şifre başarıyla güncellendi.",
  };
}
