import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: InputProps) {
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

      <input
        id={id}
        className={cn(
          "h-10 w-full rounded-lg border bg-[#111111] px-3 text-sm text-[#f5f5f5]",
          "outline-none transition-all duration-200",
          "placeholder:text-[#555555]",
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