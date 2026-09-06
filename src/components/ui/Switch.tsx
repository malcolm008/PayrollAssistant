import type { InputHTMLAttributes } from "react";

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
}

export function Switch({
    label,
    id,
    ...props
}:  SwitchProps) {
    return (
        <label
        htmlFor={id}
        className="inline-flex cursor-pointer items-center gap-3"
        >
        <span className="relative">
            <input
            id={id}
            type="checkbox"
            className="peer sr-only"
            {...props}
            />

            <span className="block h-6 w-11 rounded-full bg-[#2a2a2a] transition-colors peer-checked:bg-[#d4af37]" />

            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-[#888888] transition-transform peer-checked:translate-x-5 peer-checked:bg-[#090909]" />
        </span>

        {label && (
            <span className="text-sm text-[#b0b0b0]">
            {label}
            </span>
        )}
        </label>
    );
}