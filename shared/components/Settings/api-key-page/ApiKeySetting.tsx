"use client";

import { useSelectedProjectStore } from "@/shared/hooks/use-selected-project-store";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { ApiKeyTable } from "./ApiKeyTable";
import { ActiveKey, DataKey } from "./api-key.type";

export function ApiKeySetting() {
  const selectedProjectId = useSelectedProjectStore((state) => state.selectedProjectId);
  const [keys, setKeys] = useState<DataKey[]>([]);
  const [loading, setLoading] = useState(false);
  const prevProjectIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedProjectId || prevProjectIdRef.current === selectedProjectId) return;
    setLoading(true);
    (async () => {
      const res = await fetch(`/api/v1/projects/${selectedProjectId}/api-keys`, {
        credentials: "include",
      });
      const data = await res.json();
      setKeys(data);
      setLoading(false);
      prevProjectIdRef.current = selectedProjectId;
    })();
  }, [selectedProjectId]);
  /* type ActiveKey = {
  id: string;
  name: string;
  key: string;
  permissions: Permission;
  createdAt: string;
  lastUsedAt: string;

  const responseKey: ActiveKey[] = keys.map((key) => ({
    id: key.id,
    name: key.name,
    key: key.key,
    permissions: key.permissions,
    createdAt: key.createdAt,
    lastUsedAt: key.lastUsedAt,
  }));
}; */
  const responseKey: ActiveKey[] =
    !loading && keys.length > 0
      ? [
          {
            id: keys[0].id,
            name: "Integración Producción",
            key: selectedProjectId ? `${selectedProjectId} ` : "abc123",
            permissions: "admin",
            createdAt: keys[0].createdAt,
            lastUsedAt: "Hace 5 min",
          },
        ]
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto space-y-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-[#020617]">API Keys Activas</h2>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <ApiKeyTable activeKeys={responseKey} loading={loading} />
        </div>
        {/* <NotificationSection
          title="In-App Notifications"
          items={INAPP_NOTIFICATIONS}
          settings={settings}
          onChange={handleChange}
        /> */}
      </div>
    </div>
  );
}
