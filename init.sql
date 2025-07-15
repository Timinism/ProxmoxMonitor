-- Create tables for Proxmox Monitor Dashboard
CREATE TABLE IF NOT EXISTS servers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    host TEXT NOT NULL,
    port INTEGER DEFAULT 8006,
    username TEXT NOT NULL,
    status TEXT NOT NULL,
    cpu_usage REAL DEFAULT 0,
    memory_usage REAL DEFAULT 0,
    memory_total REAL DEFAULT 0,
    uptime TEXT,
    vm_count INTEGER DEFAULT 0,
    lxc_count INTEGER DEFAULT 0,
    last_seen TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS virtual_machines (
    id SERIAL PRIMARY KEY,
    server_id INTEGER NOT NULL,
    vmid INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    cpu_usage REAL DEFAULT 0,
    memory_usage REAL DEFAULT 0,
    memory_total REAL DEFAULT 0,
    uptime TEXT,
    node TEXT
);

CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    server_id INTEGER,
    vm_id INTEGER,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    acknowledged BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS storage_info (
    id SERIAL PRIMARY KEY,
    server_id INTEGER NOT NULL,
    storage TEXT NOT NULL,
    used REAL NOT NULL,
    total REAL NOT NULL,
    type TEXT NOT NULL
);

-- Insert sample data
INSERT INTO servers (name, host, port, username, status, cpu_usage, memory_usage, memory_total, uptime, vm_count, lxc_count, last_seen) VALUES
('proxmox-01', '192.168.1.100', 8006, 'admin', 'online', 45.0, 67.0, 32768.0, '15d 4h 32m', 12, 8, NOW()),
('proxmox-02', '192.168.1.101', 8006, 'admin', 'warning', 78.0, 89.0, 65536.0, '22d 16h 45m', 18, 6, NOW()),
('proxmox-03', '192.168.1.102', 8006, 'admin', 'offline', 0.0, 0.0, 32768.0, NULL, 0, 0, NOW() - INTERVAL '5 minutes');

INSERT INTO virtual_machines (server_id, vmid, name, type, status, cpu_usage, memory_usage, memory_total, uptime, node) VALUES
(1, 100, 'web-server-01', 'vm', 'running', 45.0, 2.1, 4.0, '5d 12h 30m', 'proxmox-01'),
(1, 101, 'docker-host', 'lxc', 'running', 23.0, 1.8, 8.0, '12d 8h 15m', 'proxmox-01'),
(2, 200, 'database-server', 'vm', 'warning', 78.0, 6.8, 8.0, '3d 22h 45m', 'proxmox-02'),
(3, 300, 'monitoring-stack', 'lxc', 'stopped', 0.0, 0.0, 4.0, NULL, 'proxmox-03');

INSERT INTO alerts (server_id, vm_id, type, message, timestamp, acknowledged) VALUES
(2, NULL, 'warning', 'proxmox-02: High memory usage (89%)', NOW() - INTERVAL '2 minutes', false),
(3, NULL, 'critical', 'proxmox-03: Server unreachable', NOW() - INTERVAL '5 minutes', false);

INSERT INTO storage_info (server_id, storage, used, total, type) VALUES
(1, 'local', 245.0, 500.0, 'dir'),
(1, 'local-lvm', 1200.0, 2000.0, 'lvm'),
(1, 'backup', 850.0, 1000.0, 'dir');