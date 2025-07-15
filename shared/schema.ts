import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const servers = pgTable("servers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  host: text("host").notNull(),
  port: integer("port").default(8006),
  username: text("username").notNull(),
  status: text("status").notNull(), // online, warning, offline
  cpuUsage: real("cpu_usage").default(0),
  memoryUsage: real("memory_usage").default(0),
  memoryTotal: real("memory_total").default(0),
  uptime: text("uptime"),
  vmCount: integer("vm_count").default(0),
  lxcCount: integer("lxc_count").default(0),
  lastSeen: timestamp("last_seen").defaultNow(),
});

export const virtualMachines = pgTable("virtual_machines", {
  id: serial("id").primaryKey(),
  serverId: integer("server_id").notNull(),
  vmid: integer("vmid").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // vm, lxc
  status: text("status").notNull(), // running, stopped, warning
  cpuUsage: real("cpu_usage").default(0),
  memoryUsage: real("memory_usage").default(0),
  memoryTotal: real("memory_total").default(0),
  uptime: text("uptime"),
  node: text("node"),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  serverId: integer("server_id"),
  vmId: integer("vm_id"),
  type: text("type").notNull(), // warning, critical, info
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  acknowledged: boolean("acknowledged").default(false),
});

export const storageInfo = pgTable("storage_info", {
  id: serial("id").primaryKey(),
  serverId: integer("server_id").notNull(),
  storage: text("storage").notNull(),
  used: real("used").notNull(),
  total: real("total").notNull(),
  type: text("type").notNull(),
});

export const insertServerSchema = createInsertSchema(servers).omit({
  id: true,
  lastSeen: true,
});

export const insertVMSchema = createInsertSchema(virtualMachines).omit({
  id: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  timestamp: true,
});

export const insertStorageSchema = createInsertSchema(storageInfo).omit({
  id: true,
});

export type Server = typeof servers.$inferSelect;
export type InsertServer = z.infer<typeof insertServerSchema>;
export type VirtualMachine = typeof virtualMachines.$inferSelect;
export type InsertVM = z.infer<typeof insertVMSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type StorageInfo = typeof storageInfo.$inferSelect;
export type InsertStorage = z.infer<typeof insertStorageSchema>;
