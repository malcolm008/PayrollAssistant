import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange, }: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between border-t border-[#242424] pt-4">
        <p className="text-xs text-[#666666]">
            Page {page} of {totalPages}
        </p>

        <div className="flex items-center gap-1">
            <button
            disabled={page === 1}
            onClick={() => onChange(page - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#777777] hover:bg-[#1a1a1a] hover:text-[#f5f5f5] disabled:pointer-events-none disabled:opacity-30"
            >
            <ChevronLeft size={16} />
            </button>

            <button
            disabled={page === totalPages}
            onClick={() => onChange(page + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#777777] hover:bg-[#1a1a1a] hover:text-[#f5f5f5] disabled:pointer-events-none disabled:opacity-30"
            >
            <ChevronRight size={16} />
            </button>
        </div>
        </div>
    );
}