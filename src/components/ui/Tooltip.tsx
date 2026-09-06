import type { ReactNode } from "react";

interface TooltipProps {
    content: string;
    children: ReactNode;
}

export function Tooltip({
    content,
    children,
}: TooltipProps) {
    return (
        <div className="group relative inline-flex">
        {children}

        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#303030] bg-[#181818] px-2.5 py-1.5 text-[10px] text-[#b0b0b0] opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            {content}
        </div>
        </div>
    );
}