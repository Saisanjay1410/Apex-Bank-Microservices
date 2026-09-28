import type { 
  AccountDTO, 
  EmployeeDTO, 
  TransactionDTO, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  CreateHrRequest,
  ChatRequest,
  ChatResponse,
  ServiceEndpoint
} from '../types';
import { 
  initialMockAccounts, 
  initialMockEmployees, 
  initialMockTransactions, 
  initialMockEndpoints, 
  mockChatKnowledgeBase 
} from './mockData';

// Storage keys
const ACCOUNTS_KEY = 'apex_mock_accounts';
const TRANSACTIONS_KEY = 'apex_mock_transactions';
const EMPLOYEES_KEY = 'apex_mock_employees';

// Helper to simulate realistic network latency
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory / sessionStorage state loaders
const loadAccounts = (): AccountDTO[] => {
  const data = sessionStorage.getItem(ACCOUNTS_KEY);
  if (data) return JSON.parse(data);
  sessionStorage.setItem(ACCOUNTS_KEY, JSON.stringify(initialMockAccounts));
  return [...initialMockAccounts];
};

const saveAccounts = (accounts: AccountDTO[]) => {
  sessionStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

const loadTransactions = (): TransactionDTO[] => {
  const data = sessionStorage.getItem(TRANSACTIONS_KEY);
  if (data) return JSON.parse(data);
  sessionStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(initialMockTransactions));
  return [...initialMockTransactions];
};

const saveTransactions = (transactions: TransactionDTO[]) => {
  sessionStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

const loadEmployees = (): EmployeeDTO[] => {
  const data = sessionStorage.getItem(EMPLOYEES_KEY);
  if (data) return JSON.parse(data);
  sessionStorage.setItem(EMPLOYEES_KEY, JSON.stringify(initialMockEmployees));
  return [...initialMockEmployees];
};

const saveEmployees = (employees: EmployeeDTO[]) => {
  sessionStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
};

export const mockService = {
  // ==========================================
  // AUTH
  // ==========================================
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    await delay(400);

    const email = request.email.toLowerCase();
    let role = 'ROLE_EMPLOYEE';
    let username = email.split('@')[0];

    if (email.includes('admin')) {
      role = 'ROLE_ADMIN';
      username = 'admin';
    } else if (email.includes('hr')) {
      role = 'ROLE_HR';
      username = 'hr_manager';
    }

    // Generate simulated JWT structure (header.payload.sig)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: username,
      role: role,
      email: request.email,
      exp: Math.floor(Date.now() / 1000) + 86400,
      iat: Math.floor(Date.now() / 1000),
    }));
    const signature = btoa('mock-jwt-signature-apex-banking-spring-cloud');
    const mockToken = `${header}.${payload}.${signature}`;

    return {
      token: mockToken,
      message: `Welcome back, ${username}! (Mock Mode Authenticated)`,
    };
  },

  register: async (request: RegisterRequest): Promise<string> => {
    await delay(450);
    return `User '${request.username}' registered successfully. You may now log in.`;
  },

  createHr: async (request: CreateHrRequest): Promise<string> => {
    await delay(400);
    return `HR account '${request.username}' (${request.email}) provisioned successfully.`;
  },

  // ==========================================
  // ACCOUNTS
  // ==========================================
  getAllAccounts: async (): Promise<AccountDTO[]> => {
    await delay(250);
    return loadAccounts();
  },

  getAccountById: async (id: number): Promise<AccountDTO> => {
    await delay(200);
    const accounts = loadAccounts();
    const found = accounts.find((a) => a.id === id);
    if (!found) throw new Error(`Account with ID ${id} not found`);
    return found;
  },

  createAccount: async (account: AccountDTO): Promise<AccountDTO> => {
    await delay(350);
    const accounts = loadAccounts();
    const newId = accounts.length > 0 ? Math.max(...accounts.map((a) => a.id || 0)) + 1 : 1;
    const newAccount: AccountDTO = {
      ...account,
      id: newId,
      accountNumber: account.accountNumber || `APX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      balance: Number(account.balance) || 0,
    };
    accounts.unshift(newAccount);
    saveAccounts(accounts);
    return newAccount;
  },

  updateAccount: async (id: number, updated: AccountDTO): Promise<AccountDTO> => {
    await delay(300);
    const accounts = loadAccounts();
    const index = accounts.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Account with ID ${id} not found`);

    accounts[index] = { ...accounts[index], ...updated, id };
    saveAccounts(accounts);
    return accounts[index];
  },

  deleteAccount: async (id: number): Promise<string> => {
    await delay(300);
    let accounts = loadAccounts();
    accounts = accounts.filter((a) => a.id !== id);
    saveAccounts(accounts);
    return 'Account deleted successfully';
  },

  // ==========================================
  // TRANSACTIONS
  // ==========================================
  getAllTransactions: async (): Promise<TransactionDTO[]> => {
    await delay(250);
    return loadTransactions();
  },

  getTransactionById: async (id: number): Promise<TransactionDTO> => {
    await delay(200);
    const txs = loadTransactions();
    const found = txs.find((t) => t.id === id);
    if (!found) throw new Error(`Transaction with ID ${id} not found`);
    return found;
  },

  createTransaction: async (tx: TransactionDTO): Promise<TransactionDTO> => {
    await delay(350);
    const txs = loadTransactions();
    const accounts = loadAccounts();
    
    // Find account to update balance
    const accIndex = accounts.findIndex((a) => a.id === Number(tx.accountId));
    if (accIndex !== -1) {
      const amount = Number(tx.amount);
      if (tx.transactionType === 'DEPOSIT') {
        accounts[accIndex].balance = Number(accounts[accIndex].balance) + amount;
      } else if (tx.transactionType === 'WITHDRAWAL') {
        if (Number(accounts[accIndex].balance) < amount) {
          throw new Error('Insufficient funds in the selected account');
        }
        accounts[accIndex].balance = Number(accounts[accIndex].balance) - amount;
      } else if (tx.transactionType === 'TRANSFER') {
        if (Number(accounts[accIndex].balance) < amount) {
          throw new Error('Insufficient funds for transfer');
        }
        accounts[accIndex].balance = Number(accounts[accIndex].balance) - amount;
      }
      saveAccounts(accounts);
    }

    const newId = txs.length > 0 ? Math.max(...txs.map((t) => t.id || 0)) + 1 : 1001;
    const newTx: TransactionDTO = {
      ...tx,
      id: newId,
      accountId: Number(tx.accountId),
      amount: Number(tx.amount),
      timestamp: new Date().toISOString(),
    };

    txs.unshift(newTx);
    saveTransactions(txs);
    return newTx;
  },

  updateTransaction: async (id: number, updated: TransactionDTO): Promise<TransactionDTO> => {
    await delay(300);
    const txs = loadTransactions();
    const index = txs.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`Transaction with ID ${id} not found`);

    txs[index] = { ...txs[index], ...updated, id };
    saveTransactions(txs);
    return txs[index];
  },

  deleteTransaction: async (id: number): Promise<string> => {
    await delay(300);
    let txs = loadTransactions();
    txs = txs.filter((t) => t.id !== id);
    saveTransactions(txs);
    return 'Transaction deleted successfully';
  },

  // ==========================================
  // EMPLOYEES
  // ==========================================
  getAllEmployees: async (): Promise<EmployeeDTO[]> => {
    await delay(250);
    return loadEmployees();
  },

  getEmployeeById: async (id: number): Promise<EmployeeDTO> => {
    await delay(200);
    const employees = loadEmployees();
    const found = employees.find((e) => e.id === id);
    if (!found) throw new Error(`Employee with ID ${id} not found`);
    return found;
  },

  createEmployee: async (emp: EmployeeDTO): Promise<EmployeeDTO> => {
    await delay(350);
    const employees = loadEmployees();
    const newId = employees.length > 0 ? Math.max(...employees.map((e) => e.id || 0)) + 1 : 101;
    const newEmp: EmployeeDTO = {
      ...emp,
      id: newId,
      employeeId: emp.employeeId || `EMP-${String(newId).padStart(3, '0')}`,
      salary: Number(emp.salary) || 0,
    };
    employees.unshift(newEmp);
    saveEmployees(employees);
    return newEmp;
  },

  updateEmployee: async (id: number, updated: EmployeeDTO): Promise<EmployeeDTO> => {
    await delay(300);
    const employees = loadEmployees();
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) throw new Error(`Employee with ID ${id} not found`);

    employees[index] = { ...employees[index], ...updated, id };
    saveEmployees(employees);
    return employees[index];
  },

  deleteEmployee: async (id: number): Promise<string> => {
    await delay(300);
    let employees = loadEmployees();
    employees = employees.filter((e) => e.id !== id);
    saveEmployees(employees);
    return 'Employee deleted successfully';
  },

  // ==========================================
  // AI CHATBOT
  // ==========================================
  chat: async (request: ChatRequest): Promise<ChatResponse> => {
    await delay(600);
    const query = request.message.toLowerCase();

    // Check knowledge base
    const match = mockChatKnowledgeBase.find((item) =>
      item.keywords.some((kw) => query.includes(kw))
    );

    if (match) {
      return {
        response: match.answer,
        status: 'SUCCESS',
      };
    }

    return {
      response: `Thank you for your inquiry about "${request.message}". I'm your Apex AI Banking Assistant connected to the Spring Boot microservices cluster. How else can I assist you with accounts, transactions, or HR queries today?`,
      status: 'SUCCESS',
    };
  },

  // ==========================================
  // HEALTH STATUS
  // ==========================================
  getEndpointsHealth: async (): Promise<ServiceEndpoint[]> => {
    await delay(300);
    return initialMockEndpoints.map((ep) => ({
      ...ep,
      latencyMs: Math.floor(10 + Math.random() * 25),
      lastChecked: new Date().toLocaleTimeString(),
    }));
  },
};
