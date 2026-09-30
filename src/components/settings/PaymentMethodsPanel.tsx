import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  CreditCard,
  Edit3,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";
import { usePaymentMethods } from "../../hooks/usePaymentMethod";
import type { PaymentMethodType, PaymentMethod } from "../../types/paymentMethod";

const PAYMENT_METHOD_TYPES: {
  value: PaymentMethodType;
  label: string;
}[] = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank Transfer" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
];

const TYPE_LABELS: Record<PaymentMethodType, string> = {
  cash: "Cash",
  bank: "Bank Transfer",
  mobile_money: "Mobile Money",
  cheque: "Cheque",
  other: "Other",
};

interface FormState {
  code: string;
  name: string;
  type: PaymentMethodType;
  description: string;
  active: boolean;
}

const EMPTY_FORM: FormState = {
  code: "",
  name: "",
  type: "bank",
  description: "",
  active: true,
};

function getTypeIcon(type: PaymentMethodType) {
  switch (type) {
    case "cash":
      return <WalletCards className="h-4 w-4" />;
    case "bank":
      return <CreditCard className="h-4 w-4" />;
    case "mobile_money":
      return <WalletCards className="h-4 w-4" />;
    case "cheque":
      return <CreditCard className="h-4 w-4" />;
    default:
      return <CreditCard className="h-4 w-4" />;
  }
}

function getTypeBadge(type: PaymentMethodType) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
      {getTypeIcon(type)}
      {TYPE_LABELS[type]}
    </span>
  );
}

function Modal({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl">
        <div className="flex items-start justify-between border-b border-[var(--color-border)] px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text)]">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default function PaymentMethodsPanel() {
  const {
    paymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    togglePaymentMethod,
  } = usePaymentMethods();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<PaymentMethodType | "all">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null,
  );

  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState("");

  const filteredMethods = useMemo(() => {
    const query = search.trim().toLowerCase();

    return paymentMethods.filter((method) => {
      const matchesSearch =
        !query ||
        method.code.toLowerCase().includes(query) ||
        method.name.toLowerCase().includes(query) ||
        method.description?.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "all" || method.type === typeFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && method.active) ||
        (statusFilter === "inactive" && !method.active);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [paymentMethods, search, typeFilter, statusFilter]);

  const activeCount = paymentMethods.filter((method) => method.active).length;
  const inactiveCount = paymentMethods.length - activeCount;

  const openAddForm = () => {
    setEditingMethod(null);
    setForm(EMPTY_FORM);
    setError("");
    setOpenMenu(null);
    setShowForm(true);
  };

  const openEditForm = (method: PaymentMethod) => {
    setEditingMethod(method);
    setForm({
      code: method.code,
      name: method.name,
      type: method.type,
      description: method.description ?? "",
      active: method.active,
    });
    setError("");
    setOpenMenu(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMethod(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = form.code.trim().toUpperCase();
    const name = form.name.trim();
    const description = form.description.trim();

    if (!code) {
      setError("Payment method code is required.");
      return;
    }

    if (!name) {
      setError("Payment method name is required.");
      return;
    }

    const duplicateCode = paymentMethods.some(
      (method) =>
        method.code.toLowerCase() === code.toLowerCase() &&
        method.id !== editingMethod?.id,
    );

    if (duplicateCode) {
      setError("A payment method with this code already exists.");
      return;
    }

    if (editingMethod) {
      updatePaymentMethod(editingMethod.id, {
        code,
        name,
        type: form.type,
        description,
        active: form.active,
      });
    } else {
      addPaymentMethod({
        code,
        name,
        type: form.type,
        description,
        active: form.active,
      });
    }

    closeForm();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    deletePaymentMethod(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <CreditCard className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[var(--color-text)]">
                Payment Method Types
              </h2>

              <p className="text-sm text-[var(--color-text-secondary)]">
                Configure the payment methods available throughout payroll.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[var(--color-brand-hover)]"
        >
          <Plus className="h-4 w-4" />
          Add Payment Method
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Total Methods
          </p>

          <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
            {paymentMethods.length}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Active
          </p>

          <p className="mt-2 text-2xl font-semibold text-[var(--color-success)]">
            {activeCount}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Inactive
          </p>

          <p className="mt-2 text-2xl font-semibold text-[var(--color-text-secondary)]">
            {inactiveCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          {/* Search */}
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search payment methods..."
              className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] pl-9 pr-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
            />
          </div>

          {/* Type filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(
                  event.target.value as PaymentMethodType | "all",
                )
              }
              className="h-10 min-w-44 appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 pr-9 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
            >
              <option value="all">All Types</option>

              {PAYMENT_METHOD_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as "all" | "active" | "inactive",
                )
              }
              className="h-10 min-w-36 appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 pr-9 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Code
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Payment Method
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Type
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Description
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Status
                </th>

                <th className="w-16 px-5 py-3" />
              </tr>
            </thead>

            <tbody>
              {filteredMethods.map((method) => (
                <tr
                  key={method.id}
                  className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)]"
                >
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm font-medium text-[var(--color-brand)]">
                      {method.code}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {method.name}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {getTypeBadge(method.type)}
                  </td>

                  <td className="max-w-xs px-5 py-4">
                    <span className="block truncate text-sm text-[var(--color-text-secondary)]">
                      {method.description || "—"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => togglePaymentMethod(method.id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                        method.active
                          ? "border-[color-mix(in_srgb,var(--color-success)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-success)_10%,transparent)] text-[var(--color-success)]"
                          : "border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text-muted)]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          method.active
                            ? "bg-[var(--color-success)]"
                            : "bg-[var(--color-text-muted)]"
                        }`}
                      />

                      {method.active ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="relative px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenu(
                          openMenu === method.id ? null : method.id,
                        )
                      }
                      className="rounded-lg p-2 text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {openMenu === method.id && (
                      <div className="absolute right-5 top-12 z-20 w-40 overflow-hidden rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] shadow-xl">
                        <button
                          type="button"
                          onClick={() => openEditForm(method)}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            togglePaymentMethod(method.id);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                        >
                          <Check className="h-4 w-4" />
                          {method.active ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTarget(method);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-[var(--color-danger)] transition hover:bg-[var(--color-surface-hover)]"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredMethods.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <CreditCard className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[var(--color-text)]">
              No payment methods found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-[var(--color-text-secondary)]">
              {search || typeFilter !== "all" || statusFilter !== "all"
                ? "Try changing your search or filters."
                : "Add your first payment method to begin configuring payroll payments."}
            </p>

            {!search &&
              typeFilter === "all" &&
              statusFilter === "all" && (
                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-strong)] px-3 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
                >
                  <Plus className="h-4 w-4" />
                  Add Payment Method
                </button>
              )}
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {showForm && (
        <Modal
          title={editingMethod ? "Edit Payment Method" : "Add Payment Method"}
          description={
            editingMethod
              ? "Update the payment method."
              : "Create a payment method."
          }
          onClose={closeForm}
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 p-6">
              {error && (
                <div className="rounded-lg border border-[color-mix(in_srgb,var(--color-danger)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)] px-3 py-2.5 text-sm text-[var(--color-danger)]">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Code */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
                    Code
                  </label>

                  <input
                    type="text"
                    value={form.code}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        code: event.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="e.g. BANK"
                    maxLength={20}
                    className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm font-mono text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
                    Name
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. Bank Transfer"
                    className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
                  />
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
                  Payment Type
                </label>

                <div className="relative">
                  <select
                    value={form.type}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        type: event.target.value as PaymentMethodType,
                      }))
                    }
                    className="h-10 w-full appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 pr-9 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
                  >
                    {PAYMENT_METHOD_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
                  Description
                  <span className="ml-1 font-normal text-[var(--color-text-muted)]">
                    (optional)
                  </span>
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Briefly describe how this payment method is used..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
                />
              </div>

              {/* Active */}
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    Active
                  </p>

                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    Allow this payment method to be selected in payroll
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

            <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[var(--color-brand-hover)]"
              >
                {editingMethod ? "Save Changes" : "Add Payment Method"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <Modal
          title="Delete Payment Method"
          description="This action cannot be undone."
          onClose={() => setDeleteTarget(null)}
        >
          <div className="p-6">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
              <p className="text-sm text-[var(--color-text-secondary)]">
                You are about to delete:
              </p>

              <div className="mt-2 flex items-center gap-3">
                <span className="rounded-md bg-[var(--color-brand-soft)] px-2 py-1 font-mono text-xs font-semibold text-[var(--color-brand)]">
                  {deleteTarget.code}
                </span>

                <span className="text-sm font-medium text-[var(--color-text)]">
                  {deleteTarget.name}
                </span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-danger)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}