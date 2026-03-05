"use client";

import { UsersRolesTable } from "./UsersRolesTable";
import { useSelectedProjectStore } from "@/shared/hooks/use-selected-project-store";
import { useEffect, useState } from "react";
import { useRef } from "react";

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
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <UsersRolesTable usersroles={members} loading={loading} />
    </div>
  );
}
