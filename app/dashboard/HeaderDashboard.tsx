"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GenerateReports from "@/shared/components/Reports/GenerateReports";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Bell, ChevronDown, User, LogOut } from "lucide-react";
import { getSession, signOut } from "@/shared/lib/auth-client";
import { useSelectedProjectStore } from "@/shared/hooks/use-selected-project-store";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function HeaderDashboard() {
  const router = useRouter();
  const { setSelectedProjectId } = useSelectedProjectStore();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      const sessionResponse = await getSession();
      const currentUser = await sessionResponse.data;
      console.log(currentUser);

      setUser(currentUser ?? null);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    const result = await signOut();
    if (result.error) {
      setIsSigningOut(false);
      return;
    }
    setSelectedProjectId(null);
    router.push("/login");
  };

  const initials = getInitials(user?.name);

  return (
    <header className="w-full border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-2">
      <div className="flex h-16 items-center justify-between">
        {/* LEFT — estado del motor */}
        <div className="flex items-center gap-4">
          <span className="h-1 w-1 rounded-full bg-[#059669]" />
          <span className="font-mono text-sm font-semibold tracking-widest text-[#059669]">
            MOTOR DE ATRIBUCIÓN ACTIVO
          </span>
        </div>

        {/* RIGHT — controles */}
        <div className="flex items-center gap-3">
          {/* Rango de fechas */}

          {/* Exportar */}
          <GenerateReports />

          {/* Notificaciones */}
          <button className="relative rounded-full p-2 transition hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-500" />
          </button>

          {/* Usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-gray-100">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-emerald-200 text-xs font-bold text-emerald-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-black">{user?.name ?? "Usuario"}</p>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-3">
              {/* Cabecera con avatar y nombre */}
              <div className="mb-2 flex items-center gap-3 px-1 py-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-emerald-200 font-bold text-emerald-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm leading-tight font-semibold">{user?.name ?? "Usuario"}</p>
                  <p className="text-muted-foreground text-xs">Founder</p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="mt-1 cursor-pointer gap-2 rounded-lg">
                <User className="h-4 w-4 text-gray-500" />
                <span>Perfil de Usuario</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="mt-1 cursor-pointer gap-2 rounded-lg bg-red-500 text-white hover:bg-red-600 focus:bg-red-600 focus:text-white"
              >
                <LogOut className="h-4 w-4 text-white" />
                <span>{isSigningOut ? "Cerrando..." : "Cerrar Sesión"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
