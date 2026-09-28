import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { transactionApi } from '../api/transactionApi';
import { ACCOUNTS_KEY } from './useAccounts';
import { useToastStore } from '../store/useToastStore';
import type { TransactionDTO } from '../types';

export const TRANSACTIONS_KEY = ['transactions'];

export function useTransactions() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const transactionsQuery = useQuery({
    queryKey: TRANSACTIONS_KEY,
    queryFn: transactionApi.getAll,
    staleTime: 1000 * 20,
  });

  const createMutation = useMutation({
    mutationFn: (tx: TransactionDTO) => transactionApi.create(tx),
    onSuccess: (data) => {
      // Invalidate both transactions and accounts so account balances refresh immediately
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });

      if (data.transactionType === 'DEPOSIT') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10B981', '#34D399', '#6EE7B7'],
        });
      }

      addToast({
        type: 'success',
        title: `${data.transactionType} Successful`,
        description: `Processed $${Number(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} for Account #${data.accountId}.`,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => transactionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      addToast({
        type: 'success',
        title: 'Transaction Removed',
        description: 'Record has been removed from ledger.',
      });
    },
  });

  return {
    transactions: transactionsQuery.data || [],
    isLoading: transactionsQuery.isLoading,
    isError: transactionsQuery.isError,
    error: transactionsQuery.error,
    refetch: transactionsQuery.refetch,
    createTransaction: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteTransaction: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
