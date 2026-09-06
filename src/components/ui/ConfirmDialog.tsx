import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    confirmText?: string;
    loading?: boolean;
}

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    loading = false,
}: ConfirmDialogProps) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            size="sm"
        >
            <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff4d4f]/10 text-[#ff4d4f]">
                <AlertTriangle size={22} />
                </div>

                <p className="mt-4 text-sm leading-6 text-[#888888]">
                {description}
                </p>

                <div className="mt-6 flex w-full justify-end gap-3">
                <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="danger"
                    onClick={onConfirm}
                    loading={loading}
                >
                    {confirmText}
                </Button>
                </div>
            </div>
        </Modal>
    );
}