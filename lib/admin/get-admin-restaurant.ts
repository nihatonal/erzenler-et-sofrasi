import { cache } from "react";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export const getAdminRestaurant = cache(async () => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("restaurant_id, role, full_name")
    .eq("id", session.user.id)
    .single();

  if (error || !profile?.restaurant_id) {
    redirect("/admin/login");
  }

  return {
    supabase,
    user: session.user,
    profile,
    restaurantId: profile.restaurant_id as string,
  };
});