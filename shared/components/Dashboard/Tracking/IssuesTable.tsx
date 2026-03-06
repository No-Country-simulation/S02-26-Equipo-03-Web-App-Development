"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";
import { Badge } from "@shared/components/ui/badge";
import { AlertBadge } from "@shared/components/ui/alertBadge";

import { useRouter } from "next/navigation";
import { Issue } from "@/shared/interfaces/issue-tracking.interface";
import { Button } from "../../ui/button";
import { ArrowRight } from "lucide-react";
import { HeaderColumn } from "@/shared/types/header-col.types";

// --- Sub-components ---

function ColHeader({ label }: { label: string }) {
  return <span>{label}</span>;
}

// --- Props ---

const HEADER_COLUMNS: HeaderColumn[] = [
  { key: "issue", label: "Tipo de problema" },
  { key: "impact", label: "Impacto estimado" },
  { key: "platform", label: "Plataforma" },
  { key: "severity", label: "Severidad" },
  { key: "action", label: "" },
];

interface Props {
  issues: Issue[];
}

// --- Main Component ---

export function IssuesTable({ issues }: Props) {
  const router = useRouter();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-[#E2E8F0] text-xs tracking-wide uppercase [&_th]:text-[#475569]">
            {HEADER_COLUMNS.map((column, index) => (
              <TableHead
                key={column.key}
                className={`${column.className ?? ""} ${index === 0 ? "pl-5" : ""}`.trim()}
              >
                <ColHeader label={column.label} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue, i) => (
            <TableRow
              key={`${issue.id}-${i}`}
              onClick={() => router.push(`/dashboard/tracking/${issue.id}`)}
              className="cursor-pointer border-[#E2E8F0] transition-colors"
            >
              <TableCell className="py-6 pl-6 text-xs font-medium text-[#020617]">
                {issue.title}
              </TableCell>
              <TableCell className="text-xs font-medium text-[#D70000]">${issue.impact}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="rounded-sm border-[#E2E8F0] bg-white px-2 text-xs font-semibold text-[#475569] uppercase"
                >
                  {issue.platform}
                </Badge>
              </TableCell>
              <TableCell>
                <AlertBadge status={issue.severity as "INFO" | "ALERTA" | "CRÍTICO"} />
              </TableCell>
              <TableCell className="pr-4 text-right">
                <Button
                  variant={"link"}
                  className="cursor-pointer text-right font-medium text-[#475569]"
                >
                  Analizar
                  <ArrowRight strokeWidth={3} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
