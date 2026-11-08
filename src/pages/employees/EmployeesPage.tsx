import {
  ChevronDown,
  Edit3,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { useMemo, useRef, useState, type ReactNode } from "react";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import type { Employee } from "../../types/employees";
import { useEmployees } from "../../hooks/useEmployees";
import EmployeeFormModal from "../../components/employees/EmployeeFormModal";
import { TrainingCoursesSection } from "../../components/employees/TrainingCoursesSection";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(value);

type View = "employees" | "training";
type StatusFilter = "All" | "Active" | "Inactive";

const fullNameOf = (employee: Employee) =>
  `${employee.name} ${employee.surname}`;

export function EmployeesPage() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } =
    useEmployees();

  const [view, setView] = useState<View>("employees");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [employmentFilter, setEmploymentFilter] = useState("All");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(
    null,
  );

  const detailRef = useRef<HTMLDivElement>(null);

  const departments = useMemo(
    () => ["All", ...new Set(employees.map((e) => e.department))],
    [employees],
  );

  const employmentTypes = useMemo(
    () => ["All", ...new Set(employees.map((e) => e.employmentType))],
    [employees],
  );

  const filteredEmployees = useMemo(() => {
    const query = search.toLowerCase().trim();

    return employees.filter((employee) => {
      const matchesSearch =
        fullNameOf(employee).toLowerCase().includes(query) ||
        employee.employeeNumber.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query) ||
        employee.jobTitle.toLowerCase().includes(query) ||
        employee.costCode.toLowerCase().includes(query);

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
  }, [employees, search, statusFilter, departmentFilter, employmentFilter]);

  // The roster is grouped by department, people sorted by surname.
  const groups = useMemo(() => {
    const byDepartment = new Map<string, Employee[]>();

    for (const employee of filteredEmployees) {
      const list = byDepartment.get(employee.department) ?? [];
      list.push(employee);
      byDepartment.set(employee.department, list);
    }

    return [...byDepartment.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([department, list]) =>
          [
            department,
            [...list].sort((a, b) => a.surname.localeCompare(b.surname)),
          ] as const,
      );
  }, [filteredEmployees]);

  // Look the selection up by id so edits show up immediately, and fall back
  // to the first match so the detail pane is never empty while people exist.
  const selected =
    filteredEmployees.find((e) => e.id === selectedId) ??
    groups[0]?.[1][0] ??
    null;

  // Highest existing number + 1, so deleting someone never causes a duplicate.
  const nextEmployeeNumber = useMemo(() => {
    const highest = employees.reduce((max, employee) => {
      const n = parseInt(employee.employeeNumber.replace(/\D/g, ""), 10);
      return Number.isNaN(n) ? max : Math.max(max, n);
    }, 0);

    return `EMP-${String(highest + 1).padStart(4, "0")}`;
  }, [employees]);

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    departmentFilter !== "All" ||
    employmentFilter !== "All";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDepartmentFilter("All");
    setEmploymentFilter("All");
  };

  const selectEmployee = (id: string) => {
    setSelectedId(id);

    // On narrow screens the detail sits below the list, so bring it into view.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDelete = (employee: Employee) => {
    const confirmed = window.confirm(
      `Remove ${fullNameOf(employee)}? This can't be undone.`,
    );

    if (!confirmed) return;

    deleteEmployee(employee.id);
  };

  const handleAddEmployee = (employee: Employee) => {
    addEmployee(employee);
    setSelectedId(employee.id);
    setShowAddModal(false);
  };

  const handleUpdateEmployee = (employee: Employee) => {
    updateEmployee(employee);
    setEditingEmployee(null);
  };

  const tabs: { id: View; label: string }[] = [
    { id: "employees", label: "Employees" },
    { id: "training", label: "Training courses" },
  ];

  return (
    <div>
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            Employees
          </h1>
        </div>
      </header>

      {/* View switch */}
      <div
        role="tablist"
        className="mt-8 flex gap-6 border-b border-[var(--color-border)]"
      >
        {tabs.map((tab) => {
          const isActive = view === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setView(tab.id)}
              className={`-mb-px border-b-2 pb-3 text-sm transition-colors ${
                isActive
                  ? "border-[var(--color-brand)] font-medium text-[var(--color-text)]"
                  : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* People */}
      {view === "employees" && employees.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-sm font-medium text-[var(--color-text)]">
            No employees yet
          </p>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Add your first employee to start building the roster.
          </p>

          <div className="mt-5 flex justify-center">
            <Button onClick={() => setShowAddModal(true)}>
              <Plus size={16} />
              Add employee
            </Button>
          </div>
        </div>
      )}

      {view === "employees" && employees.length > 0 && (
        <div className="mt-8 grid gap-10 lg:grid-cols-[19rem_minmax(0,1fr)]">
          {/* Roster */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="relative">
              <Button onClick={() => setShowAddModal(true)}>
                <Plus size={16} />
                Add employee
              </Button>
            </div>

            <div className="mt-4 relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />

              <Input
                placeholder="Search by name | role | number"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-10"
              />
            </div>

            <div
              role="group"
              aria-label="Status"
              className="mt-4 flex gap-5 text-sm"
            >
              {(["All", "Active", "Inactive"] as StatusFilter[]).map(
                (status) => {
                  const isOn = statusFilter === status;

                  return (
                    <button
                      key={status}
                      type="button"
                      aria-pressed={isOn}
                      onClick={() => setStatusFilter(status)}
                      className={`transition-colors ${
                        isOn
                          ? "font-medium text-[var(--color-text)] underline decoration-[var(--color-brand)] decoration-2 underline-offset-[6px]"
                          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                      }`}
                    >
                      {status}
                    </button>
                  );
                },
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <FilterSelect
                label="Department"
                allLabel="All departments"
                value={departmentFilter}
                options={departments}
                onChange={setDepartmentFilter}
              />

              <FilterSelect
                label="Employment type"
                allLabel="All types"
                value={employmentFilter}
                options={employmentTypes}
                onChange={setEmploymentFilter}
              />
            </div>

            <div className="mt-6 lg:max-h-[calc(100vh-19rem)] lg:overflow-y-auto">
              {groups.length === 0 ? (
                <div className="py-6">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    No one matches these filters.
                  </p>

                  {hasFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-2 text-sm font-medium text-[var(--color-brand)] hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                groups.map(([department, list]) => (
                  <section key={department} className="mb-5 last:mb-0">
                    <h3 className="mb-1 flex items-baseline justify-between px-3 text-xs text-[var(--color-text-muted)]">
                      <span>{department}</span>
                      <span className="tabular-nums">{list.length}</span>
                    </h3>

                    <ul>
                      {list.map((employee) => {
                        const isSelected = employee.id === selected?.id;
                        const isInactive = employee.status !== "Active";

                        return (
                          <li key={employee.id}>
                            <button
                              type="button"
                              onClick={() => selectEmployee(employee.id)}
                              aria-current={isSelected ? "true" : undefined}
                              className={`flex w-full items-baseline justify-between gap-3 border-l-2 py-2 pl-3 pr-2 text-left transition-colors ${
                                isSelected
                                  ? "border-[var(--color-brand)] bg-[var(--color-surface-raised)]"
                                  : "border-transparent hover:bg-[var(--color-surface-hover)]"
                              }`}
                            >
                              <span className="min-w-0">
                                <span
                                  className={`block truncate text-sm ${
                                    isSelected ? "font-semibold" : "font-medium"
                                  } ${
                                    isInactive
                                      ? "text-[var(--color-text-muted)]"
                                      : "text-[var(--color-text)]"
                                  }`}
                                >
                                  {fullNameOf(employee)}
                                </span>

                                <span className="block truncate text-xs text-[var(--color-text-secondary)]">
                                  {employee.jobTitle}
                                </span>
                              </span>

                              {isInactive && (
                                <span className="shrink-0 text-xs text-[var(--color-text-muted)]">
                                  Inactive
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))
              )}
            </div>

          </aside>

          {/* Detail */}
          <div
            ref={detailRef}
            className="min-w-0 scroll-mt-6 lg:border-l lg:border-[var(--color-border)] lg:pl-10"
          >
            {selected ? (
              <EmployeeDetail
                employee={selected}
                onEdit={() => setEditingEmployee(selected)}
                onRemove={() => handleDelete(selected)}
              />
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">
                Nobody to show. Adjust the filters to see a record.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Training */}
      {view === "training" && (
        <div className="mt-8">
          <TrainingCoursesSection employees={employees} />
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <EmployeeFormModal
          nextEmployeeNumber={nextEmployeeNumber}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddEmployee}
        />
      )}

      {editingEmployee && (
        <EmployeeFormModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSubmit={handleUpdateEmployee}
        />
      )}
    </div>
  );
}

/* =========================================================
   EMPLOYEE DETAIL
   Reads like a record: who they are, then a payslip-style
   breakdown of pay, then the supporting facts.
========================================================= */

interface EmployeeDetailProps {
  employee: Employee;
  onEdit: () => void;
  onRemove: () => void;
}

function EmployeeDetail({ employee, onEdit, onRemove }: EmployeeDetailProps) {
  const isActive = employee.status === "Active";

  const allowanceTotal = employee.allowances.reduce(
    (sum, allowance) => sum + allowance.amount,
    0,
  );

  return (
    <article>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            {fullNameOf(employee)}
          </h2>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {employee.jobTitle} in {employee.department}
          </p>

          <p className="mt-1 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive
                  ? "bg-[var(--color-success)]"
                  : "bg-[var(--color-text-disabled)]"
              }`}
            />
            <span>
              {employee.status}, {employee.employmentType.toLowerCase()},{" "}
              <span className="tabular-nums">{employee.employeeNumber}</span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onEdit}>
            <Edit3 size={15} />
            Edit
          </Button>

          <button
            type="button"
            onClick={onRemove}
            className="flex h-9 items-center gap-2 rounded-[4px] px-3 text-sm text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/10"
          >
            <Trash2 size={15} />
            Remove
          </button>
        </div>
      </header>

      <Section title="Pay">
        <ul className="space-y-2 text-sm">
          <PayLine
            label="Basic salary"
            value={formatCurrency(employee.salary)}
          />

          {employee.allowances.map((allowance) => (
            <PayLine
              key={allowance.allowanceTypeId}
              label={allowance.allowanceTypeId}
              value={formatCurrency(allowance.amount)}
            />
          ))}
        </ul>

        {employee.allowances.length > 0 && (
          <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-[var(--color-border-strong)] pt-3 text-sm font-semibold text-[var(--color-text)]">
            <span>Basic plus allowances</span>
            <span className="tabular-nums">
              {formatCurrency(employee.salary + allowanceTotal)}
            </span>
          </div>
        )}

        <Facts
          className="mt-6"
          items={[
            ["Paid overtime", employee.paidOvertime ? "Yes" : "No"],
            ["SDL exemption", employee.sdlExemption ? "Yes" : "No"],
            ["Leave entitlement", `${employee.leaveDaysEntitled} days`],
          ]}
        />
      </Section>

      <Section title="Contact">
        <Facts
          items={[
            ["Email", employee.email || "—"],
            ["Phone", employee.phone || "—"],
            ["Residence", employee.residence || "—"],
          ]}
        />
      </Section>

      <Section title="Statutory and personal">
        <Facts
          items={[
            ["National ID number", employee.nationalIdNumber || "—"],
            ["TIN number", employee.tinNumber || "—"],
            ["WCF number", employee.wcfNumber || "—"],
            ["Gender", employee.gender],
            ["Date of birth", employee.dateOfBirth || "—"],
          ]}
        />
      </Section>

      <Section title="Work and housing">
        <Facts
          items={[
            ["Cost code", employee.costCode || "—"],
            ["Currency", employee.currency],
            ["Company house", employee.companyHouse ? "Yes" : "No"],
            [
              "Rent for rented house",
              employee.rentedHouseRentAmount > 0
                ? formatCurrency(employee.rentedHouseRentAmount)
                : "—",
            ],
          ]}
        />
      </Section>
    </article>
  );
}

/* =========================================================
   SMALL PIECES
========================================================= */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 border-t border-[var(--color-border)] pt-6">
      <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
        {title}
      </h3>

      {children}
    </section>
  );
}

// A payslip line: label, dotted leader, amount.
function PayLine({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-end gap-3">
      <span className="text-[var(--color-text-secondary)]">{label}</span>

      <span
        aria-hidden="true"
        className="mb-1.5 flex-1 border-b border-dotted border-[var(--color-border-strong)]"
      />

      <span className="tabular-nums text-[var(--color-text)]">{value}</span>
    </li>
  );
}

function Facts({
  items,
  className = "",
}: {
  items: [string, string][];
  className?: string;
}) {
  return (
    <dl className={`grid gap-x-8 gap-y-4 sm:grid-cols-2 ${className}`}>
      {items.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-xs text-[var(--color-text-muted)]">{label}</dt>

          <dd className="mt-0.5 break-words text-sm text-[var(--color-text)]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

interface FilterSelectProps {
  label: string;
  allLabel: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function FilterSelect({
  label,
  allLabel,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="relative min-w-0">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full appearance-none truncate rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] pl-3 pr-8 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-brand)]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "All" ? allLabel : option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
      />
    </div>
  );
}