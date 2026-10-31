import {
    ArrowLeft,
    ChevronDown,
    Pencil,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import React, { useMemo, useState, type ReactNode } from "react";

import {
    Field,
    ModalShell,
    fieldInputClass,
    fieldSelectClass
} from "../ui/ModalShell";

import type { 
    BaseDraft,
    TypeRow,
    TypeToggle,
    TypeManagerModalProps,
    View,
} from "../../types/configurations";
import { pillTones } from "../../types/configurations";

export function Pill({
    tone = "muted",
    children,
}: {
    tone?: keyof typeof pillTones;
    children: ReactNode;
}) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${pillTones[tone]}`}
        >
            {children}
        </span>
    );
}

export function TextField({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    upper = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    upper?: boolean;
}) {
    return (
        <Field label={required ? `${label} *` : label}>
        <input
            value={value}
            onChange={(event) =>
            onChange(
                upper ? event.target.value.toUpperCase() : event.target.value,
            )
            }
            placeholder={placeholder}
            className={fieldInputClass}
        />
        </Field>
    );
}

export function TextAreaField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <Field label={label}>
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                rows={2}
                className="w-full resize-none rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
            />
        </Field>
    );
}

export function SelectInput<V extends string>({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: V;
    options: readonly V[];
    onChange: (value: V) => void;
}) {
    return (
        <Field label={label}>
            <div className="relative">
                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value as V)}
                    className={fieldSelectClass}
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                        {option}
                        </option>
                    ))}
                </select>
        
                <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />
            </div>
        </Field>
    );
}
 
export function NumberInput({
  label,
  value,
  onChange,
  suffix,
  step = 1,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  suffix?: string;
  step?: number;
}) {
  return (
        <Field label={label}>
            <div className="relative">
                <input
                    type="number"
                    min={0}
                    step={step}
                    value={value ?? ""}
                    onChange={(event) =>
                        onChange(
                        event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                        )
                    }
                    className={`${fieldInputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                        suffix ? "pr-14" : ""
                    }`}
                />
        
                {suffix && (
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)]">
                    {suffix}
                </span>
                )}
            </div>
        </Field>
    );
}

export function ToggleRow({
    label,
    value,
    onChange,
}: {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={value}
            onClick={() => onChange(!value)}
            className="flex w-full items-center justify-between gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface-hover)]"
            >
            <span className="text-xs font-medium text-[var(--color-text)]">
                {label}
            </span>
        
            <span
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                value
                    ? "bg-[var(--color-brand)]"
                    : "bg-[var(--color-border-strong)]"
                }`}
            >
                <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                    value ? "left-[18px]" : "left-0.5"
                }`}
                />
            </span>
        </button>
    );
}

function StatPill({ label, value }: {label: string; value: number }) {
    return (
        <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1 text-[11px] text-[var(--color-text-secondary)]">
        <span className="font-semibold text-[var(--color-text)]">{value}</span>{" "}
        {label}
        </span>
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
        title={active ? "Deactivate" : "Activate"}
        className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
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

export function TypeManagerModal<D extends BaseDraft>({
    title,
    noun,
    codeHint,
    nameHint,
    items,
    blank,
    columns,
    stats = [],
    renderFields,
    toggles = [],
    onCreate,
    onUpdate,
    onDelete,
    onToggle,
    onClose,
}: TypeManagerModalProps<D>) {
    const [view, setView] = useState<View>({ mode: "list" });
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        
        return items.filter((item) => {
            const matchesSearch = !query || item.code.toLowerCase().includes(query) || item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
            const matchesStatus = status === "all" || (status === "active") === item.active;

            return matchesSearch && matchesStatus;
        });
    }, [items, search, status]);

    const targetId = view.mode === "list" ? null : view.id;
    const target = targetId ? (items.find((item) => item.id === targetId) ?? null) : null;

    const toDraft = (item: TypeRow<D>): D => {
        const { id: removeId, ...rest } = item;
        void removeId;
        return rest as unknown as D;
    };

    let heading = title;
    let width = "max-w-5xl";
    let body: ReactNode;

    if (view.mode === "form") {
        heading = view.id ? `Edit ${noun}` : `Add ${noun}`;
        width = "max-w-xl";

        body = (
            <TypeForm<D>
                key={view.id ?? "new"}
                codeHint={codeHint}
                nameHint={nameHint}
                initial={target ? toDraft(target) : blank}
                isNew={view.id === null}
                renderFields={renderFields}
                toggles={toggles}
                onCancel={() => setView({ mode: "list" })}
                onSave={(data) => {
                if (view.id) {
                    onUpdate(view.id, data);
                } else {
                    onCreate(data);
                }
        
                setView({ mode: "list" });
                }}
            />
        );
    } else if (view.mode === "delete" && target) {
        heading = `Delete ${noun}`;
        width = "max-w-md";

        body = (
            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)]">
                        <Trash2 size={19} />
                    </div>
            
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text)]">
                        Delete “{target.name}”?
                        </h3>
            
                        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                        This can’t be undone.
                        </p>
                    </div>
                </div>
        
                <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
                    <button
                        type="button"
                        onClick={() => setView({ mode: "list" })}
                        className="rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)]"
                    >
                        Cancel
                    </button>
        
                    <button
                        type="button"
                        onClick={() => {
                        onDelete(target.id);
                        setView({ mode: "list" });
                        }}
                        className="rounded-lg bg-[var(--color-danger)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    } else {
        body = (
            <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                <StatPill label="Total" value={items.length} />
                <StatPill
                    label="Active"
                    value={items.filter((item) => item.active).length}
                />
                {stats.map((stat) => (
                    <StatPill
                    key={stat.label}
                    label={stat.label}
                    value={items.filter((item) => stat.test(item)).length}
                    />
                ))}
                </div>
        
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                    />
        
                    <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search..."
                    className={`${fieldInputClass} pl-10`}
                    />
                </div>
        
                <div className="relative md:w-40">
                    <select
                    value={status}
                    onChange={(event) =>
                        setStatus(
                        event.target.value as "all" | "active" | "inactive",
                        )
                    }
                    className={fieldSelectClass}
                    >
                    <option value="all">All status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    </select>
        
                    <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                    />
                </div>
        
                <button
                    type="button"
                    onClick={() => setView({ mode: "form", id: null })}
                    className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 text-xs font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-90"
                >
                    <Plus size={15} />
                    Add {noun}
                </button>
                </div>
        
                <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
                {filtered.length === 0 ? (
                    <div className="p-12 text-center">
                    <Search
                        size={20}
                        className="mx-auto text-[var(--color-text-muted)]"
                    />
                    <p className="mt-3 text-sm text-[var(--color-text)]">
                        No {title.toLowerCase()} found
                    </p>
                    </div>
                ) : (
                    <table className="w-full min-w-[760px]">
                    <thead>
                        <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)] text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                        <th className="px-4 py-3">Code</th>
                        <th className="px-4 py-3">{noun}</th>
                        {columns.map((column) => (
                            <th key={column.header} className="px-4 py-3">
                            {column.header}
                            </th>
                        ))}
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
        
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {filtered.map((item) => (
                        <tr
                            key={item.id}
                            className="transition-colors hover:bg-[var(--color-surface-hover)]"
                        >
                            <td className="px-4 py-3">
                            <span className="font-mono text-xs text-[var(--color-brand)]">
                                {item.code}
                            </span>
                            </td>
        
                            <td className="px-4 py-3">
                            <p className="text-sm font-medium text-[var(--color-text)]">
                                {item.name}
                            </p>
        
                            {item.description && (
                                <p className="mt-0.5 max-w-[240px] truncate text-xs text-[var(--color-text-muted)]">
                                {item.description}
                                </p>
                            )}
                            </td>
        
                            {columns.map((column) => (
                            <td
                                key={column.header}
                                className="px-4 py-3 text-xs text-[var(--color-text-secondary)]"
                            >
                                {column.render(item)}
                            </td>
                            ))}
        
                            <td className="px-4 py-3">
                            <StatusToggle
                                active={item.active}
                                onClick={() => onToggle(item.id)}
                            />
                            </td>
        
                            <td className="px-4 py-3">
                            <div className="flex justify-end gap-1">
                                <button
                                type="button"
                                onClick={() =>
                                    setView({ mode: "form", id: item.id })
                                }
                                title="Edit"
                                className="rounded-md p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand)]"
                                >
                                <Pencil size={14} />
                                </button>
        
                                <button
                                type="button"
                                onClick={() =>
                                    setView({ mode: "delete", id: item.id })
                                }
                                title="Delete"
                                className="rounded-md p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
                                >
                                <Trash2 size={14} />
                                </button>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                )}
                </div>
            </div>
        );
    }

    return (
        <ModalShell title={heading} onClose={onClose} maxWidth={width}>
            {body}
        </ModalShell>
    );
}

function TypeForm<D extends BaseDraft>({
    codeHint,
    nameHint,
    initial,
    isNew,
    renderFields,
    toggles,
    onCancel,
    onSave,
}: {
    codeHint?: string;
    nameHint?: string;
    initial: D;
    isNew: boolean;
    renderFields?: (
        draft: D,
        set: (patch: Partial<D>) => void,
    ) => ReactNode;
    toggles: TypeToggle<D>[];
    onCancel: () => void;
    onSave: (data: D) => void;
}) {
    const [draft, setDraft] = useState<D>(initial);
    const set = (patch: Partial<D>) => setDraft((current) => ({ ...current, ...patch }));
    const patchBase = (patch: Partial<BaseDraft>) => set(patch as unknown as Partial<D>);
    const values = draft as unknown as Record<string, unknown>;

    const valid = draft.code.trim() !== "" && draft.name.trim() !== "";

    const submit = () => {
        if (!valid) return;

        onSave({
            ...draft,
            code: draft.code.trim().toUpperCase(),
            name: draft.name.trim(),
            description: draft.description.trim(),
        });
    };

    return (
        <div className="space-y-5">
        <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
        >
            <ArrowLeft size={14} />
            Back to list
        </button>
    
        <div className="grid gap-4 sm:grid-cols-2">
            <TextField
            label="Code"
            required
            upper
            value={draft.code}
            placeholder={codeHint}
            onChange={(value) => patchBase({ code: value })}
            />
    
            <TextField
            label="Name"
            required
            value={draft.name}
            placeholder={nameHint}
            onChange={(value) => patchBase({ name: value })}
            />
        </div>
    
        <TextAreaField
            label="Description"
            value={draft.description}
            onChange={(value) => patchBase({ description: value })}
        />
    
        {renderFields?.(draft, set)}
    
        <div className="space-y-2">
            {toggles.map((toggle) => (
            <ToggleRow
                key={toggle.key}
                label={toggle.label}
                value={Boolean(values[toggle.key])}
                onChange={(value) =>
                set({ [String(toggle.key)]: value } as unknown as Partial<D>)
                }
            />
            ))}
    
            <ToggleRow
            label="Active"
            value={draft.active}
            onChange={(value) => patchBase({ active: value })}
            />
        </div>
    
        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
            <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)]"
            >
            Cancel
            </button>
    
            <button
            type="button"
            onClick={submit}
            disabled={!valid}
            className="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
            {isNew ? "Create" : "Save Changes"}
            </button>
        </div>
        </div>
    )
}