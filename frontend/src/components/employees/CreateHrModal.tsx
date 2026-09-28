import React, { useState } from 'react';
import { UserCheck, ShieldAlert } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { CreateHrRequest } from '../../types';

interface CreateHrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: CreateHrRequest) => Promise<any>;
  isLoading?: boolean;
}

export const CreateHrModal: React.FC<CreateHrModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Hr@123456');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!username.trim()) newErrors.username = 'Username is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email address is required';
    if (!password || password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      setUsername('');
      setEmail('');
      setPassword('Hr@123456');
      onClose();
    } catch {
      // Handled by react-query
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Provision HR Administrator"
      subtitle="Creates a privileged HR manager credential via Spring Boot Auth API (Admin Only)"
      maxWidth="480px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
            leftIcon={<UserCheck size={16} />}
          >
            Create HR User
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            marginBottom: '1rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          <ShieldAlert size={20} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            HR users receive elevated authorization to view employee compensation and update personnel directories.
          </p>
        </div>

        <Input
          label="HR Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
          placeholder="e.g. sarah_hr"
          required
        />

        <Input
          label="Corporate Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="e.g. sarah@apexbank.com"
          required
        />

        <Input
          label="Initial Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          helperText="Must contain at least 8 characters"
          required
        />
      </form>
    </Modal>
  );
};
