# Apex Bank - Microservices Enterprise Portal
## Complete Architecture, Features, RBAC, Credentials & API Documentation

---

## 1. System Overview

**Apex Bank** is a cloud-native, microservices-driven banking and enterprise resource management portal. It combines institutional treasury management, employee payroll synchronization, and an AI financial assistant with high-availability service discovery and reactive routing.

```
                      ┌───────────────────────────────────────────────┐
                      │    Vite React Frontend (Port 5173)            │
                      └───────────────────────┬───────────────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
          [Live Backend Mode]                              [Mock Fallback Mode]
          (Direct / Gateway Proxy)                         (Offline Dev Simulator)
                      │
     ┌────────────────┼────────────────┬────────────────┬─────────────┐
     ▼                ▼                ▼                ▼             ▼
Eureka Server    API Gateway      Banking Svc      Payroll Svc    AI Chatbot
  (:8761)          (:8090)          (:8081)          (:8082)        (:8083)
     │                │                │                │             │
     │                │                ├────────┬───────┤             │
     │                │                ▼        ▼       ▼             │
     │                │             MySQL 8.0  Kafka Broker           │
     │                │             (:3306)      (:9092)              │
     ▲                ▲                ▲            ▲                 ▲
     └────────────────┴────────────────┴────────────┴─────────────────┘
                   Dynamic Registration & Heartbeat Sync
```

---

## 2. Technology Stack

### Frontend Application (`/frontend`)
| Layer | Technologies Used |
| :--- | :--- |
| **Framework & Core** | **React 19**, **TypeScript**, **HTML5 Semantic Elements** |
| **Build Tool & Bundler** | **Vite 8.3** (ESM hot-reloading, sub-500ms production builds) |
| **State Management** | **TanStack Query v5** (Server-state caching, background refetching, mutations) + **Zustand** (Client auth tokens, theme toggle, connection state) |
| **Routing & Guards** | **React Router v7** (`ProtectedRoute` with client-side RBAC authorization) |
| **HTTP & API Client** | **Axios** with automatic JWT Bearer token request interceptor & error interceptor |
| **Design System & UI** | **Pure Vanilla CSS** (Custom token architecture, responsive grid, dual Light & Obsidian Dark modes, glassmorphism, micro-animations) |
| **Iconography** | **Lucide React** |

### Backend Microservices
| Microservice | Port | Tech Stack |
| :--- | :--- | :--- |
| **Eureka Discovery Server** | `:8761` | Spring Boot 4.1.0, Spring Cloud Netflix Eureka Server, Java 21/24 |
| **Spring Cloud API Gateway** | `:8090` | Spring Cloud Gateway (Reactive WebFlux), Eureka Client, LoadBalancer |
| **Banking Service** | `:8081` | Spring Boot 4.1.0, Spring Data JPA, Hibernate, Spring Security 6, JJWT (HMAC-SHA256), BCrypt, SpringDoc OpenAPI |
| **Payroll Service** | `:8082` | Spring Boot 4.1.0, Spring Data JPA, Apache Kafka Producer & Consumer, Eureka Client |
| **AI Chatbot Service** | `:8083` | Spring Boot 4.1.0, Spring Web, RestTemplate, Eureka Client |
| **Database** | `:3306` | **MySQL 8.0** (`banking_payroll` database) |
| **Message Broker** | `:9092` | **Apache Kafka** |

---

## 3. Seed User Credentials (MySQL Database)

All users are registered and active in the MySQL database (`banking_payroll.users`). Passwords are encrypted with **BCrypt**.

| Role | Username | Corporate Email | Password | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | `admin@bank.com` | `Admin@123` | **Full Enterprise Access** (All pages, create HR accounts, manage staff, open/close accounts, post transactions, inspect cluster topology) |
| **HR MANAGER** | `hr` | `hr@bank.com` | `Hr@123456` | **Staff & Payroll Operations** (Staff directory, employee records, salary inspection, AI assistant, health monitoring) |
| **EMPLOYEE** | `john_fintech` | `john_fintech@gmail.com` | `Password1234` | **Standard Banking** (View assigned accounts, execute deposits/withdrawals, ledger audit history, AI assistant) |
| **EMPLOYEE (Alt)** | `testuser` | `testuser@gmail.com` | `Test@123` | Standard employee profile |

> **Quick Login Tip**: On the Login page (`/login`), click the one-click seed buttons (**Admin**, **HR Mgr**, **Staff**) to automatically populate credentials.

---

## 4. Role-Based Access Control (RBAC) Matrix

| Portal Feature / Route | URL Path | ROLE_ADMIN | ROLE_HR | ROLE_EMPLOYEE | Public / Guest |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Public Login / Register** | `/login` | ✅ | ✅ | ✅ | ✅ |
| **Executive Overview** | `/dashboard` | ✅ | ✅ | ✅ | ❌ |
| **Bank Accounts & 3D Cards** | `/accounts` | ✅ | ❌ | ✅ | ❌ |
| **Open New Account** | Modal on `/accounts` | ✅ | ❌ | ✅ | ❌ |
| **Close Account (No Txs)** | Delete on `/accounts` | ✅ | ❌ | ❌ | ❌ |
| **Transaction Ledger** | `/transactions` | ✅ | ❌ | ✅ | ❌ |
| **Deposit / Withdraw / Transfer**| Modal on `/transactions`| ✅ | ❌ | ✅ | ❌ |
| **Export Ledger to CSV** | Button on `/transactions`| ✅ | ❌ | ✅ | ❌ |
| **Staff Directory** | `/employees` | ✅ | ✅ | ❌ *(Redirected)*| ❌ |
| **Add / Edit Employee** | Modal on `/employees` | ✅ | ✅ | ❌ | ❌ |
| **Create HR Account** | Modal on `/employees` | ✅ *(Admin only)*| ❌ | ❌ | ❌ |
| **AI Financial Assistant** | `/assistant` | ✅ | ✅ | ✅ | ❌ |
| **Floating AI Assistant Drawer**| Popup (Bottom-Right) | ✅ | ✅ | ✅ | ❌ |
| **Cluster Topology & Health** | `/health` | ✅ | ✅ | ✅ | ❌ |
| **Live / Mock Mode Toggle** | Navbar Pill | ✅ | ✅ | ✅ | ❌ |
| **Light / Dark Theme Toggle** | Navbar Sun/Moon | ✅ | ✅ | ✅ | ✅ |

---

## 5. Complete REST API Specifications

### A. Authentication & User Management (Banking Service - `:8081`)

#### 1. Public User Registration
* **Endpoint**: `POST /auth/register`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "username": "alex_fintech",
    "email": "alex@bank.com",
    "password": "Password123!"
  }
  ```
* **Response** (`200 OK`): `"User registered successfully"` (Creates user with `ROLE_EMPLOYEE` and `active = 1`).

#### 2. User Authentication (JWT Login)
* **Endpoint**: `POST /auth/login`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "email": "admin@bank.com",
    "password": "Admin@123"
  }
  ```
* **Response** (`200 OK`):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJST0xFX0FETUlOIi... [JWT]"
  }
  ```

#### 3. Create HR User
* **Endpoint**: `POST /auth/create-hr`
* **Access**: Requires `ROLE_ADMIN`
* **Headers**: `Authorization: Bearer <ADMIN_JWT>`
* **Request Body**:
  ```json
  {
    "username": "hr_lead",
    "email": "hr_lead@bank.com",
    "password": "SecurePassword123"
  }
  ```
* **Response** (`200 OK`): `"HR user created successfully"`

---

### B. Bank Accounts API (Banking Service - `:8081`)

*All requests require `Authorization: Bearer <TOKEN>`.*

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/accounts` | `ADMIN`, `EMPLOYEE` | List all registered accounts |
| `GET` | `/accounts/{id}` | `ADMIN`, `EMPLOYEE` | Fetch account by ID |
| `POST` | `/accounts` | `ADMIN`, `EMPLOYEE` | Open new bank account |
| `PUT` | `/accounts/{id}` | `ADMIN`, `EMPLOYEE` | Update account type or linked employee |
| `DELETE` | `/accounts/{id}` | `ADMIN`, `EMPLOYEE` | Delete account (prevented if account has transactions) |

**Sample Create Account Payload (`POST /accounts`)**:
```json
{
  "accountNumber": "ACC10003",
  "accountType": "SAVINGS",
  "balance": 15000.00,
  "employeeId": 1
}
```

---

### C. Transactions & Ledger API (Banking Service - `:8081`)

*All requests require `Authorization: Bearer <TOKEN>`.*

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/transactions` | `ADMIN`, `EMPLOYEE` | Fetch full audit ledger |
| `GET` | `/transactions/{id}` | `ADMIN`, `EMPLOYEE` | Fetch transaction details by ID |
| `POST` | `/transactions` | `ADMIN`, `EMPLOYEE` | Execute financial operation & update balance |
| `PUT` | `/transactions/{id}` | `ADMIN`, `EMPLOYEE` | Update transaction record |
| `DELETE` | `/transactions/{id}` | `ADMIN`, `EMPLOYEE` | Remove transaction record |

**Sample Post Transaction Payload (`POST /transactions`)**:
```json
{
  "accountId": 2,
  "amount": 2500.00,
  "transactionType": "DEPOSIT",
  "remarks": "Institutional wire settlement"
}
```
*Supported `transactionType` values: `DEPOSIT`, `WITHDRAWAL` (or `WITHDRAW`), `TRANSFER`.*

---

### D. Staff Directory & Employee API (Banking Service - `:8081`)

*All requests require `Authorization: Bearer <TOKEN>`.*

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/employees` | `ADMIN`, `HR` | Retrieve full staff directory |
| `GET` | `/employees/{id}` | `ADMIN`, `HR` | Fetch single employee profile |
| `POST` | `/employees` | `ADMIN`, `HR` | Add new employee |
| `PUT` | `/employees/{id}` | `ADMIN`, `HR` | Update employee information |
| `DELETE` | `/employees/{id}` | `ADMIN`, `HR` | Remove employee record |

**Sample Create Employee Payload (`POST /employees`)**:
```json
{
  "employeeId": "EMP003",
  "firstName": "Sarah",
  "lastName": "Connor",
  "department": "Security",
  "designation": "Security Architect",
  "salary": 92000.00,
  "phone": "9876543212",
  "address": "San Francisco, CA"
}
```

---

### E. AI Chatbot API (AI-Chatbot Service - `:8083`)

* **Endpoint**: `POST /api/chat`
* **Access**: Public / Bearer
* **Request Body**:
  ```json
  {
    "message": "What is my current account balance?",
    "userId": "admin"
  }
  ```
* **Response** (`200 OK`):
  ```json
  {
    "response": "AI Response: What is my current account balance?",
    "status": "SUCCESS"
  }
  ```

---

### F. Eureka Service Registry API (Eureka Server - `:8761`)

* **Web Dashboard**: `http://localhost:8761/`
* **REST API**: `GET http://localhost:8761/eureka/apps`
* **Headers**: `Accept: application/json`
* **Sample Output**:
  ```json
  {
    "applications": {
      "application": [
        { "name": "BANKING-SERVICE", "port": 8081, "status": "UP" },
        { "name": "API-GATEWAY",     "port": 8090, "status": "UP" },
        { "name": "PAYROLL-SERVICE", "port": 8082, "status": "UP" },
        { "name": "AI-CHATBOT",      "port": 8083, "status": "UP" }
      ]
    }
  }
  ```

---

## 6. Frontend Features & Capabilities

1. **Dual Theme Engine**:
   * **Crisp Light Mode** (Default): Stripe/Mercury Bank enterprise aesthetic with slate borders (`#E2E8F0`), soft ambient shadows, and high-contrast typography.
   * **Obsidian Dark Mode**: Sleek zinc/slate dark theme toggled in real time with the Sun/Moon button.
2. **Dual Operational Modes**:
   * **Live Backend Mode**: Communicates directly through Vite reverse proxies with real Spring Boot microservices and MySQL.
   * **Mock Fallback Mode**: Client-side simulator that lets developers and reviewers test all CRUD operations, charts, and chatbot responses without running backend processes.
3. **Interactive 3D Virtual Cards**:
   * Realistic bank cards for accounts with type-specific metallic gradients (Obsidian Black, Emerald Gold, Royal Sapphire) and quick-deposit shortcuts.
4. **Real-Time Audited Ledger**:
   * Filterable transaction history with search, type tabs (All, Credits, Debits, Transfers), balance validation, and one-click **Export to CSV**.
5. **Role-Aware Navigation & Badges**:
   * Sidebar dynamically hides or shows administrative pages (`Staff Directory`, `Create HR`) based on the authenticated JWT token claims.
6. **Dual AI Interfaces**:
   * Full-screen conversational AI workspace at `/assistant`.
   * Global floating AI trigger and drawer accessible from every page.
7. **Cluster Topology Monitor**:
   * Live ping telemetry gauges that probe all microservice nodes and display latency and connectivity status.

---

## 7. How to Start the Entire Stack

### Step 1: Start MySQL Database
Verify that MySQL is running on port `3306`:
```powershell
Get-Service *mysql*
```

### Step 2: Start Eureka Discovery Server (Port 8761)
```powershell
cd "c:\Users\saisa\Desktop\Poc Implemented\Eureka-Server"
mvn spring-boot:run
```

### Step 3: Start Banking Service (Port 8081)
```powershell
cd "c:\Users\saisa\Desktop\Poc Implemented\Banking-Service"
mvn spring-boot:run
```

### Step 4: Start Payroll Service (Port 8082)
```powershell
cd "c:\Users\saisa\Desktop\Poc Implemented\Payroll-Service"
mvn spring-boot:run
```

### Step 5: Start AI Chatbot Service (Port 8083)
```powershell
cd "c:\Users\saisa\Desktop\Poc Implemented\AI-Chatbot_Geethika"
mvn spring-boot:run
```

### Step 6: Start API Gateway (Port 8090)
```powershell
cd "c:\Users\saisa\Desktop\Poc Implemented\API-Gateway"
mvn spring-boot:run
```

### Step 7: Start Vite React Frontend (Port 5173)
```powershell
cd "c:\Users\saisa\Desktop\Poc Implemented\frontend"
npm run dev
```

Open **`http://localhost:5173`** in your browser and sign in!