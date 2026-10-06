import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  FileText,
  Landmark,
  Search,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useEmployees } from "../../hooks/useEmployees";
import { useTerminations } from "../../hooks/useTerminations";
import type { Employee } from "../../types/employees";
import type {
  EmployeeTermination,
  TerminationSettlement,
} from "../../types/termination";

const TERMINATION_REASONS = [
  "Resignation",
  "Retirement",
  "Redundancy",
  "Dismissal",
  "End of Contract",
  "Death",
  "Mutual Agreement",
  "Other",
];

interface SettlementForm {
  noticePayment: number;

  normalOtHours: number;
  normalOtAmount: number;

  sundayPublicOtHours: number;
  sundayPublicOtAmount: number;

  outstandingLeaveDays: number;
  leavePay: number;
  leaveAllowance: number;

  basicPay: number;
  houseAllowance: number;
  responsibilityAllowance: number;
  utilityAllowance: number;

  otherNonTaxableAllowance: number;
  arrears: number;
  bonus: number;

  pension: number;
  paye: number;

  salaryAdvance: number;
  outstandingLoans: number;
  otherDeduction: number;

  exchangeRate: number;
  pensionType: string;
}

const EMPTY_SETTLEMENT: SettlementForm = {
  noticePayment: 0,

  normalOtHours: 0,
  normalOtAmount: 0,

  sundayPublicOtHours: 0,
  sundayPublicOtAmount: 0,

  outstandingLeaveDays: 0,
  leavePay: 0,
  leaveAllowance: 0,

  basicPay: 0,
  houseAllowance: 0,
  responsibilityAllowance: 0,
  utilityAllowance: 0,

  otherNonTaxableAllowance: 0,
  arrears: 0,
  bonus: 0,

  pension: 0,
  paye: 0,

  salaryAdvance: 0,
  outstandingLoans: 0,
  otherDeduction: 0,

  exchangeRate: 1,
  pensionType: "",
};

function formatCurrency(
  amount: number,
  currency = "TZS",
) {
  try {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  } catch {
    return `${currency} ${(amount || 0).toLocaleString()}`;
  }
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getEmployeeFullName(employee: Employee) {
  return `${employee.name} ${employee.surname}`.trim();
}

function getEmploymentDate(employee: Employee) {
  const employeeWithDate = employee as Employee & {
    employmentDate?: string;
  };

  return employeeWithDate.employmentDate || "";
}

function getInitialSettlement(
  employee: Employee,
): SettlementForm {
  return {
    ...EMPTY_SETTLEMENT,
    basicPay: employee.salary || 0,
  };
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
        {icon}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-[var(--color-text)]">
          {title}
        </h2>

        {description && (
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
      {children}

      {required && (
        <span className="ml-1 text-[var(--color-danger)]">
          *
        </span>
      )}
    </label>
  );
}

function ReadonlyField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>

      <div className="flex min-h-10 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 text-sm text-[var(--color-text)]">
        {icon && (
          <span className="text-[var(--color-text-muted)]">
            {icon}
          </span>
        )}

        <span className={value ? "" : "text-[var(--color-text-muted)]"}>
          {value || "—"}
        </span>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  prefix,
  step = "0.01",
  disabled = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  step?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>

      <div className="flex overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] transition-colors focus-within:border-[var(--color-brand)]">
        {prefix && (
          <span className="flex items-center border-r border-[var(--color-border)] px-3 text-xs text-[var(--color-text-muted)]">
            {prefix}
          </span>
        )}

        <input
          type="number"
          min="0"
          step={step}
          value={value}
          disabled={disabled}
          onChange={(event) =>
            onChange(Number(event.target.value) || 0)
          }
          className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm text-[var(--color-text)] outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 pr-9 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
        >
          {placeholder && (
            <option value="">
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
      </div>
    </div>
  );
}

function SummaryMetric({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        emphasis
          ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)]"
          : "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
      }`}
    >
      <p className="text-xs text-[var(--color-text-muted)]">
        {label}
      </p>

      <p
        className={`mt-1.5 text-lg font-semibold ${
          emphasis
            ? "text-[var(--color-brand)]"
            : "text-[var(--color-text)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function TerminalSlipModal({
  employee,
  terminationDate,
  reason,
  settlement,
  currency,
  onClose,
}: {
  employee: Employee;
  terminationDate: string;
  reason: string;
  settlement: SettlementForm;
  currency: string;
  onClose: () => void;
}) {
  const grossPay =
    settlement.basicPay +
    settlement.houseAllowance +
    settlement.responsibilityAllowance +
    settlement.utilityAllowance +
    settlement.noticePayment +
    settlement.normalOtAmount +
    settlement.sundayPublicOtAmount +
    settlement.leavePay +
    settlement.leaveAllowance +
    settlement.otherNonTaxableAllowance +
    settlement.arrears +
    settlement.bonus;

  const taxableGross =
    settlement.basicPay +
    settlement.houseAllowance +
    settlement.responsibilityAllowance +
    settlement.utilityAllowance +
    settlement.noticePayment +
    settlement.normalOtAmount +
    settlement.sundayPublicOtAmount +
    settlement.leavePay +
    settlement.arrears +
    settlement.bonus;

  const totalDeduction =
    settlement.pension +
    settlement.paye +
    settlement.salaryAdvance +
    settlement.outstandingLoans +
    settlement.otherDeduction;

  const takeHome = grossPay - totalDeduction;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Terminal Benefit Slip
            </h2>

            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              Preview of the employee's final settlement
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
          >
            <X size={19} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-75px)] overflow-y-auto p-6">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
            <div className="border-b border-[var(--color-border)] p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">
                Payroll Core
              </p>

              <h1 className="mt-2 text-xl font-semibold text-[var(--color-text)]">
                Terminal Benefit Statement
              </h1>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Employee termination settlement
              </p>
            </div>

            <div className="grid gap-4 border-b border-[var(--color-border)] p-6 sm:grid-cols-2 lg:grid-cols-4">
              <ReadonlyField
                label="Employee Number"
                value={employee.employeeNumber}
              />

              <ReadonlyField
                label="Employee Name"
                value={getEmployeeFullName(employee)}
              />

              <ReadonlyField
                label="Department"
                value={employee.department}
              />

              <ReadonlyField
                label="Termination Date"
                value={terminationDate}
              />
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
                  Earnings
                </h3>

                <div className="space-y-2">
                  <SlipRow
                    label="Basic Pay"
                    value={settlement.basicPay}
                    currency={currency}
                  />

                  <SlipRow
                    label="House Allowance"
                    value={settlement.houseAllowance}
                    currency={currency}
                  />

                  <SlipRow
                    label="Responsibility"
                    value={settlement.responsibilityAllowance}
                    currency={currency}
                  />

                  <SlipRow
                    label="Utility"
                    value={settlement.utilityAllowance}
                    currency={currency}
                  />

                  <SlipRow
                    label="Notice Payment"
                    value={settlement.noticePayment}
                    currency={currency}
                  />

                  <SlipRow
                    label="Normal Overtime"
                    value={settlement.normalOtAmount}
                    currency={currency}
                  />

                  <SlipRow
                    label="Public Holiday Overtime"
                    value={settlement.sundayPublicOtAmount}
                    currency={currency}
                  />

                  <SlipRow
                    label="Leave Pay"
                    value={settlement.leavePay}
                    currency={currency}
                  />

                  <SlipRow
                    label="Leave Allowance"
                    value={settlement.leaveAllowance}
                    currency={currency}
                  />

                  <SlipRow
                    label="Arrears"
                    value={settlement.arrears}
                    currency={currency}
                  />

                  <SlipRow
                    label="Bonus"
                    value={settlement.bonus}
                    currency={currency}
                  />

                  <SlipRow
                    label="Other Non-Taxable Payment"
                    value={settlement.otherNonTaxableAllowance}
                    currency={currency}
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
                  Deductions
                </h3>

                <div className="space-y-2">
                  <SlipRow
                    label="Pension"
                    value={settlement.pension}
                    currency={currency}
                  />

                  <SlipRow
                    label="PAYE"
                    value={settlement.paye}
                    currency={currency}
                  />

                  <SlipRow
                    label="Salary Advance"
                    value={settlement.salaryAdvance}
                    currency={currency}
                  />

                  <SlipRow
                    label="Outstanding Loans"
                    value={settlement.outstandingLoans}
                    currency={currency}
                  />

                  <SlipRow
                    label="Other Deduction"
                    value={settlement.otherDeduction}
                    currency={currency}
                  />

                  <div className="mt-4 border-t border-[var(--color-border)] pt-3">
                    <SlipRow
                      label="Total Deduction"
                      value={totalDeduction}
                      currency={currency}
                      strong
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 border-t border-[var(--color-border)] bg-[var(--color-brand-soft)] p-6 sm:grid-cols-3">
              <SummaryMetric
                label="Gross Pay"
                value={formatCurrency(grossPay, currency)}
              />

              <SummaryMetric
                label="Taxable Gross"
                value={formatCurrency(
                  taxableGross,
                  currency,
                )}
              />

              <SummaryMetric
                label="Take Home"
                value={formatCurrency(takeHome, currency)}
                emphasis
              />
            </div>

            <div className="border-t border-[var(--color-border)] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Termination Reason
                  </p>

                  <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                    {reason}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Pension Type
                  </p>

                  <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                    {settlement.pensionType || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border-strong)] px-4 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-hover)]"
            >
              <FileText size={16} />
              Print Slip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlipRow({
  label,
  value,
  currency,
  strong = false,
}: {
  label: string;
  value: number;
  currency: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span
        className={
          strong
            ? "font-semibold text-[var(--color-text)]"
            : "text-[var(--color-text-secondary)]"
        }
      >
        {label}
      </span>

      <span
        className={
          strong
            ? "font-semibold text-[var(--color-text)]"
            : "text-[var(--color-text)]"
        }
      >
        {formatCurrency(value, currency)}
      </span>
    </div>
  );
}

export default function EmployeeTerminationPage() {
  const { employees, updateEmployee } = useEmployees();
  const { addTermination, getTermination } =
    useTerminations();

  const [search, setSearch] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState("");

  const [terminationDate, setTerminationDate] =
    useState(getToday());

  const [reason, setReason] = useState("");

  const [settlement, setSettlement] =
    useState<SettlementForm>(EMPTY_SETTLEMENT);

  const [showEmployeeList, setShowEmployeeList] =
    useState(false);

  const [showPreview, setShowPreview] =
    useState(false);

  const [showConfirmation, setShowConfirmation] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedEmployee = useMemo(
    () =>
      employees.find(
        (employee) =>
          employee.id === selectedEmployeeId,
      ) ?? null,
    [employees, selectedEmployeeId],
  );

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return employees.filter(
        (employee) => employee.status === "Active",
      );
    }

    return employees.filter((employee) => {
      if (employee.status !== "Active") {
        return false;
      }

      const fullName =
        getEmployeeFullName(employee).toLowerCase();

      return (
        fullName.includes(query) ||
        employee.employeeNumber
          .toLowerCase()
          .includes(query) ||
        employee.department
          .toLowerCase()
          .includes(query) ||
        employee.costCode
          .toLowerCase()
          .includes(query) ||
        employee.jobTitle
          .toLowerCase()
          .includes(query)
      );
    });
  }, [employees, search]);

  const currency =
    selectedEmployee?.currency || "TZS";

  const grossPay =
    settlement.basicPay +
    settlement.houseAllowance +
    settlement.responsibilityAllowance +
    settlement.utilityAllowance +
    settlement.noticePayment +
    settlement.normalOtAmount +
    settlement.sundayPublicOtAmount +
    settlement.leavePay +
    settlement.leaveAllowance +
    settlement.otherNonTaxableAllowance +
    settlement.arrears +
    settlement.bonus;

  const taxableGross =
    settlement.basicPay +
    settlement.houseAllowance +
    settlement.responsibilityAllowance +
    settlement.utilityAllowance +
    settlement.noticePayment +
    settlement.normalOtAmount +
    settlement.sundayPublicOtAmount +
    settlement.leavePay +
    settlement.arrears +
    settlement.bonus;

  const totalDeduction =
    settlement.pension +
    settlement.paye +
    settlement.salaryAdvance +
    settlement.outstandingLoans +
    settlement.otherDeduction;

  const takeHome = grossPay - totalDeduction;

  const updateSettlement = (
    field: keyof SettlementForm,
    value: number | string,
  ) => {
    setSettlement((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const selectEmployee = (employee: Employee) => {
    setSelectedEmployeeId(employee.id);
    setSearch(getEmployeeFullName(employee));
    setSettlement(getInitialSettlement(employee));
    setReason("");
    setError("");
    setMessage("");
    setShowEmployeeList(false);
  };

  const clearEmployee = () => {
    setSelectedEmployeeId("");
    setSearch("");
    setSettlement(EMPTY_SETTLEMENT);
    setReason("");
    setError("");
    setMessage("");
  };

  const validateTermination = () => {
    if (!selectedEmployee) {
      setError("Please select an employee first.");
      return false;
    }

    if (selectedEmployee.status !== "Active") {
      setError(
        "This employee is already inactive and cannot be terminated again.",
      );
      return false;
    }

    if (!terminationDate) {
      setError("Please enter a termination date.");
      return false;
    }

    if (!reason) {
      setError("Please select a termination reason.");
      return false;
    }

    if (terminationDate < getEmploymentDate(selectedEmployee)) {
      setError(
        "Termination date cannot be earlier than the employment date.",
      );
      return false;
    }

    return true;
  };

  const handlePreview = () => {
    setError("");
    setMessage("");

    if (!validateTermination()) {
      return;
    }

    setShowPreview(true);
  };

    const handlePerformTermination = () => {
    setError("");
    setMessage("");

    const employee = selectedEmployee;

    if (!employee) {
        setError("Please select an employee first.");
        return;
    }

    if (employee.status !== "Active") {
        setError(
        "This employee is already inactive and cannot be terminated again.",
        );
        return;
    }

    if (!terminationDate) {
        setError("Please enter a termination date.");
        return;
    }

    if (!reason) {
        setError("Please select a termination reason.");
        return;
    }

    if (terminationDate < getEmploymentDate(employee)) {
        setError(
        "Termination date cannot be earlier than the employment date.",
        );
        return;
    }

    const existingTermination = getTermination(employee.id);

    if (existingTermination) {
        setError(
        "A termination record already exists for this employee.",
        );
        return;
    }

    setShowConfirmation(true);
    };

    const confirmTermination = () => {
    const employee = selectedEmployee;

    if (!employee) {
        return;
    }

    const settlementRecord: TerminationSettlement = {
        ...settlement,
        grossPay,
        taxableGross,
        totalDeduction,
        takeHome,
    };

    const termination: EmployeeTermination = {
        id: crypto.randomUUID(),

        employeeId: employee.id,
        employeeNumber: employee.employeeNumber,

        employeeName: getEmployeeFullName(employee),
        department: employee.department,
        costCode: employee.costCode,

        employmentDate: getEmploymentDate(employee),
        terminationDate,
        reason,

        settlement: settlementRecord,

        terminatedAt: new Date().toISOString(),
    };

    addTermination(termination);

    updateEmployee({
        ...employee,
        status: "Inactive",
    });

    setShowConfirmation(false);

    setMessage(
        `${getEmployeeFullName(employee)} has been successfully terminated.`,
    );
    };

  return (
    <div className="min-h-full bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-[1600px] space-y-5 p-5 lg:p-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <BriefcaseBusiness size={21} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text)]">
                  Employee Termination
                </h1>

                <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Terminal Settlement
                </span>
              </div>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Process employee termination and calculate
                the final settlement.
              </p>
            </div>
          </div>

          {selectedEmployee && (
            <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
              <span className="text-xs text-[var(--color-text-muted)]">
                Employee
              </span>

              <span className="text-sm font-semibold text-[var(--color-brand)]">
                {selectedEmployee.employeeNumber}
              </span>
            </div>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-4 py-3">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-[var(--color-danger)]"
            />

            <p className="text-sm text-[var(--color-text)]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError("")}
              className="ml-auto text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {message && (
          <div className="flex items-start gap-3 rounded-xl border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 px-4 py-3">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-[var(--color-success)]"
            />

            <p className="text-sm text-[var(--color-text)]">
              {message}
            </p>

            <button
              type="button"
              onClick={() => setMessage("")}
              className="ml-auto text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Employee Search */}
        <section className="overflow-visible rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <SectionHeader
            icon={<Search size={18} />}
            title="Find Employee"
            description="Select an active employee to begin the termination process."
          />

          <div className="relative p-5">
            <div className="relative max-w-2xl">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setShowEmployeeList(true);

                  if (!event.target.value) {
                    setSelectedEmployeeId("");
                    setSettlement(EMPTY_SETTLEMENT);
                  }
                }}
                onFocus={() =>
                  setShowEmployeeList(true)
                }
                placeholder="Search employee number, name, department, cost code..."
                className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] pl-10 pr-10 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearEmployee}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  <X size={17} />
                </button>
              )}

              {showEmployeeList && (
                <>
                  <button
                    type="button"
                    aria-label="Close employee results"
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() =>
                      setShowEmployeeList(false)
                    }
                  />

                  <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-80 overflow-y-auto rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-1 shadow-2xl">
                    {filteredEmployees.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <UserRound
                          size={24}
                          className="mx-auto text-[var(--color-text-muted)]"
                        />

                        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                          No active employees found.
                        </p>
                      </div>
                    ) : (
                      filteredEmployees.map(
                        (employee) => (
                          <button
                            key={employee.id}
                            type="button"
                            onClick={() =>
                              selectEmployee(employee)
                            }
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-[var(--color-surface-hover)]"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-xs font-semibold text-[var(--color-brand)]">
                              {employee.name
                                .charAt(0)
                                .toUpperCase()}
                              {employee.surname
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-medium text-[var(--color-text)]">
                                  {getEmployeeFullName(
                                    employee,
                                  )}
                                </p>

                                <span className="text-xs text-[var(--color-brand)]">
                                  {
                                    employee.employeeNumber
                                  }
                                </span>
                              </div>

                              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                                {employee.department} •{" "}
                                {employee.jobTitle} •{" "}
                                {employee.costCode}
                              </p>
                            </div>

                            <ChevronDown
                              size={15}
                              className="-rotate-90 text-[var(--color-text-muted)]"
                            />
                          </button>
                        ),
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {selectedEmployee ? (
          <>
            {/* Employee Information */}
            <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <SectionHeader
                icon={<UserRound size={18} />}
                title="Employee Information"
                description="Employee details retrieved from the employee register."
              />

              <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
                <ReadonlyField
                  label="Payroll Number"
                  value={selectedEmployee.employeeNumber}
                />

                <ReadonlyField
                  label="First Name"
                  value={selectedEmployee.name}
                />

                <ReadonlyField
                  label="Last Name"
                  value={selectedEmployee.surname}
                />

                <ReadonlyField
                  label="Department"
                  value={selectedEmployee.department}
                />

                <ReadonlyField
                  label="Cost Code"
                  value={selectedEmployee.costCode}
                />

                <ReadonlyField
                  label="Job Title"
                  value={selectedEmployee.jobTitle}
                />

                <ReadonlyField
                  label="Employment Date"
                  value={getEmploymentDate(
                    selectedEmployee,
                  )}
                  icon={<CalendarDays size={15} />}
                />

                <ReadonlyField
                  label="Current Salary"
                  value={formatCurrency(
                    selectedEmployee.salary,
                    currency,
                  )}
                  icon={<CircleDollarSign size={15} />}
                />
              </div>
            </section>

            {/* Termination Details */}
            <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <SectionHeader
                icon={<CalendarDays size={18} />}
                title="Termination Details"
                description="Enter the information that triggers the final settlement."
              />

              <div className="grid gap-4 p-5 md:grid-cols-3">
                <div>
                  <FieldLabel>Termination Date</FieldLabel>

                  <input
                    type="date"
                    value={terminationDate}
                    min={getEmploymentDate(
                      selectedEmployee,
                    )}
                    onChange={(event) =>
                      setTerminationDate(
                        event.target.value,
                      )
                    }
                    className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
                  />
                </div>

                <SelectField
                  label="Reason"
                  value={reason}
                  onChange={setReason}
                  options={TERMINATION_REASONS}
                  placeholder="Select termination reason"
                />

                <SelectField
                  label="Pension Type"
                  value={settlement.pensionType}
                  onChange={(value) =>
                    updateSettlement(
                      "pensionType",
                      value,
                    )
                  }
                  options={[
                    "NSSF",
                    "PSSSF",
                    "Other",
                  ]}
                  placeholder="Select pension type"
                />
              </div>
            </section>

            {/* Settlement */}
            <div className="grid gap-5 xl:grid-cols-2">
              {/* Earnings */}
              <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <SectionHeader
                  icon={<WalletCards size={18} />}
                  title="Terminal Earnings"
                  description="Payments included in the employee's final settlement."
                />

                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  <NumberField
                    label="Basic Pay"
                    value={settlement.basicPay}
                    onChange={(value) =>
                      updateSettlement(
                        "basicPay",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="1 Month Notice Payment"
                    value={settlement.noticePayment}
                    onChange={(value) =>
                      updateSettlement(
                        "noticePayment",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="Normal OT Hours"
                    value={settlement.normalOtHours}
                    onChange={(value) =>
                      updateSettlement(
                        "normalOtHours",
                        value,
                      )
                    }
                    step="0.5"
                  />

                  <NumberField
                    label="Normal OT Amount"
                    value={settlement.normalOtAmount}
                    onChange={(value) =>
                      updateSettlement(
                        "normalOtAmount",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="Sundays / Public Holiday OT Hours"
                    value={
                      settlement.sundayPublicOtHours
                    }
                    onChange={(value) =>
                      updateSettlement(
                        "sundayPublicOtHours",
                        value,
                      )
                    }
                    step="0.5"
                  />

                  <NumberField
                    label="Public OT Amount"
                    value={settlement.sundayPublicOtAmount}
                    onChange={(value) =>
                      updateSettlement(
                        "sundayPublicOtAmount",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="Outstanding Leave Days"
                    value={
                      settlement.outstandingLeaveDays
                    }
                    onChange={(value) =>
                      updateSettlement(
                        "outstandingLeaveDays",
                        value,
                      )
                    }
                    step="0.5"
                  />

                  <NumberField
                    label="Leave Pay"
                    value={settlement.leavePay}
                    onChange={(value) =>
                      updateSettlement(
                        "leavePay",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="Leave Allowance"
                    value={settlement.leaveAllowance}
                    onChange={(value) =>
                      updateSettlement(
                        "leaveAllowance",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="House Allowance"
                    value={settlement.houseAllowance}
                    onChange={(value) =>
                      updateSettlement(
                        "houseAllowance",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="Responsibility Allowance"
                    value={
                      settlement.responsibilityAllowance
                    }
                    onChange={(value) =>
                      updateSettlement(
                        "responsibilityAllowance",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="Utility Allowance"
                    value={settlement.utilityAllowance}
                    onChange={(value) =>
                      updateSettlement(
                        "utilityAllowance",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="Other Non-Taxable Payment"
                    value={
                      settlement.otherNonTaxableAllowance
                    }
                    onChange={(value) =>
                      updateSettlement(
                        "otherNonTaxableAllowance",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="Arrears"
                    value={settlement.arrears}
                    onChange={(value) =>
                      updateSettlement(
                        "arrears",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="Bonus"
                    value={settlement.bonus}
                    onChange={(value) =>
                      updateSettlement(
                        "bonus",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="Exchange Rate"
                    value={settlement.exchangeRate}
                    onChange={(value) =>
                      updateSettlement(
                        "exchangeRate",
                        value,
                      )
                    }
                  />
                </div>
              </section>

              {/* Deductions */}
              <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <SectionHeader
                  icon={<Landmark size={18} />}
                  title="Terminal Deductions"
                  description="Deductions applied to the employee's final settlement."
                />

                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  <NumberField
                    label="Pension"
                    value={settlement.pension}
                    onChange={(value) =>
                      updateSettlement(
                        "pension",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="PAYE"
                    value={settlement.paye}
                    onChange={(value) =>
                      updateSettlement(
                        "paye",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="Salary Advance"
                    value={settlement.salaryAdvance}
                    onChange={(value) =>
                      updateSettlement(
                        "salaryAdvance",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="Outstanding Loans"
                    value={settlement.outstandingLoans}
                    onChange={(value) =>
                      updateSettlement(
                        "outstandingLoans",
                        value,
                      )
                    }
                    prefix={currency}
                  />

                  <NumberField
                    label="Any Other Deduction"
                    value={settlement.otherDeduction}
                    onChange={(value) =>
                      updateSettlement(
                        "otherDeduction",
                        value,
                      )
                    }
                    prefix={currency}
                  />
                </div>

                {/* Deduction summary */}
                <div className="mx-5 mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Total Deduction
                    </span>

                    <span className="text-base font-semibold text-[var(--color-danger)]">
                      {formatCurrency(
                        totalDeduction,
                        currency,
                      )}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Settlement Summary */}
            <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <SectionHeader
                icon={<CircleDollarSign size={18} />}
                title="Final Settlement"
                description="Summary of the employee's terminal benefit calculation."
              />

              <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryMetric
                  label="Gross Pay"
                  value={formatCurrency(
                    grossPay,
                    currency,
                  )}
                />

                <SummaryMetric
                  label="Taxable Gross"
                  value={formatCurrency(
                    taxableGross,
                    currency,
                  )}
                />

                <SummaryMetric
                  label="Total Deduction"
                  value={formatCurrency(
                    totalDeduction,
                    currency,
                  )}
                />

                <SummaryMetric
                  label="Take Home"
                  value={formatCurrency(
                    takeHome,
                    currency,
                  )}
                  emphasis
                />
              </div>

              <div className="border-t border-[var(--color-border)] px-5 py-4">
                <div className="flex flex-col gap-2 text-xs text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    {selectedEmployee.employeeNumber} •{" "}
                    {getEmployeeFullName(
                      selectedEmployee,
                    )}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock3 size={13} />
                    Settlement prepared{" "}
                    {new Date().toLocaleDateString(
                      "en-TZ",
                    )}
                  </span>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="sticky bottom-0 z-10 -mx-5 flex flex-col gap-3 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 px-5 py-4 backdrop-blur sm:-mx-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <button
                type="button"
                onClick={clearEmployee}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--color-border-strong)] px-4 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              >
                Clear
              </button>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--color-border-strong)] px-4 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-hover)]"
                >
                  <FileText size={16} />
                  Preview Terminal Slip
                </button>

                <button
                  type="button"
                  onClick={handlePerformTermination}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--color-brand)] px-5 text-sm font-semibold text-black transition-colors hover:bg-[var(--color-brand-hover)]"
                >
                  <CheckCircle2 size={16} />
                  Perform Termination
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <section className="rounded-xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <UserRound size={25} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-[var(--color-text)]">
              Select an employee to begin
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
              Search for an active employee above. Once
              selected, their employee information will be
              loaded and you can prepare the final
              termination settlement.
            </p>
          </section>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedEmployee && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowConfirmation(false);
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl">
            <div className="border-b border-[var(--color-border)] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-warning)]/10 text-[var(--color-warning)]">
                  <AlertTriangle size={20} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-[var(--color-text)]">
                    Confirm Termination
                  </h2>

                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    This action will mark the employee as
                    inactive.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-5">
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Employee
                </p>

                <p className="mt-1 font-medium text-[var(--color-text)]">
                  {getEmployeeFullName(
                    selectedEmployee,
                  )}
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  {selectedEmployee.employeeNumber} •{" "}
                  {selectedEmployee.department}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Termination Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                    {terminationDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Take Home
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[var(--color-brand)]">
                    {formatCurrency(
                      takeHome,
                      currency,
                    )}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-[var(--color-warning)]/20 bg-[var(--color-warning)]/5 p-3">
                <p className="text-xs leading-5 text-[var(--color-text-secondary)]">
                  The employee will remain in the system
                  for historical and reporting purposes,
                  but their status will change from Active
                  to Inactive.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[var(--color-border)] p-4">
              <button
                type="button"
                onClick={() =>
                  setShowConfirmation(false)
                }
                className="h-10 rounded-lg border border-[var(--color-border-strong)] px-4 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmTermination}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--color-brand)] px-5 text-sm font-semibold text-black hover:bg-[var(--color-brand-hover)]"
              >
                <CheckCircle2 size={16} />
                Confirm Termination
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedEmployee && (
        <TerminalSlipModal
          employee={selectedEmployee}
          terminationDate={terminationDate}
          reason={reason}
          settlement={settlement}
          currency={currency}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}