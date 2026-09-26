import { X } from "lucide-react";
import type { ReactNode } from "react";

export function ModalShell({
    title,
    children,
    onClose,
    maxWidth = "max-w-lg",
}: {
    title: string;
    children: ReactNode;
    onClose: () => void;
    maxWidth?: string;
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div
            className={`max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] shadow-2xl`}
        >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-4">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
                {title}
            </h2>
    
            <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                aria-label="Close"
            >
                <X size={17} />
            </button>
            </div>
    
            <div className="p-6">{children}</div>
        </div>
        </div>
    );
}

export function Field({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <label className="block space-y-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            {label}
        </span>
        {children}
        </label>
    );
}

export const fieldInputClass = "h-10 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]";
 
export const fieldSelectClass = "h-10 w-full appearance-none rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3 pr-8 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]";