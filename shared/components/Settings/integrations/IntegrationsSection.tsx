import { Plus } from "lucide-react";
import IntegrationCard from "./IntegrationCard";
import { integrationsMock } from "./integration.mock";

export default function IntegrationsSection() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">Estado de las conexiones activas.</p>

      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {integrationsMock.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}

        {/* Añadir integración */}
        <button className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white p-5 text-sm font-medium text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-600">
          <Plus className="h-5 w-5" />
          <span>Añadir integración</span>
        </button>
      </div>
    </div>
  );
}