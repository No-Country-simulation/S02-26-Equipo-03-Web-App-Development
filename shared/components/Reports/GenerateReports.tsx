"use client";

import { useEffect, useMemo, useState } from "react";
import { Document, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useSelectedProjectStore } from "@/shared/hooks/use-selected-project-store";

type OrderApiRecord = {
  id: string;
  projectId: string;
  ecommerceIntegrationId: string | null;
  transactionId: string;
  externalOrderId: string;
  totalAmount: number;
  currency: string;
  status: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  paymentType: string;
  stripeId: string;
  campaignId: string;
  sourcePlatform: string;
};

type CampaignApiRecord = {
  id: string;
  name: string;
  externalId: string | null;
  platform: string | null;
  projectId: string;
  adSpend: number;
  revenue: number;
  roas: number;
  cpa: number;
  startDate: string;
  endDate: string | null;
  status: string;
};

type OrdersApiResponse = {
  success: boolean;
  data: OrderApiRecord[];
};

type CampaignsApiResponse = {
  success: boolean;
  data: CampaignApiRecord[];
};

type OrderExportRow = {
  date: string;
  orderId: string;
  customer: string;
  service: string;
  paymentType: string;
  source: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed";
};

type CampaignExportRow = {
  date: string;
  campaign: string;
  platform: "Meta Ads" | "Google Ads";
  spend: number;
  stripeRevenue: number;
  roas: number;
  cpa: number;
};

type ExportReportData = {
  period: string;
  currency: string;
  company: string;
  orders: OrderExportRow[];
  campaigns: CampaignExportRow[];
};

function toISODate(value: string | number | Date | null | undefined) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toISOString().slice(0, 10);
}

function normalizeOrderStatus(status: string): "Paid" | "Pending" | "Failed" {
  if (status.toLowerCase() === "confirmed") {
    return "Paid";
  }

  if (status.toLowerCase() === "pending") {
    return "Pending";
  }

  return "Failed";
}

function formatSlugToTitle(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function mapOrderRecord(record: OrderApiRecord): OrderExportRow {
  return {
    date: toISODate(record.orderDate),
    orderId: record.id,
    customer: record.customerName || "Sin cliente",
    service: record.productName || "Sin servicio",
    paymentType: record.paymentType || "Sin tipo",
    source: formatSlugToTitle(record.sourcePlatform),
    amount: record.totalAmount,
    status: normalizeOrderStatus(record.status),
  };
}

function normalizeCampaignPlatform(
  platform: CampaignApiRecord["platform"]
): CampaignExportRow["platform"] {
  const normalized = (platform || "").toLowerCase();

  if (normalized.includes("google")) {
    return "Google Ads";
  }

  if (normalized.includes("meta") || normalized.includes("facebook")) {
    return "Meta Ads";
  }

  return "Meta Ads";
}

function mapCampaignRecord(record: CampaignApiRecord): CampaignExportRow {
  return {
    date: toISODate(record.startDate),
    campaign: formatSlugToTitle(record.name),
    platform: normalizeCampaignPlatform(record.platform),
    spend: record.adSpend,
    stripeRevenue: record.revenue,
    roas: record.roas,
    cpa: record.cpa,
  };
}

const REPORT_CONFIG = {
  currency: "USD",
  company: "Garder Ads",
} as const;

async function fetchOrdersByProject(projectId: string): Promise<OrderApiRecord[]> {
  const response = await fetch(`/api/v1/orders?projectId=${encodeURIComponent(projectId)}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener órdenes");
  }

  const json = (await response.json()) as OrdersApiResponse;
  return Array.isArray(json.data) ? json.data : [];
}

async function fetchCampaignsByProject(projectId: string): Promise<CampaignApiRecord[]> {
  const response = await fetch(`/api/v1/campaigns?projectId=${encodeURIComponent(projectId)}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener campañas");
  }

  const json = (await response.json()) as CampaignsApiResponse;
  return Array.isArray(json.data) ? json.data : [];
}

const pdfStyles = StyleSheet.create({
  page: { padding: 24, fontSize: 11 },
  title: { fontSize: 16, marginBottom: 10 },
  subtitle: { marginBottom: 14 },
  sectionTitle: { fontSize: 13, marginBottom: 8, fontWeight: 700 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    paddingBottom: 4,
    marginBottom: 4,
    fontWeight: 700,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    paddingVertical: 4,
  },
  c1: { width: "16%" },
  c2: { width: "12%" },
  c3: { width: "18%", textAlign: "right" },
  c4: { width: "12%", textAlign: "right" },
  c5: { width: "12%", textAlign: "right" },
  c6: { width: "16%", textAlign: "right" },
  c7: { width: "16%", textAlign: "right" },
  c8: { width: "12%", textAlign: "right" },
});
function formatCurrency(value: number) {
  return Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  }).format(value);
}
function ReportPdf({ data }: { data: ExportReportData }) {
  const hasOrders = data.orders.length > 0;
  const hasCampaigns = data.campaigns.length > 0;

  return (
    <Document>
      {hasOrders && (
        <Page size="A4" style={pdfStyles.page}>
          <Text style={pdfStyles.title}>Órdenes - {data.company}</Text>
          <Text style={pdfStyles.subtitle}>Período: {data.period}</Text>

          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.c1}>Fecha</Text>
            <Text style={pdfStyles.c2}>Orden</Text>
            <Text style={pdfStyles.c3}>Cliente</Text>
            <Text style={pdfStyles.c4}>Fuente</Text>
            <Text style={pdfStyles.c5}>Estado</Text>
            <Text style={pdfStyles.c6}>Tipo pago</Text>
            <Text style={pdfStyles.c7}>Servicio</Text>
            <Text style={pdfStyles.c8}>Monto</Text>
          </View>

          {data.orders.map((row) => (
            <View key={row.orderId} style={pdfStyles.row}>
              <Text style={pdfStyles.c1}>{toISODate(row.date)}</Text>
              <Text style={pdfStyles.c2}>
                {row.orderId.slice(0, 4) + "..." + row.orderId.slice(-4)}
              </Text>
              <Text style={pdfStyles.c3}>{row.customer}</Text>
              <Text style={pdfStyles.c4}>{row.source}</Text>
              <Text style={pdfStyles.c5}>{row.status}</Text>
              <Text style={pdfStyles.c6}>{row.paymentType}</Text>
              <Text style={pdfStyles.c7}>{row.service}</Text>
              <Text style={pdfStyles.c8}>{formatCurrency(row.amount)}</Text>
            </View>
          ))}
        </Page>
      )}

      {hasCampaigns && (
        <Page size="A4" style={pdfStyles.page}>
          <Text style={pdfStyles.title}>Campañas - {data.company}</Text>
          <Text style={pdfStyles.subtitle}>Período: {data.period}</Text>

          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.c1}>Fecha</Text>
            <Text style={pdfStyles.c2}>Campaña</Text>
            <Text style={pdfStyles.c3}>Plataforma</Text>
            <Text style={pdfStyles.c4}>Gasto</Text>
            <Text style={pdfStyles.c5}>Revenue</Text>
            <Text style={pdfStyles.c6}>ROAS</Text>
            <Text style={pdfStyles.c7}>CPA</Text>
            <Text style={pdfStyles.c8}></Text>
          </View>

          {data.campaigns.map((row) => (
            <View key={`${row.date}-${row.campaign}`} style={pdfStyles.row}>
              <Text style={pdfStyles.c1}>{toISODate(row.date)}</Text>
              <Text style={pdfStyles.c2}>{row.campaign}</Text>
              <Text style={pdfStyles.c3}>{row.platform}</Text>
              <Text style={pdfStyles.c4}>
                {Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "USD",
                  currencyDisplay: "narrowSymbol",
                }).format(row.spend)}
              </Text>
              <Text style={pdfStyles.c5}>
                {Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "USD",
                  currencyDisplay: "narrowSymbol",
                }).format(row.stripeRevenue)}
              </Text>
              <Text style={pdfStyles.c6}>{row.roas.toFixed(2)}x</Text>
              <Text style={pdfStyles.c7}>{formatCurrency(row.cpa)}</Text>
              <Text style={pdfStyles.c8}></Text>
            </View>
          ))}
        </Page>
      )}
    </Document>
  );
}

export default function GenerateReports() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const selectedProjectId = useSelectedProjectStore((state) => state.selectedProjectId);

  const [orderRecords, setOrderRecords] = useState<OrderApiRecord[]>([]);
  const [campaignRecords, setCampaignRecords] = useState<CampaignApiRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);

  const availableDates = useMemo(
    () =>
      [
        ...orderRecords.map((row) => toISODate(row.orderDate)),
        ...campaignRecords.map((row) => toISODate(row.startDate)),
      ]
        .filter(Boolean)
        .filter((date, index, list) => list.indexOf(date) === index)
        .sort(),
    [campaignRecords, orderRecords]
  );

  const minDate = availableDates[0] ?? today;
  const maxDate = availableDates[availableDates.length - 1] ?? today;

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [includeOrders, setIncludeOrders] = useState(true);
  const [includeCampaigns, setIncludeCampaigns] = useState(true);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [exportFormat, setExportFormat] = useState<"excel" | "pdf">("excel");

  useEffect(() => {
    setFromDate((current) => {
      if (!current || current < minDate || current > maxDate) {
        return minDate;
      }

      return current;
    });

    setToDate((current) => {
      if (!current || current < minDate || current > maxDate) {
        return maxDate;
      }

      return current;
    });
  }, [maxDate, minDate]);

  const isDateRangeValid = Boolean(fromDate && toDate && fromDate <= toDate);
  const hasAtLeastOneModule = includeOrders || includeCampaigns;
  const loadData = async () => {
    if (!selectedProjectId) {
      return;
    }

    setIsLoadingData(true);
    setLoadError(null);

    try {
      const [orders, campaigns] = await Promise.all([
        fetchOrdersByProject(selectedProjectId),
        fetchCampaignsByProject(selectedProjectId),
      ]);

      setOrderRecords(orders);
      setCampaignRecords(campaigns);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Error al cargar reportes.");
    } finally {
      setIsLoadingData(false);
    }
  };
  const openExportModal = () => {
    loadData();
    setExportFormat("excel");
    setIsExportModalOpen(true);
  };

  const getExportData = () => {
    const exportableOrders = includeOrders
      ? orderRecords.map(mapOrderRecord).filter((row) => row.date >= fromDate && row.date <= toDate)
      : [];

    const exportableCampaigns = includeCampaigns
      ? campaignRecords
          .filter((row) => {
            const date = toISODate(row.startDate);
            return date >= fromDate && date <= toDate;
          })
          .map(mapCampaignRecord)
      : [];

    return { exportableOrders, exportableCampaigns };
  };

  const saveReportInBackend = async (payload: {
    fileUrl: string;
    format: "pdf" | "csv" | "xlsx";
  }) => {
    if (!selectedProjectId) {
      throw new Error("No hay proyecto seleccionado para guardar el reporte");
    }

    const reportName = `Reporte${includeOrders ? "-ordenes" : ""}${includeCampaigns ? "-campañas" : ""}`;

    const response = await fetch("/api/v1/reports", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: selectedProjectId,
        name: reportName,
        format: payload.format,
        fileUrl: payload.fileUrl,
        periodStart: new Date(`${fromDate}T00:00:00.000Z`).toISOString(),
        periodEnd: new Date(`${toDate}T23:59:59.999Z`).toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("No se pudo guardar el reporte en el backend");
    }
  };

  const uploadReportToCloudinary = async (blob: Blob, extension: "pdf" | "xlsx") => {
    if (!selectedProjectId) {
      throw new Error("No hay proyecto seleccionado para subir el reporte");
    }

    const formDataFile = new FormData();
    const fileName = `reporte${includeOrders ? "-ordenes" : ""}${includeCampaigns ? "-campañas" : ""}.${extension}`;
    formDataFile.append("file", blob);
    formDataFile.append("upload_preset", "garderads_reports");
    formDataFile.append("folder", `gardenads/${selectedProjectId}/reports`);
    formDataFile.append("public_id", fileName.replace(/\.[^/.]+$/, ""));
    formDataFile.append("filename_override", fileName);
    const { data } = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
      {
        method: "POST",
        body: formDataFile,
      }
    )
      .then((res) => res.json())
      .then((json) => {
        if (!json.secure_url) {
          throw new Error("Error al subir el archivo a Cloudinary");
        }
        return { data: json };
      });

    return data.secure_url as string;
  };

  const exportStyledExcel = async () => {
    setIsGeneratingReport(true);
    if (!isDateRangeValid || !hasAtLeastOneModule) {
      return;
    }

    const { exportableOrders, exportableCampaigns } = getExportData();

    const ExcelJS = await import("exceljs");
    const workbook = new ExcelJS.Workbook();

    const addTable = (
      sheetName: string,
      columns: string[],
      rows: Array<Record<string, string | number>>
    ) => {
      const worksheet = workbook.addWorksheet(sheetName);
      worksheet.columns = columns.map((column) => ({
        header: column,
        key: column,
        width: Math.max(14, Math.min(36, column.length + 6)),
      }));

      worksheet.views = [{ state: "frozen", ySplit: 1 }];

      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF111827" },
      };
      headerRow.alignment = { vertical: "middle", horizontal: "left" };

      rows.forEach((row, index) => {
        worksheet.addRow(row);
        const currentRow = worksheet.getRow(index + 2);
        currentRow.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: index % 2 === 0 ? "FFF9FAFB" : "FFFFFFFF" },
        };
      });

      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FFE5E7EB" } },
            left: { style: "thin", color: { argb: "FFE5E7EB" } },
            bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
            right: { style: "thin", color: { argb: "FFE5E7EB" } },
          };
          cell.alignment = { vertical: "middle", horizontal: "left" };
        });
      });
    };

    if (includeOrders) {
      addTable(
        "Órdenes",
        ["Fecha", "ID Orden", "Cliente", "Servicio", "Tipo pago", "Fuente", "Monto", "Estado"],
        exportableOrders.map((row) => ({
          Fecha: toISODate(row.date),
          "ID Orden": row.orderId,
          Cliente: row.customer,
          Servicio: row.service,
          "Tipo pago": row.paymentType,
          Fuente: row.source,
          Monto: formatCurrency(row.amount),
          Estado: row.status,
        }))
      );
    }

    if (includeCampaigns) {
      addTable(
        "Campañas",
        ["Fecha", "Campaña", "Plataforma", "Gasto", "Revenue Stripe", "ROAS", "CPA"],
        exportableCampaigns.map((row) => ({
          Fecha: toISODate(row.date),
          Campaña: row.campaign,
          Plataforma: row.platform,
          Gasto: formatCurrency(row.spend),
          "Revenue Stripe": formatCurrency(row.stripeRevenue),
          ROAS: `${row.roas.toFixed(2)}x`,
          CPA: formatCurrency(row.cpa),
        }))
      );
    }

    const fileBuffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([fileBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    await uploadReportToCloudinary(blob, "xlsx")
      .then((fileUrl) => saveReportInBackend({ fileUrl, format: "xlsx" }))
      .catch((error) => {
        console.error("Error al subir el reporte a Cloudinary:", error);
        alert("Hubo un error al subir el reporte. Por favor, intentá nuevamente.");
      });

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `reporte${includeOrders ? "-ordenes" : ""}${includeCampaigns ? "-campañas" : ""}.xlsx`;
    link.click();
    URL.revokeObjectURL(downloadUrl);

    setIsGeneratingReport(false);
    setIsExportModalOpen(false);
  };

  const exportSelectedPdf = async () => {
    setIsGeneratingReport(true);
    if (!isDateRangeValid || !hasAtLeastOneModule) {
      return;
    }

    const { exportableOrders, exportableCampaigns } = getExportData();

    const reportData: ExportReportData = {
      period: `${fromDate} a ${toDate}`,
      currency: REPORT_CONFIG.currency,
      company: REPORT_CONFIG.company,
      orders: exportableOrders,
      campaigns: exportableCampaigns,
    };

    const blob = await pdf(<ReportPdf data={reportData} />).toBlob();

    await uploadReportToCloudinary(blob, "pdf")
      .then((fileUrl) => saveReportInBackend({ fileUrl, format: "pdf" }))
      .catch((error) => {
        console.error("Error al subir el reporte a Cloudinary:", error);
        alert("Hubo un error al subir el reporte. Por favor, intentá nuevamente.");
      });

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `reporte${includeOrders ? "-ordenes" : ""}${includeCampaigns ? "-campañas" : ""}.pdf`;
    link.click();
    URL.revokeObjectURL(downloadUrl);

    setIsGeneratingReport(false);
    setIsExportModalOpen(false);
  };

  return (
    <>
      <Button variant={"ghost"} onClick={openExportModal}>
        Exportar
        <Download className="h-4 w-4" />
      </Button>

      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        {isLoadingData ? (
          <DialogContent className="max-w-sm bg-white p-6 text-center text-black">
            <DialogTitle>Cargando datos para exportar...</DialogTitle>
          </DialogContent>
        ) : (
          <DialogContent className="max-w-2xl gap-0 divide-y bg-white p-0 text-black">
            <DialogHeader className="p-4 px-6">
              <DialogTitle>Exportar reporte</DialogTitle>
              <DialogDescription>
                Seleccioná el período, formato y datos que querés exportar.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 px-6 py-4">
              <section className="space-y-2">
                <p className="text-xs font-semibold tracking-wide uppercase opacity-60">Período</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1 text-sm">
                    <Label htmlFor="from-date" className="opacity-75">
                      Fecha desde
                    </Label>
                    <Input
                      id="from-date"
                      type="date"
                      value={fromDate}
                      min={minDate}
                      max={maxDate}
                      onChange={(event) => setFromDate(event.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <Label htmlFor="to-date" className="opacity-75">
                      Fecha hasta
                    </Label>
                    <Input
                      id="to-date"
                      type="date"
                      value={toDate}
                      min={minDate}
                      max={maxDate}
                      onChange={(event) => setToDate(event.target.value)}
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-xs font-semibold tracking-wide uppercase opacity-60">Formato</p>
                <RadioGroup
                  value={exportFormat}
                  onValueChange={(value) => setExportFormat(value as "excel" | "pdf")}
                  className="grid gap-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="excel" id="format-excel" />
                    <Label htmlFor="format-excel">Excel (.xlsx)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="pdf" id="format-pdf" />
                    <Label htmlFor="format-pdf">PDF (.pdf)</Label>
                  </div>
                </RadioGroup>
              </section>

              <section className="space-y-2">
                <p className="text-xs font-semibold tracking-wide uppercase opacity-60">
                  Datos a exportar
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="include-orders"
                      checked={includeOrders}
                      onCheckedChange={(checked) => setIncludeOrders(checked === true)}
                    />
                    <Label htmlFor="include-orders">Órdenes</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="include-campaigns"
                      checked={includeCampaigns}
                      onCheckedChange={(checked) => setIncludeCampaigns(checked === true)}
                    />
                    <Label htmlFor="include-campaigns">Campañas</Label>
                  </div>
                </div>
              </section>

              {!hasAtLeastOneModule && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Seleccioná al menos un tipo de dato.
                </p>
              )}

              {!isDateRangeValid && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  El rango de fechas es inválido.
                </p>
              )}

              {loadError && <p className="text-sm text-red-600 dark:text-red-400">{loadError}</p>}
            </div>

            <DialogFooter className="gap-2 px-6 py-2 py-4 sm:justify-end">
              <Button
                variant="outline"
                className="bg-white"
                onClick={() => setIsExportModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (exportFormat === "pdf") {
                    void exportSelectedPdf();
                    return;
                  }

                  void exportStyledExcel();
                }}
                disabled={!isDateRangeValid || !hasAtLeastOneModule || isGeneratingReport}
                className="w-full sm:w-auto"
              >
                {isGeneratingReport ? (
                  "Generando..."
                ) : (
                  <>{exportFormat === "pdf" ? "Exportar PDF" : "Exportar Excel"}</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
