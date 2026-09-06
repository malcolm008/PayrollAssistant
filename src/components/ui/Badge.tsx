import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type BadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "gold";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  children,
  variant = "neutral",
  className,
  ...props
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    success:
      "bg-[#35c759]/10 text-[#35c759] border-[#35c759]/20",

    warning:
      "bg-[#ffb020]/10 text-[#ffb020] border-[#ffb020]/20",

    error:
      "bg-[#ff4d4f]/10 text-[#ff4d4f] border-[#ff4d4f]/20",

    info:
      "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20",

    neutral:
      "bg-[#242424] text-[#999999] border-[#333333]",

    gold:
      "bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}