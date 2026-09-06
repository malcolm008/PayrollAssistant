import type { InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
}

export function Checkbox({
    label,
    id,
    ...props
}: CheckboxProps) {
    return (
        <label
        htmlFor={id}
        className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-[#b0b0b0]"
        >
        <input
            id={id}
            type="checkbox"
            className="h-4 w-4 cursor-pointer appearance-none rounded border border-[#3a3a3a] bg-[#111111] transition-all checked:border-[#d4af37] checked:bg-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
            {...props}
        />

        {label && <span>{label}</span>}
        </label>
    );
}