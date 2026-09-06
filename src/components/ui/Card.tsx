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
        "rounded-xl border border-[#242424] bg-[#111111]",
        className,
      )}
      {...props}
    >
      {(title || description) && (
        <div className="border-b border-[#202020] px-6 py-5">
          {title && (
            <h2 className="text-sm font-semibold text-[#f5f5f5]">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-1 text-xs text-[#666666]">
              {description}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
}