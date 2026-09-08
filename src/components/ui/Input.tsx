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
          className="mb-2 block text-xs font-medium text-[var(--color-text-secondary)]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={cn(
          "h-10 w-full rounded-lg border bg-[var(--color-surface-raised)] px-3 text-sm text-[var(--color-text)]",
          "outline-none transition-all duration-200",
          "placeholder:text-[var(--color-text-muted)]",
          error
            ? "border-[var(--color-danger)]/70 focus:border-[var(--color-danger)]"
            : "border-[var(--color-border-strong)] focus:border-[var(--color-brand)]/70 focus:ring-1 focus:ring-[var(--color-brand)]/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />

      {error ? (
        <p className="mt-1.5 text-xs text-[var(--color-danger)]">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}