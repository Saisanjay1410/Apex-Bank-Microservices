# ðŸ¦ Apex Bank â€” Microservices Enterprise Banking & Payroll Portal

An enterprise-grade, distributed banking and payroll platform built with **Spring Boot 3**, **Spring Cloud (Netflix Eureka, API Gateway)**, **MySQL 8.0**, and **React 18 + TypeScript + Vite**.

---

## ðŸŒŸ Key Architecture & Services

```
                                [ Client Browser / Web Portal ]
                                         (Port: 5173)
                                              â”‚
                                              â–¼
                             [ Spring Cloud API Gateway ]
                                         (Port: 8090)
                                              â”‚
                      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                      â–¼                       â–¼                       â–¼
            [ Banking Microservice ] [ Payroll Microservice ] [ AI Chatbot Service ]
                 (Port: 8081)            (Port: 8082)            (Port: 8083)
                      â”‚                       â”‚                       â”‚
                      â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                              â–¼
                                 [ MySQL Database: banking_payroll ]
                                           (Port: 3306)

                                              â–²
                                              â”‚ Service Discovery
                                 [ Netflix Eureka Server ]
                                         (Port: 8761)
```

---

## ðŸš€ Microservices Directory Structure

| Service Name | Directory | Port | Description |
|:---|:---|:---:|:---|
| **Eureka Server** | `Eureka-Server/` | `8761` | Service Registry & Discovery daemon |
| **API Gateway** | `API-Gateway/` | `8090` | Central routing, CORS handling & reverse proxy |
| **Banking Service** | `Banking-Service/` | `8081` | Core banking: Accounts, Fund Transfers, Ledger |
| **Payroll Service** | `Payroll-Service/` | `8082` | HR employee records, compensation, salary runs |
| **AI Assistant** | `AI-Chatbot_Geethika/` | `8083` | Conversational financial & HR assistant |
| **Frontend Portal** | `frontend/` | `5173` | React 18, TypeScript, Tailwind CSS, Recharts |

---

## ðŸ‘¥ Seed User Credentials (MySQL: `banking_payroll`)

| Role | Username | Password | Accessible Modules |
|:---|:---|:---|:---|
| **Administrator** | `admin` | `admin123` | Analytics Dashboard, All Accounts, Full Transaction Ledger, RBAC |
| **HR Manager** | `hr_user` | `hr123` | Payroll Runs, Employee Directory, Salary Processing, AI Chatbot |
| **Employee** | `emp_user` | `emp123` | Personal Banking Portal, Own Transfers, Salary Slips, AI Chatbot |

---

## ðŸ› ï¸ Technology Stack

- **Backend Framework**: Spring Boot 3.x, Spring Cloud Gateway, Netflix Eureka Client & Server
- **Persistence**: Spring Data JPA, Hibernate, MySQL 8.0
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, Axios
- **Tooling**: Apache Maven, Node.js (v20+), Git

---

## ðŸ Quick Start: Running the Platform

### 1. Database Setup
Ensure MySQL 8.0 is running on port `3306`:
```sql
CREATE DATABASE IF NOT EXISTS banking_payroll;
```

### 2. Startup Order
Start services in the following order in separate terminal windows:

#### Step 1: Eureka Service Registry (Port 8761)
```bash
cd Eureka-Server
mvn spring-boot:run
```
*Verify at:* [http://localhost:8761](http://localhost:8761)

#### Step 2: AI Chatbot Service (Port 8083)
```bash
cd AI-Chatbot_Geethika
mvn spring-boot:run
```

#### Step 3: Banking Service (Port 8081)
```bash
cd Banking-Service
mvn spring-boot:run
```

#### Step 4: Payroll Service (Port 8082)
```bash
cd Payroll-Service
mvn spring-boot:run
```

#### Step 5: API Gateway (Port 8090)
```bash
cd API-Gateway
mvn spring-boot:run
```

#### Step 6: Frontend Portal (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
*Open application at:* [http://localhost:5173](http://localhost:5173)

---

## ðŸ“– Complete Documentation

Comprehensive architecture specifications, REST API contracts, and RBAC matrix are documented in:
- `Apex_Bank_Microservices_Documentation.pdf`
- `SYSTEM_DOCUMENTATION.md`
