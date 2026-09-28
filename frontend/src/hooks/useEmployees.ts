import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '../api/employeeApi';
import { authApi } from '../api/authApi';
import { useToastStore } from '../store/useToastStore';
import type { EmployeeDTO, CreateHrRequest } from '../types';

export const EMPLOYEES_KEY = ['employees'];

export function useEmployees() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const employeesQuery = useQuery({
    queryKey: EMPLOYEES_KEY,
    queryFn: employeeApi.getAll,
    staleTime: 1000 * 30,
  });

  const createMutation = useMutation({
    mutationFn: (emp: EmployeeDTO) => employeeApi.create(emp),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
      addToast({
        type: 'success',
        title: 'Employee Onboarded',
        description: `${data.firstName} ${data.lastName} (${data.employeeId}) has been added to the directory.`,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EmployeeDTO }) =>
      employeeApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
      addToast({
        type: 'success',
        title: 'Record Updated',
        description: `Profile for ${data.firstName} ${data.lastName} updated successfully.`,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
      addToast({
        type: 'success',
        title: 'Employee Removed',
        description: 'Employee record has been deleted.',
      });
    },
  });

  const createHrMutation = useMutation({
    mutationFn: (req: CreateHrRequest) => authApi.createHr(req),
    onSuccess: (message) => {
      addToast({
        type: 'success',
        title: 'HR Account Created',
        description: message,
      });
    },
  });

  return {
    employees: employeesQuery.data || [],
    isLoading: employeesQuery.isLoading,
    isError: employeesQuery.isError,
    error: employeesQuery.error,
    refetch: employeesQuery.refetch,
    createEmployee: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateEmployee: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteEmployee: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    createHrUser: createHrMutation.mutateAsync,
    isCreatingHr: createHrMutation.isPending,
  };
}
