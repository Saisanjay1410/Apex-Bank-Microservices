import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'gray';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'indigo',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const dotColors: Record<string, string> = {
    indigo: '#818CF8',
    emerald: '#34D399',
    amber: '#FBBF24',
    rose: '#FB7185',
    cyan: '#38BDF8',
    gray: '#9CA3AF',
  };

  const styleOverrides = size === 'sm' ? { fontSize: '0.6875rem', padding: '0.125rem 0.5rem' } : {};

  return (
    <span className={`badge badge-${variant} ${className}`} style={styleOverrides}>
      {dot && (
        <span
          className="pulse-dot"
          style={{
            width: '6px',
            height: '6px',
            backgroundColor: dotColors[variant] || '#818CF8',
          }}
        />
      )}
      {children}
    </span>
  );
};
