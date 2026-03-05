import SettingsTabs from "./SettingsTabs";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#020617]">Configuración</h1>
        <p className="mt-2 mb-3 font-medium text-[#475569]">
          Administra integraciones, usuarios y ajustes del sistema.
        </p>
      </div>

      <SettingsTabs />

      {children}
    </div>
  );
}
