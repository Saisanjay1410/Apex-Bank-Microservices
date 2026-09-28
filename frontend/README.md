# Apex Bank | Microservices Enterprise React Frontend

A production-grade, high-performance Vite + React + TypeScript frontend engineered to communicate seamlessly with a distributed **Spring Boot Microservices Cluster**.

---

## Architecture Overview

```
                      +------------------------------------------+
                      |      Apex Bank React Frontend (5173)     |
                      |   (Vite, React 19, TanStack Query,       |
                      |    Zustand, Modern Design System)        |
                      +------------------------------------------+
                                           |
                   +-----------------------+-----------------------+
                   | (Dev Proxy / Direct)                          | (REST / JWT)
                   v                                               v
+------------------------------------+           +------------------------------------+
|  Spring Cloud API Gateway (:8080)  |           |     Eureka Discovery (:8761)       |
+------------------------------------+           +------------------------------------+
                   |
     +-------------+-------------+
     |                           |
     v                           v
+--------------------+   +--------------------+   +--------------------+
|  Banking-Service   |   |  Payroll-Service   |   | AI-Chatbot Service |
|      (:8081)       |   |      (:8082)       |   |      (:8083)       |
|  - JWT Auth        |   |  - Payroll Disb.   |   |  - Geethika AI     |
|  - Accounts        |   |  - Kafka Consumer  |   |  - RestTemplate    |
|  - Transactions    |   +--------------------+   +--------------------+
|  - Employees       |
+--------------------+
```

---

## Key Capabilities

1. **Spring Boot Microservices Integration**:
   - **Banking Service (`:8081`)**: Complete management of Accounts, Transactions, Employees, and JWT Authentication (`/auth/login`, `/auth/register`, `/auth/create-hr`).
   - **Payroll Service (`:8082`)**: Synchronized employee directory and compensation data.
   - **AI Chatbot Service (`:8083`)**: Geethika AI Assistant integrated via `/api/chat` with real-time financial Q&A.
   - **API Gateway (`:8080`)**: Reverse proxy and unified routing.
   - **Eureka Discovery (`:8761`)**: Live health checks, cluster topology, and latency inspection.

2. **State Management & Network Layer**:
   - **TanStack Query (React Query v5)**: Server-state caching, automatic cache invalidation (`invalidateQueries`), background refetching, and optimistic mutations.
   - **Zustand**: Client-side state store for JWT sessions, active role permissions, dark/light theme, and mock toggle.
   - **Axios Client**: Interceptors injecting `Authorization: Bearer <token>`, global error handling, automatic 401 session expiration, and 403 access control toast notifications.

3. **Dual-Mode Connectivity (Live Backend + Mock Fallback)**:
   - When the Spring Boot microservices are running, all requests are executed live against backend endpoints.
   - If any microservice is offline or undergoing maintenance, the frontend can seamlessly toggle into **Mock Fallback Mode**, providing fully persistent local testing (open accounts, post transactions, add staff, chat with AI).

4. **Role-Based Access Control (RBAC)**:
   - **Admin (`ROLE_ADMIN`)**: Unrestricted access (Accounts, Transactions, Staff, System Health, and Admin-only HR user creation).
   - **HR Manager (`ROLE_HR`)**: Access to Staff Directory, salary metrics, and employee operations.
   - **Employee (`ROLE_EMPLOYEE`)**: Access to personal bank accounts, deposit/withdraw operations, and AI Assistant.
   - **Quick Demo Role Switcher**: A navbar dropdown allowing instant 1-click role switching during development.

---

## Environment Configuration

Configuration is managed via environment files (`.env`, `.env.development`, `.env.production`):

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_GATEWAY_URL` | `http://localhost:8080` | Spring Cloud Gateway root URL |
| `VITE_BANKING_SERVICE_URL` | `http://localhost:8081` | Spring Boot Banking Service |
| `VITE_PAYROLL_SERVICE_URL` | `http://localhost:8082` | Spring Boot Payroll Service |
| `VITE_CHATBOT_SERVICE_URL` | `http://localhost:8083` | Spring Boot AI Chatbot Service |
| `VITE_EUREKA_SERVER_URL` | `http://localhost:8761` | Netflix Eureka Service Registry |
| `VITE_USE_DEV_PROXY` | `true` | Route through Vite's local dev proxy to bypass CORS |
| `VITE_DEFAULT_MOCK_FALLBACK` | `true` | Enable graceful offline fallback when backend is offline |

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## Seed Accounts (DataInitializer)

For instant testing, the application includes pre-configured credentials matching the Spring Boot `DataInitializer`:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@bank.com` | `Admin@123` | Full Cluster Access, Create HR Users |
| **HR Manager** | `hr@bank.com` | `Hr@123456` | Staff Directory, Compensation |
| **Employee** | `john.doe@bank.com` | `Emp@123456` | Accounts, Transactions, AI Assistant |
