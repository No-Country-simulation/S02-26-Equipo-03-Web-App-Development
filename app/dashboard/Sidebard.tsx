"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ShoppingBag, BarChart3, Activity, FileText, Settings } from "lucide-react";
import { GardenAdsLogo } from "@/shared/components/Logo/Logo";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@shared/components/ui/sidebar";

const items = [
  { title: "Home", icon: Home, url: "/dashboard" },
  { title: "Órdenes", icon: ShoppingBag, url: "/dashboard/order" },
  { title: "Campañas", icon: BarChart3, url: "/dashboard/campaign" },
  { title: "Tracking Health", icon: Activity, url: "/dashboard/tracking" },
  { title: "Reportes", icon: FileText, url: "/dashboard/report" },
];

export default function SidebarDashboard() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r" collapsible="none">
      <SidebarContent>
        {/* LOGO */}
        <div className="flex items-center px-4 py-6">
          <GardenAdsLogo width={140} height={50} />
        </div>

        {/* CORE DASHBOARD */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs font-bold tracking-widest">
            CORE DASHBOARD
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`relative flex items-center justify-between px-4 py-6 transition-all duration-200 ${
                          isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
                        } `}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="active-pill"
                            className="absolute inset-0 rounded-xl bg-emerald-500"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}

                        <div className="relative flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{item.title}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* CONFIGURACIÓN */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-muted-foreground text-xs tracking-widest">
            CONFIGURACIÓN
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/dashboard/settings"
                    className="relative flex items-center gap-3 rounded-xl px-4 py-6 transition-all duration-200"
                  >
                    {/* Fondo activo */}
                    {pathname === "/dashboard/settings" && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 rounded-xl bg-emerald-500"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Contenedor del texto y icono con z-10 */}
                    <div className="relative z-10 flex items-center gap-3">
                      <Settings
                        className={`h-4 w-4 ${
                          pathname === "/dashboard/settings"
                            ? "text-white"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          pathname === "/dashboard/settings"
                            ? "text-white"
                            : "text-muted-foreground"
                        }`}
                      >
                        Ajustes
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
