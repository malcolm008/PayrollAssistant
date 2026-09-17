import {
  ArrowLeft,
  Banknote,
  Check,
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLoanTypes } from "../../../hooks/useLoanTypes";
import type {
  LoanRepaymentMethod,
  LoanType,
} from "../../../types/loan";

export function LoanTypesPage() {
  const navigate = useNavigate();

  const {
    loanTypes,
    createLoanType,
    updateLoanType,
    deleteLoanType,
    toggleLoanType,
  } = useLoanTypes();

  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  const [editing, setEditing] =
    useState<LoanType | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<LoanType | null>(null);

  const filteredTypes = useMemo(() => {
    const query = search.toLowerCase().trim();

    return loanTypes.filter((item) => {
      const matchesSearch =
        !query ||
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      const matchesActive =
        !activeOnly || item.active;

      return matchesSearch && matchesActive;
    });
  }, [loanTypes, search, activeOnly]);

  const activeCount = loanTypes.filter(
    (item) => item.active,
  ).length;

  const approvalCount = loanTypes.filter(
    (item) => item.requiresApproval,
  ).length;

  function handleDelete() {
    if (!deleteTarget) return;

    deleteLoanType(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <Banknote
                size={20}
                className="text-[var(--color-brand)]"
              />

              <h1 className="text-2xl font-semibold text-[var(--color-text)]">
                Loan Types
              </h1>
            </div>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Configure the loan categories and repayment rules
              available to employees.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditing({
              id: "",
              code: "",
              name: "",
              description: "",
              repaymentMethod:
                "Payroll Deduction",
              maxAmount: undefined,
              maxInstallments: undefined,
              interestRate: 0,
              requiresApproval: true,
              active: true,
            })
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)] transition hover:bg-[var(--color-brand-hover)]"
        >
          <Plus size={16} />
          Add Loan Type
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<Banknote size={18} />}
          label="Total Types"
          value={loanTypes.length}
        />

        <SummaryCard
          icon={<Check size={18} />}
          label="Active"
          value={activeCount}
        />

        <SummaryCard
          icon={<Check size={18} />}
          label="Requires Approval"
          value={approvalCount}
        />
      </div>

      {/* Table */}
      <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex flex-col gap-3 border-b border-[var(--color-border)] p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search loan types..."
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] py-2.5 pl-10 pr-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setActiveOnly((value) => !value)
            }
            className={`rounded-lg border px-4 py-2.5 text-sm transition ${
              activeOnly
                ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
                : "border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
            }`}
          >
            {activeOnly
              ? "Active Only"
              : "All Records"}
          </button>
        </div>

        {filteredTypes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                  <th className="px-6 py-4 font-medium">
                    Code
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Loan Type
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Repayment
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Max Amount
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Installments
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Approval
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredTypes.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-[var(--color-surface-hover)]"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[var(--color-brand)]">
                      {item.code}
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {item.name}
                      </p>

                      <p className="mt-0.5 max-w-xs truncate text-xs text-[var(--color-text-secondary)]">
                        {item.description}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                      {item.repaymentMethod}
                    </td>

                    <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                      {item.maxAmount !==
                      undefined
                        ? item.maxAmount.toLocaleString()
                        : "No limit"}
                    </td>

                    <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                      {item.maxInstallments !==
                      undefined
                        ? item.maxInstallments
                        : "No limit"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.requiresApproval
                            ? "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
                            : "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
                        }`}
                      >
                        {item.requiresApproval
                          ? "Required"
                          : "Not Required"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <StatusToggle
                        active={item.active}
                        onClick={() =>
                          toggleLoanType(item.id)
                        }
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setEditing(item)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand)]"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget(item)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editing && (
        <LoanTypeModal
          value={editing}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing.id) {
              updateLoanType(
                editing.id,
                data,
              );
            } else {
              createLoanType(data);
            }

            setEditing(null);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onClose={() =>
            setDeleteTarget(null)
          }
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
          {icon}
        </div>

        <div>
          <p className="text-xs text-[var(--color-text-muted)]">
            {label}
          </p>

          <p className="mt-0.5 text-xl font-semibold text-[var(--color-text)]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusToggle({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
          : "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-[var(--color-success)]"
            : "bg-[var(--color-text-muted)]"
        }`}
      />

      {active ? "Active" : "Inactive"}
    </button>
  );
}

function LoanTypeModal({
  value,
  onClose,
  onSave,
}: {
  value: LoanType;
  onClose: () => void;
  onSave: (
    value: Omit<LoanType, "id">,
  ) => void;
}) {
  const [form, setForm] = useState(value);

  function save() {
    if (!form.code.trim() || !form.name.trim()) {
      return;
    }

    onSave({
      code: form.code.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      repaymentMethod:
        form.repaymentMethod,
      maxAmount:
        form.maxAmount === undefined ||
        form.maxAmount === null
          ? undefined
          : Number(form.maxAmount),
      maxInstallments:
        form.maxInstallments === undefined ||
        form.maxInstallments === null
          ? undefined
          : Number(form.maxInstallments),
      interestRate:
        form.interestRate === undefined ||
        form.interestRate === null
          ? undefined
          : Number(form.interestRate),
      requiresApproval:
        form.requiresApproval,
      active: form.active,
    });
  }

  return (
    <Modal
      title={
        value.id
          ? "Edit Loan Type"
          : "Add Loan Type"
      }
      onClose={onClose}
      onSave={save}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Code"
          value={form.code}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              code: value.toUpperCase(),
            }))
          }
          placeholder="e.g. STAFF"
          required
        />

        <Field
          label="Loan Type"
          value={form.name}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              name: value,
            }))
          }
          placeholder="e.g. Staff Loan"
          required
        />
      </div>

      <Field
        label="Description"
        value={form.description}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            description: value,
          }))
        }
        placeholder="Describe this loan type"
        textarea
      />

      <SelectField
        label="Repayment Method"
        value={form.repaymentMethod}
        options={[
          "Payroll Deduction",
          "Manual",
          "Both",
        ]}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            repaymentMethod:
              value as LoanRepaymentMethod,
          }))
        }
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <NumberField
          label="Maximum Amount"
          value={form.maxAmount ?? ""}
          suffix=""
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              maxAmount:
                value === ""
                  ? undefined
                  : Number(value),
            }))
          }
        />

        <NumberField
          label="Maximum Installments"
          value={form.maxInstallments ?? ""}
          suffix="months"
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              maxInstallments:
                value === ""
                  ? undefined
                  : Number(value),
            }))
          }
        />

        <NumberField
          label="Interest Rate"
          value={form.interestRate ?? ""}
          suffix="%"
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              interestRate:
                value === ""
                  ? undefined
                  : Number(value),
            }))
          }
        />
      </div>

      <ToggleField
        label="Requires Approval"
        description="Loan requests using this type must be approved before processing."
        value={form.requiresApproval}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            requiresApproval: value,
          }))
        }
      />

      <ToggleField
        label="Active"
        description="Allow this loan type to be selected in new loan records."
        value={form.active}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            active: value,
          }))
        }
      />
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea = false,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-text)]">
        {label}

        {required && (
          <span className="ml-1 text-[var(--color-danger)]">
            *
          </span>
        )}
      </span>

      {textarea ? (
        <textarea
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
        />
      ) : (
        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
        />
      )}
    </label>
  );
}

function NumberField({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: number | string;
  suffix: string;
  onChange: (value: number | string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-text)]">
        {label}
      </span>

      <div className="relative">
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value === ""
                ? ""
                : Number(event.target.value),
            )
          }
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
        />

        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)]">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function SelectField({
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
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-text)]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleField({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3 text-left"
    >
      <div>
        <p className="text-sm font-medium text-[var(--color-text)]">
          {label}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          value
            ? "bg-[var(--color-brand)]"
            : "bg-[var(--color-border-strong)]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            value ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function Modal({
  title,
  children,
  onClose,
  onSave,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4">
          <h2 className="font-semibold text-[var(--color-text)]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {children}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)] hover:bg-[var(--color-brand-hover)]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({
  name,
  onClose,
  onConfirm,
}: {
  name: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)]">
            <Trash2 size={19} />
          </div>

          <h2 className="mt-4 font-semibold text-[var(--color-text)]">
            Delete loan type?
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Are you sure you want to delete{" "}
            <strong className="text-[var(--color-text)]">
              {name}
            </strong>
            ? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[var(--color-danger)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
        <Search size={20} />
      </div>

      <h3 className="mt-4 text-sm font-medium text-[var(--color-text)]">
        No loan types found
      </h3>

      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
        Try changing your search or filter.
      </p>
    </div>
  );
}