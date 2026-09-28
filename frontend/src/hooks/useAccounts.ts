import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi } from '../api/accountApi';
import { useToastStore } from '../store/useToastStore';
import type { AccountDTO } from '../types';

export const ACCOUNTS_KEY = ['accounts'];

export function useAccounts() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const accountsQuery = useQuery({
    queryKey: ACCOUNTS_KEY,
    queryFn: accountApi.getAll,
    staleTime: 1000 * 30, // 30 seconds
  });

  const createMutation = useMutation({
    mutationFn: (newAccount: AccountDTO) => accountApi.create(newAccount),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
      addToast({
        type: 'success',
        title: 'Account Created',
        description: `Account ${data.accountNumber} has been successfully opened.`,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AccountDTO }) =>
      accountApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
      addToast({
        type: 'success',
        title: 'Account Updated',
        description: `Account ${data.accountNumber} updated successfully.`,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => accountApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
      addToast({
        type: 'success',
        title: 'Account Closed',
        description: 'The bank account has been permanently removed.',
      });
    },
  });

  return {
    accounts: accountsQuery.data || [],
    isLoading: accountsQuery.isLoading,
    isError: accountsQuery.isError,
    error: accountsQuery.error,
    refetch: accountsQuery.refetch,
    createAccount: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateAccount: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteAccount: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
