"use client";

import { UsersRolesTable } from "./UsersRolesTable";
import { useSelectedProjectStore } from "@/shared/hooks/use-selected-project-store";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";

export function UsersRolesSection() {
  const selectedProjectId = useSelectedProjectStore((state) => state.selectedProjectId);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const prevProjectIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedProjectId || prevProjectIdRef.current === selectedProjectId) return;
    setLoading(true);
    (async () => {
      const res = await fetch(`/api/v1/projects/${selectedProjectId}/members`, {
        credentials: "include",
      });
      const data = await res.json();
      setMembers(data);
      setLoading(false);
      prevProjectIdRef.current = selectedProjectId;
    })();
  }, [selectedProjectId]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#020617]">Usuarios y Roles</h2>
          <p className="pt-2 text-sm font-medium text-[#475569]">
            Gestioná quién tiene acceso a la plataforma. Límite: 5 usuarios.
          </p>
        </div>
        <Button
          size={"lg"}
          className="rounded-md border-none bg-[#059669] py-6 text-white hover:bg-[#047857]"
        >
          <Plus className="mr-2 h-6 w-6" />
          Invitar Miembros
        </Button>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <UsersRolesTable usersroles={members} loading={loading} />
      </div>
    </>
  );
}
