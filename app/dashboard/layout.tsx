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
        <div className="w-full bg-white">
          <HeaderDashboard />
          <div>{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
