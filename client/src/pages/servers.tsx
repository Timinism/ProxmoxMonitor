import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Server as ServerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertServerSchema, type Server, type InsertServer } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/header";

const serverFormSchema = insertServerSchema.extend({});

export default function Servers() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<Server | null>(null);
  const [deletingServer, setDeletingServer] = useState<Server | null>(null);
  const { toast } = useToast();

  const { data: servers = [], isLoading } = useQuery({
    queryKey: ["/api/servers"],
  });

  const form = useForm<InsertServer>({
    resolver: zodResolver(serverFormSchema),
    defaultValues: {
      name: "",
      host: "",
      port: 8006,
      status: "online",
      cpuUsage: 0,
      memoryUsage: 0,
      uptime: 0,
    },
  });

  const createServerMutation = useMutation({
    mutationFn: (data: InsertServer) => apiRequest("/api/servers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/servers"] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Server Added",
        description: "The Proxmox server has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add server. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateServerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Server> }) =>
      apiRequest(`/api/servers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/servers"] });
      setEditingServer(null);
      form.reset();
      toast({
        title: "Server Updated",
        description: "The server has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update server. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteServerMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/servers/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/servers"] });
      setDeletingServer(null);
      toast({
        title: "Server Deleted",
        description: "The server has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete server. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertServer) => {
    if (editingServer) {
      updateServerMutation.mutate({ id: editingServer.id, data });
    } else {
      createServerMutation.mutate(data);
    }
  };

  const handleEdit = (server: Server) => {
    setEditingServer(server);
    form.reset({
      name: server.name,
      host: server.host,
      port: server.port,
      status: server.status,
      cpuUsage: server.cpuUsage,
      memoryUsage: server.memoryUsage,
      uptime: server.uptime,
    });
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingServer(null);
    form.reset();
  };

  const handleDelete = (server: Server) => {
    setDeletingServer(server);
  };

  const confirmDelete = () => {
    if (deletingServer) {
      deleteServerMutation.mutate(deletingServer.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "offline": return "bg-red-500";
      case "maintenance": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Proxmox Servers</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your Proxmox server connections
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen || !!editingServer} onOpenChange={handleCloseDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Server
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingServer ? "Edit Server" : "Add New Server"}
                </DialogTitle>
                <DialogDescription>
                  {editingServer 
                    ? "Update the server configuration below."
                    : "Add a new Proxmox server to monitor."
                  }
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Server Name</FormLabel>
                        <FormControl>
                          <Input placeholder="proxmox-01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="host"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Host/IP Address</FormLabel>
                        <FormControl>
                          <Input placeholder="192.168.1.100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Port</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="8006" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createServerMutation.isPending || updateServerMutation.isPending}
                    >
                      {editingServer ? "Update Server" : "Add Server"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server: Server) => (
            <Card key={server.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ServerIcon className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-lg">{server.name}</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(server)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(server)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(server.status)}`} />
                  <span>{server.host}:{server.port}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                    <Badge variant={server.status === 'online' ? 'default' : 'secondary'}>
                      {server.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">CPU Usage</span>
                    <span className="text-sm font-medium">{server.cpuUsage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Memory Usage</span>
                    <span className="text-sm font-medium">{server.memoryUsage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Uptime</span>
                    <span className="text-sm font-medium">{Math.floor(server.uptime / 86400)}d</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {servers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <ServerIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Servers Configured</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Add your first Proxmox server to start monitoring
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Server
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingServer} onOpenChange={() => setDeletingServer(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Server</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingServer?.name}"? This action cannot be undone and will remove all associated VMs and alerts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteServerMutation.isPending}
              >
                Delete Server
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}