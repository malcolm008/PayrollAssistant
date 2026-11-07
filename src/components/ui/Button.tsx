import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

// Every color comes from the theme tokens, so buttons follow dark/light
// automatically and a future rebrand only touches tokens.css.
const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-brand)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-hover)]",

  secondary:
    "border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]",

  ghost:
    "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]",

  danger:
    "border border-[var(--color-danger)]/40 bg-transparent text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10",

  outline:
    "border border-[var(--color-brand)]/50 bg-transparent text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)]",
};

export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-[4px] px-4 text-sm font-medium transition-colors duration-150",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}

      {children}
    </button>
  );
}