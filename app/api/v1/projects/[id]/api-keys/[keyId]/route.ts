import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/getCurrentUser";
import { ProjectApiKeyService } from "@/modules/projects/apiKeys/projectApiKey.service";

/**
 * DELETE /api/projects/:id/api-keys/:keyId
 * Revokes a specific API key
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string; keyId: string }> }
) {
  try {
    const { id, keyId } = await context.params;

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await ProjectApiKeyService.revokeApiKey(user.id, id, keyId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /projects/:id/api-keys/:keyId error:", error);

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
