import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  WalletCards,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

type AdvanceStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Paid"
  | "Partially Recovered"
  | "Fully Recovered"
  | "Rejected"
  | "Cancelled";

interface AdvanceRecord {
  id: string;
  employeeNumber: string;
  employeeName: string;
  department: string;
  type: string;
  amount: number;
  recovered: number;
  requestDate: string;
  status: AdvanceStatus;
}

const mockAdvances: AdvanceRecord[] = [
  {
    id: "ADV-0001",
    employeeNumber: "EMP-0001",
    employeeName: "John Mwangi",
    department: "Finance",
    type: "Mid-Month Advance",
    amount: 500000,
    recovered: 250000,
    requestDate: "08 Sep 2026",
    status: "Partially Recovered",
  },
  {
    id: "ADV-0002",
    employeeNumber: "EMP-0002",
    employeeName: "Sarah Johnson",
    department: "Human Resources",
    type: "Air Ticket Advance",
    amount: 1200000,
    recovered: 600000,
    requestDate: "03 Sep 2026",
    status: "Paid",
  },
  {
    id: "ADV-0003",
    employeeNumber: "EMP-0003",
    employeeName: "Michael Smith",
    department: "Information Technology",
    type: "Leave Advance",
    amount: 800000,
    recovered: 800000,
    requestDate: "28 Aug 2026",
    status: "Fully Recovered",
  },
  {
    id: "ADV-0004",
    employeeNumber: "EMP-0004",
    employeeName: "Amina Hassan",
    department: "Administration",
    type: "Emergency Advance",
    amount: 350000,
    recovered: 0,
    requestDate: "07 Sep 2026",
    status: "Pending Approval",
  },
  {
    id: "ADV-0005",
    employeeNumber: "EMP-0005",
    employeeName: "David Mushi",
    department: "Operations",
    type: "Travel Advance",
    amount: 950000,
    recovered: 0,
    requestDate: "05 Sep 2026",
    status: "Approved",
  },
  {
    id: "ADV-0006",
    employeeNumber: "EMP-0006",
    employeeName: "Grace Joseph",
    department: "Finance",
    type: "Salary Advance",
    amount: 700000,
    recovered: 350000,
    requestDate: "01 Sep 2026",
    status: "Partially Recovered",
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(value);

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function AdvancesPage() {
  const [advances] = useState(mockAdvances);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedAdvance, setSelectedAdvance] =
    useState<AdvanceRecord | null>(null);

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filteredAdvances = useMemo(() => {
    const query = search.trim().toLowerCase();

    return advances.filter((advance) => {
      const matchesSearch =
        !query ||
        advance.employeeName.toLowerCase().includes(query) ||
        advance.employeeNumber.toLowerCase().includes(query) ||
        advance.type.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || advance.status === statusFilter;

      const matchesType =
        typeFilter === "All" || advance.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [advances, search, statusFilter, typeFilter]);

  const outstanding = advances.reduce(
    (total, advance) => total + (advance.amount - advance.recovered),
    0,
  );

  const thisMonth = advances.reduce(
    (total, advance) => total + advance.amount,
    0,
  );

  const recovered = advances.reduce(
    (total, advance) => total + advance.recovered,
    0,
  );

  const pending = advances.filter(
    (advance) => advance.status === "Pending Approval",
  ).length;

  const types = [...new Set(advances.map((advance) => advance.type))];

  return (
    <div className="min-h-full bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-[1600px] space-y-6 p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <WalletCards size={16} />
              <span>Payroll / Advances</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Advances
            </h1>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Manage employee advances, approvals and repayments.
            </p>
          </div>

          <Button className="flex items-center justify-center gap-2">
            <Plus size={17} />
            New Advance
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Outstanding"
            value={formatCurrency(outstanding)}
            icon={<ArrowUpRight size={18} />}
            detail="Amount yet to be recovered"
          />

          <StatCard
            label="This Month"
            value={formatCurrency(thisMonth)}
            icon={<WalletCards size={18} />}
            detail={`${advances.length} advances recorded`}
          />

          <StatCard
            label="Recovered"
            value={formatCurrency(recovered)}
            icon={<ArrowDownRight size={18} />}
            detail="Total recovered"
          />

          <StatCard
            label="Pending Approval"
            value={String(pending)}
            icon={<Clock3 size={18} />}
            detail="Awaiting approval"
          />
        </div>

        {/* Toolbar */}
        <Card className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search employee, number or advance type..."
                className="pl-10"
              />
            </div>

            <Button
              variant="secondary"
              onClick={() => setShowFilters((current) => !current)}
              className="flex items-center justify-center gap-2"
            >
              <Filter size={16} />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 grid gap-4 border-t border-[var(--color-border)] pt-4 md:grid-cols-2">
              <FilterSelect
                label="Advance Type"
                value={typeFilter}
                options={["All", ...types]}
                onChange={setTypeFilter}
              />

              <FilterSelect
                label="Status"
                value={statusFilter}
                options={[
                  "All",
                  "Draft",
                  "Pending Approval",
                  "Approved",
                  "Paid",
                  "Partially Recovered",
                  "Fully Recovered",
                  "Rejected",
                  "Cancelled",
                ]}
                onChange={setStatusFilter}
              />
            </div>
          )}
        </Card>

        {/* Register */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
            <div>
              <h2 className="font-semibold">Advance Register</h2>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {filteredAdvances.length} advance
                {filteredAdvances.length === 1 ? "" : "s"} displayed
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
                  <TableHead>Employee</TableHead>
                  <TableHead>Advance Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Recovered</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </tr>
              </thead>

              <tbody>
                {filteredAdvances.map((advance) => {
                  const balance = advance.amount - advance.recovered;

                  return (
                    <tr
                      key={advance.id}
                      className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-hover)]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-xs font-semibold text-[var(--color-brand)]">
                            {getInitials(advance.employeeName)}
                          </div>

                          <div>
                            <div className="font-medium">
                              {advance.employeeName}
                            </div>

                            <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                              {advance.employeeNumber} · {advance.department}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {advance.type}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium">
                        {formatCurrency(advance.amount)}
                      </td>

                      <td className="px-5 py-4 text-sm text-[var(--color-success)]">
                        {formatCurrency(advance.recovered)}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold">
                        {formatCurrency(balance)}
                      </td>

                      <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                        {advance.requestDate}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={advance.status} />
                      </td>

                      <td className="relative px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu((current) =>
                              current === advance.id ? null : advance.id,
                            )
                          }
                          className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {openMenu === advance.id && (
                          <div className="absolute right-5 top-12 z-20 w-44 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] p-1 shadow-xl">
                            <MenuAction
                              icon={<Eye size={15} />}
                              label="View Details"
                              onClick={() => {
                                setSelectedAdvance(advance);
                                setOpenMenu(null);
                              }}
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAdvances.length === 0 && (
            <div className="px-6 py-16 text-center">
              <WalletCards
                size={30}
                className="mx-auto text-[var(--color-text-muted)]"
              />

              <h3 className="mt-3 font-medium">No advances found</h3>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </Card>
      </div>

      {selectedAdvance && (
        <AdvanceDetails
          advance={selectedAdvance}
          onClose={() => setSelectedAdvance(null)}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  detail,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  detail: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {label}
          </p>

          <p className="mt-2 text-xl font-semibold tracking-tight">
            {value}
          </p>

          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            {detail}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function TableHead({ children }: { children?: ReactNode }) {
  return (
    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
      {children}
    </th>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[var(--color-text-secondary)]">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 py-2.5 pr-9 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
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

function StatusBadge({ status }: { status: AdvanceStatus }) {
  const styles: Record<AdvanceStatus, string> = {
    Draft:
      "bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]",
    "Pending Approval":
      "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
    Approved: "bg-[var(--color-info)]/10 text-[var(--color-info)]",
    Paid: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
    "Partially Recovered":
      "bg-[var(--color-brand-soft)] text-[var(--color-brand)]",
    "Fully Recovered":
      "bg-[var(--color-success)]/10 text-[var(--color-success)]",
    Rejected: "bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
    Cancelled:
      "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status === "Approved" || status === "Paid" ? (
        <CheckCircle2 size={13} />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}

      {status}
    </span>
  );
}

function MenuAction({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
    >
      {icon}
      {label}
    </button>
  );
}

function AdvanceDetails({
  advance,
  onClose,
}: {
  advance: AdvanceRecord;
  onClose: () => void;
}) {
  const balance = advance.amount - advance.recovered;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl">
        <div className="flex items-start justify-between border-b border-[var(--color-border)] px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              {advance.id}
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              {advance.employeeName}
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {advance.employeeNumber} · {advance.department}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <DetailMetric
              label="Original Amount"
              value={formatCurrency(advance.amount)}
            />

            <DetailMetric
              label="Recovered"
              value={formatCurrency(advance.recovered)}
            />

            <DetailMetric
              label="Outstanding"
              value={formatCurrency(balance)}
              highlight
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <DetailField label="Advance Type" value={advance.type} />
            <DetailField label="Request Date" value={advance.requestDate} />
            <DetailField label="Employee" value={advance.employeeName} />
            <DetailField label="Status" value={advance.status} />
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] p-4">
            <div className="flex items-center gap-2">
              <WalletCards
                size={17}
                className="text-[var(--color-brand)]"
              />

              <h3 className="font-medium">Repayment</h3>
            </div>

            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Repayment schedule and payroll recovery details will be
              configured here when the repayment workflow is implemented.
            </p>
          </div>

          <div className="flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailMetric({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>

      <p
        className={`mt-2 text-lg font-semibold ${
          highlight ? "text-[var(--color-brand)]" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}