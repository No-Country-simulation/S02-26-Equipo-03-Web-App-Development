"use client";

import Link from "next/link";
import { ChevronLeft, Download, ExternalLink } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { DetailCard } from "@/shared/components/Campaigns/DetailCard";

export function CampaignDetailSection() {
  return (
    <section className="flex min-h-full flex-col gap-6 px-6 py-6 xl:max-w-4xl">
      <div className="space-y-6">
        <Link
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-black hover:text-gray-600"
          href="/dashboard/campaign/"
        >
          <ChevronLeft className="size-4" /> Volver a Campañas
        </Link>
        <h1 className="text-lg font-bold text-slate-900">US - Retargeting - LAL 1%</h1>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center rounded-full border border-blue-400 bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-700">
            META ADS
          </div>
          <div className="inline-flex items-center rounded-full border border-emerald-400 bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700">
            ACTIVA
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <DetailCard title="Revenue Stripe" value="$54,200" valueColor="success" />
        <DetailCard
          title="ROAS"
          value="4.37x"
          trend={{
            value: "+14% vs ant.",
            variant: "positive",
          }}
        />
        <DetailCard title="Gasto" size="sm" value="$12,400" valueColor="default" />
        <DetailCard title="CPA" size="sm" value="$24.50" />
      </div>
      <div className="space-y-4">
        {/* Title */}
        <h4 className="text-xs font-bold text-black uppercase">Ventas atribuidas a esta campaña</h4>
        {/* Table */}
        <Table className="border-2 border-[#F8FAFC] bg-white">
          <TableHeader>
            <TableRow className="border-none text-xs tracking-widest uppercase [&_th]:text-[#90A1B9]">
              <TableHead>Orden ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border-b-2 border-[#F8FAFC]">
            <TableRow className="text-xs font-bold [&_td]:text-black">
              <TableCell className="text-xs font-normal text-[#90A1B9]">ord_77260001</TableCell>
              <TableCell>Julie Smith</TableCell>
              <TableCell>LLC Formation</TableCell>
              <TableCell>$499.00</TableCell>
              <TableCell>16 Feb 2026</TableCell>
            </TableRow>
            <TableRow className="text-xs font-bold [&_td]:text-black">
              <TableCell className="text-xs font-normal text-[#90A1B9]">ord_77260003</TableCell>
              <TableCell>Kevin Jones</TableCell>
              <TableCell>Registered Agent</TableCell>
              <TableCell>$199.00</TableCell>
              <TableCell>15 Feb 2026</TableCell>
            </TableRow>
            <TableRow className="text-xs font-bold [&_td]:text-black">
              <TableCell className="text-xs font-normal text-[#90A1B9]">ord_77260007</TableCell>
              <TableCell>Ben Agency</TableCell>
              <TableCell>EIN Filing</TableCell>
              <TableCell>$99.00</TableCell>
              <TableCell>14 Feb 2026</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="flex gap-4">
        <Button className="border border-[#E2E8F0] bg-white text-black hover:bg-gray-100">
          ABRIR EN META ADS MANAGER
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button variant="ghost" className="bg-white text-black">
          EXPORTAR DATOS DE CAMPAÑA
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
