// app/api/cron/ping/route.ts
export async function GET() {
  console.log("[CRON] keep-alive ping");

  return Response.json({
    ok: true,
    ping: true,
    time: Date.now(),
  });
}