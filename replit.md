# Proxmox Monitor Dashboard

## Overview

This is a full-stack web application for monitoring Proxmox virtualization infrastructure. It provides a comprehensive dashboard to track server status, virtual machines, containers, alerts, and resource usage across multiple Proxmox servers.

## Recent Changes

- **2025-01-15**: Added configurable server management interface
- **2025-01-15**: Users can now add, edit, and delete Proxmox servers dynamically
- **2025-01-15**: Added navigation between Dashboard and Servers pages
- **2025-01-15**: Implemented complete CRUD operations for server management
- **2025-01-14**: Successfully migrated from in-memory storage to PostgreSQL database
- **2025-01-14**: User confirmed database integration is working correctly
- **2025-01-14**: Initial dark mode dashboard implementation completed and approved
- **2025-01-14**: Added Docker containerization with docker-compose deployment

## User Preferences

Preferred communication style: Simple, everyday language.
Default theme preference: Dark mode (user confirmed satisfaction with dark theme)

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Comprehensive set of accessible components using Radix UI primitives

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (Neon Database) - migrated from in-memory storage (2025-01-14)
- **Validation**: Zod schemas for request/response validation

### Key Components

#### Database Schema
- **Servers Table**: Stores Proxmox server information including host, status, resource usage
- **Virtual Machines Table**: Tracks VMs and LXC containers with performance metrics
- **Alerts Table**: Manages system alerts and notifications
- **Storage Info Table**: Monitors storage usage across servers

#### API Endpoints
- `/api/servers` - Full CRUD operations for Proxmox servers (GET, POST, PATCH, DELETE)
- `/api/vms` - Virtual machine and container management
- `/api/alerts` - Alert management and acknowledgment
- `/api/storage` - Storage information retrieval
- `/api/dashboard/stats` - Aggregated dashboard statistics

#### UI Components
- **Dashboard Layout**: Responsive grid-based layout with theme support
- **Navigation Header**: Multi-page navigation with Dashboard and Servers sections
- **Server Management**: Full CRUD interface for adding/editing/deleting Proxmox servers
- **Server Overview**: Real-time server status cards with resource indicators
- **Alerts Panel**: Active alert notifications with priority levels
- **Resource Charts**: Placeholder for time-series data visualization
- **VM/Container List**: Filterable table of virtual machines and containers
- **Quick Stats**: Summary statistics and key performance indicators

## Data Flow

1. **Client Requests**: React components use TanStack Query to fetch data from REST endpoints
2. **API Processing**: Express routes validate requests using Zod schemas
3. **Database Operations**: Drizzle ORM handles database queries with type safety
4. **Response Handling**: Data flows back through the same chain with proper error handling
5. **UI Updates**: React Query manages caching and automatic refetching

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL) via `@neondatabase/serverless`
- **UI Library**: Radix UI components for accessibility
- **Styling**: Tailwind CSS for utility-first styling
- **Development**: Replit-specific plugins for development environment

### Development Tools
- **Database Migrations**: Drizzle Kit for schema management
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Hot Reload**: Vite HMR for fast development cycles

## Deployment Strategy

### Docker Containerization
- **Dockerfile**: Multi-stage build with Node.js 20 Alpine
- **docker-compose.yml**: Orchestrates app and PostgreSQL database
- **Database**: PostgreSQL 15 with persistent volumes and health checks
- **Networking**: Isolated bridge network for security
- **Initialization**: Automatic database schema and sample data setup

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle push for schema deployment
4. **Container**: Docker builds production-ready container

### Environment Configuration
- **Development**: Uses Vite dev server with Express API proxy
- **Production**: Serves static files from Express with API routes
- **Docker**: Self-contained with PostgreSQL database
- **Database**: `DATABASE_URL` configured for container networking

### Folder Structure
```
├── client/          # React frontend application
├── server/          # Express backend API
├── shared/          # Shared TypeScript types and schemas
├── migrations/      # Database migration files
└── dist/           # Build output directory
```

The application follows a monorepo structure with clear separation between frontend, backend, and shared code, enabling efficient development and deployment workflows.