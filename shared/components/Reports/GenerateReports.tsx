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
  c2: { width: "16%" },
  c3: { width: "18%", textAlign: "right" },
  c4: { width: "12%", textAlign: "right" },
  c5: { width: "12%", textAlign: "right" },
  c6: { width: "14%", textAlign: "right" },
  c7: { width: "14%", textAlign: "right" },
  c8: { width: "12%", textAlign: "right" },
});

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
              <Text style={pdfStyles.c1}>{row.date}</Text>
              <Text style={pdfStyles.c2}>
                {row.orderId.slice(0, 4) + "..." + row.orderId.slice(-4)}
              </Text>
              <Text style={pdfStyles.c3}>{row.customer}</Text>
              <Text style={pdfStyles.c4}>{row.source}</Text>
              <Text style={pdfStyles.c5}>{row.status}</Text>
              <Text style={pdfStyles.c6}>{row.paymentType}</Text>
              <Text style={pdfStyles.c7}>{row.service}</Text>
              <Text style={pdfStyles.c8}>{row.amount.toFixed(2)}</Text>
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
              <Text style={pdfStyles.c1}>{row.date}</Text>
              <Text style={pdfStyles.c2}>{row.campaign}</Text>
              <Text style={pdfStyles.c3}>{row.platform}</Text>
              <Text style={pdfStyles.c4}>{row.spend.toFixed(2)}</Text>
              <Text style={pdfStyles.c5}>{row.stripeRevenue.toFixed(2)}</Text>
              <Text style={pdfStyles.c6}>{row.roas.toFixed(2)}x</Text>
              <Text style={pdfStyles.c7}>{row.cpa.toFixed(2)}</Text>
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
    let isActive = true;

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

        if (!isActive) {
          return;
        }

        setOrderRecords(orders);
        setCampaignRecords(campaigns);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setLoadError(error instanceof Error ? error.message : "Error al cargar reportes.");
      } finally {
        if (isActive) {
          setIsLoadingData(false);
        }
      }
    };

    void loadData();

    return () => {
      isActive = false;
    };
  }, [selectedProjectId]);

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

  const openExportModal = () => {
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

  const exportStyledExcel = async () => {
    if (!isDateRangeValid || !hasAtLeastOneModule) {
      return;
    }

    const { exportableOrders, exportableCampaigns } = getExportData();

    const ExcelJS = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    const currencyFormatter = new Intl.NumberFormat("es-AR", {
      style: "currency",
      signDisplay: "never",
      currency: REPORT_CONFIG.currency,
      maximumFractionDigits: 2,
    });

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
          Fecha: row.date,
          "ID Orden": row.orderId,
          Cliente: row.customer,
          Servicio: row.service,
          "Tipo pago": row.paymentType,
          Fuente: row.source,
          Monto: currencyFormatter.format(row.amount),
          Estado: row.status,
        }))
      );
    }

    if (includeCampaigns) {
      addTable(
        "Campañas",
        ["Fecha", "Campaña", "Plataforma", "Gasto", "Revenue Stripe", "ROAS", "CPA"],
        exportableCampaigns.map((row) => ({
          Fecha: row.date,
          Campaña: row.campaign,
          Plataforma: row.platform,
          Gasto: currencyFormatter.format(row.spend),
          "Revenue Stripe": currencyFormatter.format(row.stripeRevenue),
          ROAS: `${row.roas.toFixed(2)}x`,
          CPA: currencyFormatter.format(row.cpa),
        }))
      );
    }

    const fileBuffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([fileBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `reporte-exportacion-${fromDate}_a_${toDate}.xlsx`;
    link.click();
    URL.revokeObjectURL(downloadUrl);

    setIsExportModalOpen(false);
  };

  const exportSelectedPdf = async () => {
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
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `reporte-exportacion-${fromDate}_a_${toDate}.pdf`;
    link.click();
    URL.revokeObjectURL(downloadUrl);

    setIsExportModalOpen(false);
  };

  return (
    <>
      <Button variant={"ghost"} onClick={openExportModal} disabled={isLoadingData}>
        <Download className="h-4 w-4" />
        {isLoadingData ? "Cargando..." : "Exportar"}
      </Button>

      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
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
              disabled={!isDateRangeValid || !hasAtLeastOneModule}
              className="w-full sm:w-auto"
            >
              {exportFormat === "pdf" ? "Exportar PDF" : "Exportar Excel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
