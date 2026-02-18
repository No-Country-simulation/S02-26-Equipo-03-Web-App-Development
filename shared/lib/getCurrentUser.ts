import { headers } from "next/headers";
import { auth } from "@/infrastructure/better-auth/auth";

// Returns current user
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session.user;
}
