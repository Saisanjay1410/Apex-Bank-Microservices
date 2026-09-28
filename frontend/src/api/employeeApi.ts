import { apiClient, executeApi } from './client';
import { mockService } from './mockService';
import { config } from '../config/env';
import type { EmployeeDTO } from '../types';

const BASE_URL = config.endpoints.banking;

export const employeeApi = {
  getAll: async (): Promise<EmployeeDTO[]> => {
    return executeApi(
      () => apiClient.get<EmployeeDTO[]>(`${BASE_URL}/employees`),
      () => mockService.getAllEmployees(),
      'Banking Employee Service'
    );
  },

  getById: async (id: number): Promise<EmployeeDTO> => {
    return executeApi(
      () => apiClient.get<EmployeeDTO>(`${BASE_URL}/employees/${id}`),
      () => mockService.getEmployeeById(id),
      'Banking Employee Service'
    );
  },

  create: async (employee: EmployeeDTO): Promise<EmployeeDTO> => {
    return executeApi(
      () => apiClient.post<EmployeeDTO>(`${BASE_URL}/employees`, employee),
      () => mockService.createEmployee(employee),
      'Banking Employee Service'
    );
  },

  update: async (id: number, employee: EmployeeDTO): Promise<EmployeeDTO> => {
    return executeApi(
      () => apiClient.put<EmployeeDTO>(`${BASE_URL}/employees/${id}`, employee),
      () => mockService.updateEmployee(id, employee),
      'Banking Employee Service'
    );
  },

  delete: async (id: number): Promise<string> => {
    return executeApi(
      async () => {
        const res = await apiClient.delete<string>(`${BASE_URL}/employees/${id}`);
        return { data: res.data };
      },
      () => mockService.deleteEmployee(id),
      'Banking Employee Service'
    );
  },
};
