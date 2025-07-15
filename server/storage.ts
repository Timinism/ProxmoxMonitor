import { 
  servers, 
  virtualMachines, 
  alerts, 
  storageInfo,
  type Server, 
  type InsertServer,
  type VirtualMachine,
  type InsertVM,
  type Alert,
  type InsertAlert,
  type StorageInfo,
  type InsertStorage
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Servers
  getServers(): Promise<Server[]>;
  getServer(id: number): Promise<Server | undefined>;
  createServer(server: InsertServer): Promise<Server>;
  updateServer(id: number, updates: Partial<Server>): Promise<Server | undefined>;
  deleteServer(id: number): Promise<boolean>;
  
  // Virtual Machines
  getVMs(): Promise<VirtualMachine[]>;
  getVMsByServer(serverId: number): Promise<VirtualMachine[]>;
  createVM(vm: InsertVM): Promise<VirtualMachine>;
  updateVM(id: number, updates: Partial<VirtualMachine>): Promise<VirtualMachine | undefined>;
  
  // Alerts
  getAlerts(): Promise<Alert[]>;
  getActiveAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  acknowledgeAlert(id: number): Promise<Alert | undefined>;
  
  // Storage
  getStorageInfo(): Promise<StorageInfo[]>;
  getStorageByServer(serverId: number): Promise<StorageInfo[]>;
  updateStorageInfo(serverId: number, storage: InsertStorage[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getServers(): Promise<Server[]> {
    return await db.select().from(servers);
  }

  async getServer(id: number): Promise<Server | undefined> {
    const [server] = await db.select().from(servers).where(eq(servers.id, id));
    return server || undefined;
  }

  async createServer(server: InsertServer): Promise<Server> {
    const [newServer] = await db
      .insert(servers)
      .values(server)
      .returning();
    return newServer;
  }

  async updateServer(id: number, updates: Partial<Server>): Promise<Server | undefined> {
    const [updated] = await db
      .update(servers)
      .set(updates)
      .where(eq(servers.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteServer(id: number): Promise<boolean> {
    const result = await db
      .delete(servers)
      .where(eq(servers.id, id));
    return result.rowCount > 0;
  }

  async getVMs(): Promise<VirtualMachine[]> {
    return await db.select().from(virtualMachines);
  }

  async getVMsByServer(serverId: number): Promise<VirtualMachine[]> {
    return await db.select().from(virtualMachines).where(eq(virtualMachines.serverId, serverId));
  }

  async createVM(vm: InsertVM): Promise<VirtualMachine> {
    const [newVM] = await db
      .insert(virtualMachines)
      .values(vm)
      .returning();
    return newVM;
  }

  async updateVM(id: number, updates: Partial<VirtualMachine>): Promise<VirtualMachine | undefined> {
    const [updated] = await db
      .update(virtualMachines)
      .set(updates)
      .where(eq(virtualMachines.id, id))
      .returning();
    return updated || undefined;
  }

  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(alerts.timestamp);
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).where(eq(alerts.acknowledged, false)).orderBy(alerts.timestamp);
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db
      .insert(alerts)
      .values(alert)
      .returning();
    return newAlert;
  }

  async acknowledgeAlert(id: number): Promise<Alert | undefined> {
    const [updated] = await db
      .update(alerts)
      .set({ acknowledged: true })
      .where(eq(alerts.id, id))
      .returning();
    return updated || undefined;
  }

  async getStorageInfo(): Promise<StorageInfo[]> {
    return await db.select().from(storageInfo);
  }

  async getStorageByServer(serverId: number): Promise<StorageInfo[]> {
    return await db.select().from(storageInfo).where(eq(storageInfo.serverId, serverId));
  }

  async updateStorageInfo(serverId: number, storageData: InsertStorage[]): Promise<void> {
    // Remove existing storage for this server
    await db.delete(storageInfo).where(eq(storageInfo.serverId, serverId));
    
    // Add new storage data
    if (storageData.length > 0) {
      await db.insert(storageInfo).values(storageData);
    }
  }
}

export const storage = new DatabaseStorage();