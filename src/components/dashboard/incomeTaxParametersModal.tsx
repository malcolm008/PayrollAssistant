import { AlertCircle, CalendarDays, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { ModalShell } from "../ui/ModalShell";
import type { TaxBand } from "../../types/taxBand";
import { defaultBands } from "../../data/taxBand";

const BAND_COUNT = 13;

const padBands = (bands: TaxBand[]): TaxBand[] => Array.from({ length: BAND_COUNT }, (_, index) => {
    return (
        bands[index] ?? {
            category: index + 1,
            min: 0,
            max: 0,
            percent: 0,
            addAmount: 0,
        }
    );
});

const isActive = (band: TaxBand) => band.min > 0 || band.max > 0 || band.percent > 0 || band.addAmount > 0;

const formatNumber = (value: number, decimals: number) => new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
}).format(value);

function NumberCell({
    value,
    decimals,
    invalid,
    disabled,
    onChange
}: {
    value: number;
    decimals: number;
    invalid?: boolean;
    disabled?: boolean;
    onChange: (value: number) => void;
}) {
    const [focused, setFocused] = useState(false);
    const [draft, setDraft] = useState("");

    return (
        <input
        type="text"
        inputMode="decimal"
        disabled={disabled}
        value={focused ? draft : formatNumber(value, decimals)}
        onFocus={(event) => {
            setDraft(value === 0 ? "" : String(value));
            setFocused(true);
            event.target.select();
        }}
        onBlur={() => setFocused(false)}
        onChange={(event) => {
            const raw = event.target.value.replace(/,/g, "");
    
            if (raw !== "" && !/^\d*\.?\d*$/.test(raw)) return;
    
            setDraft(raw);
            const parsed = parseFloat(raw);
            onChange(Number.isNaN(parsed) ? 0 : parsed);
        }}
        className={`h-9 w-full rounded-lg border bg-[var(--color-bg)] px-3 text-right text-xs tabular-nums text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-brand)] ${
            invalid
            ? "border-[var(--color-danger)]/60"
            : "border-[var(--color-border-strong)]"
        }`}
        />
    );
}

interface IncomeTaxParametersModalProps {
    payrollPeriod: string;
    initialBands?: TaxBand[];
    onClose: () => void;
    onSave: (bands: TaxBand[]) => void;
}

export function IncomeTaxParametersModal({
    payrollPeriod,
    initialBands = defaultBands,
    onClose,
    onSave,
}: IncomeTaxParametersModalProps) {
    const [baseline] = useState(() => padBands(initialBands));
    const [bands, setBands] = useState<TaxBand[]>(baseline);

    const updateBand = (
        index: number,
        field: keyof Omit<TaxBand, "category">,
        value: number,
    ) => {
        setBands((current) => current.map((band, i) => i === index ? { ...band, [field]: value }: band));
    };

    const { errors } = useMemo(() => {
        const errors: Record<number, string> = {};
        const warnings: Record<number, string> =  {};
        let previousActive: TaxBand | null = null;

        bands.forEach((band, index) => {
            if (!isActive(band)) return;

            if (band.max <= band.min) {
                errors[index] = "Maximum must be greater than minimum";
            } else if (band.percent < 0 || band.percent > 100) {
                errors[index] = "Percent must be between 0 and 100";
            } else if (previousActive && band.min !== previousActive.max) {
                warnings[index] = `Minimum doesn't match band ${previousActive.category} maximum`;
            }

            previousActive = band;
        });

        return { errors, warnings };
    }, [bands]);

    const hasErrors = Object.keys(errors).length > 0;
    const issueEntries = [
        ...Object.entries(errors).map(([index, message]) => ({
            index: Number(index),
            message,
            level: "warning" as const,
        })),
    ].sort((a, b) => a.index - b.index);

    const dirty = JSON.stringify(bands) !== JSON.stringify(baseline);
    const activeCount = bands.filter(isActive).length;

    return (
        <ModalShell
        title="Income Tax Parameters"
        onClose={onClose}
        maxWidth="max-w-3xl"
        >
        <div className="space-y-5">
            {/* Period + active bands */}
            <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2">
                <CalendarDays
                size={14}
                className="text-[var(--color-brand)]"
                />
                <span className="text-xs text-[var(--color-text-secondary)]">
                Payroll Period
                </span>
                <span className="text-xs font-semibold text-[var(--color-text)]">
                {payrollPeriod}
                </span>
            </div>
    
            <span className="text-xs text-[var(--color-text-muted)]">
                {activeCount} of {BAND_COUNT} bands in use
            </span>
            </div>
    
            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <div className="min-w-[620px]">
                <div className="grid grid-cols-[44px_1fr_1fr_88px_1fr] gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                <span>#</span>
                <span className="text-right">Minimum</span>
                <span className="text-right">Maximum</span>
                <span className="text-right">Percent</span>
                <span className="text-right">Add Amount</span>
                </div>
    
                <div className="max-h-[400px] overflow-y-auto">
                {bands.map((band, index) => {
                    const active = isActive(band);
                    const invalid = Boolean(errors[index]);
    
                    return (
                    <div
                        key={band.category}
                        className={`grid grid-cols-[44px_1fr_1fr_88px_1fr] items-center gap-3 border-b border-[var(--color-border)] px-4 py-2 last:border-b-0 ${
                        active ? "" : "opacity-60 focus-within:opacity-100"
                        }`}
                    >
                        <span
                        className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-semibold ${
                            active
                            ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
                            : "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
                        }`}
                        >
                        {band.category}
                        </span>
    
                        <NumberCell
                        value={band.min}
                        decimals={2}
                        invalid={invalid}
                        onChange={(v) => updateBand(index, "min", v)}
                        />
                        <NumberCell
                        value={band.max}
                        decimals={2}
                        invalid={invalid}
                        onChange={(v) => updateBand(index, "max", v)}
                        />
                        <NumberCell
                        value={band.percent}
                        decimals={1}
                        invalid={
                            invalid &&
                            (band.percent < 0 || band.percent > 100)
                        }
                        onChange={(v) => updateBand(index, "percent", v)}
                        />
                        <NumberCell
                        value={band.addAmount}
                        decimals={2}
                        onChange={(v) =>
                            updateBand(index, "addAmount", v)
                        }
                        />
                    </div>
                    );
                })}
                </div>
            </div>
            </div>
    
            {/* Validation */}
            {issueEntries.length > 0 && (
            <div
                className={`rounded-xl border p-4 ${
                hasErrors
                    ? "border-[var(--color-danger)]/30 bg-[var(--color-danger)]/[0.05]"
                    : "border-[var(--color-warning)]/30 bg-[var(--color-warning)]/[0.05]"
                }`}
            >
                <div className="flex gap-3">
                <AlertCircle
                    size={16}
                    className={`mt-0.5 shrink-0 ${
                    hasErrors
                        ? "text-[var(--color-danger)]"
                        : "text-[var(--color-warning)]"
                    }`}
                />
    
                <ul className="space-y-1 text-xs text-[var(--color-text-secondary)]">
                    {issueEntries.map((issue) => (
                    <li key={`${issue.level}-${issue.index}`}>
                        <span className="font-semibold text-[var(--color-text)]">
                        Band {bands[issue.index].category}:
                        </span>{" "}
                        {issue.message}
                    </li>
                    ))}
                </ul>
                </div>
            </div>
            )}
    
            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-5">
            <button
                type="button"
                onClick={() => setBands(baseline)}
                disabled={!dirty}
                className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] disabled:opacity-40 disabled:hover:text-[var(--color-text-muted)]"
            >
                <RotateCcw size={13} />
                Reset
            </button>
    
            <div className="flex gap-3">
                <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)]"
                >
                Cancel
                </button>
    
                <button
                type="button"
                onClick={() => onSave(bands.filter(isActive))}
                disabled={hasErrors || !dirty}
                className="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                Save Parameters
                </button>
            </div>
            </div>
        </div>
        </ModalShell>
    );
}

