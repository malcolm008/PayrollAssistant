import { useMemo, useState } from "react";
import {
    ArrowLeft,
    Building2,
    Check,
    Edit3,
    GitBranch,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBanks } from "../../../hooks/useBank";
import type { Bank } from "../../../types/bank";

interface BankFormModalProps {
    bank?: Bank | null;
    onClose: () => void;
}

function BankFormModal({
    bank,
    onClose,
}: BankFormModalProps) {
    const { createBank, updateBank } = useBanks();
    const [code, setCode] = useState(bank?.code ?? "");
    const [name, setName] = useState(bank?.name ?? "");
    const [swiftCode, setSwiftCode] = useState(bank?.swiftCode ?? "");
    const [active, setActive] = useState(bank?.active ?? true);
    const [error, setError] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!code.trim()) {
            setError("Bank code is required");
            return;
        }

        if (!name.trim) {
            setError("Bank name is requried");
            return;
        }

        if (bank) {
            updateBank(bank.id, {
                code: code.trim().toUpperCase(),
                name: name.trim(),
                swiftCode: swiftCode.trim().toUpperCase(),
                active,
            });
        } else {
            createBank({
                code: code.trim().toUpperCase(),
                name: name.trim(),
                swiftCode: swiftCode.trim().toUpperCase(),
                active,
            });
        }

        onClose();
    };

    return(
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl">
            {/* Header */}
            <div className="border-b border-[var(--color-border)] px-6 py-5">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {bank ? "Edit Bank" : "Add Bank"}
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {bank
                ? "Update the bank configuration."
                : "Add a bank that can be assigned to employees."}
            </p>
            </div>

            <form
            onSubmit={handleSubmit}
            className="space-y-5 p-6"
            >
            {error && (
                <div className="rounded-lg border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-[var(--color-danger)]">
                {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                    Bank Code
                </label>

                <input
                    value={code}
                    onChange={(event) =>
                    setCode(event.target.value)
                    }
                    placeholder="e.g. NMB"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-brand)]"
                />
                </div>

                <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                    Bank Name
                </label>

                <input
                    value={name}
                    onChange={(event) =>
                    setName(event.target.value)
                    }
                    placeholder="e.g. NMB Bank"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-brand)]"
                />
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                SWIFT / BIC Code
                </label>

                <input
                value={swiftCode}
                onChange={(event) =>
                    setSwiftCode(event.target.value)
                }
                placeholder="Enter SWIFT / BIC code"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm uppercase tracking-wide text-[var(--color-text)] outline-none transition focus:border-[var(--color-brand)]"
                />
            </div>

            {/* Active */}
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <div>
                <p className="text-sm font-medium text-[var(--color-text)]">
                    Active
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Allow this bank to be selected for employees.
                </p>
                </div>

                <button
                type="button"
                onClick={() =>
                    setActive((current) => !current)
                }
                className={`relative h-6 w-11 rounded-full transition ${
                    active
                    ? "bg-[var(--color-brand)]"
                    : "bg-[var(--color-border-strong)]"
                }`}
                >
                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    active
                        ? "left-6"
                        : "left-1"
                    }`}
                />
                </button>
            </label>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
                <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-hover)]"
                >
                Cancel
                </button>

                <button
                type="submit"
                className="rounded-xl bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[var(--color-brand-hover)]"
                >
                {bank ? "Save Changes" : "Add Bank"}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}

interface DeleteModalProps {
    bank: Bank;
    onClose: () => void;
}

function DeleteBankModal({
    bank,
    onClose,
}: DeleteModalProps) {
    const { deleteBank, branches } = useBanks();

    const bankBranches = branches.filter((branch) => branch.bankId === bank.id);

    const handleDelete = () => {
        deleteBank(bank.id);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 shadow-2xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-danger)]/10 text-[var(--color-danger)]">
            <Trash2 size={22} />
            </div>

            <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Delete Bank?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[var(--color-text)]">
                {bank.name}
            </span>
            ?
            </p>

            {bankBranches.length > 0 && (
            <div className="mt-4 rounded-xl border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 p-4">
                <p className="text-sm text-[var(--color-warning)]">
                This bank currently has{" "}
                <strong>
                    {bankBranches.length}
                </strong>{" "}
                configured branch
                {bankBranches.length === 1
                    ? ""
                    : "es"}
                . Deleting the bank will also remove
                those branches.
                </p>
            </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
            <button
                onClick={onClose}
                className="rounded-xl border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
            >
                Cancel
            </button>

            <button
                onClick={handleDelete}
                className="rounded-xl bg-[var(--color-danger)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
                Delete Bank
            </button>
            </div>
        </div>
        </div>
    );
}

export function BanksPage() {
    const navigate = useNavigate();
    const { banks, branches, toggleBank } = useBanks();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

    const [formOpen, setFormOpen] = useState(false);
    const [editingBank, setEditingBank] = useState<Bank | null>(null);
    const [deletingBank, setDeletingBank] = useState<Bank | null>(null);

    const filteredBanks = useMemo(() => {
        const query = search.trim().toUpperCase();

        return banks.filter((bank) => {
            const matchesSearch = !query || bank.code.toLowerCase().includes(query) || bank.name.toLowerCase().includes(query) || bank.swiftCode.toLowerCase().includes(query);

            const matchesStatus = status === "all" || (status === "active" && bank.active) || (status === "inactive" && !bank.active);

            return (
                matchesSearch && matchesStatus
            );
        });
    }, [banks, search, status]);

    const activeBanks = banks.filter((bank) => bank.active).length;

    const totalBranches = branches.length;
    const openCreate = () => {
        setEditingBank(null);
        setFormOpen(true);
    };

    const openEdit = (bank: Bank) => {
        setEditingBank(bank);
        setFormOpen(true);
    };

    return (
        <div className="min-h-full bg-[var(--color-bg)] p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
            <button
            onClick={() => navigate("/settings")}
            className="mb-5 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition hover:text-[var(--color-brand)]"
            >
            <ArrowLeft size={16} />
            Back to Settings
            </button>

            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
                <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                    <Building2 size={22} />
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
                    Banking
                    </p>

                    <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
                    Banks
                    </h1>
                </div>
                </div>

                <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
                Configure banks and their branches so employee
                bank details can be entered consistently throughout
                the payroll system.
                </p>
            </div>

            <button
                onClick={openCreate}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--color-brand-hover)]"
            >
                <Plus size={18} />
                Add Bank
            </button>
            </div>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-sm text-[var(--color-text-secondary)]">
                Total Banks
            </p>

            <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                {banks.length}
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Configured banking institutions
            </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-sm text-[var(--color-text-secondary)]">
                Active Banks
            </p>

            <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                {activeBanks}
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Available for employee selection
            </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-sm text-[var(--color-text-secondary)]">
                Total Branches
            </p>

            <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                {totalBranches}
            </p>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Across all configured banks
            </p>
            </div>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:flex-row">
            <div className="relative flex-1">
            <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />

            <input
                value={search}
                onChange={(event) =>
                setSearch(event.target.value)
                }
                placeholder="Search banks..."
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-3 pl-11 pr-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-brand)]"
            />
            </div>

            <select
            value={status}
            onChange={(event) =>
                setStatus(
                event.target.value as
                    | "all"
                    | "active"
                    | "inactive"
                )
            }
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
            >
            <option value="all">
                All Status
            </option>

            <option value="active">
                Active
            </option>

            <option value="inactive">
                Inactive
            </option>
            </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
                <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Code
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Bank
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    SWIFT / BIC
                    </th>

                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Branches
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Actions
                    </th>
                </tr>
                </thead>

                <tbody className="divide-y divide-[var(--color-border)]">
                {filteredBanks.map((bank) => {
                    const bankBranchCount =
                    branches.filter(
                        (branch) =>
                        branch.bankId === bank.id
                    ).length;

                    return (
                    <tr
                        key={bank.id}
                        className="transition hover:bg-[var(--color-surface-hover)]"
                    >
                        <td className="px-5 py-4">
                        <span className="rounded-lg bg-[var(--color-brand-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--color-brand)]">
                            {bank.code}
                        </span>
                        </td>

                        <td className="px-5 py-4">
                        <p className="text-sm font-medium text-[var(--color-text)]">
                            {bank.name}
                        </p>
                        </td>

                        <td className="px-5 py-4">
                        <span className="font-mono text-sm text-[var(--color-text-secondary)]">
                            {bank.swiftCode || "—"}
                        </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                            <GitBranch size={14} />
                            {bankBranchCount}
                        </span>
                        </td>

                        <td className="px-5 py-4">
                        <button
                            onClick={() =>
                            toggleBank(bank.id)
                            }
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                            bank.active
                                ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                                : "bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)]"
                            }`}
                        >
                            <Check size={13} />
                            {bank.active
                            ? "Active"
                            : "Inactive"}
                        </button>
                        </td>

                        <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                            <button
                            title="Manage Branches"
                            className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-text-secondary)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
                            >
                            <GitBranch size={16} />
                            </button>

                            <button
                            title="Edit Bank"
                            onClick={() =>
                                openEdit(bank)
                            }
                            className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-text-secondary)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
                            >
                            <Edit3 size={16} />
                            </button>

                            <button
                            title="Delete Bank"
                            onClick={() =>
                                setDeletingBank(bank)
                            }
                            className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-text-secondary)] transition hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]"
                            >
                            <Trash2 size={16} />
                            </button>

                            <button
                            title="More"
                            className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-text-muted)]"
                            >
                            <MoreHorizontal size={16} />
                            </button>
                        </div>
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
            </div>

            {filteredBanks.length === 0 && (
            <div className="px-6 py-16 text-center">
                <Building2
                size={32}
                className="mx-auto text-[var(--color-text-muted)]"
                />

                <h3 className="mt-4 text-sm font-semibold text-[var(--color-text)]">
                No banks found
                </h3>

                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Try changing your search or filters.
                </p>
            </div>
            )}
        </div>

        {/* Modals */}
        {formOpen && (
            <BankFormModal
            bank={editingBank}
            onClose={() => {
                setFormOpen(false);
                setEditingBank(null);
            }}
            />
        )}

        {deletingBank && (
            <DeleteBankModal
            bank={deletingBank}
            onClose={() =>
                setDeletingBank(null)
            }
            />
        )}
        </div>
    )
}