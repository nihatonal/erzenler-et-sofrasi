// app/api/health/route.ts
export async function GET() {
  return Response.json({
    ok: true,
    service: "erzenler-et-sofrasi",
    time: new Date().toISOString(),
  });
}
