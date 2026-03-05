"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { label: "Integraciones", href: "/dashboard/settings/integrations" },
  { label: "Instalación", href: "/dashboard/settings/installation" },
  { label: "Usuarios y Roles", href: "/dashboard/settings/users-roles" },
  { label: "Notificaciones", href: "/dashboard/settings/notifications" },
  { label: "API Keys", href: "/dashboard/settings/api-keys" },
  { label: "Organización", href: "/dashboard/settings/organization" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col p-6 gap-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500 mt-1">
          Administra integraciones, usuarios y ajustes del sistema.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-6 min-w-max">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "pb-3 text-sm font-medium transition-colors relative",
                  isActive ? "text-black" : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab.label}
                {/* Indicador animado */}
                {isActive && (
                  <motion.div
                    layoutId="settings-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Contenido con animación */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}