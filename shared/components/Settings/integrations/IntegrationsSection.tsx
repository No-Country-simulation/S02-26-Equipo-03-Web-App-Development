import { Plus } from "lucide-react";
import IntegrationCard from "./IntegrationCard";
import IntegrationCardSkeleton from "./IntegrationCardSkeleton";
import { integrationsMock } from "./integration.mock";

interface IntegrationsSectionProps {
  isLoading?: boolean;
}

export default function IntegrationsSection({ isLoading = false }: IntegrationsSectionProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(240px,240px))] justify-center gap-6 sm:justify-start">
          {Array.from({ length: 4 }).map((_, index) => (
            <IntegrationCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(240px,240px))] justify-center gap-6 sm:justify-start">
        {integrationsMock.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}

        {/* Añadir integración */}
        <div className="flex w-60 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#E2E8F0] bg-white p-5 text-sm font-medium text-gray-400">
          <Plus className="h-5 w-5" />
          <span>Añadir integración</span>
        </div>
      </div>
    </div>
  );
}
