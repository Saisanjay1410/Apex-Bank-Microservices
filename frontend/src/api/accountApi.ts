import { apiClient, executeApi } from './client';
import { mockService } from './mockService';
import { config } from '../config/env';
import type { AccountDTO } from '../types';

const BASE_URL = config.endpoints.banking;

export const accountApi = {
  getAll: async (): Promise<AccountDTO[]> => {
    return executeApi(
      () => apiClient.get<AccountDTO[]>(`${BASE_URL}/accounts`),
      () => mockService.getAllAccounts(),
      'Banking Account Service'
    );
  },

  getById: async (id: number): Promise<AccountDTO> => {
    return executeApi(
      () => apiClient.get<AccountDTO>(`${BASE_URL}/accounts/${id}`),
      () => mockService.getAccountById(id),
      'Banking Account Service'
    );
  },

  create: async (account: AccountDTO): Promise<AccountDTO> => {
    return executeApi(
      () => apiClient.post<AccountDTO>(`${BASE_URL}/accounts`, account),
      () => mockService.createAccount(account),
      'Banking Account Service'
    );
  },

  update: async (id: number, account: AccountDTO): Promise<AccountDTO> => {
    return executeApi(
      () => apiClient.put<AccountDTO>(`${BASE_URL}/accounts/${id}`, account),
      () => mockService.updateAccount(id, account),
      'Banking Account Service'
    );
  },

  delete: async (id: number): Promise<string> => {
    return executeApi(
      async () => {
        const res = await apiClient.delete<string>(`${BASE_URL}/accounts/${id}`);
        return { data: res.data };
      },
      () => mockService.deleteAccount(id),
      'Banking Account Service'
    );
  },
};
