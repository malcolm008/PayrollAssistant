import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";

interface DropdownItem {
    label: string;
    onClick: () =>  void;
    danger?: boolean;
}

interface DropdownProps {
    items: DropdownItem[];
    trigger?: ReactNode;
}

export function Dropdown({
    items,
    trigger,
}: DropdownProps)  {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);

        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className="relative">
        <button
            onClick={() => setOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#777777] hover:bg-[#1a1a1a] hover:text-[#f5f5f5]"
        >
            {trigger ?? <MoreHorizontal size={18} />}
        </button>

        {open && (
            <div className="absolute right-0 top-full z-50 mt-2 min-w-[170px] overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#151515] p-1 shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
            {items.map((item) => (
                <button
                key={item.label}
                onClick={() => {
                    item.onClick();
                    setOpen(false);
                }}
                className={`flex w-full items-center rounded-md px-3 py-2 text-left text-xs transition-colors ${
                    item.danger
                    ? "text-[#ff4d4f] hover:bg-[#ff4d4f]/10"
                    : "text-[#999999] hover:bg-[#222222] hover:text-[#f5f5f5]"
                }`}
                >
                {item.label}
                </button>
            ))}
            </div>
        )}
        </div>
    );
}