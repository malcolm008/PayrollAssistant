import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function Card({
  title,
  description,
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)]",
        className,
      )}
      {...props}
    >
      {(title || description) && (
        <div className="border-b border-[var(--color-border)] px-6 py-5">
          {title && (
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {description}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
}