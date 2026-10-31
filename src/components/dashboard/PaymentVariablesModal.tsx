import { useMemo, useState } from "react";
import {
    X,
    Plus,
    Search,
    Pencil,
    Trash2,
    Wallet,
    ArrowUpDown,
} from "lucide-react";

import { usePaymentVaribles } from "../../hooks/usePaymentVariables";

import type { PaymentVariable, PaymentCategory } from "../../types/paymentVariables";

interface PaymentVariablesModalProps {
    onClose: () => void;
}

const emptyForm = {
    name: "",
    category: "Permanent" as PaymentCategory,
};

export function PaymentVariablesModal({
    onClose,
}: PaymentVariablesModalProps) {
    const {
        paymentVariables,
        addPaymentVariable,
        updatePaymentVariable,
        deletePaymentVariable,
    } = usePaymentVaribles();

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingVariable, setEditingVariable] = useState<PaymentVariable | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<PaymentVariable | null>(null);

    const filteredVariables = useMemo(() => {
        return paymentVariables.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }, [paymentVariables, search]);

    const openCreateForm = () => {
        setEditingVariable(null);
        setForm(emptyForm);
        setError("");
        setShowForm(true);
    };

    const openEditForm = (item: PaymentVariable) => {
        setEditingVariable(item);
        setForm({
            name: item.name,
            category: item.category,
        });
        setError("");
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingVariable(null);
        setForm(emptyForm);
        setError("");
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        try {
            if (editingVariable) {
                updatePaymentVariable(editingVariable.id, form)
            } else {
                addPaymentVariable(form);
            }

            closeForm();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;

        deletePaymentVariable(deleteTarget.id);
        setDeleteTarget(null);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                    <Wallet size={20} />
                    </div>

                    <div>
                    <h2 className="text-base font-semibold text-[var(--color-text)]">
                        Payment Variables
                    </h2>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                >
                    <X size={19} />
                </button>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-5 overflow-y-auto p-6">

                {/* Summary */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
                    <p className="text-xs text-[var(--color-text-muted)]">
                        Permanent Payments
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                        {paymentVariables.filter(
                        (item) => item.category === "Permanent"
                        ).length}
                    </p>
                    </div>

                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
                    <p className="text-xs text-[var(--color-text-muted)]">
                        Temporary Payments
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                        {paymentVariables.filter(
                        (item) => item.category === "Temporary"
                        ).length}
                    </p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                    />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search variables..."
                        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] py-2.5 pl-9 pr-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
                    />
                    </div>

                    <button
                    type="button"
                    onClick={openCreateForm}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
                    >
                    <Plus size={16} />
                    Add Variable
                    </button>
                </div>

                {/* Add / Edit Form */}
                {showForm && (
                    <form
                    onSubmit={handleSubmit}
                    className="space-y-4 rounded-xl border border-[var(--color-brand)]/30 bg-[var(--color-surface-raised)] p-4"
                    >
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[var(--color-text)]">
                        {editingVariable
                            ? "Update Payment Variable"
                            : "New Payment Variable"}
                        </h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                        <label className="mb-2 block text-xs font-medium text-[var(--color-text-secondary)]">
                            Payment Variable Name
                        </label>

                        <input
                            autoFocus
                            required
                            value={form.name}
                            onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                name: event.target.value,
                            }))
                            }
                            placeholder="e.g. House Allowance"
                            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
                        />
                        </div>

                        <div>
                        <label className="mb-2 block text-xs font-medium text-[var(--color-text-secondary)]">
                            Payment Category
                        </label>

                        <select
                            value={form.category}
                            onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                category: event.target.value as PaymentCategory,
                            }))
                            }
                            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
                        >
                            <option value="Permanent">Permanent</option>
                            <option value="Temporary">Temporary</option>
                        </select>
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs text-[var(--color-danger)]">
                        {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                        type="button"
                        onClick={closeForm}
                        className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
                        >
                        Cancel
                        </button>

                        <button
                        type="submit"
                        className="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-black hover:opacity-90"
                        >
                        {editingVariable ? "Save Changes" : "Create Variable"}
                        </button>
                    </div>
                    </form>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
                    <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--color-surface-raised)]">
                        <tr className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                            <th className="px-4 py-3 font-semibold">No.</th>
                            <th className="px-4 py-3 font-semibold">Payment Variable</th>
                            <th className="px-4 py-3 font-semibold">Category</th>
                            <th className="px-4 py-3 text-right font-semibold">
                            Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-[var(--color-border)]">
                        {filteredVariables.map((item) => (
                            <tr
                            key={item.id}
                            className="transition hover:bg-[var(--color-surface-hover)]"
                            >
                            <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">
                                {item.index}
                            </td>

                            <td className="px-4 py-3 text-sm font-medium text-[var(--color-text)]">
                                {item.name}
                            </td>

                            <td className="px-4 py-3">
                                <span
                                className={`rounded-md px-2.5 py-1 text-[10px] font-semibold ${
                                    item.category === "Permanent"
                                    ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
                                    : "bg-blue-500/10 text-blue-400"
                                }`}
                                >
                                {item.category}
                                </span>
                            </td>

                            <td className="px-4 py-3">
                                <div className="flex justify-end gap-1">
                                <button
                                    type="button"
                                    onClick={() => openEditForm(item)}
                                    title="Edit variable"
                                    className="rounded-md p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-brand)]"
                                >
                                    <Pencil size={15} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setDeleteTarget(item)}
                                    title="Delete variable"
                                    className="rounded-md p-2 text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-400"
                                >
                                    <Trash2 size={15} />
                                </button>
                                </div>
                            </td>
                            </tr>
                        ))}

                        {filteredVariables.length === 0 && (
                            <tr>
                            <td
                                colSpan={4}
                                className="px-4 py-12 text-center"
                            >
                                <ArrowUpDown
                                size={22}
                                className="mx-auto mb-2 text-[var(--color-text-muted)]"
                                />
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                No payment variables found.
                                </p>
                                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                                Add a variable to get started.
                                </p>
                            </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                </div>

                <p className="text-[11px] text-[var(--color-text-muted)]">
                    {paymentVariables.length} payment variable(s) configured.
                </p>
                </div>

                {/* Delete Confirmation */}
                {deleteTarget && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-sm rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-5 shadow-2xl">
                    <h3 className="text-sm font-semibold text-[var(--color-text)]">
                        Delete Payment Variable?
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-[var(--color-text)]">
                        {deleteTarget.name}
                        </span>
                        ?
                    </p>

                    <div className="mt-5 flex justify-end gap-2">
                        <button
                        type="button"
                        onClick={() => setDeleteTarget(null)}
                        className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-xs text-[var(--color-text-secondary)]"
                        >
                        Cancel
                        </button>

                        <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600"
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}