import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  Play,
  Search,
  WalletCards,
  X,
} from "lucide-react";

import { useMemo, useState, type ReactNode } from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

/* =========================================================
   TYPES
========================================================= */

type PayrollStatus =
  | "Draft"
  | "Processing"
  | "Processed"
  | "Paid";

interface PayrollEmployee {
  id: string;
  employeeNumber: string;
  name: string;
  department: string;
  position: string;

  basicSalary: number;

  allowances: {
    housing: number;
    transport: number;
    other: number;
  };

  deductions: {
    paye: number;
    pension: number;
    health: number;
    other: number;
  };

  status: PayrollStatus;
}

/* =========================================================
   MOCK PAYROLL DATA
========================================================= */

const initialPayroll: PayrollEmployee[] = [
  {
    id: "1",
    employeeNumber: "EMP-0001",
    name: "John Mwangi",
    department: "Finance",
    position: "Accountant",
    basicSalary: 1500000,

    allowances: {
      housing: 300000,
      transport: 150000,
      other: 50000,
    },

    deductions: {
      paye: 215000,
      pension: 150000,
      health: 30000,
      other: 0,
    },

    status: "Processed",
  },

  {
    id: "2",
    employeeNumber: "EMP-0002",
    name: "Sarah Johnson",
    department: "Human Resources",
    position: "HR Manager",
    basicSalary: 2200000,

    allowances: {
      housing: 400000,
      transport: 200000,
      other: 100000,
    },

    deductions: {
      paye: 390000,
      pension: 220000,
      health: 44000,
      other: 0,
    },

    status: "Processed",
  },

  {
    id: "3",
    employeeNumber: "EMP-0003",
    name: "Michael Smith",
    department: "Information Technology",
    position: "Software Engineer",
    basicSalary: 2800000,

    allowances: {
      housing: 500000,
      transport: 250000,
      other: 150000,
    },

    deductions: {
      paye: 560000,
      pension: 280000,
      health: 56000,
      other: 25000,
    },

    status: "Processed",
  },

  {
    id: "4",
    employeeNumber: "EMP-0004",
    name: "Amina Hassan",
    department: "Administration",
    position: "Administrator",
    basicSalary: 1200000,

    allowances: {
      housing: 200000,
      transport: 100000,
      other: 0,
    },

    deductions: {
      paye: 120000,
      pension: 120000,
      health: 24000,
      other: 0,
    },

    status: "Draft",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(value);

const getAllowances = (employee: PayrollEmployee) =>
  employee.allowances.housing +
  employee.allowances.transport +
  employee.allowances.other;

const getDeductions = (employee: PayrollEmployee) =>
  employee.deductions.paye +
  employee.deductions.pension +
  employee.deductions.health +
  employee.deductions.other;

const getGrossSalary = (employee: PayrollEmployee) =>
  employee.basicSalary + getAllowances(employee);

const getNetSalary = (employee: PayrollEmployee) =>
  getGrossSalary(employee) - getDeductions(employee);

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* =========================================================
   PAGE
========================================================= */

export function PayrollPage() {
  const [payroll, setPayroll] =
    useState<PayrollEmployee[]>(initialPayroll);

  const [period, setPeriod] = useState("August 2026");

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showFilters, setShowFilters] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState<PayrollEmployee | null>(null);

  const [showActions, setShowActions] =
    useState<string | null>(null);

  const [showRunPayroll, setShowRunPayroll] =
    useState(false);

  const departments = useMemo(
    () => [
      "All",
      ...new Set(
        payroll.map((employee) => employee.department),
      ),
    ],
    [payroll],
  );

  const filteredPayroll = useMemo(() => {
    const query = search.toLowerCase().trim();

    return payroll.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(query) ||
        employee.employeeNumber
          .toLowerCase()
          .includes(query) ||
        employee.department
          .toLowerCase()
          .includes(query);

      const matchesDepartment =
        departmentFilter === "All" ||
        employee.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        employee.status === statusFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    payroll,
    search,
    departmentFilter,
    statusFilter,
  ]);

  /* =========================================================
     SUMMARY
  ========================================================= */

  const totalGross = payroll.reduce(
    (total, employee) =>
      total + getGrossSalary(employee),
    0,
  );

  const totalDeductions = payroll.reduce(
    (total, employee) =>
      total + getDeductions(employee),
    0,
  );

  const totalNet = payroll.reduce(
    (total, employee) =>
      total + getNetSalary(employee),
    0,
  );

  const processedCount = payroll.filter(
    (employee) =>
      employee.status === "Processed" ||
      employee.status === "Paid",
  ).length;

  const draftCount = payroll.filter(
    (employee) => employee.status === "Draft",
  ).length;

  /* =========================================================
     RUN PAYROLL
  ========================================================= */

  const handleRunPayroll = () => {
    setPayroll((current) =>
      current.map((employee) => ({
        ...employee,
        status: "Processed",
      })),
    );

    setShowRunPayroll(false);
  };

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-brand)]">
            <span className="h-px w-5 bg-[var(--color-brand)]" />
            Payroll
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            Payroll
          </h1>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Calculate, review and manage employee payroll.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">
            <Download size={16} />
            Export
          </Button>

          <Button onClick={() => setShowRunPayroll(true)}>
            <Play size={16} />
            Run Payroll
          </Button>
        </div>
      </div>

      {/* =====================================================
          PAYROLL PERIOD
      ===================================================== */}

      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
              Payroll Period
            </p>

            <div className="mt-2 flex items-center gap-3">
              <div className="relative">
                <select
                  value={period}
                  onChange={(event) =>
                    setPeriod(event.target.value)
                  }
                  className="h-10 min-w-[180px] appearance-none rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 pr-9 text-sm font-medium text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-brand)]"
                >
                  <option>August 2026</option>
                  <option>July 2026</option>
                  <option>June 2026</option>
                  <option>May 2026</option>
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />
              </div>

              <span className="rounded-full bg-[var(--color-success)]/10 px-2.5 py-1 text-[10px] font-medium text-[var(--color-success)]">
                {processedCount === payroll.length
                  ? "Processed"
                  : "In Progress"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Clock3 size={14} />

            <span>
              {draftCount > 0
                ? `${draftCount} employee${
                    draftCount > 1 ? "s" : ""
                  } awaiting processing`
                : "All employees processed"}
            </span>
          </div>
        </div>
      </Card>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Gross */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                Gross Payroll
              </p>

              <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">
                {formatCurrency(totalGross)}
              </p>

              <div className="mt-2 flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
                <ArrowUpRight
                  size={12}
                  className="text-[var(--color-success)]"
                />
                Before deductions
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <WalletCards size={17} />
            </div>
          </div>
        </Card>

        {/* Deductions */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                Total Deductions
              </p>

              <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">
                {formatCurrency(totalDeductions)}
              </p>

              <div className="mt-2 flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
                <ArrowDownRight
                  size={12}
                  className="text-[var(--color-danger)]"
                />
                PAYE & statutory
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-danger)]/10 text-[var(--color-danger)]">
              <Calculator size={17} />
            </div>
          </div>
        </Card>

        {/* Net */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                Net Payroll
              </p>

              <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">
                {formatCurrency(totalNet)}
              </p>

              <div className="mt-2 text-[10px] text-[var(--color-text-muted)]">
                Employee take-home
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-success)]/10 text-[var(--color-success)]">
              <Check size={17} />
            </div>
          </div>
        </Card>

        {/* Employees */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                Employees
              </p>

              <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                {payroll.length}
              </p>

              <div className="mt-2 text-[10px] text-[var(--color-text-muted)]">
                {processedCount} processed
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <FileText size={17} />
            </div>
          </div>
        </Card>
      </div>

      {/* =====================================================
          PAYROLL REGISTER
      ===================================================== */}

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[var(--color-border)] p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-sm">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />

            <Input
              placeholder="Search payroll..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                setShowFilters((current) => !current)
              }
            >
              <Filter size={16} />
              Filters
            </Button>

            {(statusFilter !== "All" ||
              departmentFilter !== "All") && (
              <button
                onClick={() => {
                  setStatusFilter("All");
                  setDepartmentFilter("All");
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
          <div className="grid gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg)] p-5 md:grid-cols-2">
            <PayrollFilter
              label="Department"
              value={departmentFilter}
              options={departments}
              onChange={setDepartmentFilter}
            />

            <PayrollFilter
              label="Payroll Status"
              value={statusFilter}
              options={[
                "All",
                "Draft",
                "Processing",
                "Processed",
                "Paid",
              ]}
              onChange={setStatusFilter}
            />
          </div>
        )}

        {/* Result count */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
          <p className="text-xs text-[var(--color-text-muted)]">
            Showing{" "}
            <span className="font-medium text-[var(--color-text-secondary)]">
              {filteredPayroll.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[var(--color-text-secondary)]">
              {payroll.length}
            </span>{" "}
            employees
          </p>

          <p className="hidden text-xs text-[var(--color-text-muted)] sm:block">
            {period}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                <th className="px-5 py-4 font-medium">
                  Employee
                </th>

                <th className="px-5 py-4 font-medium">
                  Basic Salary
                </th>

                <th className="px-5 py-4 font-medium">
                  Allowances
                </th>

                <th className="px-5 py-4 font-medium">
                  Gross
                </th>

                <th className="px-5 py-4 font-medium">
                  Deductions
                </th>

                <th className="px-5 py-4 font-medium">
                  Net Pay
                </th>

                <th className="px-5 py-4 font-medium">
                  Status
                </th>

                <th className="w-12 px-5 py-4" />
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredPayroll.map((employee) => {
                const allowances =
                  getAllowances(employee);

                const gross =
                  getGrossSalary(employee);

                const deductions =
                  getDeductions(employee);

                const net =
                  getNetSalary(employee);

                return (
                  <tr
                    key={employee.id}
                    className="group transition-colors hover:bg-[var(--color-surface-hover)]"
                  >
                    {/* Employee */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-xs font-bold text-[var(--color-brand)]">
                          {getInitials(employee.name)}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-[var(--color-text)]">
                            {employee.name}
                          </p>

                          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                            {employee.employeeNumber}
                            {" · "}
                            {employee.department}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Basic */}
                    <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                      {formatCurrency(
                        employee.basicSalary,
                      )}
                    </td>

                    {/* Allowances */}
                    <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                      {formatCurrency(allowances)}
                    </td>

                    {/* Gross */}
                    <td className="px-5 py-4 text-sm font-medium text-[var(--color-text)]">
                      {formatCurrency(gross)}
                    </td>

                    {/* Deductions */}
                    <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                      {formatCurrency(deductions)}
                    </td>

                    {/* Net */}
                    <td className="px-5 py-4 text-sm font-semibold text-[var(--color-text)]">
                      {formatCurrency(net)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <PayrollStatusBadge
                        status={employee.status}
                      />
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
                        <div className="absolute right-5 top-12 z-30 w-48 overflow-hidden rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] p-1 shadow-xl">
                          <button
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowActions(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                          >
                            <Eye size={14} />
                            View payroll
                          </button>

                          <button
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowActions(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                          >
                            <FileText size={14} />
                            View payslip
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredPayroll.length === 0 && (
          <div className="p-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)]">
              <WalletCards size={22} />
            </div>

            <p className="mt-4 text-sm font-medium text-[var(--color-text)]">
              No payroll records found
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Try changing your search or filter criteria.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setDepartmentFilter("All");
              }}
              className="mt-4 text-xs font-medium text-[var(--color-brand)] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Footer */}
        {filteredPayroll.length > 0 && (
          <div className="flex items-center justify-between border-t border-[var(--color-border)] px-5 py-4">
            <p className="text-xs text-[var(--color-text-muted)]">
              Page 1 of 1
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={13} />
                Previous
              </button>

              <button
                disabled
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* =====================================================
          PAYROLL DETAILS
      ===================================================== */}

      {selectedEmployee && (
        <PayrollDetailsModal
          employee={selectedEmployee}
          period={period}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {/* =====================================================
          RUN PAYROLL MODAL
      ===================================================== */}

      {showRunPayroll && (
        <RunPayrollModal
          period={period}
          employeeCount={payroll.length}
          onClose={() => setShowRunPayroll(false)}
          onRun={handleRunPayroll}
        />
      )}
    </div>
  );
}

/* =========================================================
   FILTER
========================================================= */

interface PayrollFilterProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function PayrollFilter({
  label,
  value,
  options,
  onChange,
}: PayrollFilterProps) {
  return (
    <label className="space-y-2">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-10 w-full appearance-none rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 pr-9 text-xs text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-brand)]"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
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
   STATUS BADGE
========================================================= */

function PayrollStatusBadge({
  status,
}: {
  status: PayrollStatus;
}) {
  const styles: Record<PayrollStatus, string> = {
    Draft:
      "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-secondary)]",

    Processing:
      "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",

    Processed:
      "bg-[var(--color-success)]/10 text-[var(--color-success)]",

    Paid:
      "bg-[var(--color-brand-soft)] text-[var(--color-brand)]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   PAYROLL DETAILS MODAL
========================================================= */

interface PayrollDetailsModalProps {
  employee: PayrollEmployee;
  period: string;
  onClose: () => void;
}

function PayrollDetailsModal({
  employee,
  period,
  onClose,
}: PayrollDetailsModalProps) {
  const gross = getGrossSalary(employee);
  const deductions = getDeductions(employee);
  const net = getNetSalary(employee);

  return (
    <ModalShell
      title="Payroll Details"
      onClose={onClose}
    >
      <div className="space-y-6">
        {/* Employee heading */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-lg font-bold text-[var(--color-brand)]">
            {getInitials(employee.name)}
          </div>

          <div>
            <h3 className="text-base font-semibold text-[var(--color-text)]">
              {employee.name}
            </h3>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {employee.employeeNumber}
              {" · "}
              {period}
            </p>
          </div>

          <div className="ml-auto">
            <PayrollStatusBadge
              status={employee.status}
            />
          </div>
        </div>

        {/* Earnings */}
        <PayrollSection title="Earnings">
          <PayrollLine
            label="Basic Salary"
            value={formatCurrency(employee.basicSalary)}
          />

          <PayrollLine
            label="Housing Allowance"
            value={formatCurrency(
              employee.allowances.housing,
            )}
          />

          <PayrollLine
            label="Transport Allowance"
            value={formatCurrency(
              employee.allowances.transport,
            )}
          />

          <PayrollLine
            label="Other Allowances"
            value={formatCurrency(
              employee.allowances.other,
            )}
          />

          <div className="mt-3 border-t border-[var(--color-border)] pt-3">
            <PayrollLine
              label="Gross Salary"
              value={formatCurrency(gross)}
              strong
            />
          </div>
        </PayrollSection>

        {/* Deductions */}
        <PayrollSection title="Deductions">
          <PayrollLine
            label="PAYE"
            value={formatCurrency(
              employee.deductions.paye,
            )}
          />

          <PayrollLine
            label="Pension"
            value={formatCurrency(
              employee.deductions.pension,
            )}
          />

          <PayrollLine
            label="Health"
            value={formatCurrency(
              employee.deductions.health,
            )}
          />

          <PayrollLine
            label="Other Deductions"
            value={formatCurrency(
              employee.deductions.other,
            )}
          />

          <div className="mt-3 border-t border-[var(--color-border)] pt-3">
            <PayrollLine
              label="Total Deductions"
              value={formatCurrency(deductions)}
              strong
            />
          </div>
        </PayrollSection>

        {/* Net pay */}
        <div className="rounded-xl border border-[var(--color-brand)]/30 bg-[var(--color-brand-soft)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-brand)]">
                Net Pay
              </p>

              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                Employee take-home pay
              </p>
            </div>

            <p className="text-xl font-bold text-[var(--color-text)]">
              {formatCurrency(net)}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

/* =========================================================
   PAYROLL SECTION
========================================================= */

function PayrollSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
        {title}
      </p>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   PAYROLL LINE
========================================================= */

function PayrollLine({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span
        className={
          strong
            ? "text-xs font-semibold text-[var(--color-text)]"
            : "text-xs text-[var(--color-text-secondary)]"
        }
      >
        {label}
      </span>

      <span
        className={
          strong
            ? "text-sm font-semibold text-[var(--color-text)]"
            : "text-xs font-medium text-[var(--color-text)]"
        }
      >
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   RUN PAYROLL MODAL
========================================================= */

interface RunPayrollModalProps {
  period: string;
  employeeCount: number;
  onClose: () => void;
  onRun: () => void;
}

function RunPayrollModal({
  period,
  employeeCount,
  onClose,
  onRun,
}: RunPayrollModalProps) {
  return (
    <ModalShell
      title="Run Payroll"
      onClose={onClose}
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[var(--color-brand)]/30 bg-[var(--color-brand-soft)] p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 text-[var(--color-brand)]">
              <AlertCircle size={18} />
            </div>

            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">
                Process payroll for {period}
              </p>

              <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
                The payroll calculation will be applied to{" "}
                <strong className="text-[var(--color-text)]">
                  {employeeCount}
                </strong>{" "}
                employees using the current payroll
                configuration.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <PayrollCheck label="Employee records" />
          <PayrollCheck label="Basic salaries" />
          <PayrollCheck label="Allowances" />
          <PayrollCheck label="Deductions" />
          <PayrollCheck label="Payroll calculations" />
        </div>

        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button onClick={onRun}>
            <Play size={16} />
            Run Payroll
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

/* =========================================================
   PAYROLL CHECK
========================================================= */

function PayrollCheck({
  label,
}: {
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)]">
        <Check size={13} />
      </div>

      <span className="text-xs text-[var(--color-text-secondary)]">
        {label}
      </span>
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

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}