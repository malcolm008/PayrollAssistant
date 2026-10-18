import type { ReactNode } from "react";

export interface BaseDraft {
    code: string;
    name: string;
    description: string;
    active: boolean;
}

export type TypeRow<D extends BaseDraft> = D & { id: string };

export interface TypeColumn<D extends BaseDraft> {
    header: string;
    render: (item: TypeRow<D>) => ReactNode;
}

export interface TypeStat<D extends BaseDraft> {
    label: string;
    test: (item: TypeRow<D>) => boolean;
}

export interface TypeToggle<D extends BaseDraft> {
    key: keyof D & string;
    label: string;
}

export const pillTones = {
    success: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
    warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
    info: "bg-[var(--color-info)]/10 text-[var(--color-info)]",
    brand: "bg-[var(--color-brand-soft)] text-[var(--color-brand)]",
    muted: "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]",
};

export interface TypeManagerModalProps <D extends BaseDraft> {
    title: string;
    noun: string;
    codeHint?: string;
    nameHint?: string;
    items: TypeRow<D>[];
    blank: D;
    columns: TypeColumn<D>[];
    stats: TypeStat<D>[];
    renderFields?: (
        draft: D,
        set: (patch: Partial<D>) => void,
    ) => ReactNode;
    toggles?: TypeToggle<D>[];
    onCreate: (data: D) => void;
    onUpdate: (id: string, data: D) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
    onClose: () => void;
}

export type View = { mode: "list" } | { mode: "form"; id: string | null } | { mode: "delete"; id: string };
