import {
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Download,
  Edit3,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  department: string;
  position: string;
  employmentType: string;
  salary: number;
  status: "Active" | "Inactive";
  email: string;
  phone: string;
}

const initialEmployees: Employee[] = [
  {
    id: "1",
    employeeNumber: "EMP-0001",
    name: "John Mwangi",
    department: "Finance",
    position: "Accountant",
    employmentType: "Full Time",
    salary: 1500000,
    status: "Active",
    email: "john.mwangi@example.com",
    phone: "+255 712 345 001",
  },
  {
    id: "2",
    employeeNumber: "EMP-0002",
    name: "Sarah Johnson",
    department: "Human Resources",
    position: "HR Manager",
    employmentType: "Full Time",
    salary: 2200000,
    status: "Active",
    email: "sarah.johnson@example.com",
    phone: "+255 712 345 002",
  },
  {
    id: "3",
    employeeNumber: "EMP-0003",
    name: "Michael Smith",
    department: "Information Technology",
    position: "Software Engineer",
    employmentType: "Full Time",
    salary: 2800000,
    status: "Active",
    email: "michael.smith@example.com",
    phone: "+255 712 345 003",
  },
  {
    id: "4",
    employeeNumber: "EMP-0004",
    name: "Amina Hassan",
    department: "Administration",
    position: "Administrator",
    employmentType: "Full Time",
    salary: 1200000,
    status: "Inactive",
    email: "amina.hassan@example.com",
    phone: "+255 712 345 004",
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(value);

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [employmentFilter, setEmploymentFilter] = useState("All");

  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const [showActions, setShowActions] = useState<string | null>(null);

  const departments = useMemo(
    () => [
      "All",
      ...new Set(employees.map((employee) => employee.department)),
    ],
    [employees],
  );

  const employmentTypes = useMemo(
    () => [
      "All",
      ...new Set(employees.map((employee) => employee.employmentType)),
    ],
    [employees],
  );

  const filteredEmployees = useMemo(() => {
    const query = search.toLowerCase().trim();

    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(query) ||
        employee.employeeNumber.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query) ||
        employee.position.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || employee.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        employee.department === departmentFilter;

      const matchesEmployment =
        employmentFilter === "All" ||
        employee.employmentType === employmentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartment &&
        matchesEmployment
      );
    });
  }, [
    employees,
    search,
    statusFilter,
    departmentFilter,
    employmentFilter,
  ]);

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active",
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "Inactive",
  ).length;

  const totalPayroll = employees
    .filter((employee) => employee.status === "Active")
    .reduce((total, employee) => total + employee.salary, 0);

  const handleDelete = (employee: Employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${employee.name}?`,
    );

    if (!confirmed) return;

    setEmployees((current) =>
      current.filter((item) => item.id !== employee.id),
    );

    setShowActions(null);
  };

  return (
    <div className="space-y-6">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-brand)]">
            <span className="h-px w-5 bg-[var(--color-brand)]" />
            Workforce
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            Employees
          </h1>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Manage employee records and workforce information.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary">
            <Download size={16} />
            Export
          </Button>

          <Button onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Add Employee
          </Button>
        </div>
      </div>

      {/* =========================================================
          STATISTICS
      ========================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                Total Employees
              </p>

              <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                {employees.length}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <Users size={17} />
            </div>
          </div>
        </Card>

        {/* Active */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                Active
              </p>

              <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                {activeEmployees}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-success)]/10 text-[var(--color-success)]">
              <Check size={17} />
            </div>
          </div>
        </Card>

        {/* Inactive */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                Inactive
              </p>

              <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                {inactiveEmployees}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-secondary)]">
              <Users size={17} />
            </div>
          </div>
        </Card>

        {/* Payroll */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                Monthly Payroll
              </p>

              <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">
                {formatCurrency(totalPayroll)}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <BriefcaseBusiness size={17} />
            </div>
          </div>
        </Card>
      </div>

      {/* =========================================================
          EMPLOYEE TABLE
      ========================================================= */}

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[var(--color-border)] p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-sm">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />

            <Input
              placeholder="Search employees..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowFilters((current) => !current)}
            >
              <Filter size={16} />
              Filters
            </Button>

            {(statusFilter !== "All" ||
              departmentFilter !== "All" ||
              employmentFilter !== "All") && (
              <button
                onClick={() => {
                  setStatusFilter("All");
                  setDepartmentFilter("All");
                  setEmploymentFilter("All");
                }}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--color-brand)] transition-colors hover:bg-[var(--color-brand-soft)]"
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg)] p-5 md:grid-cols-3">
            <FilterSelect
              label="Status"
              value={statusFilter}
              options={["All", "Active", "Inactive"]}
              onChange={setStatusFilter}
            />

            <FilterSelect
              label="Department"
              value={departmentFilter}
              options={departments}
              onChange={setDepartmentFilter}
            />

            <FilterSelect
              label="Employment Type"
              value={employmentFilter}
              options={employmentTypes}
              onChange={setEmploymentFilter}
            />
          </div>
        )}

        {/* Result Count */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
          <p className="text-xs text-[var(--color-text-muted)]">
            Showing{" "}
            <span className="font-medium text-[var(--color-text-secondary)]">
              {filteredEmployees.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[var(--color-text-secondary)]">
              {employees.length}
            </span>{" "}
            employees
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                <th className="px-5 py-4 font-medium">Employee</th>
                <th className="px-5 py-4 font-medium">Department</th>
                <th className="px-5 py-4 font-medium">Position</th>
                <th className="px-5 py-4 font-medium">Employment</th>
                <th className="px-5 py-4 font-medium">Salary</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="w-12 px-5 py-4" />
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="group transition-colors hover:bg-[var(--color-surface-hover)]"
                >
                  {/* Employee */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-xs font-bold text-[var(--color-brand)]">
                        {employee.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">
                          {employee.name}
                        </p>

                        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                          {employee.employeeNumber}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                    {employee.department}
                  </td>

                  {/* Position */}
                  <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                    {employee.position}
                  </td>

                  {/* Employment */}
                  <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                    {employee.employmentType}
                  </td>

                  {/* Salary */}
                  <td className="px-5 py-4 text-sm font-medium text-[var(--color-text)]">
                    {formatCurrency(employee.salary)}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        employee.status === "Active"
                          ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                          : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="relative px-5 py-4">
                    <button
                      onClick={() =>
                        setShowActions(
                          showActions === employee.id
                            ? null
                            : employee.id,
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] opacity-0 transition-all hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] group-hover:opacity-100"
                      aria-label={`Actions for ${employee.name}`}
                    >
                      <MoreHorizontal size={17} />
                    </button>

                    {showActions === employee.id && (
                      <div className="absolute right-5 top-12 z-20 w-44 overflow-hidden rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] p-1 shadow-xl">
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowActions(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                        >
                          <Eye size={14} />
                          View details
                        </button>

                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowActions(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                        >
                          <Edit3 size={14} />
                          Edit employee
                        </button>

                        <div className="my-1 border-t border-[var(--color-border)]" />

                        <button
                          onClick={() => handleDelete(employee)}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/10"
                        >
                          <Trash2 size={14} />
                          Remove employee
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="p-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)]">
              <Users size={22} />
            </div>

            <p className="mt-4 text-sm font-medium text-[var(--color-text)]">
              No employees found
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Try changing your search or filter criteria.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setDepartmentFilter("All");
                setEmploymentFilter("All");
              }}
              className="mt-4 text-xs font-medium text-[var(--color-brand)] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Footer */}
        {filteredEmployees.length > 0 && (
          <div className="flex items-center justify-between border-t border-[var(--color-border)] px-5 py-4">
            <p className="text-xs text-[var(--color-text-muted)]">
              Page 1 of 1
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                disabled
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Employee Details */}
      {selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {/* Add Employee */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={(employee) => {
            setEmployees((current) => [...current, employee]);
            setShowAddModal(false);
          }}
          nextEmployeeNumber={`EMP-${String(
            employees.length + 1,
          ).padStart(4, "0")}`}
        />
      )}
    </div>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="space-y-2">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full appearance-none rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 pr-9 text-xs text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-brand)]"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
      </div>
    </label>
  );
}

/* =========================================================
   EMPLOYEE DETAILS MODAL
========================================================= */

interface EmployeeDetailsModalProps {
  employee: Employee;
  onClose: () => void;
}

function EmployeeDetailsModal({
  employee,
  onClose,
}: EmployeeDetailsModalProps) {
  return (
    <ModalShell title="Employee Details" onClose={onClose}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-lg font-bold text-[var(--color-brand)]">
            {employee.name
              .split(" ")
              .map((name) => name[0])
              .join("")
              .slice(0, 2)}
          </div>

          <div>
            <h3 className="text-base font-semibold text-[var(--color-text)]">
              {employee.name}
            </h3>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {employee.employeeNumber}
            </p>
          </div>

          <span
            className={`ml-auto rounded-full px-2.5 py-1 text-[10px] font-medium ${
              employee.status === "Active"
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-secondary)]"
            }`}
          >
            {employee.status}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailItem label="Department" value={employee.department} />
          <DetailItem label="Position" value={employee.position} />

          <DetailItem
            label="Employment Type"
            value={employee.employmentType}
          />

          <DetailItem
            label="Monthly Salary"
            value={formatCurrency(employee.salary)}
          />

          <DetailItem label="Email" value={employee.email} />
          <DetailItem label="Phone" value={employee.phone} />
        </div>

        <div className="border-t border-[var(--color-border)] pt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
            Payroll Information
          </p>

          <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-text-secondary)]">
                Basic monthly salary
              </span>

              <span className="text-sm font-semibold text-[var(--color-text)]">
                {formatCurrency(employee.salary)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

/* =========================================================
   ADD EMPLOYEE MODAL
========================================================= */

interface AddEmployeeModalProps {
  onClose: () => void;
  onAdd: (employee: Employee) => void;
  nextEmployeeNumber: string;
}

function AddEmployeeModal({
  onClose,
  onAdd,
  nextEmployeeNumber,
}: AddEmployeeModalProps) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [employmentType, setEmploymentType] = useState("Full Time");
  const [salary, setSalary] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!name || !department || !position || !salary) {
      return;
    }

    const employee: Employee = {
      id: crypto.randomUUID(),
      employeeNumber: nextEmployeeNumber,
      name,
      department,
      position,
      employmentType,
      salary: Number(salary),
      status: "Active",
      email,
      phone,
    };

    onAdd(employee);
  };

  return (
    <ModalShell title="Add Employee" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Full Name"
            value={name}
            onChange={setName}
            placeholder="e.g. John Mwangi"
            required
          />

          <FormField
            label="Department"
            value={department}
            onChange={setDepartment}
            placeholder="e.g. Finance"
            required
          />

          <FormField
            label="Position"
            value={position}
            onChange={setPosition}
            placeholder="e.g. Accountant"
            required
          />

          <FormField
            label="Monthly Salary"
            type="number"
            value={salary}
            onChange={setSalary}
            placeholder="e.g. 1500000"
            required
          />

          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="employee@example.com"
          />

          <FormField
            label="Phone"
            value={phone}
            onChange={setPhone}
            placeholder="+255..."
          />
        </div>

        <label className="block space-y-2">
          <span className="block text-xs font-medium text-[var(--color-text-secondary)]">
            Employment Type
          </span>

          <select
            value={employmentType}
            onChange={(event) => setEmploymentType(event.target.value)}
            className="h-10 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-brand)]"
          >
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Contract</option>
            <option>Temporary</option>
          </select>
        </label>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <UserPlus
              size={14}
              className="text-[var(--color-brand)]"
            />

            Employee number will be generated automatically:
          </div>

          <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
            {nextEmployeeNumber}
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">
            <Plus size={16} />
            Add Employee
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: FormFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="block text-xs font-medium text-[var(--color-text-secondary)]">
        {label}

        {required && (
          <span className="ml-1 text-[var(--color-brand)]">*</span>
        )}
      </span>

      <Input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        {label}
      </p>

      <p className="mt-1 text-sm text-[var(--color-text)]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   MODAL SHELL
========================================================= */

interface ModalShellProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

function ModalShell({
  title,
  children,
  onClose,
}: ModalShellProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}