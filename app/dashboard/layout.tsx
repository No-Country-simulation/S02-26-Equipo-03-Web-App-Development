import Sidebard from "@/app/dashboard/Sidebard";
import HeaderDashboard from "@/app/dashboard/HeaderDashboard";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/shared/lib/getCurrentUser";

export default async function DashboardPage({ children }: { children: React.ReactNode }) {
  await getCurrentUser().catch(() => {
    redirect("/login");
  });

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <div>
          <Sidebard />
        </div>
        <div className="flex w-full flex-col overflow-hidden bg-white">
          <HeaderDashboard />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
