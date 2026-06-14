# Travel Planner

A full-stack travel planning platform built using a **microservices architecture** powered by **Azure Service Fabric**.

The application allows users to create travel plans, manage destinations and activities, track expenses, organize packing checklists, share journeys with other users, and export plans as PDF documents.

---

# Technologies

## Backend

- ASP.NET Core Web API
- Azure Service Fabric
- Service Remoting
- Entity Framework Core
- SQL Server
- FluentValidation
- JWT Authentication

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

---

# Features

### User Management

- User registration
- User login
- JWT authentication
- Role-based authorization
- Admin dashboard

### Travel Planning

- Create travel plans
- Edit travel plans
- Delete travel plans
- Manage destinations
- Manage activities
- Travel plan notes

### Finance Management

- Planned budget tracking
- Expense tracking
- Expense categories
- Budget summary

### Checklist Management

- Packing list creation
- Mark items as completed
- Remove checklist items

### Sharing

- Share travel plans using secure links and QR code
- View-only access
- Edit access (requires login)
- Email notifications via MailingService 

### PDF Export

- Export complete travel plans to PDF

---

## System Architecture

The project leverages the **Microservices** architectural style, where each service is decoupled and manages its own state and data.

<img width="1491" height="890" alt="Arhitektura sistema" src="https://github.com/user-attachments/assets/384d8e1a-1d13-4d48-a857-037ed557b260" />

---

### Services

#### Web_Api

Stateless API Gateway responsible for:

- Authentication
- Request routing
- Communication with backend services

#### UserService

Responsible for:

- Registration
- Authentication
- User management
- Role management

#### TravelPlanService

Responsible for:

- Travel plans
- Destinations
- Activities
- Shared travel plans

#### FinanceService

Responsible for:

- Budget tracking
- Expense management
- Financial summaries

#### ChecklistService

Responsible for:

- Packing lists
- Checklist item completion

#### MailingService

Responsible for:

- Sending share invitation emails
- Email notifications with plan share links
  
---

## Use Case Analysis

The following diagram illustrates the primary actors and their interactions within the system, showcasing the core business logic.

<img width="631" height="981" alt="Use case" src="https://github.com/user-attachments/assets/903150ef-065d-4c4a-868a-059451c8d497" />

### Key Functionalities:
1.  **Identity Management:** Secure registration and login processes.
2.  **Itinerary Management:** Users can plan trips, add locations, and organize schedules.
3.  **Financial Tracking:** Integrated expense management for every travel plan.

---

# Environment Variables

Create a `.env` file inside the frontend project.

Example:

```env
VITE_API_BASE_URL=/api
VITE_FRONTEND_URL=https://your-ngrok-domain.ngrok-free.app
```

The frontend communicates with the backend through the Vite proxy.

---

# Vite Configuration

Example `vite.config.ts`:

```ts
server: {
    allowedHosts: [
        "your-ngrok-domain.ngrok-free.app"
    ],
    proxy: {
        "/api": {
            target: "http://localhost:9062",
            changeOrigin: true,
            secure: false,
        },
    },
}
```

---

# Travel Plan Sharing (ngrok)

To allow external users to access shared travel plans, expose the frontend using ngrok.

Start frontend:

```bash
npm run dev
```

Expose frontend:

```bash
ngrok http 5173
```

Copy the generated URL:

```text
https://your-ngrok-domain.ngrok-free.app
```

Add it to:

```ts
allowedHosts
```

inside:

```ts
vite.config.ts
```

Because the frontend uses:

```env
VITE_API_BASE_URL=/api
```

all API requests are automatically proxied to:

```text
http://localhost:9062
```

No separate backend ngrok tunnel is required.

---

# Running the Application

## Prerequisites

- Visual Studio 2022
- .NET 8 SDK
- Azure Service Fabric SDK
- Local Service Fabric Cluster (must be running before F5)
- SQL Server (localhost, port 1434)
- Node.js 18+
- npm

---

## Backend

Start the local Service Fabric cluster.

Open:

```text
TravelPlanner.sln
```

Press:

```text
F5
```

The API Gateway becomes available at:

```text
http://localhost:9062/swagger
```

---

## Frontend

Install dependencies:

```bash
npm install
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Database Configuration

Update connection strings in:

```text
PackageRoot/Config/Settings.xml
```

for each Service Fabric service.

## Database Migrations

Run migrations for each service using Package Manager Console in Visual Studio.

Select the target project, then run:

```bash
Add-Migration InitialCreate -Context UserDbContext -Project UserService
Update-Database -Context UserDbContext -Project UserService
```

Repeat for each service:
- `FinanceDbContext` → `FinanceService`
- `TravelDbContext` → `TravelPlanService`
- `ChecklistDbContext` → `ChecklistService`

---

# Authors

Developed as a university project demonstrating:

- Microservices Architecture
- Azure Service Fabric
- Distributed Systems
- Modern React Frontend Development
- Secure Authentication and Authorization
