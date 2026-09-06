interface AvatarProps {
    name: string;
    src?: string;
    size?: "sm" | "md" | "lg";
}

export function Avatar({
    name,
    src,
    size = "md",
}: AvatarProps) {
    const sizes = {
        sm: "h-7 w-7 text-[9px]",
        md: "h-9 w-9 text-[11px]",
        lg: "h-12 w-12 text-sm",  
    };

    const initials = name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();

    return (
        <div
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#242424] font-semibold text-[#d4af37] ${sizes[size]}`}
        >
        {src ? (
            <img
            src={src}
            alt={name}
            className="h-full w-full object-cover"
            />
        ) : (
            initials
        )}
        </div>
    );
}