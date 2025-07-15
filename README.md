# Proxmox Monitor Dashboard

A dark mode web-based monitoring dashboard for Proxmox servers with PostgreSQL backend and real-time system metrics visualization.

## Features

- 🌙 **Dark Mode Interface** - Professional dark theme with light mode toggle
- 📊 **Real-time Monitoring** - Live CPU, memory, and storage usage tracking
- 🚨 **Alert System** - Critical and warning alerts with timestamp tracking
- 💾 **PostgreSQL Database** - Persistent data storage with full CRUD operations
- 🖥️ **Server Overview** - Comprehensive server status and resource monitoring
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔍 **VM/Container Management** - Search and filter virtual machines and containers

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS with shadcn/ui components
- TanStack Query for state management
- Wouter for routing
- Vite for development and build

### Backend
- Node.js with Express.js
- TypeScript with ES modules
- Drizzle ORM for database operations
- PostgreSQL database
- Zod for validation

## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- At least 2GB of available RAM

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/Timinism/ProxmoxMonitor.git
cd ProxmoxMonitor
```

2. Start the application:
```bash
docker compose up -d
```

3. Access the dashboard:
- Dashboard: http://localhost:5000
- Database: localhost:5432 (postgres/postgres)

### Configuration

The `docker-compose.yml` includes:
- **Web Application**: Runs on port 5000
- **PostgreSQL Database**: Runs on port 5432 with persistent storage
- **Sample Data**: Automatically loads demo Proxmox servers and VMs

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | production | Application environment |
| `DATABASE_URL` | postgresql://postgres:postgres@db:5432/proxmox_monitor | Database connection string |

### Data Persistence

The PostgreSQL data is persisted in a Docker volume named `postgres_data`. To reset the data:

```bash
docker compose down -v
docker compose up -d
```

### Development

For local development without Docker:

```bash
npm install
npm run dev
```

## Database Schema

The application includes four main tables:
- **servers** - Proxmox server information and status
- **virtual_machines** - VM and LXC container data
- **alerts** - System alerts and notifications
- **storage_info** - Storage usage across servers

## API Endpoints

- `GET /api/servers` - List all servers
- `GET /api/vms` - List all VMs/containers
- `GET /api/alerts` - List all alerts
- `GET /api/storage` - List storage information
- `GET /api/dashboard/stats` - Dashboard statistics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details