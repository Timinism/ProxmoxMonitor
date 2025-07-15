import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { StorageInfo } from "@shared/schema";

interface DashboardStats {
  totalServers: number;
  onlineServers: number;
  totalVMs: number;
  totalLXC: number;
  avgCPU: number;
  avgMemory: number;
  activeAlerts: number;
}

export function QuickStats() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: storage, isLoading: storageLoading } = useQuery<StorageInfo[]>({
    queryKey: ["/api/storage"],
  });

  if (statsLoading || storageLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Total Servers</span>
              <span className="font-semibold">{stats?.totalServers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Online</span>
              <span className="font-semibold text-green-600">{stats?.onlineServers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Total VMs</span>
              <span className="font-semibold">{stats?.totalVMs || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Total LXC</span>
              <span className="font-semibold">{stats?.totalLXC || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Avg CPU</span>
              <span className="font-semibold">{stats?.avgCPU || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">Avg Memory</span>
              <span className="font-semibold">{stats?.avgMemory || 0}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Storage Usage</h3>
          <div className="space-y-3">
            {storage?.map((s) => {
              const percentage = (s.used / s.total) * 100;
              return (
                <div key={s.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{s.storage}</span>
                    <span>{s.used} GB / {s.total} GB</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
