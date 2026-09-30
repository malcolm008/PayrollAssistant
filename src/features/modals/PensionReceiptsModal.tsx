import { CalendarDays, CheckCircle2, FileText, X } from "lucide-react";
import { useEffect, useState } from "react";
import { type PensionReceipt, type PensionReceiptsModalProps, emptyForm } from "../../types/pension";

const STORAGE_KEY = "payroll_pension_receipts";

export function PensionReceiptsModal({
    payrollPeriod,
    onClose,
}: PensionReceiptsModalProps) {
    const [ form, setForm ] = useState(emptyForm);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) return;

        try {
            const receipts: PensionReceipt[] = JSON.parse(stored);

            const current = receipts.find((receipt) => receipt.payrollPeriod === payrollPeriod);

            if (current) {
                setForm({
                    nssfReceiptNumber: current.nssfReceiptNumber,
                    nssfReceiptDate: current.nssfReceiptDate,
                    psssfReceiptNumber: current.psssfReceiptNumber,
                    psssfReceiptDate: current.psssfReceiptDate,
                    companyPFReceiptNumber: current.companyPFReceiptNumber,
                    companyPFReceiptDate: current.companyPFReceiptDate,
                });
            }
        } catch {
            //Ignore malformed
        }
    }, [payrollPeriod]);

    function updateField(
        field: keyof typeof emptyForm,
        value: string,
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setSaved(false);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const stored = localStorage.getItem(STORAGE_KEY);

        let receipts: PensionReceipt[] = [];

        if (stored) {
            try {
                receipts = JSON.parse(stored);
            } catch {
                receipts = [];
            }
        }

        const existingIndex = receipts.findIndex((receipt) => receipt.payrollPeriod ===  payrollPeriod);
        const record: PensionReceipt = {
            id: existingIndex  >= 0 ? receipts[existingIndex].id : crypto.randomUUID(),
            payrollPeriod,
            ...form,
            updatedAt: new Date().toISOString(),
        };

        if (existingIndex >= 0) {
            receipts[existingIndex] = record;
        } else {
            receipts.push(record);
        }

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(receipts),
        );

        setSaved(true);

        window.setTimeout(() => {
            setSaved(false);
        }, 2500);
    }

    const inputClass = "h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]";

    return (
        <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
            onClose();
            }
        }}
        >
        <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] shadow-2xl">
            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-5">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-soft)]">
                <FileText
                    size={19}
                    className="text-[var(--color-brand)]"
                />
                </div>

                <div>
                <h2 className="text-base font-semibold text-[var(--color-text)]">
                    Pension Receipts
                </h2>

                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    Record pension and company provident fund receipts.
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

            <form onSubmit={handleSubmit}>
            <div className="space-y-6 p-6">
                {/* PAYROLL PERIOD */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <div className="flex items-center gap-2">
                    <CalendarDays
                    size={16}
                    className="text-[var(--color-brand)]"
                    />

                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                    Payroll Period
                    </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
                    {payrollPeriod}
                </p>
                </div>

                {/* NSSF */}
                <section>
                <div className="mb-4 flex items-center gap-2">
                    <span className="h-5 w-1 rounded-full bg-[var(--color-brand)]" />

                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
                    NSSF
                    </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                        NSSF Receipt Number
                    </span>

                    <input
                        value={form.nssfReceiptNumber}
                        onChange={(event) =>
                        updateField(
                            "nssfReceiptNumber",
                            event.target.value,
                        )
                        }
                        placeholder="Enter receipt number"
                        className={inputClass}
                    />
                    </label>

                    <label className="space-y-2">
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                        NSSF Receipt Date
                    </span>

                    <input
                        type="date"
                        value={form.nssfReceiptDate}
                        onChange={(event) =>
                        updateField(
                            "nssfReceiptDate",
                            event.target.value,
                        )
                        }
                        className={inputClass}
                    />
                    </label>
                </div>
                </section>

                {/* PSSSF */}
                <section>
                <div className="mb-4 flex items-center gap-2">
                    <span className="h-5 w-1 rounded-full bg-[var(--color-info)]" />

                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
                    PSSSF
                    </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                        PSSSF Receipt Number
                    </span>

                    <input
                        value={form.psssfReceiptNumber}
                        onChange={(event) =>
                        updateField(
                            "psssfReceiptNumber",
                            event.target.value,
                        )
                        }
                        placeholder="Enter receipt number"
                        className={inputClass}
                    />
                    </label>

                    <label className="space-y-2">
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                        PSSSF Receipt Date
                    </span>

                    <input
                        type="date"
                        value={form.psssfReceiptDate}
                        onChange={(event) =>
                        updateField(
                            "psssfReceiptDate",
                            event.target.value,
                        )
                        }
                        className={inputClass}
                    />
                    </label>
                </div>
                </section>

                {/* COMPANY PF */}
                <section>
                <div className="mb-4 flex items-center gap-2">
                    <span className="h-5 w-1 rounded-full bg-[var(--color-success)]" />

                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
                    Company PF
                    </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                        Company PF Receipt Number
                    </span>

                    <input
                        value={form.companyPFReceiptNumber}
                        onChange={(event) =>
                        updateField(
                            "companyPFReceiptNumber",
                            event.target.value,
                        )
                        }
                        placeholder="Enter receipt number"
                        className={inputClass}
                    />
                    </label>

                    <label className="space-y-2">
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                        Company PF Receipt Date
                    </span>

                    <input
                        type="date"
                        value={form.companyPFReceiptDate}
                        onChange={(event) =>
                        updateField(
                            "companyPFReceiptDate",
                            event.target.value,
                        )
                        }
                        className={inputClass}
                    />
                    </label>
                </div>
                </section>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between border-t border-[var(--color-border)] px-6 py-4">
                <div className="flex items-center gap-2">
                {saved && (
                    <>
                    <CheckCircle2
                        size={15}
                        className="text-[var(--color-success)]"
                    />

                    <span className="text-xs text-[var(--color-success)]">
                        Receipt information saved
                    </span>
                    </>
                )}
                </div>

                <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                >
                    Close
                </button>

                <button
                    type="submit"
                    className="rounded-xl bg-[var(--color-brand)] px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-[var(--color-brand-hover)]"
                >
                    Save Receipts
                </button>
                </div>
            </div>
            </form>
        </div>
        </div>
    );
}

