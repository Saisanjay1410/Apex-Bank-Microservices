import { apiClient, executeApi } from './client';
import { mockService } from './mockService';
import { config } from '../config/env';
import type { LoginRequest, LoginResponse, RegisterRequest, CreateHrRequest } from '../types';

const BASE_URL = config.endpoints.banking;

export const authApi = {
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    return executeApi(
      () => apiClient.post<LoginResponse>(`${BASE_URL}/auth/login`, request),
      () => mockService.login(request),
      'Banking Auth Service'
    );
  },

  register: async (request: RegisterRequest): Promise<string> => {
    return executeApi(
      async () => {
        const res = await apiClient.post<string>(`${BASE_URL}/auth/register`, request);
        return { data: res.data };
      },
      () => mockService.register(request),
      'Banking Auth Service'
    );
  },

  createHr: async (request: CreateHrRequest): Promise<string> => {
    return executeApi(
      async () => {
        const res = await apiClient.post<string>(`${BASE_URL}/auth/create-hr`, request);
        return { data: res.data };
      },
      () => mockService.createHr(request),
      'Banking Auth Service'
    );
  },
};
