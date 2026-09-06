import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export function Select({
    label,
    error,
    hint,
    className,
    id,
    children,
    ...props
}: SelectProps) {
    return(
        <div className="w-full">
        {label && (
            <label
            htmlFor={id}
            className="mb-2 block text-xs font-medium text-[#b0b0b0]"
            >
            {label}
            </label>
        )}

        <div className="relative">
            <select
            id={id}
            className={cn(
                "h-10 w-full appearance-none rounded-lg border bg-[#111111] px-3 pr-10 text-sm text-[#f5f5f5]",
                "outline-none transition-all duration-200",
                error
                ? "border-[#ff4d4f]/70 focus:border-[#ff4d4f]"
                : "border-[#2a2a2a] focus:border-[#d4af37]/70 focus:ring-1 focus:ring-[#d4af37]/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
            >
            {children}
            </select>

            <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]"
            />
        </div>

        {error ? (
            <p className="mt-1.5 text-xs text-[#ff4d4f]">{error}</p>
        ) : hint ? (
            <p className="mt-1.5 text-xs text-[#666666]">{hint}</p>
        ) : null}
        </div>
    );
}