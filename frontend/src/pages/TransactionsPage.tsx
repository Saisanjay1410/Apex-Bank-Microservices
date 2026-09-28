import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Plus, 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Download, 
  Trash2,
  Calendar,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { TransactionModal } from '../components/banking/TransactionModal';
import { useToastStore } from '../store/useToastStore';

export const TransactionsPage: React.FC = () => {
  const { transactions, isLoading, createTransaction, deleteTransaction, isCreating, isDeleting } = useTransactions();
  const { accounts } = useAccounts();
  const { addToast } = useToastStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Filter transactions
  const filteredTxs = transactions.filter((tx) => {
    const matchesSearch =
      (tx.remarks && tx.remarks.toLowerCase().includes(searchTerm.toLowerCase())) ||
      String(tx.accountId).includes(searchTerm) ||
      (tx.id && String(tx.id).includes(searchTerm));
    const matchesType = filterType === 'ALL' || tx.transactionType === filterType;
    return matchesSearch && matchesType;
  });

  // Calculate transaction stats
  const totalDeposits = transactions
    .filter((t) => t.transactionType === 'DEPOSIT')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const totalWithdrawals = transactions
    .filter((t) => t.transactionType === 'WITHDRAWAL')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const netFlow = totalDeposits - totalWithdrawals;
  const turnover = totalDeposits + totalWithdrawals;
  const inflowRatio = turnover > 0 ? Math.round((totalDeposits / turnover) * 100) : 50;

  const handleExportCSV = () => {
    if (filteredTxs.length === 0) return;
    const headers = ['Transaction ID', 'Account ID', 'Type', 'Amount ($)', 'Remarks', 'Timestamp'];
    const rows = filteredTxs.map((t) => [
      t.id || '',
      t.accountId,
      t.transactionType,
      t.amount,
      `"${(t.remarks || '').replace(/"/g, '""')}"`,
      t.timestamp || new Date().toISOString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apex_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'info',
      title: 'Report Downloaded',
      description: 'Transaction ledger successfully exported to CSV.',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.625rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
              Transaction Ledger
            </h1>
            <Badge variant="indigo" dot>
              Real-Time Sync
            </Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Audited financial operations stream connecting directly to Banking-Service (Port 8081)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download size={14} />}
          >
            Export CSV
          </Button>
          <Button
            variant="emerald"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus size={15} />}
          >
            Post Transaction
          </Button>
        </div>
      </div>

      {/* 3 Balanced KPI Cards in ONE Clean Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
        {/* Total Inflow */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Inflow (Deposits)
              </p>
              <p style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '0.25rem', fontFamily: 'var(--font-sans)' }}>
                +${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowDownLeft size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              <TrendingUp size={13} /> {inflowRatio}%
            </span>
            <span>of total ledger volume</span>
          </div>
        </Card>

        {/* Total Outflow */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Outflow (Debits)
              </p>
              <p style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--accent-rose)', marginTop: '0.25rem', fontFamily: 'var(--font-sans)' }}>
                -${totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                color: 'var(--accent-rose)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
            <span>Settled across active accounts</span>
          </div>
        </Card>

        {/* Net Flow Ratio */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Net Liquidity Delta
              </p>
              <p
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  color: netFlow >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                  marginTop: '0.25rem',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {netFlow >= 0 ? '+' : ''}${netFlow.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowLeftRight size={20} />
            </div>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Liquidity ratio</span>
              <span>{inflowRatio}% inflow</span>
            </div>
            <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${inflowRatio}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10B981, #6366F1)',
                  borderRadius: '999px',
                }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar with Clean Tabs */}
      <Card style={{ padding: '0.875rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by memo, Account ID, or Tx Reference..."
              className="form-control"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          {/* Clean Segmented Filter Pills */}
          <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--bg-tertiary)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
            {[
              { id: 'ALL', label: 'All Operations', count: transactions.length },
              { id: 'DEPOSIT', label: 'Credits' },
              { id: 'WITHDRAWAL', label: 'Debits' },
              { id: 'TRANSFER', label: 'Transfers' },
            ].map((tab) => {
              const active = filterType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: active ? 'var(--primary)' : 'transparent',
                    color: active ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: active ? 600 : 500,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({tab.count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Main Ledger Table */}
      <Card style={{ padding: 0 }}>
        {isLoading ? (
          <div style={{ padding: '1.5rem' }}>
            <Skeleton height="50px" count={5} />
          </div>
        ) : filteredTxs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
            <ArrowLeftRight size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              No transactions found
            </h3>
            <p style={{ fontSize: '0.8125rem', margin: '0.25rem auto 1.25rem' }}>
              No recorded operations match your query.
            </p>
            <Button
              variant="emerald"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Plus size={15} />}
            >
              Post First Transaction
            </Button>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Operation</th>
                  <th>Transaction Memo</th>
                  <th>Account Reference</th>
                  <th>Settlement Amount</th>
                  <th>Timestamp</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.map((tx) => {
                  const isDeposit = tx.transactionType === 'DEPOSIT';
                  const isWithdrawal = tx.transactionType === 'WITHDRAWAL';

                  return (
                    <tr key={tx.id}>
                      {/* Operation Icon + Type */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: isDeposit
                                ? 'rgba(16, 185, 129, 0.12)'
                                : isWithdrawal
                                ? 'rgba(239, 68, 68, 0.12)'
                                : 'rgba(99, 102, 241, 0.12)',
                              color: isDeposit
                                ? 'var(--accent-emerald)'
                                : isWithdrawal
                                ? 'var(--accent-rose)'
                                : 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {isDeposit ? (
                              <ArrowDownLeft size={16} />
                            ) : isWithdrawal ? (
                              <ArrowUpRight size={16} />
                            ) : (
                              <ArrowLeftRight size={16} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                              {tx.transactionType}
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                              #{tx.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Memo / Remarks */}
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                          {tx.remarks || 'Standard Banking Operation'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.725rem', color: 'var(--accent-emerald)', marginTop: '2px' }}>
                          <CheckCircle2 size={11} />
                          <span>Settled via Spring Boot</span>
                        </div>
                      </td>

                      {/* Account Reference with Mini Card Chip */}
                      <td>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-subtle)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.78125rem',
                            fontWeight: 500,
                          }}
                        >
                          <CreditCard size={13} style={{ color: 'var(--primary)' }} />
                          <span>Account #{tx.accountId}</span>
                        </div>
                      </td>

                      {/* Settlement Amount */}
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: isDeposit
                              ? 'var(--accent-emerald)'
                              : isWithdrawal
                              ? 'var(--accent-rose)'
                              : 'var(--text-primary)',
                          }}
                        >
                          {isDeposit ? '+' : '-'}${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                          {tx.timestamp ? new Date(tx.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.725rem' }}>
                          {tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingId(tx.id!)}
                          title="Delete record from ledger"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createTransaction}
        accounts={accounts}
        isLoading={isCreating}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={async () => {
          if (deletingId) {
            await deleteTransaction(deletingId);
            setDeletingId(null);
          }
        }}
        title="Delete Transaction Record"
        message="Are you sure you want to permanently remove this transaction from the ledger? This action cannot be reversed."
        isConfirming={isDeleting}
      />
    </div>
  );
};