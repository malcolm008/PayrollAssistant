import {
  Banknote,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { useState, type ElementType } from "react";

import { AdvanceTypeModal } from "./advanceTypesModal";
import {
  AllowanceTypesModal,
  DeductionTypesModal,
  LeaveTypesModal,
  LoanTypesModal,
} from "./payrollConfigModals";

type ConfigKey = "advance" | "allowance" | "deduction" | "leave" | "loan";

const items: { key: ConfigKey; title: string; icon: ElementType }[] = [
  { key: "advance", title: "Advance Types", icon: WalletCards },
  { key: "allowance", title: "Allowance Types", icon: CircleDollarSign },
  { key: "deduction", title: "Deduction Types", icon: ShieldCheck },
  { key: "leave", title: "Leave Types", icon: CalendarDays },
  { key: "loan", title: "Loan Types", icon: Banknote },
];

export function PayrollConfigPanel({ onClose }: { onClose?: () => void }) {
  const [open, setOpen] = useState<ConfigKey | null>(null);
  const close = () => setOpen(null);

  return (
    <section className="mb-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">
            Payroll Configuration
          </h2>

          <span className="rounded-full bg-[var(--color-brand-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-brand)]">
            {items.length}
          </span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-brand)]"
          >
            Hide
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(({ key, title, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setOpen(key)}
            className="group flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-left transition-colors hover:border-[var(--color-brand)]/40 hover:bg-[var(--color-surface-hover)]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <Icon size={17} strokeWidth={1.8} />
            </div>

            <span className="flex-1 text-xs font-semibold text-[var(--color-text)]">
              {title}
            </span>

            <ChevronRight
              size={15}
              className="text-[var(--color-text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-brand)]"
            />
          </button>
        ))}
      </div>

      {open === "advance" && <AdvanceTypeModal onClose={close} />}
      {open === "allowance" && <AllowanceTypesModal onClose={close} />}
      {open === "deduction" && <DeductionTypesModal onClose={close} />}
      {open === "leave" && <LeaveTypesModal onClose={close} />}
      {open === "loan" && <LoanTypesModal onClose={close} />}
    </section>
  );
}