export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { auth } = await import("@/src/lib/auth");
  return auth.handler(request);
}

export async function POST(request: Request) {
  const { auth } = await import("@/src/lib/auth");
  return auth.handler(request);
}
