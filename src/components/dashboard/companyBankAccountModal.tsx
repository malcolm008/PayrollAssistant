import { useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Field, FormError, ModalShell, RowActions, inputClass } from "../ui/RecordModal";

import { useCompanyBankAccounts, type CompanyBankAccount, type CompanyBankAccountInput } from "../../hooks/useCompanyBankAccount";

const CURRENCIES = ["TZS", "USD", "EUR", "GBP", "KES"];

const emptyForm: CompanyBankAccountInput = {
    accountNumber: "",
    bankName: "",
    branch: "",
    address: "",
    accountName: "",
    currency: "TZS",
}

interface CompanyBankAccountsModalProps {
    onClose: () => void;
}

export function CompanyBankAccountsModal({
    onClose,
}: CompanyBankAccountsModalProps) {
    const { accounts, addAccount, updateAccount, deleteAccount } = useCompanyBankAccounts();

    const [ search, setSearch ] = useState("");

    const [editing, setEditing] = useState<CompanyBankAccount | "new" | null>(null);

    const [ form , setForm ] = useState<CompanyBankAccountInput>(emptyForm);
    const [error, setError] = useState("");

    const editingItem = typeof editing === "object" ? editing : null;

    const query = search.trim().toLowerCase();

    const filtered = accounts.filter((account) => !query || [
        account.bankName,
        account.branch, 
        account.accountName,
        account.accountNumber,
        account.address,
    ].join(" ").toLowerCase().includes(query));

    const byCurrency = Object.entries(accounts.reduce<Record<string, number>>((counts, account) => {
        counts[account.currency] = (counts[account.currency] ?? 0) + 1;
        return counts;
    }, {})).map(([currency, count]) => `${count} in ${currency}`).join(", ");

    const update = (field: keyof CompanyBankAccountInput, value: string) => setForm((current) => ({ ...current, [field]: value }));

    const closeForm = () => {
        setEditing(null);
        setForm(emptyForm);
        setError("");
    };

    const openCreate = () => {
        setForm(emptyForm);
        setError("");
        setEditing("new");
    }

    const openEdit = (account: CompanyBankAccount) => {
        setForm({
            accountNumber: account.accountNumber,
            bankName: account.bankName,
            branch: account.branch,
            address: account.address,
            accountName: account.accountName,
            currency: account.currency,
        });
        setError("");
        setEditing(account);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        try {
            if (editingItem) {
                updateAccount(editingItem.id, form);
            } else {
                addAccount(form);
            }

            closeForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        }
    };

    return (
        <ModalShell title="Company bank accounts" onClose={onClose}>
        {editing === null ? (
            <div>
            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />

                <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by bank, account name or number"
                    className="pl-9"
                />
                </div>

                <Button onClick={openCreate}>
                <Plus size={16} />
                Add account
                </Button>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="py-14 text-center">
                <p className="text-sm font-medium text-[var(--color-text)]">
                    {accounts.length === 0
                    ? "No bank accounts yet"
                    : "Nothing matches that search"}
                </p>

                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {accounts.length === 0
                    ? "Add the account payroll is paid from."
                    : "Try a different search."}
                </p>
                </div>
            ) : (
                <ul className="mt-5 divide-y divide-[var(--color-border)]">
                {filtered.map((account) => (
                    <li
                    key={account.id}
                    className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
                    >
                    <div className="min-w-0 flex-1 basis-64">
                        <p className="truncate text-sm">
                        <span className="font-medium text-[var(--color-text)]">
                            {account.bankName}
                        </span>

                        <span className="ml-2 text-xs tabular-nums text-[var(--color-secondary)]">
                            {account.currency}
                        </span>
                        </p>

                        <p className="truncate text-xs tabular-nums text-[var(--color-text-secondary)]">
                        {account.accountName}, {account.accountNumber}
                        </p>

                        {(account.branch || account.address) && (
                        <p className="truncate text-xs text-[var(--color-text-muted)]">
                            {[account.branch, account.address]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        )}
                    </div>

                    <RowActions
                        name={account.accountNumber}
                        onEdit={() => openEdit(account)}
                        onDelete={() => deleteAccount(account.id)}
                    />
                    </li>
                ))}
                </ul>
            )}

            {accounts.length > 0 && (
                <p className="mt-5 text-xs text-[var(--color-text-muted)]">
                {filtered.length} of {accounts.length} shown. {byCurrency}.
                </p>
            )}
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-base font-semibold text-[var(--color-text)]">
                {editingItem ? "Edit bank account" : "New bank account"}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Bank name" required>
                <Input
                    autoFocus
                    required
                    value={form.bankName}
                    onChange={(event) => update("bankName", event.target.value)}
                />
                </Field>

                <Field label="Branch">
                <Input
                    value={form.branch}
                    onChange={(event) => update("branch", event.target.value)}
                />
                </Field>

                <Field label="Account name" required>
                <Input
                    required
                    value={form.accountName}
                    onChange={(event) => update("accountName", event.target.value)}
                />
                </Field>

                <Field label="Account number" required>
                <Input
                    required
                    value={form.accountNumber}
                    onChange={(event) =>
                    update("accountNumber", event.target.value)
                    }
                />
                </Field>

                <Field label="Currency">
                <select
                    value={form.currency}
                    onChange={(event) => update("currency", event.target.value)}
                    className={inputClass}
                >
                    {CURRENCIES.map((code) => (
                    <option key={code} value={code}>
                        {code}
                    </option>
                    ))}
                </select>
                </Field>
            </div>

            <Field label="Bank address">
                <textarea
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
                rows={2}
                className={`${inputClass} h-auto resize-none py-2.5`}
                />
            </Field>

            <FormError message={error} />

            <div className="flex justify-end gap-2 border-t border-[var(--color-border)] pt-5">
                <Button type="button" variant="ghost" onClick={closeForm}>
                Cancel
                </Button>

                <Button type="submit">
                {editingItem ? "Save changes" : "Add account"}
                </Button>
            </div>
            </form>
        )}
        </ModalShell>
    );
}