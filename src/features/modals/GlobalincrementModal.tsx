import { ChevronDown, Percent } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Field,
  ModalShell,
  fieldInputClass,
  fieldSelectClass,
} from "../../components/ui/ModalShell";

/* Replace this with the real employee/payroll source in the app */
export interface IncrementEmployee {
  id: string;
  name: string;
  department: string;
  status: "Active" | "Inactive";
  basicSalary: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(value);

type IncrementMethod = "percentage" | "fixed";

interface GlobalIncrementModalProps {
  employees: IncrementEmployee[];
  onClose: () => void;
  onApply: (payload: {
    effectiveDate: string;
    method: IncrementMethod;
    value: number;
    applyTo: string;
    department: string;
    employeeStatus: "Active" | "All";
    affectedIds: string[];
  }) => void;
}

export function GlobalIncrementModal({
  employees,
  onClose,
  onApply,
}: GlobalIncrementModalProps) {
  const [effectiveDate, setEffectiveDate] = useState("2026-10-01");
  const [method, setMethod] = useState<IncrementMethod>("percentage");
  const [value, setValue] = useState(5);
  const [applyTo, setApplyTo] = useState<"all" | "department">("all");
  const [department, setDepartment] = useState("All Departments");
  const [employeeStatus, setEmployeeStatus] = useState<
    "Active" | "All"
  >("Active");

  const departments = useMemo(
    () => [
      "All Departments",
      ...Array.from(new Set(employees.map((e) => e.department))),
    ],
    [employees],
  );

  const affected = useMemo(() => {
    return employees.filter((employee) => {
      const matchesStatus =
        employeeStatus === "All" || employee.status === "Active";

      const matchesDepartment =
        applyTo === "all" ||
        department === "All Departments" ||
        employee.department === department;

      return matchesStatus && matchesDepartment;
    });
  }, [employees, applyTo, department, employeeStatus]);

  const currentPayroll = affected.reduce(
    (total, e) => total + e.basicSalary,
    0,
  );

  const estimatedIncrease =
    method === "percentage"
      ? currentPayroll * (value / 100)
      : value * affected.length;

  const newPayroll = currentPayroll + estimatedIncrease;

  return (
    <ModalShell title="Global Increment" onClose={onClose} maxWidth="max-w-xl">
      <div className="space-y-6">
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
            Increment Information
          </p>

          <div className="space-y-4">
            <Field label="Effective Date">
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className={fieldInputClass}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Increment Method">
                <div className="relative">
                  <select
                    value={method}
                    onChange={(e) =>
                      setMethod(e.target.value as IncrementMethod)
                    }
                    className={fieldSelectClass}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                  />
                </div>
              </Field>

              <Field
                label={
                  method === "percentage"
                    ? "Increment Value (%)"
                    : "Increment Value (TZS)"
                }
              >
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={method === "percentage" ? 0.5 : 10000}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className={fieldInputClass}
                  />
                  {method === "percentage" && (
                    <Percent
                      size={13}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                    />
                  )}
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Apply To">
                <div className="relative">
                  <select
                    value={applyTo}
                    onChange={(e) =>
                      setApplyTo(e.target.value as "all" | "department")
                    }
                    className={fieldSelectClass}
                  >
                    <option value="all">All Employees</option>
                    <option value="department">By Department</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                  />
                </div>
              </Field>

              <Field label="Department">
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    disabled={applyTo === "all"}
                    className={`${fieldSelectClass} disabled:opacity-50`}
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
              </Field>
            </div>

            <Field label="Employee Status">
              <div className="relative">
                <select
                  value={employeeStatus}
                  onChange={(e) =>
                    setEmployeeStatus(e.target.value as "Active" | "All")
                  }
                  className={fieldSelectClass}
                >
                  <option value="Active">Active Employees</option>
                  <option value="All">All Employees</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />
              </div>
            </Field>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] pt-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
            Preview
          </p>

          <div className="rounded-xl border border-[var(--color-brand)]/30 bg-[var(--color-brand-soft)] p-4">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              {affected.length} employees affected
            </p>

            <div className="mt-3 grid grid-cols-3 gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  Current Payroll
                </p>
                <p className="mt-1 text-xs font-semibold text-[var(--color-text)]">
                  {formatCurrency(currentPayroll)}
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  Est. Increase
                </p>
                <p className="mt-1 text-xs font-semibold text-[var(--color-success)]">
                  +{formatCurrency(estimatedIncrease)}
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  New Payroll
                </p>
                <p className="mt-1 text-xs font-semibold text-[var(--color-text)]">
                  {formatCurrency(newPayroll)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() =>
              onApply({
                effectiveDate,
                method,
                value,
                applyTo,
                department,
                employeeStatus,
                affectedIds: affected.map((e) => e.id),
              })
            }
            disabled={affected.length === 0}
            className="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Apply Increment
          </button>
        </div>
      </div>
    </ModalShell>
  );
}