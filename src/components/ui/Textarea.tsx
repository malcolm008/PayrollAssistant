import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export function Textarea({
    label,
    error,
    hint,
    className,
    id,
    ...props
}: TextareaProps) {
    return (
        <div className="w-full">
        {label && (
            <label
            htmlFor={id}
            className="mb-2 block text-xs font-medium text-[#b0b0b0]"
            >
            {label}
            </label>
        )}

        <textarea
            id={id}
            className={cn(
            "min-h-[100px] w-full resize-y rounded-lg border bg-[#111111] px-3 py-2.5 text-sm text-[#f5f5f5]",
            "outline-none transition-all duration-200 placeholder:text-[#555555]",
            error
                ? "border-[#ff4d4f]/70 focus:border-[#ff4d4f]"
                : "border-[#2a2a2a] focus:border-[#d4af37]/70 focus:ring-1 focus:ring-[#d4af37]/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
            )}
            {...props}
        />

        {error ? (
            <p className="mt-1.5 text-xs text-[#ff4d4f]">{error}</p>
        ) : hint ? (
            <p className="mt-1.5 text-xs text-[#666666]">{hint}</p>
        ) : null}
        </div>
    );
}