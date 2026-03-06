import { Issue } from "@/shared/interfaces/issue-tracking.interface";

const ALL_PLATFORMS = ["STRIPE", "META ADS", "GOOGLE ADS", "DATA"];
export function sortIssuesByImpact(issues: Issue[]) {
  return [...issues].sort((a, b) => b.impact - a.impact);
}

export function calculateTotalRisk(issues: Issue[]) {
  return issues.reduce((acc, issue) => acc + issue.impact, 0);
}

export function getIntegrationStatus(issues: Issue[]) {
  return ALL_PLATFORMS.map((platform) => {
    const platformIssues = issues.filter((i) => i.platform === platform);

    if (platformIssues.some((i) => i.severity === "CRÍTICO")) {
      return { platform, status: "CRÍTICO", color: "red" };
    }

    if (platformIssues.some((i) => i.severity === "ALERTA")) {
      return { platform, status: "ALERTA", color: "yellow" };
    }

    return { platform, status: "ACTIVO", color: "green" };
  });
}

export function getSeverityStyles(severity: string) {
  switch (severity) {
    case "CRÍTICO":
      return "bg-red-100 text-red-700 border-red-200";

    case "ALERTA":
      return "bg-amber-100 text-amber-700 border-amber-200";

    case "ACTIVO":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";

    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}
