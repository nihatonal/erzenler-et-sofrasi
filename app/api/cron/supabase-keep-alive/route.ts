// app/api/cron/supabase-keep-alive/route.ts

import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { error } = await supabase.from("restaurants").select("id").limit(1);

  if (error) {
    console.error("[SUPABASE_KEEP_ALIVE_ERROR]", error.message);

    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  console.log("[SUPABASE_KEEP_ALIVE_OK]", new Date().toISOString());

  return Response.json({
    ok: true,
    service: "supabase",
    time: new Date().toISOString(),
  });
}
