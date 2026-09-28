// ==========================================
// User & Authentication Types
// ==========================================

export type UserRole = 'ROLE_ADMIN' | 'ROLE_HR' | 'ROLE_EMPLOYEE' | 'ADMIN' | 'HR' | 'EMPLOYEE';

export interface User {
  username: string;
  email?: string;
  role: UserRole;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface CreateHrRequest {
  username: string;
  email: string;
  password: string;
}

// ==========================================
// Banking Account Types
// ==========================================

export interface AccountDTO {
  id?: number;
  accountNumber: string;
  accountType: 'SAVINGS' | 'CHECKING' | 'INVESTMENT' | 'FIXED_DEPOSIT' | string;
  balance: number;
  employeeId?: number | null;
}

// ==========================================
// Transaction Types
// ==========================================

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';

export interface TransactionDTO {
  id?: number;
  accountId: number;
  transactionType: TransactionType | string;
  amount: number;
  remarks?: string;
  timestamp?: string;
}

// ==========================================
// Employee & HR Types
// ==========================================

export interface EmployeeDTO {
  id?: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  department: string;
  designation: string;
  salary: number;
  phone?: string;
  address?: string;
}

// ==========================================
// AI Chatbot Types
// ==========================================

export interface ChatRequest {
  message: string;
  userId?: string;
}

export interface ChatResponse {
  response: string;
  status: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
}

// ==========================================
// Microservices Health & Status Types
// ==========================================

export interface ServiceEndpoint {
  id: string;
  name: string;
  port: number;
  targetUrl: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'CHECKING';
  latencyMs?: number;
  description: string;
  category: 'core' | 'gateway' | 'service' | 'ai';
  lastChecked?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}
