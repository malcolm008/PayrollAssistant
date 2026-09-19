import type { ReactNode } from "react";

interface SummaryCardProps {
    title: string,
    value: string,
    description?: string;
    icon: ReactNode;
}

export function SummaryCard({
    title,
    value,
    description,
    icon,
}: SummaryCardProps) {
    return (
        <div
        className="
            group relative overflow-hidden rounded-2xl
            border border-[var(--color-border)]
            bg-[var(--color-surface)]
            p-5
            transition-all duration-200
            hover:border-[var(--color-border-strong)]
            hover:bg-[var(--color-surface-hover)]
        "
        >
        {/* Subtle gold glow */}
        <div
            className="
            pointer-events-none absolute -right-8 -top-8
            h-24 w-24 rounded-full
            bg-[var(--color-brand)]
            opacity-[0.04]
            blur-2xl
            transition-opacity
            group-hover:opacity-[0.08]
            "
        />

        <div className="relative flex items-start justify-between gap-4">
            {/* Text */}
            <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                {title}
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
                {value}
            </p>

            {description && (
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {description}
                </p>
            )}
            </div>

            {/* Icon */}
            <div
            className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl
                border border-[var(--color-brand)]
                bg-[var(--color-brand-soft)]
                text-[var(--color-brand)]
            "
            >
            {icon}
            </div>
        </div>
        </div>
    );
}