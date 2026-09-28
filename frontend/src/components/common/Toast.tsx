import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';
import type { ToastMessage } from '../../types';

export const ToastItem: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const { removeToast } = useToastStore();

  const icons = {
    success: <CheckCircle2 size={20} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />,
    error: <XCircle size={20} style={{ color: 'var(--accent-rose)', flexShrink: 0 }} />,
    warning: <AlertTriangle size={20} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />,
    info: <Info size={20} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />,
  };

  const borderColors = {
    success: 'rgba(16, 185, 129, 0.4)',
    error: 'rgba(244, 63, 94, 0.4)',
    warning: 'rgba(245, 158, 11, 0.4)',
    info: 'rgba(6, 182, 212, 0.4)',
  };

  return (
    <div
      className="toast"
      style={{
        borderLeft: `4px solid ${borderColors[toast.type]}`,
      }}
      role="alert"
    >
      {icons[toast.type]}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
          {toast.title}
        </p>
        {toast.description && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px',
        }}
        aria-label="Dismiss toast"
      >
        <X size={15} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
