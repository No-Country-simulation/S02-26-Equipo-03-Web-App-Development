import { getPacReport } from "@/modules/analytics.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  return getPacReport();
}
