import {
  Check,
  Edit3,
  MoreHorizontal,
  Plus,
  Settings2,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
} from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

import {
  defaultAdvanceTypes,
  type AdvanceType,
  type RepaymentMethod,
} from "./advanceTypes";

const formatLimit = (value?: number) => {
  if (value === undefined) return "No limit";

  return `${Math.round(value * 100)}% of salary`;
};

const formatInstallments = (value?: number) => {
  if (!value) return "Not specified";

  return `${value} installment${value === 1 ? "" : "s"}`;
};

export function AdvanceTypesPage() {
  const [advanceTypes, setAdvanceTypes] =
    useState<AdvanceType[]>(defaultAdvanceTypes);

  const [showForm, setShowForm] = useState(false);
  const [editingType, setEditingType] = useState<AdvanceType | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [repaymentMethod, setRepaymentMethod] =
    useState<RepaymentMethod>("Payroll Deduction");
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [maxAmount, setMaxAmount] = useState("");
  const [maxInstallments, setMaxInstallments] = useState("1");

  const resetForm = () => {
    setName("");
    setCode("");
    setDescription("");
    setRepaymentMethod("Payroll Deduction");
    setRequiresApproval(true);
    setMaxAmount("");
    setMaxInstallments("1");
    setEditingType(null);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (type: AdvanceType) => {
    setEditingType(type);
    setName(type.name);
    setCode(type.code);
    setDescription(type.description);
    setRepaymentMethod(type.repaymentMethod);
    setRequiresApproval(type.requiresApproval);
    setMaxAmount(
      type.maxAmount !== undefined
        ? String(Math.round(type.maxAmount * 100))
        : "",
    );
    setMaxInstallments(
      type.maxInstallments !== undefined
        ? String(type.maxInstallments)
        : "",
    );

    setOpenMenu(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !code.trim()) return;

    const amountLimit = maxAmount.trim()
      ? Number(maxAmount) / 100
      : undefined;

    const installments = maxInstallments.trim()
      ? Number(maxInstallments)
      : undefined;

    if (editingType) {
      setAdvanceTypes((current) =>
        current.map((type) =>
          type.id === editingType.id
            ? {
                ...type,
                name: name.trim(),
                code: code.trim().toUpperCase(),
                description: description.trim(),
                repaymentMethod,
                requiresApproval,
                maxAmount: amountLimit,
                maxInstallments: installments,
              }
            : type,
        ),
      );
    } else {
      const newType: AdvanceType = {
        id: `ADV-${String(advanceTypes.length + 1).padStart(3, "0")}`,
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim(),
        repaymentMethod,
        requiresApproval,
        maxAmount: amountLimit,
        maxInstallments: installments,
        active: true,
      };

      setAdvanceTypes((current) => [...current, newType]);
    }

    closeForm();
  };

  const toggleStatus = (id: string) => {
    setAdvanceTypes((current) =>
      current.map((type) =>
        type.id === id ? { ...type, active: !type.active } : type,
      ),
    );

    setOpenMenu(null);
  };

  const deleteType = (id: string) => {
    setAdvanceTypes((current) => current.filter((type) => type.id !== id));
    setOpenMenu(null);
  };

  return (
    <div className="min-h-full bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-[1600px] space-y-6 p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <Settings2 size={16} />
              <span>Settings / Payroll / Advance Types</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Advance Types
            </h1>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Configure the types of advances available in the payroll system.
            </p>
          </div>

          <Button
            onClick={openCreate}
            className="flex items-center justify-center gap-2"
          >
            <Plus size={17} />
            Add Advance Type
          </Button>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total Types"
            value={advanceTypes.length}
            icon={<Settings2 size={18} />}
          />

          <SummaryCard
            label="Active Types"
            value={advanceTypes.filter((type) => type.active).length}
            icon={<Check size={18} />}
          />

          <SummaryCard
            label="Approval Required"
            value={
              advanceTypes.filter((type) => type.requiresApproval).length
            }
            icon={<Check size={18} />}
          />

          <SummaryCard
            label="Payroll Deduction"
            value={
              advanceTypes.filter(
                (type) =>
                  type.repaymentMethod === "Payroll Deduction" ||
                  type.repaymentMethod === "Both",
              ).length
            }
            icon={<Settings2 size={18} />}
          />
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="border-b border-[var(--color-border)] px-5 py-4">
            <h2 className="font-semibold">Configured Advance Types</h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              These options will be available when creating an employee
              advance.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Advance Type
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Code
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Repayment
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Limit
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Installments
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Approval
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Status
                  </th>

                  <th className="w-16 px-5 py-3" />
                </tr>
              </thead>

              <tbody>
                {advanceTypes.map((type) => (
                  <tr
                    key={type.id}
                    className="border-b border-[var(--color-border)] transition-colors last:border-b-0 hover:bg-[var(--color-surface-hover)]"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium">{type.name}</div>
                      <div className="mt-1 max-w-xs truncate text-xs text-[var(--color-text-muted)]">
                        {type.description}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2 py-1 font-mono text-xs text-[var(--color-text-secondary)]">
                        {type.code}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                      {type.repaymentMethod}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {formatLimit(type.maxAmount)}
                    </td>

                    <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                      {formatInstallments(type.maxInstallments)}
                    </td>

                    <td className="px-5 py-4">
                      {type.requiresApproval ? (
                        <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-success)]">
                          <Check size={15} />
                          Required
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                          <X size={15} />
                          Not required
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge active={type.active} />
                    </td>

                    <td className="relative px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu((current) =>
                            current === type.id ? null : type.id,
                          )
                        }
                        className="rounded-lg p-2 text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                        aria-label={`Actions for ${type.name}`}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openMenu === type.id && (
                        <div className="absolute right-5 top-12 z-30 w-44 overflow-hidden rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] p-1 shadow-xl">
                          <MenuButton
                            icon={<Edit3 size={15} />}
                            label="Edit"
                            onClick={() => openEdit(type)}
                          />

                          <MenuButton
                            icon={
                              type.active ? (
                                <ToggleLeft size={15} />
                              ) : (
                                <ToggleRight size={15} />
                              )
                            }
                            label={type.active ? "Deactivate" : "Activate"}
                            onClick={() => toggleStatus(type.id)}
                          />

                          <MenuButton
                            danger
                            icon={<Trash2 size={15} />}
                            label="Delete"
                            onClick={() => deleteType(type.id)}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {advanceTypes.length === 0 && (
            <div className="px-6 py-16 text-center">
              <Settings2
                className="mx-auto text-[var(--color-text-muted)]"
                size={30}
              />

              <h3 className="mt-3 font-medium">No advance types</h3>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Add an advance type to make it available during advance
                creation.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Create / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl">
            <div className="flex items-start justify-between border-b border-[var(--color-border)] px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingType ? "Edit Advance Type" : "Add Advance Type"}
                </h2>

                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Configure how this advance type behaves in the payroll
                  system.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Advance Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. School Fees Advance"
                  required
                />

                <Input
                  label="Code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="e.g. SCHOOL_FEES"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  placeholder="Describe when this advance type should be used..."
                  className="w-full resize-none rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Repayment Method
                  </label>

                  <select
                    value={repaymentMethod}
                    onChange={(event) =>
                      setRepaymentMethod(
                        event.target.value as RepaymentMethod,
                      )
                    }
                    className="w-full rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
                  >
                    <option value="Payroll Deduction">
                      Payroll Deduction
                    </option>
                    <option value="Manual">Manual Repayment</option>
                    <option value="Both">Payroll + Manual</option>
                  </select>
                </div>

                <Input
                  label="Maximum Installments"
                  type="number"
                  min="1"
                  value={maxInstallments}
                  onChange={(event) => setMaxInstallments(event.target.value)}
                  placeholder="e.g. 3"
                />
              </div>

              <div>
                <Input
                  label="Maximum Amount (% of Basic Salary)"
                  type="number"
                  min="0"
                  max="100"
                  value={maxAmount}
                  onChange={(event) => setMaxAmount(event.target.value)}
                  placeholder="Leave empty for no percentage limit"
                />

                <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                  Example: enter 50 to limit the advance to 50% of the
                  employee's basic salary.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRequiresApproval((current) => !current)}
                className="flex w-full items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-4 py-3 text-left"
              >
                <div>
                  <div className="text-sm font-medium">Approval Required</div>
                  <div className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    Advances using this type must be approved before payment.
                  </div>
                </div>

                <div
                  className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
                    requiresApproval
                      ? "bg-[var(--color-brand)]"
                      : "bg-[var(--color-border-strong)]"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition ${
                      requiresApproval ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </button>

              <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
                <Button type="button" variant="secondary" onClick={closeForm}>
                  Cancel
                </Button>

                <Button type="submit">
                  {editingType ? "Save Changes" : "Create Advance Type"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
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
    </span>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
        danger
          ? "text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}