"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Button } from "../ui/button";

const tabs = [
  { label: "Integraciones", href: "/dashboard/settings/integrations" },
  { label: "Instalación", href: "/dashboard/settings/installation" },
  { label: "Usuarios y Roles", href: "/dashboard/settings/users-roles" },
  { label: "Notificaciones", href: "/dashboard/settings/notifications" },
  { label: "API Keys", href: "/dashboard/settings/api-keys" },
  { label: "Organización", href: "/dashboard/settings/organization" },
];

export default function SettingsTabs() {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto">
      <nav className="flex min-w-max gap-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Button
              key={tab.href}
              asChild
              variant="ghost"
              className={cn(
                "h-9 px-3 text-sm font-medium uppercase",
                isActive
                  ? "bg-[#CBD5E1] text-black hover:bg-[#CBD5E1]/70"
                  : "bg-transparent text-[#475569] hover:text-gray-700"
              )}
            >
              <Link href={tab.href} prefetch scroll={false}>
                {tab.label}
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
