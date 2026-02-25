"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Campaign } from "./types/campaign.types";
import Link from "next/link";
import { Button } from "../ui/button";

// --- Sub-components ---

interface ColHeaderProps {
  label: string;
  icon?: boolean;
}

function ColHeader({ label, icon = false }: ColHeaderProps) {
  return (
    <div className="flex flex-row gap-2 font-bold">
      <span>{label}</span>
      {icon && <Info className="size-3.5" />}
    </div>
  );
}

// --- Props ---

interface CampaignsTableProps {
  campaigns: Campaign[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (_page: number) => void;
}

export function CampaignTable({
  campaigns,
  total,
  page,
  pageSize,
  onPageChange,
}: CampaignsTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f3f3f3] text-xs tracking-widest uppercase [&_th]:text-[#90A1B9]">
            <TableHead>
              <ColHeader label="Campaña" />
            </TableHead>
            <TableHead>
              <ColHeader label="Plataforma" icon />
            </TableHead>
            <TableHead>
              <ColHeader label="Gasto" icon />
            </TableHead>
            <TableHead>
              <ColHeader label="Revenue Stripe" icon />
            </TableHead>
            <TableHead>
              <ColHeader label="ROAS" icon />
            </TableHead>
            <TableHead>
              <ColHeader icon label="CPA" />
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.length > 0 ? (
            campaigns.map((campaign, i) => (
              <TableRow key={`${campaign.id}-${i}`} className="text-sm font-bold text-black">
                <TableCell>
                  <div>
                    <p>{campaign.name}</p>
                    <p className="font-normal">{campaign.id}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{campaign.platform}</Badge>
                </TableCell>

                <TableCell>{campaign.spend}</TableCell>
                <TableCell>{campaign.revenue}</TableCell>
                <TableCell>{campaign.roas}</TableCell>
                <TableCell>{campaign.cpa}</TableCell>

                <TableCell>
                  <Link
                    className="text-sm font-medium text-emerald-600 hover:underline"
                    href={`/dashboard/campaign/${campaign.id}`}
                  >
                    Analizar →
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="py-4 text-center text-gray-400">
                No hay campañas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-black">
          Mostrando {start}-{end} de {total}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
