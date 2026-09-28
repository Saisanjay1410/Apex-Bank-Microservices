import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { AccountDTO, TransactionDTO } from '../../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tx: TransactionDTO) => Promise<any>;
  accounts: AccountDTO[];
  defaultAccountId?: number;
  isLoading?: boolean;
}

const TX_TYPES = [
  { label: 'Deposit (Credit Funds)', value: 'DEPOSIT' },
  { label: 'Withdrawal (Debit Funds)', value: 'WITHDRAWAL' },
  { label: 'Wire / Account Transfer', value: 'TRANSFER' },
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  accounts,
  defaultAccountId,
  isLoading = false,
}) => {
  const [accountId, setAccountId] = useState<string>('');
  const [txType, setTxType] = useState('DEPOSIT');
  const [amount, setAmount] = useState('500.00');
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (defaultAccountId) {
      setAccountId(String(defaultAccountId));
    } else if (accounts.length > 0 && !accountId) {
      setAccountId(String(accounts[0].id));
    }
  }, [defaultAccountId, accounts, isOpen]);

  const selectedAccount = accounts.find((a) => String(a.id) === accountId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!accountId) newErrors.accountId = 'Please select an account';
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    } else if (
      (txType === 'WITHDRAWAL' || txType === 'TRANSFER') &&
      selectedAccount &&
      numAmount > selectedAccount.balance
    ) {
      newErrors.amount = `Insufficient funds. Available balance: $${selectedAccount.balance.toLocaleString()}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit({
        accountId: parseInt(accountId, 10),
        transactionType: txType,
        amount: numAmount,
        remarks: remarks.trim() || undefined,
      });
      onClose();
    } catch {
      // Error handled by react-query
    }
  };

  const accountOptions = accounts.map((acc) => ({
    label: `${acc.accountNumber} (${acc.accountType}) - Bal: $${Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    value: String(acc.id),
  }));

  const getIcon = () => {
    if (txType === 'DEPOSIT') return <ArrowDownLeft size={16} style={{ color: 'var(--accent-emerald)' }} />;
    if (txType === 'WITHDRAWAL') return <ArrowUpRight size={16} style={{ color: 'var(--accent-rose)' }} />;
    return <ArrowLeftRight size={16} style={{ color: 'var(--primary)' }} />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post New Transaction"
      subtitle="Dispatch credit or debit instruction to Banking-Service"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={txType === 'DEPOSIT' ? 'emerald' : txType === 'WITHDRAWAL' ? 'danger' : 'primary'}
            onClick={handleSubmit}
            isLoading={isLoading}
            leftIcon={getIcon()}
          >
            Execute {txType}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Select
          label="Target Bank Account"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          options={accountOptions.length > 0 ? accountOptions : [{ label: 'No accounts available', value: '' }]}
          error={errors.accountId}
          required
        />

        <Select
          label="Transaction Operation"
          value={txType}
          onChange={(e) => setTxType(e.target.value)}
          options={TX_TYPES}
          required
        />

        <Input
          label="Transaction Amount ($ USD)"
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          required
        />

        <Input
          label="Memo / Remarks (Optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="e.g. Invoice payment #4410"
        />

        {selectedAccount && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginTop: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8125rem',
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>Current Ledger Balance:</span>
            <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
              ${Number(selectedAccount.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </form>
    </Modal>
  );
};
