import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/getCurrentUser";
import { ProjectApiKeyService } from "@/modules/projects/apiKeys/projectApiKey.service";

/**
 * GET /api/projects/:id/api-keys
 * List all API keys for a project
 */
export async function listApiKeys(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const apiKeys = await ProjectApiKeyService.listApiKeys(user.id, id);

    return NextResponse.json(apiKeys, { status: 200 });
  } catch (error) {
    console.error("GET /projects/:id/api-keys error:", error);

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/projects/:id/api-keys
 * Rotates the API key (revokes active and creates new one)
 */
export async function rotateApiKeys(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const apiKey = await ProjectApiKeyService.rotateApiKey(user.id, id);

    return NextResponse.json({ apiKey }, { status: 201 });
  } catch (error) {
    console.error("POST /projects/:id/api-keys error:", error);

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export { listApiKeys as GET, rotateApiKeys as POST };
