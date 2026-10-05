import {
    CheckCircle2,
    MessageSquareText,
    Send,
    Users,
    X, 
} from "lucide-react";
import { useMemo, useState } from "react";
import type { PayslipBroadcastModalProps, BroadcastRecord } from "../../types/payslipBroadcast";

const STORAGE_KEY = "payroll_payslip_broadcasts";

const payrollPeriods = [
    "September 2026",
    "August 2026",
    "July 2026",
    "June 2026",
    "May 2026",
];

export function PayslipBroadcastModal({
    employees,
    onClose,
}: PayslipBroadcastModalProps) {
    const [payrollPeriod, setPayrollPeriod] = useState("September 2026");
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);

    const activeEmployees = useMemo(() => employees.filter((employee) => employee,status.toLowerCase() === "active"), [employees]);

    function handleBroadcast() {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
            window.alert("Please enter a broadcast message.");
            return;
        }

        const stored = localStorage.getItem(STORAGE_KEY);
        let broadcasts: BroadcastRecord[] = [];

        if (stored) {
            try {
                broadcasts = JSON.parse(stored);
            } catch {
                broadcasts = [];
            }
        }

        const record: BroadcastRecord = {
            id: crypto.randomUUID(),
            payrollPeriod,
            message: trimmedMessage,
            receipientCount: activeEmployees.length,
            sentAt: new Date().toISOString(),
            status: "Sent",
        };

        broadcasts.unshift(record);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(broadcasts),
        );

        setSent(true);
    }

    return (
        <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
            onClose();
            }
        }}
        >
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-soft)]">
                <MessageSquareText
                    size={19}
                    className="text-[var(--color-brand)]"
                />
                </div>

                <div>
                <h2 className="text-base font-semibold text-[var(--color-text)]">
                    Payslip Broadcast Message
                </h2>

                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    Send a message to employees for a payroll period.
                </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
            >
                <X size={18} />
            </button>
            </div>

            {!sent ? (
            <>
                <div className="space-y-6 p-6">
                {/* PAYROLL PERIOD */}
                <label className="block space-y-2">
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                    Payroll Period
                    </span>

                    <select
                    value={payrollPeriod}
                    onChange={(event) =>
                        setPayrollPeriod(event.target.value)
                    }
                    className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
                    >
                    {payrollPeriods.map((period) => (
                        <option key={period} value={period}>
                        {period}
                        </option>
                    ))}
                    </select>
                </label>

                {/* RECIPIENT SUMMARY */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                    <div className="flex items-center gap-2">
                        <Users
                        size={16}
                        className="text-[var(--color-brand)]"
                        />

                        <span className="text-xs text-[var(--color-text-secondary)]">
                        Recipients
                        </span>
                    </div>

                    <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">
                        {activeEmployees.length}
                    </p>

                    <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                        Active employees
                    </p>
                    </div>

                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                    <div className="flex items-center gap-2">
                        <MessageSquareText
                        size={16}
                        className="text-[var(--color-info)]"
                        />

                        <span className="text-xs text-[var(--color-text-secondary)]">
                        Period
                        </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
                        {payrollPeriod}
                    </p>

                    <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                        Payslip period
                    </p>
                    </div>
                </div>

                {/* MESSAGE */}
                <label className="block space-y-2">
                    <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                        Broadcast Message
                    </span>

                    <span className="text-[10px] text-[var(--color-text-muted)]">
                        {message.length}/500
                    </span>
                    </div>

                    <textarea
                    value={message}
                    onChange={(event) => {
                        if (event.target.value.length <= 500) {
                        setMessage(event.target.value);
                        }
                    }}
                    rows={6}
                    placeholder=""
                    className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]"
                    />
                </label>

                {/* PREVIEW */}
                {message.trim() && (
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <MessageSquareText
                        size={15}
                        className="text-[var(--color-brand)]"
                        />

                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                        Message Preview
                        </span>
                    </div>

                    <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                        {message}
                    </p>
                    </div>
                )}
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between border-t border-[var(--color-border)] px-6 py-4">
                <span className="text-[11px] text-[var(--color-text-muted)]">
                    This will broadcast to all active employees.
                </span>

                <div className="flex gap-3">
                    <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-hover)]"
                    >
                    Cancel
                    </button>

                    <button
                    type="button"
                    onClick={handleBroadcast}
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-[var(--color-brand-hover)]"
                    >
                    <Send size={14} />
                    Broadcast Message
                    </button>
                </div>
                </div>
            </>
            ) : (
            /* SUCCESS */
            <div className="p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-success)]/10">
                <CheckCircle2
                    size={28}
                    className="text-[var(--color-success)]"
                />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-[var(--color-text)]">
                Broadcast Sent
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
                The payslip message for{" "}
                <span className="font-medium text-[var(--color-text)]">
                    {payrollPeriod}
                </span>{" "}
                has been recorded for{" "}
                <span className="font-medium text-[var(--color-text)]">
                    {activeEmployees.length}
                </span>{" "}
                active employees.
                </p>

                <button
                type="button"
                onClick={onClose}
                className="mt-7 rounded-xl bg-[var(--color-brand)] px-6 py-2.5 text-xs font-semibold text-black transition hover:bg-[var(--color-brand-hover)]"
                >
                Done
                </button>
            </div>
            )}
        </div>
        </div>
    );
}