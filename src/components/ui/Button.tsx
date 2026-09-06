import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    loading?: boolean;
}

export function Button({
    children,
    variant = "primary",
    loading = false,
    disabled,
    className,
    ...props
}: ButtonProps) {
    const variants: Record<ButtonVariant, string> = {
        primary: "bg-[#d4af37] text-[#090909] hover:bg-[#f0c75e] shadow-[0_0_16px_rgba(212,175,55,0.08)]",

        secondary: "bg-[#1a1a1a] text-[#f5f5f5] border border-[#2a2a2a] hover:bg-[#222222]",

        ghost: "bg-transparent text-[#999999] hover:bg-[#171717] hover:text-[#f5f5f5]",

        danger: "bg-[#ff4d4f] text-white hover:bg-[#ff6567]",

        outline: "border border-[#3a3320] bg-transparent text-[#d4af37] hover:bg-[#1a1810]",
    };

    return (
        <button
            disabled={disabled || loading}
            className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30",
                "disabled:cursor-not-allowed disabled:opacity-50",
                variants[variant],
                className,
            )}
            {...props}
        >
            {loading && <Loader2 size={16} className="animate-spin" />}

            {children}
        </button>
    )
}