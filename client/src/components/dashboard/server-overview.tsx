import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Server } from "@shared/schema";

export function ServerOverview() {
  const { data: servers, isLoading } = useQuery<Server[]>({
    queryKey: ["/api/servers"],
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Server Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="space-y-4">
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-slate-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "warning":
        return "Warning";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">Server Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers?.map((server) => (
          <Card 
            key={server.id} 
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{server.name}</h3>
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${getStatusColor(server.status)} rounded-full mr-2`}></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {getStatusText(server.status)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">CPU Usage</p>
                  <div className="flex items-center">
                    <div className="flex-1 mr-3">
                      <Progress 
                        value={server.cpuUsage || 0} 
                        className="h-2"
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {server.status === "offline" ? "--" : `${server.cpuUsage}%`}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Memory</p>
                  <div className="flex items-center">
                    <div className="flex-1 mr-3">
                      <Progress 
                        value={server.memoryUsage || 0} 
                        className="h-2"
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {server.status === "offline" ? "--" : `${server.memoryUsage}%`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Uptime</p>
                  <p className="font-medium">
                    {server.status === "offline" ? "Offline" : server.uptime}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">VMs/LXC</p>
                  <p className="font-medium">
                    {server.status === "offline" ? "-- / --" : `${server.vmCount} / ${server.lxcCount}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
