"use client";

import { useEffect, useState } from "react";
import { Download, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useSelectedProjectStore } from "@/shared/hooks/use-selected-project-store";
import { formatDate } from "@/shared/lib/utils";

type Report = {
  id: string;
  projectId: string;
  userId: string;
  user: { name: string } | undefined;
  name: string;
  format: "pdf" | "csv" | "xlsx";
  fileUrl: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
};

type ApiResponse = {
  status: string;
  data: Report[];
  count: number;
};

function formatPeriod(start: string, end: string) {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

function getDownloadUrl(fileUrl: string) {
  if (fileUrl.includes("res.cloudinary.com") && fileUrl.includes("/upload/")) {
    return fileUrl.replace("/upload/", "/upload/fl_attachment/");
  }

  return fileUrl;
}

function FormatBadge({ format }: { format: "pdf" | "csv" | "xlsx" }) {
  return (
    <Badge variant={"secondary"} className="uppercase">
      {format}
    </Badge>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-12 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-36" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="ml-auto h-4 w-20" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function ReportsList() {
  const { selectedProjectId } = useSelectedProjectStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [filtered, setFiltered] = useState<Report[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/v1/reports?projectId=${encodeURIComponent(selectedProjectId)}`
        );
        if (!res.ok) throw new Error("Error al obtener reportes");
        const json: ApiResponse = await res.json();
        setReports(json.data ?? []);
        setFiltered(json.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [selectedProjectId]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      reports.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.format.toLowerCase().includes(q) ||
          r.user?.name.toLowerCase().includes(q)
      )
    );
  }, [search, reports]);
  console.log(reports);
  const deleteReport = async (reportId: string) => {
    if (
      !confirm(
        "¿Estás seguro de que quieres eliminar este reporte? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/v1/reports/${reportId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al eliminar el reporte");
      }
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error desconocido al eliminar el reporte");
    }
  };
  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Reportes y Exportación</h1>
        <p className="mt-1 text-sm text-black/40">
          Genera reportes ejecutivos o exporta datos para análisis.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Buscar"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 bg-white">
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold tracking-wide text-black uppercase">
                  Nombre del Reporte
                </TableHead>
                <TableHead className="font-semibold tracking-wide text-black uppercase">
                  Fecha
                </TableHead>
                <TableHead className="font-semibold tracking-wide text-black uppercase">
                  Formato
                </TableHead>
                <TableHead className="font-semibold tracking-wide text-black uppercase">
                  Período
                </TableHead>
                <TableHead className="font-semibold tracking-wide text-black uppercase">
                  Generado Por
                </TableHead>
                <TableHead className="font-semibold tracking-wide text-black uppercase" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton />
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-destructive py-12 text-center text-sm">
                    {error}
                  </TableCell>
                </TableRow>
              ) : !selectedProjectId ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm">
                    Selecciona un proyecto para ver los reportes.
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm">
                    No se encontraron reportes.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>{formatDate(report.createdAt)}</TableCell>
                    <TableCell>
                      <FormatBadge format={report.format} />
                    </TableCell>
                    <TableCell>{formatPeriod(report.periodStart, report.periodEnd)}</TableCell>
                    <TableCell>{report.user?.name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={getDownloadUrl(report.fileUrl)}
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-1.5"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        onClick={() => deleteReport(report.id)}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Trash2 className="h-4 w-4" />
                        </span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
