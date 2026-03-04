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

import { useRouter } from "next/navigation";
import { Issue } from "@/shared/interfaces/issue-tracking.interface";
import { Button } from "../../ui/button";
import { ArrowRight } from "lucide-react";

// --- Sub-components ---

function ColHeader({ label }: { label: string }) {
  return <span>{label}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    INFO: "border-[#BBF7D1] bg-[#EEFFF4] text-[#049140]",
    ALERTA: "border-[#FFFD86] bg-[#FFFFE7] text-[#A67102]",
    CRÍTICO: "border-[#FFC0C0] bg-[#FFF0F0] text-[#D70000]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {status === "CRÍTICO"
        ? "Crítico"
        : status === "ALERTA" ? "Alerta" : "Info"}
    </span>
  );
}

// --- Props ---

type HeaderColumn = {
  key: string;
  label: string;
  className?: string;
};

const HEADER_COLUMNS: HeaderColumn[] = [
  { key: "issue", label: "Tipo de problema" },
  { key: "impact", label: "Impacto estimado" },
  { key: "platform", label: "Plataforma" },
  { key: "severity", label: "Severidad" },
  { key: "action", label: "" },
];

interface Props {
  issues: Issue[]
}

// --- Main Component ---

export function IssuesTable({ issues }: Props) {
  const router = useRouter();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-[#E2E8F0] text-xs uppercase tracking-wide [&_th]:text-[#475569]">
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
              onClick={() => router.push(`/dashboard/issue/${issue.id}`)}
              className="cursor-pointer border-[#E2E8F0] transition-colors"
            >
              <TableCell className="py-6 pl-6 text-xs font-medium text-[#020617]">
                {issue.title}
              </TableCell>
              <TableCell className="text-xs font-medium text-[#D70000]">${issue.impact}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="rounded-sm border-[#E2E8F0] bg-white px-2 text-xs font-semibold uppercase text-[#475569]"
                >
                  {issue.platform}
                </Badge>
              </TableCell>
              <TableCell>
                <StatusBadge status={issue.severity} />
              </TableCell>
              <TableCell className="text-right pr-4">
                <Button variant={'ghost'} className="text-right text-[#475569] font-medium cursor-pointer">
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