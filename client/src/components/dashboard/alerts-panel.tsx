import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import type { Alert } from "@shared/schema";

export function AlertsPanel() {
  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
    queryFn: () => fetch("/api/alerts?active=true").then(res => res.json()),
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-pulse">
          <div className="h-4 bg-red-200 dark:bg-red-800 rounded mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-red-200 dark:bg-red-800 rounded"></div>
            <div className="h-3 bg-red-200 dark:bg-red-800 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <section className="mb-8">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center">
            <AlertTriangle className="text-green-500 mr-2" size={16} />
            <h3 className="font-semibold text-green-800 dark:text-green-200">All Systems Normal</h3>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-2">
            No active alerts at this time.
          </p>
        </div>
      </section>
    );
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <section className="mb-8">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <div className="flex items-center mb-3">
          <AlertTriangle className="text-red-500 mr-2" size={16} />
          <h3 className="font-semibold text-red-800 dark:text-red-200">Active Alerts</h3>
          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {alerts.length}
          </span>
        </div>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between text-sm">
              <span className="text-red-700 dark:text-red-300">{alert.message}</span>
              <span className="text-red-600 dark:text-red-400">
                {formatTimeAgo(alert.timestamp!.toString())}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
