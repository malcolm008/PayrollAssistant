import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = "Something went wrong",
    description = "We couldn't load this information. Please try again.",
    onRetry,
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#ff4d4f]/20 bg-[#ff4d4f]/[0.03] px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff4d4f]/10 text-[#ff4d4f]">
            <AlertCircle size={21} />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-[#f5f5f5]">
            {title}
        </h3>

        <p className="mt-2 max-w-sm text-xs leading-5 text-[#777777]">
            {description}
        </p>

        {onRetry && (
            <Button
            variant="secondary"
            className="mt-5"
            onClick={onRetry}
            >
            <RefreshCw size={14} />
            Try Again
            </Button>
        )}
        </div>
    );
}