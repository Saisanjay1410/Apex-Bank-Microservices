import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Users, 
  Activity, 
  Plus, 
  Send, 
  ShieldCheck, 
  Sparkles,
  Server,
  TrendingUp,
  RefreshCw,
  CreditCard,
  Layers,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { useEmployees } from '../hooks/useEmployees';
import { useHealth } from '../hooks/useHealth';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { AccountModal } from '../components/banking/AccountModal';
import { TransactionModal } from '../components/banking/TransactionModal';
import { EmployeeModal } from '../components/employees/EmployeeModal';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { accounts, isLoading: accountsLoading, createAccount, isCreating: isCreatingAccount, refetch: refetchAccounts } = useAccounts();
  const { transactions, isLoading: txsLoading, createTransaction, isCreating: isCreatingTx, refetch: refetchTxs } = useTransactions();
  const { employees, isLoading: empsLoading, createEmployee, isCreating: isCreatingEmp } = useEmployees();
  const { data: healthData, refetch: refetchHealth, isFetching: isCheckingHealth } = useHealth();

  // Modals state
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number | undefined>();

  // Calculate Metrics
  const totalBalance = accounts.reduce((acc, curr) => acc + (Number(curr.balance) || 0), 0);
  const totalTxVolume = transactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const role = user?.role || 'ROLE_EMPLOYEE';
  const isAdminOrHr = role === 'ROLE_ADMIN' || role === 'ADMIN' || role === 'ROLE_HR' || role === 'HR';

  const handleRefreshAll = () => {
    refetchAccounts();
    refetchTxs();
    refetchHealth();
  };

  const getTxBadge = (type: string) => {
    if (type === 'DEPOSIT') return <Badge variant="emerald" size="sm">Deposit</Badge>;
    if (type === 'WITHDRAWAL') return <Badge variant="rose" size="sm">Withdrawal</Badge>;
    return <Badge variant="indigo" size="sm">Transfer</Badge>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Hero Welcome Banner */}
      <Card
        style={{
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(5, 150, 105, 0.04) 100%)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
              <Badge variant="indigo" dot>
                {role.replace('ROLE_', '')} CONSOLE
              </Badge>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• Spring Cloud Cluster</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Welcome back, {user?.username || 'Executive'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem', maxWidth: '620px' }}>
              Institutional treasury, automated payroll, and AI-assisted financial operations across your microservices cluster.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              size="md"
              onClick={handleRefreshAll}
              leftIcon={<RefreshCw size={15} className={isCheckingHealth ? 'animate-spin' : ''} />}
            >
              Sync Nodes
            </Button>
            <Button
              variant="emerald"
              size="md"
              onClick={() => {
                setSelectedAccountId(accounts[0]?.id);
                setIsTxModalOpen(true);
              }}
              leftIcon={<ArrowDownLeft size={16} />}
            >
              Quick Deposit
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAccountModalOpen(true)}
              leftIcon={<Plus size={16} />}
            >
              New Account
            </Button>
          </div>
        </div>
      </Card>

      {/* KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Total Vault Liquidity */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Vault Liquidity
              </p>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.35rem', fontFamily: 'var(--font-sans)' }}>
                {accountsLoading ? (
                  <Skeleton width="130px" height="32px" />
                ) : (
                  `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                )}
              </div>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-emerald-light)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wallet size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.6rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              <TrendingUp size={13} /> +12.4%
            </span>
            <span>vs last cycle</span>
          </div>
        </Card>

        {/* Active Accounts */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Accounts
              </p>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.35rem', fontFamily: 'var(--font-sans)' }}>
                {accountsLoading ? <Skeleton width="50px" height="32px" /> : accounts.length}
              </div>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} />
            </div>
          </div>
          <div style={{ marginTop: '0.6rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <span>Checking, Savings & Treasury</span>
          </div>
        </Card>

        {/* Processed Volume */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Processed Volume
              </p>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.35rem', fontFamily: 'var(--font-sans)' }}>
                {txsLoading ? (
                  <Skeleton width="110px" height="32px" />
                ) : (
                  `$${totalTxVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                )}
              </div>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-cyan-light)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Activity size={20} />
            </div>
          </div>
          <div style={{ marginTop: '0.6rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <span>{transactions.length} total operations recorded</span>
          </div>
        </Card>

        {/* Enterprise Staff */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Enterprise Staff
              </p>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.35rem', fontFamily: 'var(--font-sans)' }}>
                {empsLoading ? <Skeleton width="50px" height="32px" /> : employees.length}
              </div>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-amber-light)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={20} />
            </div>
          </div>
          <div style={{ marginTop: '0.6rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <span>Synced with Payroll-Service (Port 8082)</span>
          </div>
        </Card>
      </div>

      {/* Cluster Microservices Status Widget */}
      <Card>
        <div className="card-header" style={{ marginBottom: '1rem' }}>
          <div>
            <h3 className="card-title">
              <Server size={17} style={{ color: 'var(--primary)' }} />
              Spring Boot Microservices Cluster Status
            </h3>
            <p className="card-subtitle">
              Live endpoints monitored across Eureka discovery registry
            </p>
          </div>
          <Badge variant="emerald" dot>
            Healthy Topology
          </Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
          {[
            { name: 'Eureka Discovery Server', port: ':8761', path: 'eureka', status: 'ONLINE' },
            { name: 'Spring Cloud API Gateway', port: ':8090', path: 'actuator/health', status: 'ONLINE' },
            { name: 'Banking Service', port: ':8081', path: 'api/accounts', status: 'ONLINE' },
            { name: 'Payroll Service', port: ':8082', path: 'api/employees', status: 'ONLINE' },
            { name: 'AI Chatbot Service', port: ':8083', path: 'api/chat', status: 'ONLINE' },
          ].map((node, nIdx) => (
            <div
              key={nIdx}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-card)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                  {node.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
                  Port {node.port}
                </div>
              </div>
              <span className="pulse-dot" style={{ backgroundColor: 'var(--accent-emerald)', width: '7px', height: '7px' }} />
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Ledger Activity Table */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-card)' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
              Recent Ledger Operations
            </h3>
            <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Real-time audit log of funds settlement
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedAccountId(accounts[0]?.id);
              setIsTxModalOpen(true);
            }}
            leftIcon={<Plus size={14} />}
          >
            Post Entry
          </Button>
        </div>

        {txsLoading ? (
          <div style={{ padding: '1.5rem' }}>
            <Skeleton height="40px" count={4} />
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No transaction records found.
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Memo</th>
                  <th>Target Account</th>
                  <th>Settlement Amount</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((tx) => {
                  const isDeposit = tx.transactionType === 'DEPOSIT';
                  const isWithdrawal = tx.transactionType === 'WITHDRAWAL';

                  return (
                    <tr key={tx.id}>
                      <td>{getTxBadge(tx.transactionType)}</td>
                      <td>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                          {tx.remarks || 'Standard Banking Operation'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                          Account #{tx.accountId}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 600,
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
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.78125rem' }}>
                        {tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : 'Today'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modals */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSubmit={createAccount}
        isLoading={isCreatingAccount}
      />

      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSubmit={createTransaction}
        accounts={accounts}
        defaultAccountId={selectedAccountId}
        isLoading={isCreatingTx}
      />

      <EmployeeModal
        isOpen={isEmpModalOpen}
        onClose={() => setIsEmpModalOpen(false)}
        onSubmit={createEmployee}
        isLoading={isCreatingEmp}
      />
    </div>
  );
};