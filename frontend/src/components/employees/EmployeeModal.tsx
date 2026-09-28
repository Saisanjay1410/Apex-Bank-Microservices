import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { EmployeeDTO } from '../../types';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: EmployeeDTO) => Promise<any>;
  initialData?: EmployeeDTO | null;
  isLoading?: boolean;
}

const DEPARTMENTS = [
  { label: 'Engineering & Technology', value: 'Engineering' },
  { label: 'Human Resources', value: 'Human Resources' },
  { label: 'Finance & Treasury', value: 'Finance' },
  { label: 'Compliance & AML Risk', value: 'Compliance' },
  { label: 'Banking Operations', value: 'Operations' },
  { label: 'Executive Leadership', value: 'Executive' },
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('');
  const [salary, setSalary] = useState('85000');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setEmployeeId(initialData.employeeId);
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
      setDepartment(initialData.department);
      setDesignation(initialData.designation);
      setSalary(String(initialData.salary));
      setPhone(initialData.phone || '');
      setAddress(initialData.address || '');
    } else {
      setEmployeeId(`EMP-${Math.floor(100 + Math.random() * 900)}`);
      setFirstName('');
      setLastName('');
      setDepartment('Engineering');
      setDesignation('Software Engineer');
      setSalary('95000');
      setPhone('');
      setAddress('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!designation.trim()) newErrors.designation = 'Designation is required';
    const numSalary = parseFloat(salary);
    if (isNaN(numSalary) || numSalary < 0) {
      newErrors.salary = 'Salary cannot be negative';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit({
        employeeId: employeeId.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        department,
        designation: designation.trim(),
        salary: numSalary,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
      });
      onClose();
    } catch {
      // Handled by react-query
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Employee Profile' : 'Add New Staff Member'}
      subtitle="Maintains synced employee records with Banking and Payroll microservices"
      maxWidth="580px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            {initialData ? 'Update Profile' : 'Onboard Employee'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Input
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.firstName}
            placeholder="e.g. Elena"
            required
          />
          <Input
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={errors.lastName}
            placeholder="e.g. Vance"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Input
            label="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            error={errors.employeeId}
            placeholder="EMP-101"
            required
          />
          <Select
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            options={DEPARTMENTS}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Input
            label="Designation / Role"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            error={errors.designation}
            placeholder="e.g. Lead Systems Architect"
            required
          />
          <Input
            label="Annual Salary ($ USD)"
            type="number"
            step="1000"
            min="0"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            error={errors.salary}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Input
            label="Contact Phone (Optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
          <Input
            label="Work Location / Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="New York Tech Center"
          />
        </div>
      </form>
    </Modal>
  );
};
