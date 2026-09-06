import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
    open,
    onClose,
    title,
    description,
    children,
    size = "md",
}: ModalProps) {
    if (!open) return null;

    const sizes = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        >
        <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
        />

        <div
            className={`relative w-full ${sizes[size]} overflow-hidden rounded-xl border border-[#303030] bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.6)]`}
        >
            <div className="flex items-start justify-between border-b border-[#242424] px-6 py-5">
            <div>
                <h2 className="text-base font-semibold text-[#f5f5f5]">
                {title}
                </h2>

                {description && (
                <p className="mt-1 text-xs text-[#666666]">
                    {description}
                </p>
                )}
            </div>

            <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#666666] hover:bg-[#1d1d1d] hover:text-[#f5f5f5]"
                aria-label="Close modal"
            >
                <X size={18} />
            </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
            {children}
            </div>
        </div>
        </div>
    );
}