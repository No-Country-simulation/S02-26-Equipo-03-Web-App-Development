"use client";
import Sidebard from "@/app/dashboard/Sidebard";
import HeaderDashboard from "@/app/dashboard/HeaderDashboard";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { getSession } from "@/shared/lib/auth-client";
import { useSelectedProjectStore } from "@/shared/hooks/use-selected-project-store";
import { useEffect } from "react";

export default function DashboardPage({ children }: { children: React.ReactNode }) {
  const { setSelectedProjectId } = useSelectedProjectStore();
  const route = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const sessionResponse = await getSession().catch(() => null);

      if (!sessionResponse) {
        route.push("/login");
      }
    };

    const fetchProjects = async () => {
      const res = await fetch("/api/v1/projects", { credentials: "include" });
      const data = await res.json();

      if (data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
    };

    getUser();
    fetchProjects();
  }, [route, setSelectedProjectId]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <div>
          <Sidebard />
        </div>
        <div className="flex w-full flex-col overflow-hidden bg-[#F8FAFC]">
          <HeaderDashboard />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
