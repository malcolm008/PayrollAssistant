import { useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Field, FormError, ModalShell, RowActions, inputClass} from "../ui/RecordModal";

import { usePayrollVariableSets, type PayrollVariable, type VariableKind } from "../../hooks/usePayrollVariableSets";
import type { PaymentCategory } from "../../types/paymentVariables";

const TABS: {
    kind: VariableKind;
    label: string;
    singular: string;
    example: string;
}[] = [
    { 
        kind: "deduction",
        label: "Deductions",
        singular: "deduction",
        example: "Loan repayment",
    },
    { kind: "bill", label: "Bills", singular: "bill", example: "Water bill" },
    {
        kind: "advance",
        label: "Advances",
        singular: "advance",
        example: "Travel advance",
    },
];

const CATEGORY_COLOR: Record<PaymentCategory, string> = {
    Permanent: "var(---color-brand)",
    Temporary: "var(--color-secondary)",
};

const emptyForm = {
    name: "",
    category: "Permanent" as PaymentCategory,
};

interface DeductionsBillsAdvancesModalProps {
    onClose: () => void;
    initialKind?: VariableKind;
}

export function DeductionsBillsAdvancesModal({
    onClose,
    initialKind = "deduction",
}: DeductionsBillsAdvancesModalProps) {
    const { variablesOf, addVariable, updateVariable, deleteVariable } = usePayrollVariableSets();
    const [kind, setKind] = useState<VariableKind>(initialKind);
    const [search, setSearch] = useState("");

    const [editing, setEditing] = useState<PayrollVariable | "new" | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState("");

    const tab = TABS.find((item) => item.kind === kind) ?? TABS[0];
    const editingItem = typeof editing === "object" ? editing : null;

    const all = variablesOf(kind);
    const query = search.trim().toLowerCase();
    const filtered = all.filter((item) => item.name.toLowerCase().includes(query));

    const permanent = all.filter((item) => item.category === "Permanent").length;
    const temporary = all.length - permanent;

    const closeForm = () => {
        setEditing(null);
        setForm(emptyForm);
        setError("");
    };

    const changeTab = (next: VariableKind) => {
        setKind(next);
        setSearch("");
        closeForm();
    };

    const openCreate = () => {
        setForm(emptyForm);
        setError("");
        setEditing("new");
    };

    const openEdit = (item: PayrollVariable) => {
        setForm({ name: item.name, category: item.category });
        setError("");
        setEditing(item);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        try {
            if (editingItem) {
                updateVariable(editingItem.id, form);
            } else {
                addVariable(kind, form);
            }

            closeForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        }
    };

    return (
        <ModalShell
        title="Deductions, bills and advances"
        onClose={onClose}
        maxWidth="max-w-2xl"
        >
        {/* Which list */}
        <div
            role="tablist"
            className="-mt-2 mb-6 flex gap-6 border-b border-[var(--color-border)]"
        >
            {TABS.map((item) => {
            const isActive = item.kind === kind;

            return (
                <button
                key={item.kind}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => changeTab(item.kind)}
                className={`-mb-px border-b-2 pb-3 text-sm transition-colors ${
                    isActive
                    ? "border-[var(--color-brand)] font-medium text-[var(--color-text)]"
                    : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                }`}
                >
                {item.label}

                <span className="ml-1.5 text-xs font-normal tabular-nums text-[var(--color-text-muted)]">
                    {variablesOf(item.kind).length}
                </span>
                </button>
            );
            })}
        </div>

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
                    placeholder={`Search ${tab.label.toLowerCase()}`}
                    className="pl-9"
                />
                </div>

                <Button onClick={openCreate}>
                <Plus size={16} />
                Add {tab.singular}
                </Button>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="py-14 text-center">
                <p className="text-sm font-medium text-[var(--color-text)]">
                    {all.length === 0
                    ? `No ${tab.label.toLowerCase()} defined yet`
                    : "Nothing matches that search"}
                </p>

                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {all.length === 0
                    ? `Add the first one, for example "${tab.example}".`
                    : "Try a different search."}
                </p>
                </div>
            ) : (
                <ul className="mt-5 divide-y divide-[var(--color-border)]">
                {filtered.map((item) => (
                    <li
                    key={item.id}
                    className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
                    >
                    <span className="w-6 text-xs tabular-nums text-[var(--color-text-muted)]">
                        {item.index}
                    </span>

                    <span className="min-w-0 flex-1 basis-48 truncate text-sm font-medium text-[var(--color-text)]">
                        {item.name}
                    </span>

                    <span
                        className="text-xs"
                        style={{ color: CATEGORY_COLOR[item.category] }}
                    >
                        {item.category}
                    </span>

                    <RowActions
                        name={item.name}
                        onEdit={() => openEdit(item)}
                        onDelete={() => deleteVariable(item.id)}
                    />
                    </li>
                ))}
                </ul>
            )}

            {all.length > 0 && (
                <p className="mt-5 text-xs text-[var(--color-text-muted)]">
                {filtered.length} of {all.length} shown. {permanent} permanent,{" "}
                {temporary} temporary.
                </p>
            )}
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-base font-semibold text-[var(--color-text)]">
                {editingItem ? `Edit ${tab.singular}` : `New ${tab.singular}`}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" required>
                <Input
                    autoFocus
                    required
                    value={form.name}
                    onChange={(event) =>
                    setForm((current) => ({
                        ...current,
                        name: event.target.value,
                    }))
                    }
                    placeholder={tab.example}
                />
                </Field>

                <Field label="Category">
                <select
                    value={form.category}
                    onChange={(event) =>
                    setForm((current) => ({
                        ...current,
                        category: event.target.value as PaymentCategory,
                    }))
                    }
                    className={inputClass}
                >
                    <option value="Permanent">Permanent</option>
                    <option value="Temporary">Temporary</option>
                </select>
                </Field>
            </div>

            <FormError message={error} />

            <div className="flex justify-end gap-2 border-t border-[var(--color-border)] pt-5">
                <Button type="button" variant="ghost" onClick={closeForm}>
                Cancel
                </Button>

                <Button type="submit">
                {editingItem ? "Save changes" : `Add ${tab.singular}`}
                </Button>
            </div>
            </form>
        )}
        </ModalShell>
    );
}