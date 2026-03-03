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

type Canal = "Google Ads" | "Meta Ads" | "Stripe";

type MetricaDiaria = {
  fecha: string;
  canal: Canal;
  impresiones: number;
  clicks: number;
  conversiones: number;
  gasto: number;
  ingresos: number;
  revenueAtribuido: number;
  ordenes: number;
  campanas: number;
  eventosTrackeados: number;
  eventosEsperados: number;
};

type OrdenBackend = {
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

type Orden = {
  fecha: string;
  idOrden: string;
  cliente: string;
  servicio: string;
  tipoPago: string;
  fuente: string;
  monto: number;
  estado: "Pagado" | "Pendiente" | "Fallido";
  campaignId: string;
  projectId: string;
  stripeId: string;
  clientEmail: string;
  orderDateIso: string;
};

type CampanaBackend = {
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

type ProyectoBackend = {
  id: string;
};

type RespuestaOrdenes = {
  success: boolean;
  data: OrdenBackend[];
};

type RespuestaCampanas = {
  success: boolean;
  data: CampanaBackend[];
};

type Campana = {
  fecha: string;
  campana: string;
  plataforma: "Meta Ads" | "Google Ads";
  gasto: number;
  revenueStripe: number;
  roas: number;
  cpa: number;
};

type ProblemaTracking = {
  fecha: string;
  tipoProblema: string;
  impactoEstimado: number;
  plataforma: string;
  severidad: "Crítico" | "Alerta" | "Estable";
  hace: string;
};

type ReporteExportable = {
  periodo: string;
  moneda: string;
  empresa: string;
  metricas: MetricaDiaria[];
  panelEjecutivo: {
    revenueTotalStripe: number;
    pagosConfirmados: number;
    roasGlobal: number;
    healthScore: number;
    accionRequerida: number;
  };
  ordenes: Orden[];
  campanas: Campana[];
  trackingHealth: {
    estadoGeneral: string;
    healthScore: number;
    resumen: string;
    problemas: ProblemaTracking[];
    ingresosRiesgo: number;
  };
};

function calcularSaludTracking(eventosTrackeados: number, eventosEsperados: number) {
  return eventosEsperados > 0 ? (eventosTrackeados / eventosEsperados) * 100 : 0;
}

function estadoTracking(salud: number) {
  if (salud >= 95) {
    return "Alta";
  }

  if (salud >= 90) {
    return "Media";
  }

  return "Baja";
}

function isoAFecha(iso: string | number | Date | null | undefined) {
  if (!iso) {
    return "";
  }

  if (typeof iso === "string") {
    return iso.slice(0, 10);
  }

  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime()) ? "" : fecha.toISOString().slice(0, 10);
}

function normalizarEstadoOrden(estado: string): "Pagado" | "Pendiente" | "Fallido" {
  if (estado.toLowerCase() === "confirmed") {
    return "Pagado";
  }

  if (estado.toLowerCase() === "pending") {
    return "Pendiente";
  }

  return "Fallido";
}

function formatearTextoDesdeSlug(valor: string) {
  return valor
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
}

function mapearOrdenBackend(orden: OrdenBackend): Orden {
  return {
    fecha: isoAFecha(orden.orderDate),
    idOrden: orden.id,
    cliente: orden.customerName || "Sin cliente",
    servicio: orden.productName || "Sin servicio",
    tipoPago: orden.paymentType || "Sin tipo",
    fuente: formatearTextoDesdeSlug(orden.sourcePlatform),
    monto: orden.totalAmount,
    estado: normalizarEstadoOrden(orden.status),
    campaignId: orden.campaignId,
    projectId: orden.projectId,
    stripeId: orden.stripeId,
    clientEmail: orden.customerEmail,
    orderDateIso: orden.orderDate,
  };
}

function normalizarPlataformaCampana(
  plataforma: CampanaBackend["platform"]
): Campana["plataforma"] {
  const valor = (plataforma || "").toLowerCase();

  if (valor.includes("google")) {
    return "Google Ads";
  }

  if (valor.includes("meta") || valor.includes("facebook")) {
    return "Meta Ads";
  }

  return "Meta Ads";
}

function mapearCampanaBackend(campana: CampanaBackend): Campana {
  return {
    fecha: isoAFecha(campana.startDate),
    campana: formatearTextoDesdeSlug(campana.name),
    plataforma: normalizarPlataformaCampana(campana.platform),
    gasto: campana.adSpend,
    revenueStripe: campana.revenue,
    roas: campana.roas,
    cpa: campana.cpa,
  };
}

const REPORTE_CONFIG = {
  moneda: "USD",
  empresa: "Garder Ads",
} as const;

async function obtenerOrdersDesdeApi(projectId: string): Promise<OrdenBackend[]> {
  const respuesta = await fetch(`/api/v1/orders?projectId=${encodeURIComponent(projectId)}`, {
    credentials: "include",
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudo obtener órdenes`);
  }

  const json = (await respuesta.json()) as RespuestaOrdenes;
  return Array.isArray(json.data) ? json.data : [];
}
async function obtenerCampanasDesdeApi(projectId: string): Promise<CampanaBackend[]> {
  const respuesta = await fetch(`/api/v1/campaigns?projectId=${encodeURIComponent(projectId)}`, {
    credentials: "include",
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudo obtener campañas`);
  }

  const json = (await respuesta.json()) as RespuestaCampanas;
  return Array.isArray(json.data) ? json.data : [];
}

const estilosPdf = StyleSheet.create({
  page: { padding: 24, fontSize: 11 },
  title: { fontSize: 16, marginBottom: 10 },
  subtitle: { marginBottom: 14 },
  sectionTitle: { fontSize: 13, marginBottom: 8, fontWeight: 700 },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  summaryCard: {
    width: "48%",
    borderWidth: 0.5,
    borderColor: "#ccc",
    padding: 8,
    marginRight: "2%",
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 9, color: "#666", marginBottom: 4 },
  summaryValue: { fontSize: 12, fontWeight: 700 },
  lineItem: { marginBottom: 4 },
  sectionSpacing: { marginTop: 10 },
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

function ReportePdf({ data }: { data: ReporteExportable }) {
  const tieneMetricas = data.metricas.length > 0;
  const tieneOrdenes = data.ordenes.length > 0;
  const tieneCampanas = data.campanas.length > 0;
  const tieneTracking = data.trackingHealth.problemas.length > 0;

  const totalGasto = data.metricas.reduce((acc, fila) => acc + fila.gasto, 0);
  const totalIngresos = data.metricas.reduce((acc, fila) => acc + fila.ingresos, 0);
  const totalRevenueAtribuido = data.metricas.reduce((acc, fila) => acc + fila.revenueAtribuido, 0);
  const totalOrdenes = data.metricas.reduce((acc, fila) => acc + fila.ordenes, 0);
  const totalCampanas = data.metricas.reduce((acc, fila) => acc + fila.campanas, 0);
  const totalEventosTrackeados = data.metricas.reduce(
    (acc, fila) => acc + fila.eventosTrackeados,
    0
  );
  const totalEventosEsperados = data.metricas.reduce((acc, fila) => acc + fila.eventosEsperados, 0);
  const saludTracking = calcularSaludTracking(totalEventosTrackeados, totalEventosEsperados);
  const roas = totalGasto > 0 ? totalIngresos / totalGasto : 0;
  const ticketPromedio = totalOrdenes > 0 ? totalRevenueAtribuido / totalOrdenes : 0;

  const resumenPorCanal = (
    Object.entries(
      data.metricas.reduce<
        Record<Canal, { revenueAtribuido: number; gasto: number; ordenes: number }>
      >(
        (acc, fila) => {
          if (!acc[fila.canal]) {
            acc[fila.canal] = { revenueAtribuido: 0, gasto: 0, ordenes: 0 };
          }
          acc[fila.canal].revenueAtribuido += fila.revenueAtribuido;
          acc[fila.canal].gasto += fila.gasto;
          acc[fila.canal].ordenes += fila.ordenes;
          return acc;
        },
        {} as Record<Canal, { revenueAtribuido: number; gasto: number; ordenes: number }>
      )
    ) as [Canal, { revenueAtribuido: number; gasto: number; ordenes: number }][]
  )
    .map(([canal, valores]) => ({
      canal,
      ...valores,
      roas: valores.gasto > 0 ? valores.revenueAtribuido / valores.gasto : 0,
      share:
        totalRevenueAtribuido > 0 ? (valores.revenueAtribuido / totalRevenueAtribuido) * 100 : 0,
    }))
    .sort((a, b) => b.revenueAtribuido - a.revenueAtribuido);

  const canalPrincipal = resumenPorCanal[0]?.canal ?? "Sin datos";

  const totalOrdenesExport = data.ordenes.length;
  const totalCampanasExport = data.campanas.length;
  const totalProblemasTracking = data.trackingHealth.problemas.length;

  return (
    <Document>
      {tieneMetricas && (
        <Page size="A4" style={estilosPdf.page}>
          <Text style={estilosPdf.title}>Panel Ejecutivo - {data.empresa}</Text>
          <Text style={estilosPdf.subtitle}>
            Período: {data.periodo} | Moneda: {data.moneda}
          </Text>

          <Text style={estilosPdf.sectionTitle}>Resumen ejecutivo</Text>

          <View style={estilosPdf.summaryGrid}>
            <View style={estilosPdf.summaryCard}>
              <Text style={estilosPdf.summaryLabel}>Revenue atribuido</Text>
              <Text style={estilosPdf.summaryValue}>{totalRevenueAtribuido.toFixed(2)}</Text>
            </View>
            <View style={estilosPdf.summaryCard}>
              <Text style={estilosPdf.summaryLabel}>Órdenes</Text>
              <Text style={estilosPdf.summaryValue}>{totalOrdenes}</Text>
            </View>
            <View style={estilosPdf.summaryCard}>
              <Text style={estilosPdf.summaryLabel}>Ticket promedio</Text>
              <Text style={estilosPdf.summaryValue}>{ticketPromedio.toFixed(2)}</Text>
            </View>
            <View style={estilosPdf.summaryCard}>
              <Text style={estilosPdf.summaryLabel}>ROAS</Text>
              <Text style={estilosPdf.summaryValue}>{roas.toFixed(2)}x</Text>
            </View>
            <View style={estilosPdf.summaryCard}>
              <Text style={estilosPdf.summaryLabel}>Campañas</Text>
              <Text style={estilosPdf.summaryValue}>{totalCampanas}</Text>
            </View>
            <View style={estilosPdf.summaryCard}>
              <Text style={estilosPdf.summaryLabel}>Salud tracking</Text>
              <Text style={estilosPdf.summaryValue}>
                {saludTracking.toFixed(2)}% ({estadoTracking(saludTracking)})
              </Text>
            </View>
          </View>

          <Text style={estilosPdf.lineItem}>
            Revenue total Stripe: {data.panelEjecutivo.revenueTotalStripe.toFixed(2)}
          </Text>
          <Text style={estilosPdf.lineItem}>
            Pagos confirmados: {data.panelEjecutivo.pagosConfirmados}
          </Text>
          <Text style={estilosPdf.lineItem}>Health score: {data.panelEjecutivo.healthScore}</Text>
          <Text style={estilosPdf.lineItem}>
            Acción requerida: {data.panelEjecutivo.accionRequerida.toFixed(2)}
          </Text>

          <Text style={estilosPdf.sectionTitle}>Atribución por canal</Text>
          {resumenPorCanal.map((fila) => (
            <Text key={fila.canal} style={{ marginBottom: 4 }}>
              {fila.canal}: revenue {fila.revenueAtribuido.toFixed(2)} | share{" "}
              {fila.share.toFixed(2)}% | órdenes {fila.ordenes} | roas {fila.roas.toFixed(2)}x
            </Text>
          ))}

          <Text style={{ marginTop: 10 }}>
            Canal principal por revenue atribuido: {canalPrincipal}
          </Text>
        </Page>
      )}

      {tieneOrdenes && (
        <Page size="A4" style={estilosPdf.page}>
          <Text style={estilosPdf.title}>Órdenes - {data.empresa}</Text>
          <Text style={estilosPdf.subtitle}>Total órdenes exportadas: {totalOrdenesExport}</Text>

          <View style={estilosPdf.tableHeader}>
            <Text style={estilosPdf.c1}>Fecha</Text>
            <Text style={estilosPdf.c2}>Orden</Text>
            <Text style={estilosPdf.c3}>Cliente</Text>
            <Text style={estilosPdf.c4}>Fuente</Text>
            <Text style={estilosPdf.c5}>Estado</Text>
            <Text style={estilosPdf.c6}>Tipo pago</Text>
            <Text style={estilosPdf.c7}>Servicio</Text>
            <Text style={estilosPdf.c8}>Monto</Text>
          </View>

          {data.ordenes.map((fila) => (
            <View key={fila.idOrden} style={estilosPdf.row}>
              <Text style={estilosPdf.c1}>{fila.fecha}</Text>
              <Text style={estilosPdf.c2}>
                {fila.idOrden.slice(0, 4) + "..." + fila.idOrden.slice(-4)}
              </Text>
              <Text style={estilosPdf.c3}>{fila.cliente}</Text>
              <Text style={estilosPdf.c4}>{fila.fuente}</Text>
              <Text style={estilosPdf.c5}>{fila.estado}</Text>
              <Text style={estilosPdf.c6}>{fila.tipoPago}</Text>
              <Text style={estilosPdf.c7}>{fila.servicio}</Text>
              <Text style={estilosPdf.c8}>{fila.monto.toFixed(2)}</Text>
            </View>
          ))}
        </Page>
      )}

      {tieneCampanas && (
        <Page size="A4" style={estilosPdf.page}>
          <Text style={estilosPdf.title}>Campañas - {data.empresa}</Text>
          <Text style={estilosPdf.subtitle}>Total campañas exportadas: {totalCampanasExport}</Text>
          <View style={estilosPdf.tableHeader}>
            <Text style={estilosPdf.c1}>Fecha</Text>
            <Text style={estilosPdf.c2}>Campaña</Text>
            <Text style={estilosPdf.c3}>Plataforma</Text>
            <Text style={estilosPdf.c4}>Gasto</Text>
            <Text style={estilosPdf.c5}>Revenue</Text>
            <Text style={estilosPdf.c6}>ROAS</Text>
            <Text style={estilosPdf.c7}>CPA</Text>
            <Text style={estilosPdf.c8}></Text>
          </View>
          {data.campanas.map((fila) => (
            <View key={`${fila.fecha}-${fila.campana}`} style={estilosPdf.row}>
              <Text style={estilosPdf.c1}>{fila.fecha}</Text>
              <Text style={estilosPdf.c2}>{fila.campana}</Text>
              <Text style={estilosPdf.c3}>{fila.plataforma}</Text>
              <Text style={estilosPdf.c4}>{fila.gasto.toFixed(2)}</Text>
              <Text style={estilosPdf.c5}>{fila.revenueStripe.toFixed(2)}</Text>
              <Text style={estilosPdf.c6}>{fila.roas.toFixed(2)}x</Text>
              <Text style={estilosPdf.c7}>{fila.cpa.toFixed(2)}</Text>
              <Text style={estilosPdf.c8}></Text>
            </View>
          ))}
        </Page>
      )}

      {tieneTracking && (
        <Page size="A4" style={estilosPdf.page}>
          <Text style={estilosPdf.title}>Tracking Health - {data.empresa}</Text>
          <Text style={estilosPdf.subtitle}>
            Score: {data.trackingHealth.healthScore} | Estado: {data.trackingHealth.estadoGeneral}
          </Text>
          <Text style={estilosPdf.lineItem}>{data.trackingHealth.resumen}</Text>
          <Text style={estilosPdf.lineItem}>Problemas detectados: {totalProblemasTracking}</Text>
          <Text style={estilosPdf.lineItem}>
            Ingresos estimados en riesgo: {data.trackingHealth.ingresosRiesgo.toFixed(2)}
          </Text>

          <Text style={[estilosPdf.sectionTitle, estilosPdf.sectionSpacing]}>Incidencias</Text>
          <View style={estilosPdf.tableHeader}>
            <Text style={estilosPdf.c1}>Fecha</Text>
            <Text style={estilosPdf.c2}>Problema</Text>
            <Text style={estilosPdf.c3}>Plataforma</Text>
            <Text style={estilosPdf.c4}>Severidad</Text>
            <Text style={estilosPdf.c5}>Impacto</Text>
            <Text style={estilosPdf.c6}>Detectado</Text>
            <Text style={estilosPdf.c7}></Text>
            <Text style={estilosPdf.c8}></Text>
          </View>
          {data.trackingHealth.problemas.map((fila, index) => (
            <View key={`${fila.fecha}-${fila.tipoProblema}-${index}`} style={estilosPdf.row}>
              <Text style={estilosPdf.c1}>{fila.fecha}</Text>
              <Text style={estilosPdf.c2}>{fila.tipoProblema}</Text>
              <Text style={estilosPdf.c3}>{fila.plataforma}</Text>
              <Text style={estilosPdf.c4}>{fila.severidad}</Text>
              <Text style={estilosPdf.c5}>{fila.impactoEstimado.toFixed(2)}</Text>
              <Text style={estilosPdf.c6}>{fila.hace}</Text>
              <Text style={estilosPdf.c7}></Text>
              <Text style={estilosPdf.c8}></Text>
            </View>
          ))}
        </Page>
      )}
    </Document>
  );
}

export default function GenerateReports() {
  const hoy = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [ordenesBackend, setOrdenesBackend] = useState<OrdenBackend[]>([]);
  const [campanasBackend, setCampanasBackend] = useState<CampanaBackend[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const fechasDisponibles = useMemo(
    () =>
      [
        ...ordenesBackend.map((fila) => isoAFecha(fila.orderDate)),
        ...campanasBackend.map((fila) => isoAFecha(fila.startDate)),
      ]
        .filter(Boolean)
        .filter((fecha, indice, arr) => arr.indexOf(fecha) === indice)
        .sort(),
    [campanasBackend, ordenesBackend]
  );

  const fechaMinima = fechasDisponibles[0] ?? hoy;
  const fechaMaxima = fechasDisponibles[fechasDisponibles.length - 1] ?? hoy;

  const [modalExportacionAbierto, setModalExportacionAbierto] = useState(false);
  const [exportarOrdenesSeleccionado, setExportarOrdenesSeleccionado] = useState(true);
  const [exportarCampanasSeleccionado, setExportarCampanasSeleccionado] = useState(true);
  const [fechaDesdeExportacion, setFechaDesdeExportacion] = useState(hoy);
  const [fechaHastaExportacion, setFechaHastaExportacion] = useState(hoy);
  const [formatoExportacion, setFormatoExportacion] = useState<"excel" | "pdf">("excel");

  useEffect(() => {
    let activo = true;

    const cargarDatos = async () => {
      setCargandoDatos(true);
      setErrorCarga(null);

      try {
        const respuestaProyectos = await fetch("/api/v1/projects", {
          credentials: "include",
        });

        if (!respuestaProyectos.ok) {
          throw new Error("No se pudieron obtener proyectos.");
        }

        const proyectos = (await respuestaProyectos.json()) as ProyectoBackend[];
        const projectId = proyectos[0]?.id;

        if (!projectId) {
          throw new Error("No hay proyectos disponibles.");
        }

        const [ordenes, campanas] = await Promise.all([
          obtenerOrdersDesdeApi(projectId),
          obtenerCampanasDesdeApi(projectId),
        ]);

        if (!ordenes) {
          throw new Error("No se pudieron obtener órdenes.");
        }

        if (!activo) {
          return;
        }

        setOrdenesBackend(ordenes);
        setCampanasBackend(campanas);
      } catch (error) {
        if (!activo) {
          return;
        }

        setErrorCarga(error instanceof Error ? error.message : "Error al cargar reportes.");
      } finally {
        if (activo) {
          setCargandoDatos(false);
        }
      }
    };

    void cargarDatos();

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    setFechaDesdeExportacion((actual) => {
      if (!actual || actual < fechaMinima || actual > fechaMaxima) {
        return fechaMinima;
      }

      return actual;
    });

    setFechaHastaExportacion((actual) => {
      if (!actual || actual < fechaMinima || actual > fechaMaxima) {
        return fechaMaxima;
      }

      return actual;
    });
  }, [fechaMaxima, fechaMinima]);

  const rangoExportacionValido = Boolean(
    fechaDesdeExportacion && fechaHastaExportacion && fechaDesdeExportacion <= fechaHastaExportacion
  );

  const tieneModuloSeleccionado = exportarOrdenesSeleccionado || exportarCampanasSeleccionado;

  const abrirModalExportacion = () => {
    // setFechaDesdeExportacion(fechaDesde);
    // setFechaHastaExportacion(fechaHasta);
    setFormatoExportacion("excel");
    setModalExportacionAbierto(true);
  };

  const obtenerDatosExportables = () => {
    const ordenesExportables = exportarOrdenesSeleccionado
      ? ordenesBackend
          .map(mapearOrdenBackend)
          .filter(
            (fila) => fila.fecha >= fechaDesdeExportacion && fila.fecha <= fechaHastaExportacion
          )
      : [];

    const campanasExportables = exportarCampanasSeleccionado
      ? campanasBackend
          .filter((fila) => {
            const fecha = isoAFecha(fila.startDate);
            return fecha >= fechaDesdeExportacion && fecha <= fechaHastaExportacion;
          })
          .map(mapearCampanaBackend)
      : [];

    return { ordenesExportables, campanasExportables };
  };

  const exportarExcelEstilizado = async () => {
    if (!rangoExportacionValido || !tieneModuloSeleccionado) {
      return;
    }

    const { ordenesExportables, campanasExportables } = obtenerDatosExportables();

    const ExcelJS = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    const moneda = new Intl.NumberFormat("es-AR", {
      style: "currency",
      signDisplay: "never",
      currency: REPORTE_CONFIG.moneda,
      maximumFractionDigits: 2,
    });

    const agregarTabla = (
      hoja: string,
      columnas: string[],
      filas: Array<Record<string, string | number>>
    ) => {
      const ws = workbook.addWorksheet(hoja);
      ws.columns = columnas.map((columna) => ({
        header: columna,
        key: columna,
        width: Math.max(14, Math.min(36, columna.length + 6)),
      }));

      ws.views = [{ state: "frozen", ySplit: 1 }];

      const headerRow = ws.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF111827" },
      };
      headerRow.alignment = { vertical: "middle", horizontal: "left" };

      filas.forEach((fila, index) => {
        ws.addRow(fila);
        const row = ws.getRow(index + 2);
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: index % 2 === 0 ? "FFF9FAFB" : "FFFFFFFF" },
        };
      });

      ws.eachRow((row) => {
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

    if (exportarOrdenesSeleccionado) {
      agregarTabla(
        "Órdenes",
        ["Fecha", "ID Orden", "Cliente", "Servicio", "Tipo pago", "Fuente", "Monto", "Estado"],
        ordenesExportables.map((fila) => ({
          Fecha: fila.fecha,
          "ID Orden": fila.idOrden,
          Cliente: fila.cliente,
          Servicio: fila.servicio,
          "Tipo pago": fila.tipoPago,
          Fuente: fila.fuente,
          Monto: moneda.format(fila.monto),
          Estado: fila.estado,
        }))
      );
    }

    if (exportarCampanasSeleccionado) {
      agregarTabla(
        "Campañas",
        ["Fecha", "Campaña", "Plataforma", "Gasto", "Revenue Stripe", "ROAS", "CPA"],
        campanasExportables.map((fila) => ({
          Fecha: fila.fecha,
          Campaña: fila.campana,
          Plataforma: fila.plataforma,
          Gasto: moneda.format(fila.gasto),
          "Revenue Stripe": moneda.format(fila.revenueStripe),
          ROAS: `${fila.roas.toFixed(2)}x`,
          CPA: moneda.format(fila.cpa),
        }))
      );
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reporte-exportacion-${fechaDesdeExportacion}_a_${fechaHastaExportacion}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);

    setModalExportacionAbierto(false);
  };

  const exportarPdfSeleccionado = async () => {
    if (!rangoExportacionValido || !tieneModuloSeleccionado) {
      return;
    }

    const { ordenesExportables, campanasExportables } = obtenerDatosExportables();

    const totalRevenueStripe = ordenesExportables
      .filter((fila) => fila.estado === "Pagado")
      .reduce((acc, fila) => acc + fila.monto, 0);
    const pagosConfirmados = ordenesExportables.filter((fila) => fila.estado === "Pagado").length;
    const totalGastoCampanas = campanasExportables.reduce((acc, fila) => acc + fila.gasto, 0);
    const roasGlobal = totalGastoCampanas > 0 ? totalRevenueStripe / totalGastoCampanas : 0;

    const reporteParaPdf: ReporteExportable = {
      periodo: `${fechaDesdeExportacion} a ${fechaHastaExportacion}`,
      moneda: REPORTE_CONFIG.moneda,
      empresa: REPORTE_CONFIG.empresa,
      metricas: [],
      panelEjecutivo: {
        revenueTotalStripe: totalRevenueStripe,
        pagosConfirmados,
        roasGlobal,
        healthScore: 100,
        accionRequerida: 0,
      },
      ordenes: ordenesExportables,
      campanas: campanasExportables,
      trackingHealth: {
        estadoGeneral: "Sin datos",
        healthScore: 0,
        resumen: "",
        problemas: [],
        ingresosRiesgo: 0,
      },
    };

    const blob = await pdf(<ReportePdf data={reporteParaPdf} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reporte-exportacion-${fechaDesdeExportacion}_a_${fechaHastaExportacion}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    setModalExportacionAbierto(false);
  };

  return (
    <>
      <Button variant={"ghost"} onClick={abrirModalExportacion} disabled={cargandoDatos}>
        <Download className="h-4 w-4" />
        {cargandoDatos ? "Cargando..." : "Exportar"}
      </Button>

      <Dialog open={modalExportacionAbierto} onOpenChange={setModalExportacionAbierto}>
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
                  <Label htmlFor="fecha-desde" className="opacity-75">
                    Fecha desde
                  </Label>
                  <Input
                    id="fecha-desde"
                    type="date"
                    value={fechaDesdeExportacion}
                    min={fechaMinima}
                    max={fechaMaxima}
                    onChange={(event) => setFechaDesdeExportacion(event.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <Label htmlFor="fecha-hasta" className="opacity-75">
                    Fecha hasta
                  </Label>
                  <Input
                    id="fecha-hasta"
                    type="date"
                    value={fechaHastaExportacion}
                    min={fechaMinima}
                    max={fechaMaxima}
                    onChange={(event) => setFechaHastaExportacion(event.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <p className="text-xs font-semibold tracking-wide uppercase opacity-60">Formato</p>
              <RadioGroup
                value={formatoExportacion}
                onValueChange={(value) => setFormatoExportacion(value as "excel" | "pdf")}
                className="grid gap-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="excel" id="formato-excel" />
                  <Label htmlFor="formato-excel">Excel (.xlsx)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="pdf" id="formato-pdf" />
                  <Label htmlFor="formato-pdf">PDF (.pdf)</Label>
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
                    id="exportar-ordenes"
                    checked={exportarOrdenesSeleccionado}
                    onCheckedChange={(checked) => setExportarOrdenesSeleccionado(checked === true)}
                  />
                  <Label htmlFor="exportar-ordenes">Órdenes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="exportar-campanas"
                    checked={exportarCampanasSeleccionado}
                    onCheckedChange={(checked) => setExportarCampanasSeleccionado(checked === true)}
                  />
                  <Label htmlFor="exportar-campanas">Campañas</Label>
                </div>
              </div>
            </section>

            {!tieneModuloSeleccionado && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Seleccioná al menos un tipo de dato.
              </p>
            )}

            {!rangoExportacionValido && (
              <p className="text-sm text-red-600 dark:text-red-400">
                El rango de fechas es inválido.
              </p>
            )}

            {errorCarga && <p className="text-sm text-red-600 dark:text-red-400">{errorCarga}</p>}
          </div>

          <DialogFooter className="gap-2 px-6 py-2 py-4 sm:justify-end">
            <Button
              variant="outline"
              className="bg-white"
              onClick={() => setModalExportacionAbierto(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (formatoExportacion === "pdf") {
                  void exportarPdfSeleccionado();
                  return;
                }

                void exportarExcelEstilizado();
              }}
              disabled={!rangoExportacionValido || !tieneModuloSeleccionado}
              className="w-full sm:w-auto"
            >
              {formatoExportacion === "pdf" ? "Exportar PDF" : "Exportar Excel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
