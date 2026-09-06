interface DividerProps {
    label?: string;
}

export function Divider({ label }: DividerProps) {
    if (!label) {
        return <div className="h-px w-full bg-[#242424]" />;
    }

    return (
        <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-[#242424]" />

        <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#555555]">
            {label}
        </span>

        <div className="h-px flex-1 bg-[#242424]" />
        </div>
    );
}