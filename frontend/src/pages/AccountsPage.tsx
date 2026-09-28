import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  Search, 
  LayoutGrid, 
  Table as TableIcon, 
  Edit3, 
  Trash2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wifi, 
  ShieldCheck, 
  CreditCard,
  Building2,
  Sparkles
} from 'lucide-react';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { AccountModal } from '../components/banking/AccountModal';
import { TransactionModal } from '../components/banking/TransactionModal';
import type { AccountDTO } from '../types';

export const AccountsPage: React.FC = () => {
  const { 
    accounts, 
    isLoading, 
    createAccount, 
    updateAccount, 
    deleteAccount, 
    isCreating, 
    isUpdating, 
    isDeleting 
  } = useAccounts();

  const { createTransaction, isCreating: isCreatingTx } = useTransactions();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountDTO | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Quick transaction modal
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number | undefined>();

  // Filter accounts
  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch = 
      acc.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (acc.employeeId && String(acc.employeeId).includes(searchTerm));
    const matchesType = filterType === 'ALL' || acc.accountType === filterType;
    return matchesSearch && matchesType;
  });

  const totalBalance = accounts.reduce((acc, curr) => acc + (Number(curr.balance) || 0), 0);

  const getCardTheme = (type: string) => {
    switch (type) {
      case 'SAVINGS':
        return 'card-theme-emerald';
      case 'INVESTMENT':
        return 'card-theme-royal';
      default:
        return 'card-theme-obsidian';
    }
  };

  const getAccountBadge = (type: string) => {
    switch (type) {
      case 'CHECKING':
        return <Badge variant="indigo">Checking</Badge>;
      case 'SAVINGS':
        return <Badge variant="emerald">Savings</Badge>;
      case 'INVESTMENT':
        return <Badge variant="cyan">Investment</Badge>;
      case 'FIXED_DEPOSIT':
        return <Badge variant="amber">Fixed Deposit</Badge>;
      default:
        return <Badge variant="gray">{type}</Badge>;
    }
  };

  const handleOpenEdit = (acc: AccountDTO) => {
    setEditingAccount(acc);
    setIsAccountModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingAccount(null);
    setIsAccountModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      await deleteAccount(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>
              Bank Accounts & Liquidity
            </h1>
            <Badge variant="emerald" dot>
              {accounts.length} Active Accounts
            </Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time deposit and checking ledger balances synced with Spring Boot Banking-Service
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenCreate}
          leftIcon={<Plus size={16} />}
        >
          Open New Account
        </Button>
      </div>

      {/* Quick Vault Overview Banner */}
      <Card style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cumulative Vault Liquidity
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginTop: '2px' }}>
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>APY Yield (Savings)</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>4.85% APY</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FDIC Coverage</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>$2,500,000</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Toolbar: Search, Type filter, and Grid/Table toggle */}
      <Card style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by account # or employee ID..."
                className="form-control"
                style={{ paddingLeft: '42px', height: '42px' }}
              />
            </div>

            {/* Account Type dropdown */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-control"
              style={{ width: 'auto', minWidth: '170px', height: '42px', cursor: 'pointer' }}
            >
              <option value="ALL">All Account Types</option>
              <option value="CHECKING">Checking Accounts</option>
              <option value="SAVINGS">Savings Accounts</option>
              <option value="INVESTMENT">Investment Portfolios</option>
              <option value="FIXED_DEPOSIT">Fixed Deposits</option>
            </select>
          </div>

          {/* Grid / Table toggle */}
          <div
            style={{
              display: 'flex',
              padding: '4px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)',
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'grid' ? '#FFFFFF' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
                fontSize: '0.8125rem',
                transition: 'all var(--transition-fast)',
              }}
            >
              <LayoutGrid size={15} />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                backgroundColor: viewMode === 'table' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'table' ? '#FFFFFF' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
                fontSize: '0.8125rem',
                transition: 'all var(--transition-fast)',
              }}
            >
              <TableIcon size={15} />
              <span>Table</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Main View: Virtual Cards or Data Table */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <Skeleton height="220px" count={4} />
        </div>
      ) : filteredAccounts.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
          <Wallet size={48} style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            No accounts match your query
          </h3>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Open an account to initiate records in Banking-Service.
          </p>
          <Button
            variant="primary"
            onClick={handleOpenCreate}
            style={{ marginTop: '1.25rem' }}
            leftIcon={<Plus size={16} />}
          >
            Open First Account
          </Button>
        </Card>
      ) : viewMode === 'grid' ? (
        /* 3D Visual Cards View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredAccounts.map((acc) => {
            const themeClass = getCardTheme(acc.accountType);

            return (
              <div key={acc.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* 3D Realistic Bank Card */}
                <div className={`virtual-card ${themeClass}`}>
                  {/* Card Header: Brand + Contactless */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ShieldCheck size={20} style={{ color: '#FFFFFF' }} />
                      <span style={{ fontWeight: 800, letterSpacing: '0.05em', fontSize: '0.95rem' }}>
                        APEX<span style={{ opacity: 0.8 }}>BANK</span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Wifi size={18} style={{ transform: 'rotate(90deg)', opacity: 0.8 }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.15)' }}>
                        {acc.accountType}
                      </span>
                    </div>
                  </div>

                  {/* EMV Microchip & Contactless */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="card-chip" />
                  </div>

                  {/* Card Number */}
                  <div>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.7, letterSpacing: '0.08em', marginBottom: '2px' }}>
                      Account Ledger Number
                    </div>
                    <div className="card-number">
                      {acc.accountNumber}
                    </div>
                  </div>

                  {/* Card Footer: Balance & Linked Owner */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', opacity: 0.7, letterSpacing: '0.05em' }}>
                        Available Liquidity
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                        ${Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.6875rem', opacity: 0.7, textTransform: 'uppercase' }}>
                        Linked Profile
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                        {acc.employeeId ? `Employee #${acc.employeeId}` : 'Commercial Vault'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action Tray underneath each virtual card */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    variant="emerald"
                    size="sm"
                    style={{ flex: 1 }}
                    onClick={() => { setSelectedAccountId(acc.id); setIsTxModalOpen(true); }}
                    leftIcon={<ArrowDownLeft size={14} />}
                  >
                    Deposit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    style={{ flex: 1 }}
                    onClick={() => { setSelectedAccountId(acc.id); setIsTxModalOpen(true); }}
                    leftIcon={<ArrowUpRight size={14} />}
                  >
                    Withdraw
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(acc)}
                    title="Edit Account Details"
                  >
                    <Edit3 size={15} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeletingId(acc.id!)}
                    title="Close Account"
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Data Table View */
        <Card style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Account Number</th>
                  <th>Classification</th>
                  <th>Ledger Balance</th>
                  <th>Linked Member</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((acc) => (
                  <tr key={acc.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem' }}>
                      {acc.accountNumber}
                    </td>
                    <td>{getAccountBadge(acc.accountType)}</td>
                    <td style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-highlight)' }}>
                      ${Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {acc.employeeId ? `Employee #${acc.employeeId}` : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Button
                          variant="emerald"
                          size="sm"
                          onClick={() => { setSelectedAccountId(acc.id); setIsTxModalOpen(true); }}
                          leftIcon={<ArrowDownLeft size={13} />}
                        >
                          Tx
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(acc)}
                          leftIcon={<Edit3 size={13} />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeletingId(acc.id!)}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Account Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSubmit={async (account) => {
          if (editingAccount?.id) {
            await updateAccount({ id: editingAccount.id, data: account });
          } else {
            await createAccount(account);
          }
        }}
        initialData={editingAccount}
        isLoading={isCreating || isUpdating}
      />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSubmit={createTransaction}
        accounts={accounts}
        defaultAccountId={selectedAccountId}
        isLoading={isCreatingTx}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Account Closure"
        message="Are you sure you want to permanently delete this bank account? All transaction associations will be removed."
        confirmText="Yes, Close Account"
        isConfirming={isDeleting}
      />
    </div>
  );
};
