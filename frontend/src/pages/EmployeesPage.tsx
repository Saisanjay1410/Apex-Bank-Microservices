import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  UserCheck, 
  Edit3, 
  Trash2, 
  Building2, 
  DollarSign,
  Phone,
  MapPin,
  Briefcase
} from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmployeeModal } from '../components/employees/EmployeeModal';
import { CreateHrModal } from '../components/employees/CreateHrModal';
import type { EmployeeDTO } from '../types';

export const EmployeesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    employees, 
    isLoading, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee, 
    createHrUser,
    isCreating, 
    isUpdating, 
    isDeleting,
    isCreatingHr 
  } = useEmployees();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Modals state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isHrModalOpen, setIsHrModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeDTO | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const role = user?.role || 'ROLE_EMPLOYEE';
  const isAdmin = role === 'ROLE_ADMIN' || role === 'ADMIN';

  // Filters
  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  // Calculate metrics
  const totalPayroll = employees.reduce((acc, curr) => acc + (Number(curr.salary) || 0), 0);
  const avgSalary = employees.length > 0 ? totalPayroll / employees.length : 0;

  const handleOpenEdit = (emp: EmployeeDTO) => {
    setEditingEmployee(emp);
    setIsEmployeeModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setIsEmployeeModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      await deleteEmployee(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
            Enterprise Staff Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Maintained via Banking-Service and synced with Payroll-Service (Port 8082)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isAdmin && (
            <Button
              variant="secondary"
              onClick={() => setIsHrModalOpen(true)}
              leftIcon={<UserCheck size={16} style={{ color: 'var(--accent-amber)' }} />}
            >
              Create HR User
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleOpenCreate}
            leftIcon={<Plus size={16} />}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <Card style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={20} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Headcount</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {employees.length} Personnel
              </p>
            </div>
          </div>
        </Card>

        <Card style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DollarSign size={20} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Annual Payroll Budget</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                ${totalPayroll.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </Card>

        <Card style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Building2 size={20} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Average Compensation</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                ${avgSalary.toLocaleString('en-US', { maximumFractionDigits: 0 })} / yr
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
              placeholder="Search by name, ID, or title..."
              className="form-control"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: '180px', cursor: 'pointer' }}
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Compliance">Compliance</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
      </Card>

      {/* Directory Table */}
      <Card style={{ padding: 0 }}>
        {isLoading ? (
          <div style={{ padding: '1.5rem' }}>
            <Skeleton height="50px" count={5} />
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>No employee records found</h3>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Add staff members to synchronize records with the Banking and Payroll microservices.
            </p>
            <Button
              variant="primary"
              onClick={handleOpenCreate}
              style={{ marginTop: '1.25rem' }}
              leftIcon={<Plus size={16} />}
            >
              Onboard First Employee
            </Button>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>ID</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Salary</th>
                  <th>Contact</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: 'var(--radius-full)',
                            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                          }}
                        >
                          {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, margin: 0 }}>
                            {emp.firstName} {emp.lastName}
                          </p>
                          {emp.address && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                              {emp.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                      {emp.employeeId}
                    </td>
                    <td>
                      <Badge variant="indigo" size="sm">
                        {emp.department}
                      </Badge>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {emp.designation}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                      ${Number(emp.salary).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                      {emp.phone || 'â€”'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(emp)}
                          leftIcon={<Edit3 size={13} />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeletingId(emp.id!)}
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
        )}
      </Card>

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSubmit={async (emp) => {
          if (editingEmployee?.id) {
            await updateEmployee({ id: editingEmployee.id, data: emp });
          } else {
            await createEmployee(emp);
          }
        }}
        initialData={editingEmployee}
        isLoading={isCreating || isUpdating}
      />

      {/* HR Provisioning Modal (Admin Only) */}
      <CreateHrModal
        isOpen={isHrModalOpen}
        onClose={() => setIsHrModalOpen(false)}
        onSubmit={createHrUser}
        isLoading={isCreatingHr}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Employee Record"
        message="Are you sure you want to remove this employee from the directory? Linked payroll records may be affected."
        isConfirming={isDeleting}
      />
    </div>
  );
};
