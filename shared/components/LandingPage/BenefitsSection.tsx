"use client"


import {
  FaDollarSign,
  FaBullseye,
  FaHeartbeat,
  FaFileAlt,
} from "react-icons/fa"
import { FiCheck, FiShield, FiCreditCard, FiGrid } from "react-icons/fi";
import { FaMeta } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import BenefitsSectionCard from "./BenefitsSectionCard"
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Calendar } from "lucide-react";
const rows = [
    { date: "01/01", revenue: "$2,300", roas: "4.2x" },
    { date: "02/01", revenue: "$2,780", roas: "4.7x" },
  ];
const data = [
  {
    name: "Meta",
    icon: <FaMeta className="text-blue-600 text-lg" />,
    revenue: "$8,200",
    roas: "3.8x",
  },
  {
    name: "Google",
    icon: <FcGoogle className="text-lg" />,
    revenue: "$12,100",
    roas: "4.9x",
  },
  {
    name: "Email",
    icon: <MdEmail className="text-blue-500 text-lg" />,
    revenue: "$4,267",
    roas: "5.2x",
  },
]

const StatusItem = ({ icon, label, status, isWarning = false }: any) => (
  <div className="flex items-center justify-between text-slate-600">
    <div className="flex items-center space-x-3">
      {icon}
      <span className="text-[15px] font-medium">{label} —</span>
    </div>
    <span className={`text-[15px] ${isWarning ? 'text-slate-500' : 'text-slate-500'}`}>
      {status}
    </span>
  </div>
);

export default function BenefitsSection() {
  const healthScore = 87;

  return (
    <section className="w-full  py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            ¿Qué obtienes con GardenAds?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Más que un dashboard.{" "}
            <span className="text-emerald-600 font-semibold">
              Un sistema de confianza.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

          {/* ========================= */}
          {/* 1️⃣ Revenue */}
          {/* ========================= */}
       <BenefitsSectionCard title="Dashboard de Revenue"
       description="Métricas de revenue en tiempo real confirmadas por pagos de Stripe."
        icon={<FaDollarSign size={32} />}
        visualization={ <div className=" rounded-2xl bg-white shadow-md border border-gray-100 p-2">
      
      {/* Header */}
      <div className="flex flex-col justify-between items-start mb-4">
        <p className="text-sm text-gray-400">Revenue — Last 30 days</p>
        <div>
          <div className="flex items-center  gap-1 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mt-1">
            $24,567
          </h2>
            <p className="text-[10px] text-gray-400">
          Compared to Previous period
        </p>
        </div>
        <div className="w-full flex items-start">
          <p className="text-sm text-green-600 mt-1">
            Confirmed by Stripe ✓
          </p>
        </div>
        </div>
      </div>
<div className="mt-6 relative">
        <svg
          viewBox="0 0 400 160"
          className="w-full h-[145px]"
        >
          {/* Gradient */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <g stroke="#E5E7EB" strokeWidth="1">
            <line x1="0" y1="40" x2="400" y2="40" />
            <line x1="0" y1="80" x2="400" y2="80" />
            <line x1="0" y1="120" x2="400" y2="120" />
          </g>

          {/* Area */}
          <path
            d="
              M 0 130
              C 50 120, 80 115, 120 105
              S 180 90, 210 75
              S 260 70, 290 85
              S 330 95, 360 80
              S 380 75, 400 70
              L 400 160
              L 0 160
              Z
            "
            fill="url(#areaGradient)"
          />

          {/* Line */}
          <path
            d="
              M 0 130
              C 50 120, 80 115, 120 105
              S 180 90, 210 75
              S 260 70, 290 85
              S 330 95, 360 80
              S 380 75, 400 70
            "
            fill="none"
            stroke="#2563EB"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between text-[8px] text-gray-400  px-1">
          <span>Ins: 23.4</span>
          <span>Sep: 2/11</span>
          <span>Sep: 07.0d</span>
          <span>Sep28: 772s</span>
        </div>
      </div>

      {/* Footer */}
    {/* Footer con icons */}
      <div className="border-t  pt-6">
        <div className="flex items-center gap-3 text-gray-700 mb-2">
          <FiCheck className="text-teal-600 text-lg" />
          <span className="font-medium text-lg">
            Confirmed by Stripe
          </span>
        </div>

        <div className="flex gap-1 overflow-hidden">
          <FooterChip icon={<FiShield />} label="Confirmed bridging system" />
          <FooterChip icon={<FiCreditCard />} label="PPI card" />
          <FooterChip icon={<FiGrid />} label="KPI cards" />
        </div>
      </div>
    </div>} />

             
          <BenefitsSectionCard  title="Analytics de Atribución"
        description="Trackeá el ROAS real en todos tus canales de marketing."
        icon={<FaBullseye size={32} />}
        visualization={ <div className=" rounded-2xl bg-white shadow-md border border-gray-100 p-2">
                <p className="text-xl text-gray-500 mb-2">
                  ROAS Overview
                </p>
              <Separator className="mb-4"/>
                <p className="text-2xl font-semibold text-gray-900">
                  4.5x
                </p>

                <p className="text-[14px] text-emerald-600 mb-3">
                  Confirmed by Stripe ✓
                </p>
 <Separator className="mb-4"/>
              <div className="rounded-xl bg-white p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs text-gray-500">
              Channel
            </TableHead>
            <TableHead className="text-right text-xs text-gray-500">
              Revenue
            </TableHead>
            <TableHead className="text-right text-xs text-gray-500">
              ROAS
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((channel) => (
            <TableRow key={channel.name}>
              {/* Channel */}
              <TableCell>
                <div className="flex items-center gap-3 font-medium">
                  {channel.icon}
                  {channel.name}
                </div>
              </TableCell>

              {/* Revenue */}
              <TableCell className="text-right font-semibold">
                {channel.revenue}
              </TableCell>

              {/* ROAS */}
              <TableCell className="text-right">
                <span className="text-emerald-600 font-medium">
                  {channel.roas}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        
    </div><div className="flex gap-1">
          <FooterChip icon={<FiShield />} label="Confirmed by Stripe" />
          <FooterChip icon={<FiGrid />} label="KPI cards" />
        </div>
              </div>   }
/>
         

              

          

          {/* ========================= */}
          {/* 3️⃣ Tracking Health */}
          {/* ========================= */}

            <BenefitsSectionCard 
            title="Salud del Tracking" 
            description="Monitoreá la integridad del tracking 24/7 con alertas automáticas."
            icon={<FaHeartbeat size={32} />}
            visualization={
              <div className="rounded-2xl bg-white shadow-md border border-gray-100 p-4 flex flex-col items-center">
                <p className="text-slate-400 text-sm self-start mb-4">Tracking Health</p>
                
                {/* Gráfico Circular */}
                <div className="relative flex items-center justify-center mb-2">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
    {/* Círculo de fondo */}
    <circle
      cx="50"
      cy="50"
      r="40" // Radio ajustado para dejar espacio al stroke
      stroke="#f1f5f9"
      strokeWidth="10"
      fill="transparent"
    />
    {/* Círculo de progreso */}
    <circle
      cx="50"
      cy="50"
      r="40"
      stroke="#10b981"
      strokeWidth="10"
      fill="transparent"
      strokeDasharray="251.2" // 2 * PI * 40
      strokeDashoffset={251.2 - (360 *  healthScore) / 100}
      strokeLinecap="round"
      className="opacity-60 transition-all duration-500"
    />
  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-700">{healthScore}</span>
                  </div>
                </div>

                <p className="text-slate-500 text-sm font-medium mb-4">Health Score</p>

                {/* Lista de conexiones */}
                <div className="w-full space-y-3 pt-4 border-t border-slate-100">
                  <StatusItem 
                    icon={<CheckCircle2 className="text-emerald-500 w-4 h-4" />}
                    label="Stripe connection"
                    status="OK"
                  />
                
                  <StatusItem 
                    icon={<AlertTriangle className="text-amber-500 w-4 h-4" />}
                    label="Meta purchase"
                    status="Delayed"
                    isWarning
                  />
                  <StatusItem 
                    icon={<CheckCircle2 className="text-emerald-500 w-4 h-4" />}
                    label="Google Ads sync"
                    status="OK"
                  />
                </div>

                {/* Sparkline Decorativo inferior */}
                <div className="w-full h-8 mt-4 bg-slate-50/50 rounded-lg overflow-hidden relative">
                  <svg viewBox="0 0 100 20" className="w-full h-full opacity-40">
                    <path 
                      d="M0 15 Q 15 15, 30 10 T 60 15 T 100 10" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="1.5"
                    />
                    <circle cx="50" cy="12" r="1.5" fill="red" />
                  </svg>
                </div>
              </div>
            }
          />
      
         

           

        

          {/* ========================= */}
          {/* 4️⃣ Export */}
          {/* ========================= */}
          <BenefitsSectionCard 
  title="Exportar Reportes" 
  description="Descargá reportes completos para análisis y compartir con un solo clic."
  icon={<FaFileAlt size={32} />}
  visualization={<div className="rounded-3xl bg-white shadow-xl border border-slate-100 p-6 w-full max-w-[320px] mx-auto space-y-6">
      <h4 className="text-slate-500 text-sm text-start font-medium">Export Reports</h4>

      {/* Botones de Exportación */}
      <div className="flex gap-2">
        <button className="flex-1 py-2 px-2 rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 text-slate-500 text-sm font-medium shadow-sm hover:shadow-md transition-all">
          Export <span className="text-blue-500 ml-1">CSV</span>
        </button>
        <button className="flex-1 py-2 px-2 rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 text-slate-500 text-sm font-medium shadow-sm hover:shadow-md transition-all">
          Export <span className="text-red-400 ml-1">PDF</span>
        </button>
      </div>

      {/* Tabla de Reportes */}
      <div className="w-full">
        <div className="grid grid-cols-3  text-slate-400 text-sm font-medium border-b border-slate-50">
          <span>Date</span>
          <span className="text-center">Revenue</span>
          <span className="text-right">ROAS</span>
        </div>
        <div className="divide-y divide-slate-50">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-3 py-4 text-slate-600 font-medium italic">
              <span>{row.date}</span>
              <span className="text-center">{row.revenue}</span>
              <span className="text-right">{row.roas}</span>
            </div>
          ))}
        </div>
      </div>

   
      <div className="flex items-center gap-3 w-full p-1.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-400 text-sm">
        <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-100">
          <Calendar className="w-4 h-4 text-slate-400" />
        </div>
        <span className="font-medium">Custom date range enabled</span>
      </div>

     
    
    </div>}
/>
       

        </div>
      </div>
    </section>
  )
}

type FooterChipProps = {
  icon: React.ReactNode;
  label: string;
};

const FooterChip = ({ icon, label }: FooterChipProps) => {
  return (
    <div className="flex items-center gap-2 border bg-gray-100 rounded-xl px-1 py-2 min-w-[90px] ">
      <div className="text-gray-500">{icon}</div>
      <span className="text-[10px] text-gray-600 truncate">
        {label}
      </span>
    </div>
  );
};
