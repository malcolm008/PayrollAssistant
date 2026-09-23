import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  Check,
  ChevronDown,
  Clock3,
  Download,
  Eye,
  FileText,
  History,
  ListChecks,
  Play,
  Plus,
  Search,
  UserCheck,
  Users,
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

type PayrollWorkspace =
  | "overview"
  | "allowances"
  | "deductions"
  | "overtime"
  | "payslips"
  | "history";

interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  department: string;
  position: string;
  basicSalary: number;
}

interface PayrollEmployee extends Employee {
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

  overtimeHours: number;
  overtimeAmount: number;
  status: PayrollStatus;
}

interface PayrollHistoryRecord {
  id: string;
  period: string;
  employeeCount: number;
  gross: number;
  deductions: number;
  net: number;
  status: "Processed" | "Paid";
  processedDate: string;
}

const employeeDirectory: Employee[] = [
  {
    id: "EMP-0001",
    employeeNumber: "EMP-0001",
    name: "John Mwangi",
    department: "Finance",
    position: "Accountant",
    basicSalary: 1500000,
  },
  {
    id: "EMP-0002",
    employeeNumber: "EMP-0002",
    name: "Sarah Johnson",
    department: "Human Resources",
    position: "HR Manager",
    basicSalary: 2200000,
  },
  {
    id: "EMP-0003",
    employeeNumber: "EMP-0003",
    name: "Michael Smith",
    department: "Information Technology",
    position: "Software Engineer",
    basicSalary: 2800000,
  },
  {
    id: "EMP-0004",
    employeeNumber: "EMP-0004",
    name: "Amina Hassan",
    department: "Administration",
    position: "Administrator",
    basicSalary: 1200000,
  },
  {
    id: "EMP-0005",
    employeeNumber: "EMP-0005",
    name: "David Kimaro",
    department: "Operations",
    position: "Operations Officer",
    basicSalary: 1800000,
  },
  {
    id: "EMP-0006",
    employeeNumber: "EMP-0006",
    name: "Grace Mollel",
    department: "Sales",
    position: "Sales Executive",
    basicSalary: 1650000,
  },
  {
    id: "EMP-0007",
    employeeNumber: "EMP-0007",
    name: "Daniel Joseph",
    department: "Information Technology",
    position: "Systems Administrator",
    basicSalary: 2400000,
  },
  {
    id: "EMP-0008",
    employeeNumber: "EMP-0008",
    name: "Neema Peter",
    department: "Human Resources",
    position: "HR Officer",
    basicSalary: 1400000,
  },
];

const initialRegisteredEmployees = [
  "EMP-0001",
  "EMP-0002",
  "EMP-0003",
  "EMP-0004",
];

const initialHistory: PayrollHistoryRecord[] = [
  {
    id: "PAY-2026-07",
    period: "July 2026",
    employeeCount: 4,
    gross: 9450000,
    deductions: 1975000,
    net: 7475000,
    status: "Paid",
    processedDate: "2026-07-28",
  },
  {
    id: "PAY-2026-06",
    period: "June 2026",
    employeeCount: 4,
    gross: 9450000,
    deductions: 1975000,
    net: 7475000,
    status: "Paid",
    processedDate: "2026-06-28",
  },
  {
    id: "PAY-2026-05",
    period: "May 2026",
    employeeCount: 3,
    gross: 8050000,
    deductions: 1531000,
    net: 6519000,
    status: "Paid",
    processedDate: "2026-05-28",
  },
];

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
  employee.basicSalary +
  getAllowances(employee) +
  employee.overtimeAmount;

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
  const [period, setPeriod] = useState("August 2026");

  const [registeredIds, setRegisteredIds] = useState<string[]>(
    initialRegisteredEmployees,
  );

  const [payroll, setPayroll] = useState<PayrollEmployee[]>(
    employeeDirectory
      .filter((employee) =>
        initialRegisteredEmployees.includes(employee.id),
      )
      .map((employee) => ({
        ...employee,

        allowances: {
          housing:
            employee.id === "EMP-0001"
              ? 300000
              : employee.id === "EMP-0002"
                ? 400000
                : employee.id === "EMP-0003"
                  ? 500000
                  : 200000,
          transport:
            employee.id === "EMP-0001"
              ? 150000
              : employee.id === "EMP-0002"
                ? 200000
                : employee.id === "EMP-0003"
                  ? 250000
                  : 100000,
          other:
            employee.id === "EMP-0001"
              ? 50000
              : employee.id === "EMP-0002"
                ? 100000
                : employee.id === "EMP-0003"
                  ? 150000
                  : 0,
        },

        deductions: {
          paye:
            employee.id === "EMP-0001"
              ? 215000
              : employee.id === "EMP-0002"
                ? 390000
                : employee.id === "EMP-0003"
                  ? 560000
                  : 120000,
          pension: employee.basicSalary * 0.1,
          health: employee.basicSalary * 0.02,
          other: employee.id === "EMP-0003" ? 25000 : 0,
        },

        overtimeHours: 0,
        overtimeAmount: 0,

        status:
          employee.id === "EMP-0004"
            ? "Draft"
            : "Processed",
      })),
  );

  const [history, setHistory] =
    useState<PayrollHistoryRecord[]>(initialHistory);

  const [workspace, setWorkspace] =
    useState<PayrollWorkspace>("overview");

  const [showRegisterModal, setShowRegisterModal] =
    useState(false);

  const [showRunPayroll, setShowRunPayroll] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState<PayrollEmployee | null>(null);

  const [showPayslip, setShowPayslip] =
    useState(false);

  const [showPeriodModal, setShowPeriodModal] =
    useState(false);

  const [showComponentModal, setShowComponentModal] =
    useState<"allowance" | "deduction" | "overtime" | null>(
      null,
    );

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const totalGross = payroll.reduce(
    (total, employee) => total + getGrossSalary(employee),
    0,
  );

  const totalDeductions = payroll.reduce(
    (total, employee) => total + getDeductions(employee),
    0,
  );

  const totalNet = payroll.reduce(
    (total, employee) => total + getNetSalary(employee),
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

  const processing =
    payroll.some(
      (employee) => employee.status === "Processing",
    );

  /* =======================================================
     REGISTER EMPLOYEES
  ======================================================= */

  const registerEmployees = (ids: string[]) => {
    const uniqueIds = Array.from(
      new Set([...registeredIds, ...ids]),
    );

    setRegisteredIds(uniqueIds);

    const newEmployees = employeeDirectory
      .filter(
        (employee) =>
          ids.includes(employee.id) &&
          !payroll.some(
            (record) => record.id === employee.id,
          ),
      )
      .map((employee) => ({
        ...employee,

        allowances: {
          housing: 0,
          transport: 0,
          other: 0,
        },

        deductions: {
          paye: 0,
          pension: employee.basicSalary * 0.1,
          health: employee.basicSalary * 0.02,
          other: 0,
        },

        overtimeHours: 0,
        overtimeAmount: 0,

        status: "Draft" as PayrollStatus,
      }));

    if (newEmployees.length > 0) {
      setPayroll((current) => [
        ...current,
        ...newEmployees,
      ]);
    }

    setShowRegisterModal(false);
  };

  /* =======================================================
     UNREGISTER EMPLOYEE
  ======================================================= */

  const unregisterEmployee = (id: string) => {
    setRegisteredIds((current) =>
      current.filter((employeeId) => employeeId !== id),
    );

    setPayroll((current) =>
      current.filter((employee) => employee.id !== id),
    );
  };

  /* =======================================================
     RUN PAYROLL
  ======================================================= */

  const handleRunPayroll = () => {
    setPayroll((current) =>
      current.map((employee) => ({
        ...employee,
        status: "Processed",
      })),
    );

    setHistory((current) => [
      {
        id: `PAY-${period.replace(" ", "-")}`,
        period,
        employeeCount: payroll.length,
        gross: totalGross,
        deductions: totalDeductions,
        net: totalNet,
        status: "Processed",
        processedDate: new Date()
          .toISOString()
          .slice(0, 10),
      },
      ...current,
    ]);

    setShowRunPayroll(false);
  };

  /* =======================================================
     MAIN PAGE
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-brand)]">
            <span className="h-px w-5 bg-[var(--color-brand)]" />
            Payroll
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            Payroll Workspace
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowPeriodModal(true)}
          >
            <Clock3 size={16} />
            {period}
          </Button>

          <Button
            onClick={() => setShowRegisterModal(true)}
          >
            <UserCheck size={16} />
            Register Employees
          </Button>
        </div>
      </div>

      {/* =====================================================
          CURRENT PERIOD BANNER
      ===================================================== */}

      <Card className="overflow-hidden">
        <div className="relative p-6">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[var(--color-brand)]/5 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[var(--color-brand)]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  Current Period
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                  {period}
                </h2>

                <PayrollStatusBadge
                  status={
                    processing
                      ? "Processing"
                      : draftCount > 0
                        ? "Draft"
                        : "Processed"
                  }
                />
              </div>

              <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                {registeredIds.length} employees registered
              </p>
            </div>

            <Button
              onClick={() => setShowRunPayroll(true)}
              disabled={registeredIds.length === 0}
            >
              <Play size={15} />
              Process Payroll
            </Button>
          </div>
        </div>
      </Card>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Registered"
          value={registeredIds.length.toString()}
          description={`${processedCount} processed`}
          icon={<Users size={17} />}
        />

        <SummaryCard
          label="Gross Payroll"
          value={formatCurrency(totalGross)}
          description="Before deductions"
          icon={<ArrowUpRight size={17} />}
          iconClass="text-[var(--color-success)] bg-[var(--color-success)]/10"
        />

        <SummaryCard
          label="Deductions"
          value={formatCurrency(totalDeductions)}
          description="PAYE & statutory"
          icon={<ArrowDownRight size={17} />}
          iconClass="text-[var(--color-danger)] bg-[var(--color-danger)]/10"
        />

        <SummaryCard
          label="Net Payroll"
          value={formatCurrency(totalNet)}
          description="Take-home"
          icon={<Check size={17} />}
          iconClass="text-[var(--color-success)] bg-[var(--color-success)]/10"
        />
      </div>

      {/* =====================================================
          PAYROLL WORKSPACE
          Single navigation surface — register, components,
          payslips and history all live here instead of being
          duplicated as separate action/component card grids.
      ===================================================== */}

      <Card className="overflow-hidden">
        <div className="flex flex-wrap border-b border-[var(--color-border)]">
          <WorkspaceTab
            active={workspace === "overview"}
            icon={<ListChecks size={15} />}
            label="Register"
            onClick={() => setWorkspace("overview")}
          />

          <WorkspaceTab
            active={workspace === "allowances"}
            icon={<WalletCards size={15} />}
            label="Allowances"
            onClick={() => setWorkspace("allowances")}
          />

          <WorkspaceTab
            active={workspace === "deductions"}
            icon={<Calculator size={15} />}
            label="Deductions"
            onClick={() => setWorkspace("deductions")}
          />

          <WorkspaceTab
            active={workspace === "overtime"}
            icon={<Clock3 size={15} />}
            label="Overtime"
            onClick={() => setWorkspace("overtime")}
          />

          <WorkspaceTab
            active={workspace === "payslips"}
            icon={<FileText size={15} />}
            label="Payslips"
            onClick={() => setWorkspace("payslips")}
          />

          <WorkspaceTab
            active={workspace === "history"}
            icon={<History size={15} />}
            label="History"
            onClick={() => setWorkspace("history")}
          />
        </div>

        <div className="p-6">
          {workspace === "overview" && (
            <PayrollRegisterLauncher
              employeeCount={payroll.length}
              totalNet={totalNet}
              onOpen={() => setShowRegisterModal(true)}
            />
          )}

          {workspace === "allowances" && (
            <ComponentWorkspace
              title="Allowances"
              description="Earnings components for this payroll."
              icon={<WalletCards size={21} />}
              onAdd={() =>
                setShowComponentModal("allowance")
              }
            >
              <ComponentSummary
                title="Total Allowances"
                value={formatCurrency(
                  payroll.reduce(
                    (total, employee) =>
                      total + getAllowances(employee),
                    0,
                  ),
                )}
              />

              <ComponentSummary
                title="Employees with Allowances"
                value={
                  payroll
                    .filter(
                      (employee) =>
                        getAllowances(employee) > 0,
                    )
                    .length.toString()
                }
              />
            </ComponentWorkspace>
          )}

          {workspace === "deductions" && (
            <ComponentWorkspace
              title="Deductions"
              description="Statutory and other deductions."
              icon={<Calculator size={21} />}
              onAdd={() =>
                setShowComponentModal("deduction")
              }
            >
              <ComponentSummary
                title="Total Deductions"
                value={formatCurrency(totalDeductions)}
              />

              <ComponentSummary
                title="Employees Affected"
                value={payroll.length.toString()}
              />
            </ComponentWorkspace>
          )}

          {workspace === "overtime" && (
            <ComponentWorkspace
              title="Overtime"
              description="Overtime hours and additional pay."
              icon={<Clock3 size={21} />}
              onAdd={() =>
                setShowComponentModal("overtime")
              }
            >
              <ComponentSummary
                title="Overtime Hours"
                value={payroll
                  .reduce(
                    (total, employee) =>
                      total + employee.overtimeHours,
                    0,
                  )
                  .toString()}
              />

              <ComponentSummary
                title="Overtime Pay"
                value={formatCurrency(
                  payroll.reduce(
                    (total, employee) =>
                      total + employee.overtimeAmount,
                    0,
                  ),
                )}
              />
            </ComponentWorkspace>
          )}

          {workspace === "payslips" && (
            <PayslipWorkspace
              payroll={payroll}
              onView={(employee) => {
                setSelectedEmployee(employee);
                setShowPayslip(true);
              }}
            />
          )}

          {workspace === "history" && (
            <PayrollHistory
              history={history}
            />
          )}
        </div>
      </Card>

      {/* =====================================================
          REGISTER EMPLOYEES MODAL
      ===================================================== */}

      {showRegisterModal && (
        <RegisterEmployeesModal
          employees={employeeDirectory}
          registeredIds={registeredIds}
          onClose={() => setShowRegisterModal(false)}
          onRegister={registerEmployees}
          onUnregister={unregisterEmployee}
        />
      )}

      {/* =====================================================
          RUN PAYROLL MODAL
      ===================================================== */}

      {showRunPayroll && (
        <RunPayrollModal
          period={period}
          employeeCount={payroll.length}
          gross={totalGross}
          deductions={totalDeductions}
          net={totalNet}
          onClose={() => setShowRunPayroll(false)}
          onRun={handleRunPayroll}
        />
      )}

      {/* =====================================================
          PERIOD MODAL
      ===================================================== */}

      {showPeriodModal && (
        <PeriodModal
          period={period}
          onClose={() => setShowPeriodModal(false)}
          onChange={(value) => {
            setPeriod(value);
            setShowPeriodModal(false);
          }}
        />
      )}

      {/* =====================================================
          COMPONENT MODAL
      ===================================================== */}

      {showComponentModal && (
        <ComponentModal
          type={showComponentModal}
          onClose={() => setShowComponentModal(null)}
        />
      )}

      {/* =====================================================
          PAYSLIP MODAL
      ===================================================== */}

      {showPayslip && selectedEmployee && (
        <PayslipModal
          employee={selectedEmployee}
          period={period}
          onClose={() => {
            setShowPayslip(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  label,
  value,
  description,
  icon,
  iconClass = "text-[var(--color-brand)] bg-[var(--color-brand-soft)]",
}: {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
  iconClass?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[var(--color-text-muted)]">
            {label}
          </p>

          <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">
            {value}
          </p>

          <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">
            {description}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

/* =========================================================
   WORKSPACE TAB
========================================================= */

function WorkspaceTab({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-medium transition-colors ${
        active
          ? "border-[var(--color-brand)] text-[var(--color-brand)]"
          : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* =========================================================
   REGISTER LAUNCHER

   Notice there is NO payroll table here.
========================================================= */

function PayrollRegisterLauncher({
  employeeCount,
  totalNet,
  onOpen,
}: {
  employeeCount: number;
  totalNet: number;
  onOpen: () => void;
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
          <ListChecks size={21} />
        </div>

        <h3 className="mt-4 text-base font-semibold text-[var(--color-text)]">
          Payroll Register
        </h3>

        <p className="mt-1 max-w-xl text-xs leading-5 text-[var(--color-text-secondary)]">
          Review and manage employees included in this payroll run.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
            Employees
          </p>

          <p className="mt-1 text-lg font-semibold text-[var(--color-text)]">
            {employeeCount}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
            Net Payroll
          </p>

          <p className="mt-1 text-lg font-semibold text-[var(--color-text)]">
            {formatCurrency(totalNet)}
          </p>
        </div>

        <Button onClick={onOpen}>
          <Eye size={15} />
          Open Register
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENT WORKSPACE
========================================================= */

function ComponentWorkspace({
  title,
  description,
  icon,
  onAdd,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
            {icon}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              {title}
            </h3>

            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {description}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={onAdd}
        >
          <Plus size={15} />
          Add
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENT SUMMARY
========================================================= */

function ComponentSummary({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
      <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
        {title}
      </p>

      <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   PAYSLIP WORKSPACE
========================================================= */

function PayslipWorkspace({
  payroll,
  onView,
}: {
  payroll: PayrollEmployee[];
  onView: (employee: PayrollEmployee) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text)]">
            Employee Payslips
          </h3>

          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            Select an employee to preview.
          </p>
        </div>

        <Button variant="secondary">
          <Download size={15} />
          Export All
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {payroll.map((employee) => (
          <button
            key={employee.id}
            type="button"
            onClick={() => onView(employee)}
            className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] p-4 text-left transition-colors hover:bg-[var(--color-surface-hover)]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-xs font-bold text-[var(--color-brand)]">
              {getInitials(employee.name)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--color-text)]">
                {employee.name}
              </p>

              <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                {employee.employeeNumber}
              </p>
            </div>

            <Eye
              size={15}
              className="text-[var(--color-text-muted)]"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   PAYROLL HISTORY
========================================================= */

function PayrollHistory({
  history,
}: {
  history: PayrollHistoryRecord[];
}) {
  return (
    <div>
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          Payroll History
        </h3>

        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          Previous periods and their totals.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {history.map((record) => (
          <div
            key={record.id}
            className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] p-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {record.period}
                </p>

                <PayrollStatusBadge status={record.status} />
              </div>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {record.employeeCount} employees · Processed{" "}
                {record.processedDate}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <HistoryValue
                label="Gross"
                value={formatCurrency(record.gross)}
              />

              <HistoryValue
                label="Deductions"
                value={formatCurrency(record.deductions)}
              />

              <HistoryValue
                label="Net"
                value={formatCurrency(record.net)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-[var(--color-text)]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   REGISTER EMPLOYEES MODAL

   Individual + bulk selection
   Search
   Department filter
   Select all
========================================================= */

function RegisterEmployeesModal({
  employees,
  registeredIds,
  onClose,
  onRegister,
  onUnregister,
}: {
  employees: Employee[];
  registeredIds: string[];
  onClose: () => void;
  onRegister: (ids: string[]) => void;
  onUnregister: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [selected, setSelected] = useState<string[]>(
    registeredIds,
  );

  const departments = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(employees.map((employee) => employee.department)),
      ),
    ],
    [employees],
  );

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return employees.filter((employee) => {
      const matchesSearch =
        !query ||
        employee.name.toLowerCase().includes(query) ||
        employee.employeeNumber
          .toLowerCase()
          .includes(query) ||
        employee.position.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All" ||
        employee.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, department]);

  const toggleEmployee = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((employeeId) => employeeId !== id)
        : [...current, id],
    );
  };

  const toggleAllVisible = () => {
    const visibleIds = filtered.map(
      (employee) => employee.id,
    );

    const allSelected = visibleIds.every((id) =>
      selected.includes(id),
    );

    if (allSelected) {
      setSelected((current) =>
        current.filter((id) => !visibleIds.includes(id)),
      );
    } else {
      setSelected((current) =>
        Array.from(new Set([...current, ...visibleIds])),
      );
    }
  };

  return (
    <ModalShell
      title="Register Employees for Payroll"
      onClose={onClose}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-[var(--color-brand)]/30 bg-[var(--color-brand-soft)] p-4">
          <div className="flex gap-3">
            <UserCheck
              size={19}
              className="mt-0.5 shrink-0 text-[var(--color-brand)]"
            />

            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">
                Choose who undergoes payroll
              </p>

              <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
                Registration alone doesn't add someone to payroll.
                Select employees for this period below.
              </p>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search employee, number or position..."
              className="pl-10"
            />
          </div>

          <div className="relative md:w-56">
            <select
              value={department}
              onChange={(event) =>
                setDepartment(event.target.value)
              }
              className="h-10 w-full appearance-none rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 pr-9 text-xs text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
            >
              {departments.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />
          </div>
        </div>

        {/* Selection bar */}
        <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleAllVisible}
              className={`flex h-5 w-5 items-center justify-center rounded border ${
                filtered.length > 0 &&
                filtered.every((employee) =>
                  selected.includes(employee.id),
                )
                  ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-bg)]"
                  : "border-[var(--color-border-strong)]"
              }`}
            >
              {filtered.length > 0 &&
                filtered.every((employee) =>
                  selected.includes(employee.id),
                ) && <Check size={13} />}
            </button>

            <span className="text-xs text-[var(--color-text-secondary)]">
              Select all visible
            </span>
          </div>

          <span className="text-xs font-medium text-[var(--color-brand)]">
            {selected.length} selected
          </span>
        </div>

        {/* Employee selection */}
        <div className="max-h-[430px] overflow-y-auto rounded-xl border border-[var(--color-border)]">
          {filtered.map((employee) => {
            const isSelected = selected.includes(employee.id);
            const isRegistered =
              registeredIds.includes(employee.id);

            return (
              <div
                key={employee.id}
                className="flex items-center gap-4 border-b border-[var(--color-border)] px-4 py-4 last:border-b-0 hover:bg-[var(--color-surface-hover)]"
              >
                <button
                  type="button"
                  onClick={() =>
                    toggleEmployee(employee.id)
                  }
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    isSelected
                      ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-bg)]"
                      : "border-[var(--color-border-strong)]"
                  }`}
                >
                  {isSelected && <Check size={13} />}
                </button>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[10px] font-bold text-[var(--color-brand)]">
                  {getInitials(employee.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {employee.name}
                  </p>

                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                    {employee.employeeNumber} ·{" "}
                    {employee.department} ·{" "}
                    {employee.position}
                  </p>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                    {formatCurrency(employee.basicSalary)}
                  </p>

                  <p className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                    Basic Salary
                  </p>
                </div>

                {isRegistered && (
                  <span className="rounded-full bg-[var(--color-success)]/10 px-2 py-1 text-[9px] font-medium text-[var(--color-success)]">
                    Registered
                  </span>
                )}

                {isRegistered && (
                  <button
                    type="button"
                    onClick={() =>
                      onUnregister(employee.id)
                    }
                    className="rounded-md p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
                    title="Remove from payroll"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <Search
                size={20}
                className="mx-auto text-[var(--color-text-muted)]"
              />

              <p className="mt-3 text-sm text-[var(--color-text)]">
                No employees found
              </p>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Try another search or department.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-5">
          <p className="text-xs text-[var(--color-text-muted)]">
            {selected.length} employees will be included.
          </p>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              onClick={() => onRegister(selected)}
            >
              <UserCheck size={15} />
              Register Selected
            </Button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

/* =========================================================
   RUN PAYROLL MODAL
========================================================= */

function RunPayrollModal({
  period,
  employeeCount,
  gross,
  deductions,
  net,
  onClose,
  onRun,
}: {
  period: string;
  employeeCount: number;
  gross: number;
  deductions: number;
  net: number;
  onClose: () => void;
  onRun: () => void;
}) {
  return (
    <ModalShell
      title="Process Payroll"
      onClose={onClose}
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[var(--color-brand)]/30 bg-[var(--color-brand-soft)] p-4">
          <div className="flex gap-3">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-[var(--color-brand)]"
            />

            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">
                Process {period}
              </p>

              <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
                Calculations run for{" "}
                <strong className="text-[var(--color-text)]">
                  {employeeCount}
                </strong>{" "}
                registered employees.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <ProcessValue
            label="Gross"
            value={formatCurrency(gross)}
          />

          <ProcessValue
            label="Deductions"
            value={formatCurrency(deductions)}
          />

          <ProcessValue
            label="Net Pay"
            value={formatCurrency(net)}
            highlighted
          />
        </div>

        <div className="space-y-2">
          <PayrollCheck label="Employee payroll registration" />
          <PayrollCheck label="Basic salaries" />
          <PayrollCheck label="Allowances" />
          <PayrollCheck label="Deductions" />
          <PayrollCheck label="Overtime" />
          <PayrollCheck label="Payroll calculations" />
        </div>

        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button onClick={onRun}>
            <Play size={15} />
            Process Payroll
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

function ProcessValue({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlighted
          ? "border-[var(--color-brand)]/30 bg-[var(--color-brand-soft)]"
          : "border-[var(--color-border)] bg-[var(--color-bg)]"
      }`}
    >
      <p className="text-[9px] uppercase tracking-[0.13em] text-[var(--color-text-muted)]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   PERIOD MODAL
========================================================= */

function PeriodModal({
  period,
  onClose,
  onChange,
}: {
  period: string;
  onClose: () => void;
  onChange: (value: string) => void;
}) {
  const periods = [
    "September 2026",
    "August 2026",
    "July 2026",
    "June 2026",
    "May 2026",
  ];

  return (
    <ModalShell
      title="Payroll Period"
      onClose={onClose}
    >
      <div className="space-y-5">
        <p className="text-xs text-[var(--color-text-secondary)]">
          Select the period to view or process.
        </p>

        <div className="space-y-2">
          {periods.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                item === period
                  ? "border-[var(--color-brand)]/40 bg-[var(--color-brand-soft)]"
                  : "border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]"
              }`}
            >
              <span className="text-sm text-[var(--color-text)]">
                {item}
              </span>

              {item === period && (
                <Check
                  size={16}
                  className="text-[var(--color-brand)]"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

/* =========================================================
   COMPONENT MODAL
========================================================= */

function ComponentModal({
  type,
  onClose,
}: {
  type: "allowance" | "deduction" | "overtime";
  onClose: () => void;
}) {
  const titles = {
    allowance: "Manage Allowance",
    deduction: "Manage Deduction",
    overtime: "Manage Overtime",
  };

  const descriptions = {
    allowance: "Add an allowance to an employee's payroll.",
    deduction: "Add a deduction to an employee's payroll.",
    overtime: "Record overtime hours for an employee.",
  };

  return (
    <ModalShell
      title={titles[type]}
      onClose={onClose}
    >
      <div className="space-y-5">
        <div>
          <p className="text-xs leading-5 text-[var(--color-text-secondary)]">
            {descriptions[type]}
          </p>
        </div>

        <label className="space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Employee
          </span>

          <select className="h-10 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 text-xs text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]">
            {employeeDirectory
              .filter((employee) =>
                initialRegisteredEmployees.includes(employee.id),
              )
              .map((employee) => (
                <option key={employee.id}>
                  {employee.employeeNumber} ·{" "}
                  {employee.name}
                </option>
              ))}
          </select>
        </label>

        {type === "overtime" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Hours
              </span>

              <input
                type="number"
                min="0"
                className="h-10 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
                placeholder="0"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Amount
              </span>

              <input
                type="number"
                min="0"
                className="h-10 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
                placeholder="0"
              />
            </label>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Type
              </span>

              <select className="h-10 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 text-xs text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]">
                <option>
                  {type === "allowance"
                    ? "Housing Allowance"
                    : "PAYE"}
                </option>
                <option>
                  {type === "allowance"
                    ? "Transport Allowance"
                    : "Pension"}
                </option>
                <option>
                  {type === "allowance"
                    ? "Other Allowance"
                    : "Other Deduction"}
                </option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Amount
              </span>

              <input
                type="number"
                min="0"
                className="h-10 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
                placeholder="0"
              />
            </label>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button onClick={onClose}>
            <Check size={15} />
            Save
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

/* =========================================================
   PAYSLIP MODAL
========================================================= */

function PayslipModal({
  employee,
  period,
  onClose,
}: {
  employee: PayrollEmployee;
  period: string;
  onClose: () => void;
}) {
  const gross = getGrossSalary(employee);
  const deductions = getDeductions(employee);
  const net = getNetSalary(employee);

  return (
    <ModalShell
      title="Employee Payslip"
      onClose={onClose}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-sm font-bold text-[var(--color-brand)]">
            {getInitials(employee.name)}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              {employee.name}
            </h3>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {employee.employeeNumber} · {period}
            </p>
          </div>

          <div className="ml-auto">
            <PayrollStatusBadge
              status={employee.status}
            />
          </div>
        </div>

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

          <PayrollLine
            label="Overtime"
            value={formatCurrency(employee.overtimeAmount)}
          />

          <div className="mt-3 border-t border-[var(--color-border)] pt-3">
            <PayrollLine
              label="Gross Salary"
              value={formatCurrency(gross)}
              strong
            />
          </div>
        </PayrollSection>

        <PayrollSection title="Deductions">
          <PayrollLine
            label="PAYE"
            value={formatCurrency(employee.deductions.paye)}
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

        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Close
          </Button>

          <Button>
            <Download size={15} />
            Export Payslip
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
   PAYROLL STATUS
========================================================= */

function PayrollStatusBadge({
  status,
}: {
  status:
    | PayrollStatus
    | PayrollHistoryRecord["status"];
}) {
  const styles: Record<string, string> = {
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

function ModalShell({
  title,
  children,
  onClose,
  maxWidth = "max-w-2xl",
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className={`max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] shadow-2xl`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">
            {title}
          </h2>

          <button
            type="button"
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