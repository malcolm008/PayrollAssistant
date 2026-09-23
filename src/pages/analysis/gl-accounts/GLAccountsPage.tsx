import { useMemo, useState } from "react";
import {
  Activity,
  Check,
  Edit3,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";

import { useGLAccounts } from "../../../hooks/useGLAccounts";
import type { GLAccount } from "../../../types/glAccount";

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

function formatAmount(value: number) {
  return Number(value || 0).toLocaleString("en-TZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getBalance(account: GLAccount) {
  return Number(account.debit || 0) - Number(account.credit || 0);
}

export function GLAccountsPage() {
  const {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    toggleAccountStatus,
  } = useGLAccounts();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] =
    useState<GLAccount | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<GLAccount | null>(null);

  const [form, setForm] = useState<AccountForm>(emptyForm);

  const filteredAccounts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return accounts.filter((account) => {
      const matchesSearch =
        !query ||
        account.accountNumber.toLowerCase().includes(query) ||
        account.description.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && account.active) ||
        (statusFilter === "inactive" && !account.active);

      return matchesSearch && matchesStatus;
    });
  }, [accounts, search, statusFilter]);

  const totals = useMemo(() => {
    const debit = accounts.reduce(
      (sum, account) => sum + Number(account.debit || 0),
      0
    );

    const credit = accounts.reduce(
      (sum, account) => sum + Number(account.credit || 0),
      0
    );

    return {
      debit,
      credit,
      balance: debit - credit,
    };
  }, [accounts]);

  const activeCount = accounts.filter(
    (account) => account.active
  ).length;

  function openCreateModal() {
    setEditingAccount(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function openEditModal(account: GLAccount) {
    setEditingAccount(account);

    setForm({
      accountNumber: account.accountNumber,
      description: account.description,
      debit: String(account.debit),
      credit: String(account.credit),
      active: account.active,
    });

    setIsFormOpen(true);
  }

  function closeFormModal() {
    setIsFormOpen(false);
    setEditingAccount(null);
    setForm(emptyForm);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const accountNumber = form.accountNumber.trim();
    const description = form.description.trim();

    if (!accountNumber || !description) {
      return;
    }

    const debit = Number(form.debit) || 0;
    const credit = Number(form.credit) || 0;

    const duplicate = accounts.some(
      (account) =>
        account.accountNumber.toLowerCase() ===
          accountNumber.toLowerCase() &&
        account.id !== editingAccount?.id
    );

    if (duplicate) {
      window.alert(
        "A GL account with this account number already exists."
      );
      return;
    }

    const payload = {
      accountNumber,
      description,
      debit,
      credit,
      active: form.active,
    };

    if (editingAccount) {
      updateAccount(editingAccount.id, payload);
    } else {
      addAccount(payload);
    }

    closeFormModal();
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    deleteAccount(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-full bg-[var(--color-bg)]">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <WalletCards size={14} />
              <span>Settings</span>
              <span>/</span>
              <span>Payroll</span>
              <span>/</span>
              <span className="text-[var(--color-text-secondary)]">
                GL Accounts
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)] sm:text-3xl">
              General Ledger Accounts
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-secondary)]">
              Maintain the general ledger accounts used for payroll
              accounting and nominal analysis.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 text-sm font-semibold text-black transition-colors hover:bg-[var(--color-brand-hover)]"
          >
            <Plus size={17} />
            New GL Account
          </button>
        </div>

        {/* =====================================================
            SUMMARY
        ===================================================== */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total Accounts"
            value={accounts.length.toString()}
            icon={FileText}
          />

          <SummaryCard
            label="Active Accounts"
            value={activeCount.toString()}
            icon={Check}
          />

          <SummaryCard
            label="Total Debit"
            value={`TZS ${formatAmount(totals.debit)}`}
            icon={Activity}
          />

          <SummaryCard
            label="Total Credit"
            value={`TZS ${formatAmount(totals.credit)}`}
            icon={WalletCards}
          />
        </div>

        {/* =====================================================
            TABLE CONTAINER
        ===================================================== */}
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-[var(--color-border)] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search account number or description..."
                className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] pl-9 pr-4 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
              />
            </div>

            <div className="flex items-center gap-2">
              <FilterButton
                label="All"
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
              />

              <FilterButton
                label="Active"
                active={statusFilter === "active"}
                onClick={() => setStatusFilter("active")}
              />

              <FilterButton
                label="Inactive"
                active={statusFilter === "inactive"}
                onClick={() => setStatusFilter("inactive")}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    GL Account Number
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Description
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Debit
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Credit
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Balance
                  </th>

                  <th className="px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Status
                  </th>

                  <th className="w-14 px-3 py-3" />
                </tr>
              </thead>

              <tbody>
                {filteredAccounts.map((account) => {
                  const balance = getBalance(account);

                  return (
                    <tr
                      key={account.id}
                      className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)]"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm font-medium text-[var(--color-brand)]">
                          {account.accountNumber}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-[var(--color-text)]">
                          {account.description}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="font-mono text-sm text-[var(--color-text)]">
                          {formatAmount(account.debit)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="font-mono text-sm text-[var(--color-text)]">
                          {formatAmount(account.credit)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span
                          className={`font-mono text-sm font-semibold ${
                            balance > 0
                              ? "text-[var(--color-success)]"
                              : balance < 0
                                ? "text-[var(--color-danger)]"
                                : "text-[var(--color-text-secondary)]"
                          }`}
                        >
                          {formatAmount(Math.abs(balance))}
                        </span>

                        {balance !== 0 && (
                          <span className="ml-1 text-[10px] text-[var(--color-text-muted)]">
                            {balance > 0 ? "DR" : "CR"}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            toggleAccountStatus(account.id)
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            account.active
                              ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                              : "bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              account.active
                                ? "bg-[var(--color-success)]"
                                : "bg-[var(--color-text-muted)]"
                            }`}
                          />

                          {account.active
                            ? "Active"
                            : "Inactive"}
                        </button>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            title="Edit"
                            onClick={() =>
                              openEditModal(account)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand)]"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            type="button"
                            title="Delete"
                            onClick={() =>
                              setDeleteTarget(account)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
                          >
                            <Trash2 size={15} />
                          </button>

                          <button
                            type="button"
                            title="More"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                          >
                            <MoreHorizontal size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredAccounts.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-brand-soft)]">
                  <FileText
                    size={20}
                    className="text-[var(--color-brand)]"
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[var(--color-text)]">
                  No GL accounts found
                </h3>

                <p className="mt-1 max-w-sm text-xs text-[var(--color-text-secondary)]">
                  {search
                    ? "Try changing your search criteria."
                    : "Create your first general ledger account to get started."}
                </p>

                {!search && (
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-3 py-2 text-xs font-semibold text-black hover:bg-[var(--color-brand-hover)]"
                  >
                    <Plus size={14} />
                    Create GL Account
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[var(--color-border)] px-5 py-3">
            <span className="text-[10px] text-[var(--color-text-muted)]">
              Showing {filteredAccounts.length} of{" "}
              {accounts.length} accounts
            </span>

            <span className="text-[10px] text-[var(--color-text-muted)]">
              Net Balance:{" "}
              <span className="font-semibold text-[var(--color-text-secondary)]">
                TZS {formatAmount(totals.balance)}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================
          CREATE / EDIT MODAL
      ========================================================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <div>
                <h2 className="text-base font-semibold text-[var(--color-text)]">
                  {editingAccount
                    ? "Edit GL Account"
                    : "New GL Account"}
                </h2>

                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  {editingAccount
                    ? "Update the general ledger account details."
                    : "Create a new general ledger account."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeFormModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              >
                <X size={17} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5 p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="GL Account Number"
                    required
                  >
                    <input
                      value={form.accountNumber}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          accountNumber: event.target.value,
                        }))
                      }
                      placeholder="e.g. 5100"
                      className={inputClass}
                      required
                    />
                  </FormField>

                  <FormField label="Description" required>
                    <input
                      value={form.description}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      placeholder="e.g. Basic Salaries"
                      className={inputClass}
                      required
                    />
                  </FormField>

                  <FormField label="Debit">
                    <input
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
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="Credit">
                    <input
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
                      className={inputClass}
                    />
                  </FormField>
                </div>

                {/* Balance Preview */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                        Calculated Balance
                      </p>

                      <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                        Debit − Credit
                      </p>
                    </div>

                    <p className="font-mono text-lg font-semibold text-[var(--color-brand)]">
                      TZS{" "}
                      {formatAmount(
                        (Number(form.debit) || 0) -
                          (Number(form.credit) || 0)
                      )}
                    </p>
                  </div>
                </div>

                {/* Active toggle */}
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--color-border)] p-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      Active Account
                    </p>

                    <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                      Inactive accounts won't be available for new
                      transactions.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        active: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[var(--color-brand)]"
                  />
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[var(--color-brand)] px-4 py-2.5 text-xs font-semibold text-black hover:bg-[var(--color-brand-hover)]"
                >
                  {editingAccount
                    ? "Save Changes"
                    : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          DELETE MODAL
      ========================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-danger)]/10">
              <Trash2
                size={20}
                className="text-[var(--color-danger)]"
              />
            </div>

            <h2 className="mt-4 text-base font-semibold text-[var(--color-text)]">
              Delete GL Account?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              You are about to delete{" "}
              <span className="font-semibold text-[var(--color-text)]">
                {deleteTarget.accountNumber} —{" "}
                {deleteTarget.description}
              </span>
              . This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-[var(--color-danger)] px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =============================================================
   SUPPORTING COMPONENTS
============================================================= */

const inputClass =
  "h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]";

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[var(--color-text-secondary)]">
        {label}
        {required && (
          <span className="ml-1 text-[var(--color-danger)]">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)]">
          <Icon
            size={16}
            className="text-[var(--color-brand)]"
          />
        </div>
      </div>

      <p className="mt-4 text-xl font-semibold text-[var(--color-text)]">
        {value}
      </p>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
        active
          ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
      }`}
    >
      {label}
    </button>
  );
}