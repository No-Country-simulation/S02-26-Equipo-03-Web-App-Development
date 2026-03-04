import { Card } from "@/shared/components/ui/card"
import Image from "next/image"

type IntegrationStatusType = "ok" | "warning" | "error"

interface Props {
  integrations: {
    name: string
    status: IntegrationStatusType
  }[]
}

const integrationDotColor: Record<IntegrationStatusType, string> = {
    ok: "bg-green-500",
    warning: "bg-yellow-300",
    error: "bg-red-500",
};

const integrationLogos: Record<string, { src: string; alt: string }> = {
  stripe: { src: "/images/stripe.svg", alt: "Stripe" },
  meta: { src: "/images/meta.svg", alt: "Meta" },
  google: { src: "/images/google-ads.svg", alt: "Google Ads" },
}

function getIntegrationLogo(name: string) {
  const normalizedName = name.toLowerCase()

  if (normalizedName.includes("stripe")) return integrationLogos.stripe
  if (normalizedName.includes("meta")) return integrationLogos.meta
  if (normalizedName.includes("google")) return integrationLogos.google

  return null
}

export function IntegrationStatus({ integrations }: Props) {
  return (
    <div className="flex justify-between gap-4">
      {integrations.map((integration) => {
        const logo = getIntegrationLogo(integration.name)

        return (
          <Card
            key={integration.name}
            className="flex flex-row items-center p-4 rounded-lg shadow-none border border-[#E2E8F0]/50"
          >
            {logo ? (
              <Image
                src={logo.src}
                alt={logo.alt}
                width={0}
                height={36}
                sizes="100vw"
                className="h-9 w-auto"
                />
            ) : (
              <span className="w-9 h-9 rounded-md border flex items-center justify-center text-xs font-semibold uppercase">
                {integration.name.slice(0, 2)}
              </span>
            )}

            <span className="flex items-center gap-1.5 ml-8">
              <span
                className={`w-2 h-2 rounded-full ${integrationDotColor[integration.status]}`}
              />
              {integration.status === "ok" ? "Activo" : integration.status === "warning" ? "Estable" : "Alerta"}
            </span>
          </Card>
        )
      })}
    </div>
  )
}