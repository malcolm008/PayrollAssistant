import { useMemo, useState } from "react";
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
} from "../ui/RecordModal";
import { matchesStatus, type StatusFilter } from "../../types/costCenter";
import { useGLAccounts } from "../../hooks/useGLAccounts";
import type { GLAccount } from "../../types/glAccount";

interface AccountForm {
  accountNumber: string;
  description: string;
  debit: string;
  credit: string;
  active: boolean;
}

const emptyForm: AccountForm = {
  accountNumber: "",
  description: "",
  debit: "0",
  credit: "0",
  active: true,
};

const formatAmount = (value: number) =>
  Number(value || 0).toLocaleString("en-TZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getBalance = (account: { debit: number; credit: number }) =>
  Number(account.debit || 0) - Number(account.credit || 0);

// A balance is shown as an amount with DR or CR, never as a signed number.
function Balance({ value }: { value: number }) {
  return (
    <span className="tabular-nums">
      {formatAmount(Math.abs(value))}

      {value !== 0 && (
        <span className="ml-1 text-xs text-[var(--color-text-muted)]">
          {value > 0 ? "DR" : "CR"}
        </span>
      )}
    </span>
  );
}

interface GLAccountsModalProps {
  onClose: () => void;
}

export function GLAccountsModal({ onClose }: GLAccountsModalProps) {
  const {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    toggleAccountStatus,
  } = useGLAccounts();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  // null shows the list, "new" and a record show the form.
  const [editing, setEditing] = useState<GLAccount | "new" | null>(null);
  const [form, setForm] = useState<AccountForm>(emptyForm);
  const [error, setError] = useState("");

  const editingItem = typeof editing === "object" ? editing : null;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return accounts.filter((account) => {
      const matchesSearch =
        !query ||
        account.accountNumber.toLowerCase().includes(query) ||
        account.description.toLowerCase().includes(query);

      return matchesSearch && matchesStatus(status, account.active);
    });
  }, [accounts, search, status]);

  const formBalance =
    (Number(form.debit) || 0) - (Number(form.credit) || 0);

  const openCreate = () => {
    setForm(emptyForm);
    setError("");
    setEditing("new");
  };

  const openEdit = (account: GLAccount) => {
    setForm({
      accountNumber: account.accountNumber,
      description: account.description,
      debit: String(account.debit),
      credit: String(account.credit),
      active: account.active,
    });
    setError("");
    setEditing(account);
  };

  const closeForm = () => {
    setEditing(null);
    setError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const accountNumber = form.accountNumber.trim();
    const description = form.description.trim();

    if (!accountNumber || !description) {
      setError("Enter an account number and a description.");
      return;
    }

    const duplicate = accounts.some(
      (account) =>
        account.accountNumber.toLowerCase() === accountNumber.toLowerCase() &&
        account.id !== editingItem?.id,
    );

    if (duplicate) {
      setError("A GL account with this number already exists.");
      return;
    }

    const payload = {
      accountNumber,
      description,
      debit: Number(form.debit) || 0,
      credit: Number(form.credit) || 0,
      active: form.active,
    };

    if (editingItem) {
      updateAccount(editingItem.id, payload);
    } else {
      addAccount(payload);
    }

    closeForm();
  };

  return (
    <ModalShell title="General ledger accounts" onClose={onClose}>
      {editing === null ? (
        <div>
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative sm:w-64">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by number or description"
                className="pl-9"
              />
            </div>

            <StatusTabs value={status} onChange={setStatus} />

            <div className="sm:ml-auto">
              <Button onClick={openCreate}>
                <Plus size={16} />
                New GL account
              </Button>
            </div>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-sm font-medium text-[var(--color-text)]">
                {accounts.length === 0
                  ? "No GL accounts yet"
                  : "Nothing matches that search"}
              </p>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {accounts.length === 0
                  ? "Add the first account to start posting payroll."
                  : "Try a different search or status."}
              </p>
            </div>
          ) : (
            <ul className="mt-5 divide-y divide-[var(--color-border)]">
              {filtered.map((account) => (
                <li
                  key={account.id}
                  className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
                >
                  <div className="min-w-0 flex-1 basis-56">
                    <p className="truncate text-sm">
                      <span className="font-medium tabular-nums text-[var(--color-text)]">
                        {account.accountNumber}
                      </span>

                      <span
                        className={`ml-2 ${
                          account.active
                            ? "text-[var(--color-text)]"
                            : "text-[var(--color-text-muted)]"
                        }`}
                      >
                        {account.description}
                      </span>
                    </p>

                    <p className="text-xs tabular-nums text-[var(--color-text-muted)]">
                      Debit {formatAmount(account.debit)}, credit{" "}
                      {formatAmount(account.credit)}
                    </p>
                  </div>

                  <p className="w-36 text-right text-sm text-[var(--color-text)]">
                    <Balance value={getBalance(account)} />
                  </p>

                  <ActiveT
                    active={account.active}
                    onToggle={() => toggleAccountStatus(account.id)}
                  />

                  <RowActions
                    name={account.accountNumber}
                    onEdit={() => openEdit(account)}
                    onDelete={() => deleteAccount(account.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="text-base font-semibold text-[var(--color-text)]">
            {editingItem ? "Edit GL account" : "New GL account"}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Account number" required>
              <Input
                value={form.accountNumber}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    accountNumber: event.target.value,
                  }))
                }
                placeholder="5100"
                required
              />
            </Field>

            <Field label="Description" required>
              <Input
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Basic salaries"
                required
              />
            </Field>

            <Field label="Debit">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.debit}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    debit: event.target.value,
                  }))
                }
              />
            </Field>

            <Field label="Credit">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.credit}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    credit: event.target.value,
                  }))
                }
              />
            </Field>
          </div>

          <p className="flex items-baseline justify-between gap-4 border-t border-[var(--color-border)] pt-4 text-sm">
            <span className="text-[var(--color-text-secondary)]">
              Balance (debit minus credit)
            </span>

            <span className="font-semibold text-[var(--color-text)]">
              TZS <Balance value={formBalance} />
            </span>
          </p>

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
                Inactive accounts can't be used for new transactions.
              </span>
            </span>
          </label>

          <FormError message={error} />

          <div className="flex justify-end gap-2 border-t border-[var(--color-border)] pt-5">
            <Button type="button" variant="ghost" onClick={closeForm}>
              Cancel
            </Button>

            <Button type="submit">
              {editingItem ? "Save changes" : "Create account"}
            </Button>
          </div>
        </form>
      )}
    </ModalShell>
  );
}