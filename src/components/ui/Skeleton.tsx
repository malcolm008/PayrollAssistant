interface SkeletonProps {
    className?: string;
}

export function Skeleton({
    className = "",
}: SkeletonProps) {
    return (
        <div
        className={`animate-pulse rounded-md bg-[#222222] ${className}`}
        />
    );
}