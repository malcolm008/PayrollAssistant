import { useMemo, useState, type ReactNode } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  ActiveT,
  Field,
  FormError,
  ModalShell,
  RowActions,
  StatusTabs,
  inputClass,
} from "../ui/RecordModal";
import { matchesStatus, type StatusFilter } from "../../types/costCenter";
import { useAccountAllocations } from "../../hooks/useAccountAllocation";
import { useCostCenters } from "../../hooks/useCostCenters";
import { useGLAccounts } from "../../hooks/useGLAccounts";
import type {
  AccountAllocation,
  AllocationType,
} from "../../types/accountAllocation";

interface AllocationForm {
  code: string;
  description: string;
  allocationType: AllocationType;
  costCenterId: string;
  debitGLAccountId: string;
  creditGLAccountId: string;
  active: boolean;
}

const emptyForm: AllocationForm = {
  code: "",
  description: "",
  allocationType: "salary",
  costCenterId: "",
  debitGLAccountId: "",
  creditGLAccountId: "",
  active: true,
};

const allocationTypeLabels: Record<AllocationType, string> = {
  salary: "Salary",
  allowance: "Allowance",
  deduction: "Deduction",
  advance: "Advance",
  loan: "Loan",
  other: "Other",
};

const typeKeys = Object.keys(allocationTypeLabels) as AllocationType[];

const smallSelectClass =
  "h-9 rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text-secondary)] outline-none transition-colors focus:border-[var(--color-brand)]";

// Active records, plus the one already chosen even if it was deactivated since,
// so editing an old allocation doesn't blank its select.
const choices = <T extends { id: string; active: boolean }>(
  list: T[],
  selectedId: string,
) => list.filter((item) => item.active || item.id === selectedId);

function Missing({ children }: { children: ReactNode }) {
  return <span className="text-[var(--color-danger)]">{children}</span>;
}

interface AccountAllocationModalProps {
  onClose: () => void;
}

export function AccountAllocationModal({
  onClose,
}: AccountAllocationModalProps) {
  const {
    allocations,
    addAllocation,
    updateAllocation,
    deleteAllocation,
    toggleAllocationStatus,
  } = useAccountAllocations();

  const { costCenters } = useCostCenters();
  const { accounts } = useGLAccounts();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | AllocationType>("all");

  // null shows the list, "new" and a record show the form.
  const [editing, setEditing] = useState<AccountAllocation | "new" | null>(
    null,
  );
  const [form, setForm] = useState<AllocationForm>(emptyForm);
  const [error, setError] = useState("");

  const editingItem = typeof editing === "object" ? editing : null;

  const getCostCenter = (id: string) =>
    costCenters.find((item) => item.id === id);

  const getAccount = (id: string) => accounts.find((item) => item.id === id);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allocations.filter((allocation) => {
      const costCenter = costCenters.find(
        (item) => item.id === allocation.costCenterId,
      );
      const debit = accounts.find(
        (item) => item.id === allocation.debitGLAccountId,
      );
      const credit = accounts.find(
        (item) => item.id === allocation.creditGLAccountId,
      );

      const searchable = [
        allocation.code,
        allocation.description,
        allocationTypeLabels[allocation.allocationType],
        costCenter?.code ?? "",
        costCenter?.name ?? "",
        debit?.accountNumber ?? "",
        debit?.description ?? "",
        credit?.accountNumber ?? "",
        credit?.description ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!query || searchable.includes(query)) &&
        matchesStatus(status, allocation.active) &&
        (typeFilter === "all" || allocation.allocationType === typeFilter)
      );
    });
  }, [allocations, costCenters, accounts, search, status, typeFilter]);

  const activeCostCenters = costCenters.filter((item) => item.active);
  const activeAccounts = accounts.filter((item) => item.active);

  const openCreate = () => {
    setForm({
      ...emptyForm,
      costCenterId: activeCostCenters[0]?.id ?? "",
      debitGLAccountId: activeAccounts[0]?.id ?? "",
      creditGLAccountId: activeAccounts[1]?.id ?? "",
    });
    setError("");
    setEditing("new");
  };

  const openEdit = (allocation: AccountAllocation) => {
    setForm({
      code: allocation.code,
      description: allocation.description,
      allocationType: allocation.allocationType,
      costCenterId: allocation.costCenterId,
      debitGLAccountId: allocation.debitGLAccountId,
      creditGLAccountId: allocation.creditGLAccountId,
      active: allocation.active,
    });
    setError("");
    setEditing(allocation);
  };

  const closeForm = () => {
    setEditing(null);
    setError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = form.code.trim();
    const description = form.description.trim();

    if (
      !code ||
      !description ||
      !form.costCenterId ||
      !form.debitGLAccountId ||
      !form.creditGLAccountId
    ) {
      setError(
        "Fill in the code, description, cost center and both GL accounts.",
      );
      return;
    }

    if (form.debitGLAccountId === form.creditGLAccountId) {
      setError("The debit and credit GL accounts must be different.");
      return;
    }

    const duplicate = allocations.some(
      (allocation) =>
        allocation.code.toLowerCase() === code.toLowerCase() &&
        allocation.id !== editingItem?.id,
    );

    if (duplicate) {
      setError("An allocation with this code already exists.");
      return;
    }

    const payload = {
      code,
      description,
      allocationType: form.allocationType,
      costCenterId: form.costCenterId,
      debitGLAccountId: form.debitGLAccountId,
      creditGLAccountId: form.creditGLAccountId,
      active: form.active,
    };

    if (editingItem) {
      updateAllocation(editingItem.id, payload);
    } else {
      addAllocation(payload);
    }

    closeForm();
  };

  return (
    <ModalShell
      title="Account allocation"
      onClose={onClose}
      maxWidth="max-w-4xl"
    >
      {editing === null ? (
        <div>
          {/* Toolbar */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative lg:w-64">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search allocations"
                className="pl-9"
              />
            </div>

            <StatusTabs value={status} onChange={setStatus} />

            <select
              aria-label="Allocation type"
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value as "all" | AllocationType)
              }
              className={smallSelectClass}
            >
              <option value="all">All types</option>

              {typeKeys.map((type) => (
                <option key={type} value={type}>
                  {allocationTypeLabels[type]}
                </option>
              ))}
            </select>

            <div className="lg:ml-auto">
              <Button onClick={openCreate}>
                <Plus size={16} />
                New allocation
              </Button>
            </div>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-sm font-medium text-[var(--color-text)]">
                {allocations.length === 0
                  ? "No allocations yet"
                  : "Nothing matches those filters"}
              </p>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {allocations.length === 0
                  ? "An allocation sends a payroll item to a cost center, with a debit and a credit GL account."
                  : "Try a different search, status or type."}
              </p>
            </div>
          ) : (
            <ul className="mt-5 divide-y divide-[var(--color-border)]">
              {filtered.map((allocation) => {
                const costCenter = getCostCenter(allocation.costCenterId);
                const debit = getAccount(allocation.debitGLAccountId);
                const credit = getAccount(allocation.creditGLAccountId);

                return (
                  <li
                    key={allocation.id}
                    className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
                  >
                    <div className="min-w-0 flex-1 basis-72">
                      <p className="truncate text-sm">
                        <span
                          className={`font-medium ${
                            allocation.active
                              ? "text-[var(--color-text)]"
                              : "text-[var(--color-text-muted)]"
                          }`}
                        >
                          {allocation.code}
                        </span>

                        <span className="ml-2 text-xs text-[var(--color-text-secondary)]">
                          {allocationTypeLabels[allocation.allocationType]}
                        </span>
                      </p>

                      <p className="truncate text-xs text-[var(--color-text-secondary)]">
                        {allocation.description}
                      </p>

                      <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                        Cost center:{" "}
                        {costCenter ? (
                          `${costCenter.code} ${costCenter.name}`
                        ) : (
                          <Missing>missing</Missing>
                        )}
                      </p>

                      <p className="text-xs text-[var(--color-text-muted)]">
                        Debit{" "}
                        {debit ? (
                          `${debit.accountNumber} ${debit.description}`
                        ) : (
                          <Missing>missing</Missing>
                        )}
                        , credit{" "}
                        {credit ? (
                          `${credit.accountNumber} ${credit.description}`
                        ) : (
                          <Missing>missing</Missing>
                        )}
                      </p>
                    </div>

                    <ActiveT
                      active={allocation.active}
                      onToggle={() => toggleAllocationStatus(allocation.id)}
                    />

                    <RowActions
                      name={allocation.code}
                      onEdit={() => openEdit(allocation)}
                      onDelete={() => deleteAllocation(allocation.id)}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h3 className="text-base font-semibold text-[var(--color-text)]">
              {editingItem ? "Edit allocation" : "New allocation"}
            </h3>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Choose where this payroll item is charged and which GL accounts
              it posts to.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Code" required>
              <Input
                value={form.code}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    code: event.target.value,
                  }))
                }
                placeholder="SAL-001"
                required
              />
            </Field>

            <Field label="Type" required>
              <select
                value={form.allocationType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    allocationType: event.target.value as AllocationType,
                  }))
                }
                className={inputClass}
              >
                {typeKeys.map((type) => (
                  <option key={type} value={type}>
                    {allocationTypeLabels[type]}
                  </option>
                ))}
              </select>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Description" required>
                <Input
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Basic salary allocation"
                  required
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field
                label="Cost center"
                required
                hint={
                  activeCostCenters.length === 0
                    ? "There are no active cost centers. Create one first."
                    : undefined
                }
              >
                <select
                  value={form.costCenterId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      costCenterId: event.target.value,
                    }))
                  }
                  className={inputClass}
                  required
                >
                  <option value="">Select a cost center</option>

                  {choices(costCenters, form.costCenterId).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code} {item.name}
                      {item.active ? "" : " (inactive)"}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Debit GL account" required hint="Expense or asset side">
              <select
                value={form.debitGLAccountId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    debitGLAccountId: event.target.value,
                  }))
                }
                className={inputClass}
                required
              >
                <option value="">Select an account</option>

                {choices(accounts, form.debitGLAccountId).map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} {account.description}
                    {account.active ? "" : " (inactive)"}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Credit GL account"
              required
              hint="Liability or income side"
            >
              <select
                value={form.creditGLAccountId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    creditGLAccountId: event.target.value,
                  }))
                }
                className={inputClass}
                required
              >
                <option value="">Select an account</option>

                {choices(accounts, form.creditGLAccountId).map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} {account.description}
                    {account.active ? "" : " (inactive)"}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {activeAccounts.length === 0 && (
            <p className="text-xs text-[var(--color-danger)]">
              There are no active GL accounts. Create accounts first.
            </p>
          )}

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  active: event.target.checked,
                }))
              }
              className="mt-0.5 h-4 w-4 accent-[var(--color-brand)]"
            />

            <span>
              <span className="block text-sm font-medium text-[var(--color-text)]">
                Active
              </span>

              <span className="block text-xs text-[var(--color-text-muted)]">
                Only active allocations are used when payroll is processed.
              </span>
            </span>
          </label>

          <FormError message={error} />

          <div className="flex justify-end gap-2 border-t border-[var(--color-border)] pt-5">
            <Button type="button" variant="ghost" onClick={closeForm}>
              Cancel
            </Button>

            <Button type="submit">
              {editingItem ? "Save changes" : "Create allocation"}
            </Button>
          </div>
        </form>
      )}
    </ModalShell>
  );
}