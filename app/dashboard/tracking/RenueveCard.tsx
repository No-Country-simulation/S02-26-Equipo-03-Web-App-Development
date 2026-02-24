"use client"

import { AlertTriangle } from "lucide-react"
import { Card } from "@/shared/components/ui/card"

interface Props {
  totalRisk: number
}

export function RevenueCard({ totalRisk }: Props) {
  // 🔢 Lógica de color
  const getColor = () => {
    if (totalRisk > 5000) return "from-rose-600 to-red-500"
    if (totalRisk > 2000) return "from-amber-500 to-yellow-400"
    return "from-emerald-600 to-green-500"
  }

  // 📊 Health score dinámico (100 - % riesgo estimado)
  const healthScore = Math.max(0, 100 - totalRisk / 100)

  return (
    <Card
      className={`relative overflow-hidden border-0 bg-gradient-to-r ${getColor()} text-white shadow-lg`}
    >
      <div className="p-8 flex justify-between items-center">
        <div className="space-y-4">
          <span className="text-xs font-semibold tracking-widest bg-white/20 px-3 py-1 rounded-full">
            REVENUE AT RISK
          </span>

          <h2 className="text-3xl font-bold">
            Estimated revenue at risk: $
            {totalRisk.toLocaleString()}
          </h2>

          <p className="text-white/90 max-w-xl text-sm">
            El monto se calcula automáticamente según los problemas detectados
            en el sistema.
          </p>
        </div>

        <div className="flex items-center gap-8">
          <div className="bg-black/20 p-3 rounded-full">
            <AlertTriangle className="w-6 h-6 text-yellow-300" />
          </div>

          {/* Health Score */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(white ${healthScore * 3.6}deg, rgba(255,255,255,0.2) 0deg)`,
              }}
            />
            <div className="absolute w-20 h-20 bg-black/20 rounded-full flex flex-col items-center justify-center">
              <p className="text-2xl font-bold">
                {Math.round(healthScore)}
              </p>
              <p className="text-xs tracking-widest">HEALTH</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}