import Sidebard from "@/app/dashboard/Sidebard";
import HeaderDashboard from "@/app/dashboard/HeaderDashboard";
import { SidebarProvider } from "@/shared/components/ui/sidebar";

export default function DashboardPage({ children }: { children: React.ReactNode }) {
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
