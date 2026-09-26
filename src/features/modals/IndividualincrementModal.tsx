import { ChevronDown, Percent } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Field,
  ModalShell,
  fieldInputClass,
  fieldSelectClass,
} from "../../components/ui/ModalShell";
import type { IncrementEmployee } from "./GlobalincrementModal";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(value);

type IncrementMethod = "percentage" | "fixed";

interface IndividualIncrementModalProps {
  employees: IncrementEmployee[];
  defaultEmployeeId?: string;
  onClose: () => void;
  onApply: (payload: {
    employeeId: string;
    method: IncrementMethod;
    value: number;
    effectiveDate: string;
    newSalary: number;
    reason: string;
  }) => void;
}

export function IndividualIncrementModal({
  employees,
  defaultEmployeeId,
  onClose,
  onApply,
}: IndividualIncrementModalProps) {
  const [employeeId, setEmployeeId] = useState(
    defaultEmployeeId ?? employees[0]?.id ?? "",
  );
  const [method, setMethod] = useState<IncrementMethod>("percentage");
  const [value, setValue] = useState(10);
  const [effectiveDate, setEffectiveDate] = useState("2026-10-01");
  const [reason, setReason] = useState("Annual salary adjustment");

  const employee = useMemo(
    () => employees.find((e) => e.id === employeeId) ?? null,
    [employees, employeeId],
  );

  const currentSalary = employee?.basicSalary ?? 0;

  const newSalary =
    method === "percentage"
      ? currentSalary + currentSalary * (value / 100)
      : currentSalary + value;

  return (
    <ModalShell
      title="Individual Increment"
      onClose={onClose}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <Field label="Employee">
            <div className="relative">
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className={fieldSelectClass}
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
            </div>
          </Field>

          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
            <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Current Salary
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
              {formatCurrency(currentSalary)}
            </p>
          </div>

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

          <Field label="Effective Date">
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className={fieldInputClass}
            />
          </Field>

          <div className="rounded-lg border border-[var(--color-brand)]/30 bg-[var(--color-brand-soft)] px-4 py-3">
            <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--color-brand)]">
              New Salary
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
              {formatCurrency(newSalary)}
            </p>
          </div>

          <Field label="Reason">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
            />
          </Field>
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
              employee &&
              onApply({
                employeeId,
                method,
                value,
                effectiveDate,
                newSalary,
                reason,
              })
            }
            disabled={!employee}
            className="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Apply Increment
          </button>
        </div>
      </div>
    </ModalShell>
  );
}