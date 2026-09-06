import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export function EmptyState({
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2a2a2a] px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1a1810] text-[#d4af37]">
            <Inbox size={21} />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-[#f5f5f5]">
            {title}
        </h3>

        {description && (
            <p className="mt-2 max-w-sm text-xs leading-5 text-[#666666]">
            {description}
            </p>
        )}

        {action && <div className="mt-5">{action}</div>}
        </div>
    );
}