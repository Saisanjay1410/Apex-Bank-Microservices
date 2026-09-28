import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { AccountDTO } from '../../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (account: AccountDTO) => Promise<any>;
  initialData?: AccountDTO | null;
  isLoading?: boolean;
}

const ACCOUNT_TYPES = [
  { label: 'Checking Account', value: 'CHECKING' },
  { label: 'Savings Account', value: 'SAVINGS' },
  { label: 'Investment Portfolio', value: 'INVESTMENT' },
  { label: 'Fixed Term Deposit', value: 'FIXED_DEPOSIT' },
];

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('CHECKING');
  const [balance, setBalance] = useState('1000.00');
  const [employeeId, setEmployeeId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setAccountNumber(initialData.accountNumber);
      setAccountType(initialData.accountType);
      setBalance(String(initialData.balance));
      setEmployeeId(initialData.employeeId ? String(initialData.employeeId) : '');
    } else {
      setAccountNumber(`APX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`);
      setAccountType('CHECKING');
      setBalance('1000.00');
      setEmployeeId('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
    const numBalance = parseFloat(balance);
    if (isNaN(numBalance) || numBalance < 0) {
      newErrors.balance = 'Balance must be a positive number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit({
        accountNumber: accountNumber.trim(),
        accountType,
        balance: numBalance,
        employeeId: employeeId.trim() ? parseInt(employeeId, 10) : undefined,
      });
      onClose();
    } catch {
      // Error handled by react-query / axios interceptor
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Bank Account' : 'Open New Bank Account'}
      subtitle={initialData ? `Update configuration for ${initialData.accountNumber}` : 'Deploy a new account ledger record to Banking-Service'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            {initialData ? 'Save Changes' : 'Open Account'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          error={errors.accountNumber}
          placeholder="e.g. APX-4912-8821"
          required
        />

        <Select
          label="Account Classification"
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          options={ACCOUNT_TYPES}
          required
        />

        <Input
          label="Initial Balance ($ USD)"
          type="number"
          step="0.01"
          min="0"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          error={errors.balance}
          required
        />

        <Input
          label="Linked Employee ID (Optional)"
          type="number"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="e.g. 101"
          helperText="Optional reference to associate account with an employee profile"
        />
      </form>
    </Modal>
  );
};
