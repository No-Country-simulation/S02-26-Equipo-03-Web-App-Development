import { NextResponse } from "next/server";
import { openApiSpec } from "@/shared/openapi/v1";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(openApiSpec);
}
