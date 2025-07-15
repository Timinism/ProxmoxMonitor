import { DashboardHeader } from "@/components/dashboard/header";
import { ServerOverview } from "@/components/dashboard/server-overview";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { ResourceCharts } from "@/components/dashboard/resource-charts";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { VMContainerList } from "@/components/dashboard/vm-container-list";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <ServerOverview />
        <AlertsPanel />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ResourceCharts />
          <QuickStats />
        </div>
        
        <VMContainerList />
      </main>
    </div>
  );
}
