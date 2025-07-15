import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dock, Box } from "lucide-react";
import type { VirtualMachine, Server } from "@shared/schema";

export function VMContainerList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServer, setSelectedServer] = useState<string>("all");

  const { data: vms, isLoading: vmsLoading } = useQuery<VirtualMachine[]>({
    queryKey: ["/api/vms"],
  });

  const { data: servers, isLoading: serversLoading } = useQuery<Server[]>({
    queryKey: ["/api/servers"],
  });

  if (vmsLoading || serversLoading) {
    return (
      <section className="mt-8">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const getServerName = (serverId: number) => {
    return servers?.find(s => s.id === serverId)?.name || "Unknown";
  };

  const filteredVMs = vms?.filter(vm => {
    const matchesSearch = vm.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesServer = selectedServer === "all" || vm.serverId.toString() === selectedServer;
    return matchesSearch && matchesServer;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "stopped":
        return "bg-red-500";
      default:
        return "bg-slate-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "running":
        return "Running";
      case "warning":
        return "Warning";
      case "stopped":
        return "Stopped";
      default:
        return "Unknown";
    }
  };

  return (
    <section className="mt-8">
      <Card>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Virtual Machines & Containers</h3>
            <div className="flex items-center space-x-3">
              <Input
                type="text"
                placeholder="Search VMs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48"
              />
              <Select value={selectedServer} onValueChange={setSelectedServer}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Servers</SelectItem>
                  {servers?.map((server) => (
                    <SelectItem key={server.id} value={server.id.toString()}>
                      {server.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  CPU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Memory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Server
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Uptime
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredVMs.map((vm) => (
                <tr 
                  key={vm.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {vm.type === "vm" ? (
                        <Dock className="text-blue-500 mr-3" size={16} />
                      ) : (
                        <Box className="text-purple-500 mr-3" size={16} />
                      )}
                      <span className="font-medium">{vm.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        vm.type === "vm" 
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                          : "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                      }`}
                    >
                      {vm.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 ${getStatusColor(vm.status)} rounded-full mr-2`}></div>
                      <span className="text-sm">{getStatusText(vm.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {vm.status === "stopped" ? "--" : `${vm.cpuUsage}%`}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {vm.status === "stopped" 
                      ? "--" 
                      : `${vm.memoryUsage} GB / ${vm.memoryTotal} GB`
                    }
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {getServerName(vm.serverId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {vm.status === "stopped" ? "Offline" : vm.uptime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>Showing {filteredVMs.length} of {vms?.length || 0} results</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
