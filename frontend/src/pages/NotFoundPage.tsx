import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          marginBottom: '1.25rem',
        }}
      >
        <ShieldAlert size={36} />
      </div>

      <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.25rem' }}>
        Endpoint or Route Not Found
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', marginTop: '0.5rem', fontSize: '0.9rem' }}>
        The microservice endpoint or frontend view you are trying to access does not exist on the current routing table.
      </p>

      <Button
        variant="primary"
        onClick={() => navigate('/dashboard')}
        leftIcon={<Home size={16} />}
        style={{ marginTop: '1.5rem' }}
      >
        Return to Dashboard
      </Button>
    </div>
  );
};
