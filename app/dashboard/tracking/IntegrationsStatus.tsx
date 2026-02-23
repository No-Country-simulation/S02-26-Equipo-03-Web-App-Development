import { Card } from "@/shared/components/ui/card"

interface Props {
  integrations: {
    platform: string
    status: string
    color: string
  }[]
}
import {
  Globe,
  Zap,
  Database,
  CreditCard,
} from "lucide-react"

function getIcon(platform: string) {
  switch (platform) {
    case "STRIPE":
      return <CreditCard className="w-4 h-4 text-gray-400" />
    case "META ADS":
      return <Zap className="w-4 h-4 text-red-400" />
    case "GOOGLE ADS":
      return <Zap className="w-4 h-4 text-yellow-400" />
    case "DATA":
      return <Database className="w-4 h-4 text-blue-400" />
    default:
      return <Globe className="w-4 h-4" />
  }
}

function getDotColor(color: string) {
  if (color === "green") return "bg-emerald-500"
  if (color === "yellow") return "bg-amber-500"
  return "bg-red-500"
}

function getStatusTextColor(color: string) {
  if (color === "green") return "text-emerald-500"
  if (color === "yellow") return "text-amber-500"
  return "text-red-500"
}
export function IntegrationsStatus({ integrations }: Props) {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      {integrations.map((item) => (
        <Card
          key={item.platform}
          className="flex items-start justify-between p-4 bg-muted/30 border rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg border">
              {getIcon(item.platform)}
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-medium">
                {item.platform === "DATA"
                  ? "Data (UTM/SERVER)"
                  : item.platform}
              </p>

              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${getDotColor(
                    item.color
                  )}`}
                />
               <span
  className={`text-xs font-medium ${getStatusTextColor(item.color)}`}
>
  {item.status}
</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}