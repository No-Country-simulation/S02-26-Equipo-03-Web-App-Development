export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { auth } = await import("@/infrastructure/better-auth/auth");
  return auth.handler(request);
}

export async function POST(request: Request) {
  const { auth } = await import("@/infrastructure/better-auth/auth");
  return auth.handler(request);
}
