"use client";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { Calendar, Bell, X } from "lucide-react";
import GenerateReports from "@/shared/components/Reports/GenerateReports";

export default function HeaderDashboard() {
  return (
    <header className="w-full gap-2 border-b px-6">
      <div className="flex h-16 items-center justify-between px-6">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="rounded-md border bg-white px-3 py-1 text-xs font-medium shadow-sm">
            <p className="font-bold text-black">MOTOR DE ATRIBUCIÓN ACTIVO</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select defaultValue="30">
            <SelectTrigger className="w-50 rounded-xl bg-white font-bold text-black">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <SelectValue placeholder="Últimos 30 días" className="" />
              </div>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="7">Últimos 7 días</SelectItem>
              <SelectItem value="30">Últimos 30 días</SelectItem>
              <SelectItem value="90">Últimos 90 días</SelectItem>
            </SelectContent>
          </Select>

          {/* Exportar */}
          <GenerateReports />

          {/* Notificaciones */}
          <div className="relative">
            <Bell className="text-muted-foreground hover:text-foreground h-5 w-5 cursor-pointer transition-colors" />
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
            >
              1
            </Badge>
          </div>

          {/* Cerrar */}
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
