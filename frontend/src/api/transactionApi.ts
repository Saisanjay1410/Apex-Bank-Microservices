import { apiClient, executeApi } from './client';
import { mockService } from './mockService';
import { config } from '../config/env';
import type { TransactionDTO } from '../types';

const BASE_URL = config.endpoints.banking;

export const transactionApi = {
  getAll: async (): Promise<TransactionDTO[]> => {
    return executeApi(
      () => apiClient.get<TransactionDTO[]>(`${BASE_URL}/transactions`),
      () => mockService.getAllTransactions(),
      'Banking Transaction Service'
    );
  },

  getById: async (id: number): Promise<TransactionDTO> => {
    return executeApi(
      () => apiClient.get<TransactionDTO>(`${BASE_URL}/transactions/${id}`),
      () => mockService.getTransactionById(id),
      'Banking Transaction Service'
    );
  },

  create: async (transaction: TransactionDTO): Promise<TransactionDTO> => {
    return executeApi(
      () => apiClient.post<TransactionDTO>(`${BASE_URL}/transactions`, transaction),
      () => mockService.createTransaction(transaction),
      'Banking Transaction Service'
    );
  },

  update: async (id: number, transaction: TransactionDTO): Promise<TransactionDTO> => {
    return executeApi(
      () => apiClient.put<TransactionDTO>(`${BASE_URL}/transactions/${id}`, transaction),
      () => mockService.updateTransaction(id, transaction),
      'Banking Transaction Service'
    );
  },

  delete: async (id: number): Promise<string> => {
    return executeApi(
      async () => {
        const res = await apiClient.delete<string>(`${BASE_URL}/transactions/${id}`);
        return { data: res.data };
      },
      () => mockService.deleteTransaction(id),
      'Banking Transaction Service'
    );
  },
};
