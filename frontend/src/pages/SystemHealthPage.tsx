import React from 'react';
import { 
  Activity, 
  Server, 
  Radio, 
  ExternalLink, 
  RefreshCw, 
  Database, 
  Cpu, 
  Bot, 
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useHealth } from '../hooks/useHealth';
import { useAuthStore } from '../store/useAuthStore';
import { config } from '../config/env';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const SystemHealthPage: React.FC = () => {
  const { data: endpoints, isLoading, refetch, isFetching } = useHealth();
  const { mockMode, toggleMockMode } = useAuthStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />;
      case 'DEGRADED':
        return <AlertTriangle size={18} style={{ color: 'var(--accent-amber)' }} />;
      case 'OFFLINE':
        return <XCircle size={18} style={{ color: 'var(--accent-rose)' }} />;
      default:
        return <HelpCircle size={18} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return <Badge variant="emerald" dot>Online</Badge>;
      case 'DEGRADED':
        return <Badge variant="amber" dot>Degraded</Badge>;
      case 'OFFLINE':
        return <Badge variant="rose" dot>Offline</Badge>;
      default:
        return <Badge variant="gray">Probing</Badge>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
              Cluster Health & Microservices Topology
            </h1>
            <Badge variant="cyan" dot>
              Spring Cloud 2025.1
            </Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Real-time ping telemetry across Eureka, Gateway, Banking, Payroll & AI services
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            onClick={() => toggleMockMode()}
            leftIcon={<Database size={15} />}
          >
            {mockMode ? 'Switch to Live Backend' : 'Switch to Mock Mode'}
          </Button>
          <Button
            variant="primary"
            onClick={() => refetch()}
            isLoading={isFetching}
            leftIcon={<RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />}
          >
            Probe Cluster
          </Button>
        </div>
      </div>

      {/* Visual Microservice Architecture Topology */}
      <Card>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Layers size={18} style={{ color: 'var(--primary)' }} />
              Spring Cloud Microservices Topology
            </h3>
            <p className="card-subtitle">Service mesh routing & inter-process communication</p>
          </div>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center',
          }}
        >
          {/* Level 1: Client & Discovery */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div
              style={{
                padding: '1rem 1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--primary)',
                textAlign: 'center',
                minWidth: '200px',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              <Cpu size={22} style={{ color: 'var(--primary)', margin: '0 auto 0.25rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Vite React Frontend</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Port 5173</div>
            </div>

            <div
              style={{
                padding: '1rem 1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                minWidth: '200px',
              }}
            >
              <Radio size={22} style={{ color: 'var(--accent-amber)', margin: '0 auto 0.25rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Eureka Registry</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Port 8761</div>
            </div>
          </div>

          {/* Level 2: API Gateway */}
          <div
            style={{
              padding: '0.875rem 2.5rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              textAlign: 'center',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.1)',
            }}
          >
            <Server size={20} style={{ color: 'var(--accent-cyan)', margin: '0 auto 0.25rem' }} />
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Spring Cloud API Gateway</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Port 8090 (WebFlux Reactive Proxy)</div>
          </div>

          {/* Level 3: Downstream Services */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', width: '100%' }}>
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
              }}
            >
              <Database size={20} style={{ color: 'var(--accent-emerald)', margin: '0 auto 0.25rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Banking Service</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Port 8081 (JWT, DB)</div>
            </div>

            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
              }}
            >
              <Activity size={20} style={{ color: 'var(--accent-purple)', margin: '0 auto 0.25rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Payroll Service</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Port 8082 (Kafka)</div>
            </div>

            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
              }}
            >
              <Bot size={20} style={{ color: 'var(--accent-cyan)', margin: '0 auto 0.25rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>AI Chatbot Service</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Port 8083 (AI Chatbot)</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Service Endpoint Telemetry Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {endpoints?.map((svc) => (
          <Card key={svc.id} interactive style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getStatusIcon(svc.status)}
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{svc.name}</h3>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {svc.description}
                </p>
              </div>
              {getStatusBadge(svc.status)}
            </div>

            <div
              style={{
                padding: '0.875rem 1rem',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.8125rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Assigned TCP Port:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>:{svc.port}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Direct Target URL:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{svc.targetUrl}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Response Latency:</span>
                <span style={{ fontWeight: 600, color: svc.latencyMs ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                  {svc.latencyMs ? `${svc.latencyMs} ms` : 'Offline / Standby'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Last Ping Check:</span>
                <span style={{ color: 'var(--text-muted)' }}>{svc.lastChecked || 'Just now'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
              <a
                href={svc.targetUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Direct Open</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Environment Configuration Inspector */}
      <Card>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Server size={18} style={{ color: 'var(--accent-emerald)' }} />
              Active Environment Configuration
            </h3>
            <p className="card-subtitle">Resolved variables from .env & .env.development</p>
          </div>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Configuration Key</th>
                <th>Resolved Endpoint / Value</th>
                <th>Proxy Routing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>VITE_BANKING_SERVICE_URL</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent-emerald)' }}>
                  {config.directUrls.banking}
                </td>
                <td>
                  <Badge variant="indigo" size="sm">/api/banking</Badge>
                </td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>VITE_PAYROLL_SERVICE_URL</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent-emerald)' }}>
                  {config.directUrls.payroll}
                </td>
                <td>
                  <Badge variant="indigo" size="sm">/api/payroll</Badge>
                </td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>VITE_CHATBOT_SERVICE_URL</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent-emerald)' }}>
                  {config.directUrls.chatbot}
                </td>
                <td>
                  <Badge variant="indigo" size="sm">/api/chatbot</Badge>
                </td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>VITE_API_GATEWAY_URL</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent-emerald)' }}>
                  {config.directUrls.gateway}
                </td>
                <td>
                  <Badge variant="indigo" size="sm">/api/gateway</Badge>
                </td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>VITE_EUREKA_SERVER_URL</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent-emerald)' }}>
                  {config.directUrls.eureka}
                </td>
                <td>
                  <Badge variant="indigo" size="sm">/api/eureka</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
