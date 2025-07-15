import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertServerSchema, insertVMSchema, insertAlertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Servers
  app.get("/api/servers", async (req, res) => {
    try {
      const servers = await storage.getServers();
      res.json(servers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch servers" });
    }
  });

  app.get("/api/servers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const server = await storage.getServer(id);
      if (!server) {
        return res.status(404).json({ message: "Server not found" });
      }
      res.json(server);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch server" });
    }
  });

  app.post("/api/servers", async (req, res) => {
    try {
      const validatedData = insertServerSchema.parse(req.body);
      const server = await storage.createServer(validatedData);
      res.status(201).json(server);
    } catch (error) {
      res.status(400).json({ message: "Invalid server data" });
    }
  });

  app.patch("/api/servers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const server = await storage.updateServer(id, req.body);
      if (!server) {
        return res.status(404).json({ message: "Server not found" });
      }
      res.json(server);
    } catch (error) {
      res.status(500).json({ message: "Failed to update server" });
    }
  });

  app.delete("/api/servers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteServer(id);
      if (!deleted) {
        return res.status(404).json({ message: "Server not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete server" });
    }
  });

  // Virtual Machines
  app.get("/api/vms", async (req, res) => {
    try {
      const serverId = req.query.serverId ? parseInt(req.query.serverId as string) : undefined;
      const vms = serverId 
        ? await storage.getVMsByServer(serverId)
        : await storage.getVMs();
      res.json(vms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch VMs" });
    }
  });

  app.post("/api/vms", async (req, res) => {
    try {
      const validatedData = insertVMSchema.parse(req.body);
      const vm = await storage.createVM(validatedData);
      res.status(201).json(vm);
    } catch (error) {
      res.status(400).json({ message: "Invalid VM data" });
    }
  });

  app.patch("/api/vms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vm = await storage.updateVM(id, req.body);
      if (!vm) {
        return res.status(404).json({ message: "VM not found" });
      }
      res.json(vm);
    } catch (error) {
      res.status(500).json({ message: "Failed to update VM" });
    }
  });

  // Alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const active = req.query.active === 'true';
      const alerts = active 
        ? await storage.getActiveAlerts()
        : await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ message: "Invalid alert data" });
    }
  });

  app.patch("/api/alerts/:id/acknowledge", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const alert = await storage.acknowledgeAlert(id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to acknowledge alert" });
    }
  });

  // Storage
  app.get("/api/storage", async (req, res) => {
    try {
      const serverId = req.query.serverId ? parseInt(req.query.serverId as string) : undefined;
      const storage_info = serverId 
        ? await storage.getStorageByServer(serverId)
        : await storage.getStorageInfo();
      res.json(storage_info);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch storage info" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const servers = await storage.getServers();
      const vms = await storage.getVMs();
      const alerts = await storage.getActiveAlerts();
      
      const onlineServers = servers.filter(s => s.status === 'online').length;
      const totalVMs = vms.filter(vm => vm.type === 'vm').length;
      const totalLXC = vms.filter(vm => vm.type === 'lxc').length;
      
      const avgCPU = servers.length > 0 
        ? servers.reduce((sum, s) => sum + (s.cpuUsage || 0), 0) / servers.length 
        : 0;
      const avgMemory = servers.length > 0
        ? servers.reduce((sum, s) => sum + (s.memoryUsage || 0), 0) / servers.length
        : 0;

      res.json({
        totalServers: servers.length,
        onlineServers,
        totalVMs,
        totalLXC,
        avgCPU: Math.round(avgCPU * 10) / 10,
        avgMemory: Math.round(avgMemory * 10) / 10,
        activeAlerts: alerts.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
