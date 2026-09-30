import { useState } from "react";
import {
  X,
  Building2,
  BriefcaseBusiness,
  Users,
  ChevronRight,
  ChevronDown,
  CircleDollarSign,
  Moon,
  Settings2,
  ShieldCheck,
  Sun,
  WalletCards,
  Check,
  Banknote,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import type { ReactNode } from "react";
import PaymentMethodsPanel from "../../components/settings/PaymentMethodsPanel";

type ThemeOption = {
  id: "dark" | "light";
  name: string;
  description: string;
  icon: typeof Sun;
};

const themeOptions: ThemeOption[] = [
  {
    id: "dark",
    name: "Dark",
    description:
      "The default Payroll Assistant dark interface.",
    icon: Moon,
  },
  {
    id: "light",
    name: "Light",
    description:
      "A clean light interface with gold Accent.",
    icon: Sun,
  },
];

type SectionKey = "appearance" | "company" | "payroll" | "banking" ;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
 
  const [expandedSections, setExpandedSections] = useState<
    Record<SectionKey, boolean>
  >({
    appearance: true,
    company: true,
    payroll: true,
    banking: true,
  });

  const toggleSection = (key: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">
          Settings
        </h1>
      </div>

      {/* APPEARANCE */}
      <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <button
          type="button"
          onClick={() => toggleSection("appearance")}
          className="flex w-full items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-5 text-left transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <Sun size={20} />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Section
              </span>
              <h2 className="text-base font-semibold text-[var(--color-text)]">
                Appearance
              </h2>
            </div>
          </div>

          <ChevronDown
            size={19}
            className={`shrink-0 text-[var(--color-text-muted)] transition-transform ${
              expandedSections.appearance ? "rotate-180" : ""
            }`}
          />
        </button>

        {expandedSections.appearance && (
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-[var(--color-text)]">
                Theme
              </h3>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Choose the interface theme you want to use.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const selected = theme === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setTheme(option.id)}
                    className={`relative rounded-xl border p-5 text-left transition-all ${
                      selected
                        ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface-raised)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)]"
                    }`}
                  >
                    {selected && (
                      <div className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand)] text-[var(--color-bg)]">
                        <Check size={13} strokeWidth={3} />
                      </div>
                    )}

                    <div
                      className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${
                        selected
                          ? "bg-[var(--color-brand)] text-[var(--color-bg)]"
                          : "bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <h4 className="font-medium text-[var(--color-text)]">
                      {option.name}
                    </h4>

                    <p className="mt-1 pr-6 text-xs leading-5 text-[var(--color-text-secondary)]">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* COMPANY INFORMATION CONFIGURATION*/}
      <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <button
          type="button"
          onClick={() => toggleSection("company")}
          className="flex w-full items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-5 text-left transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <Building2 size={20} />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Section
              </span>
              <h2 className="text-base font-semibold text-[var(--color-text)]">
                Company Information
              </h2>
            </div>
          </div>

          <ChevronDown
            size={19}
            className={`shrink-0 text-[var(--color-text-muted)] transition-transform ${
              expandedSections.company ? "rotate-180" : ""
            }`}
          />
        </button>

        {expandedSections.company && (
          <div className="divide-y divide-[var(--color-border)]">
            <SettingsItem
              icon={<Building2 size={19} />}
              title="General Information"
              onClick={() =>
                navigate("/settings/company")
              }
            />

            <SettingsItem
              icon={<Users size={19} />}
              title="Job Titles & Departments"
              onClick={() =>
                navigate("/departments")
              }
            />

            <SettingsItem
              icon={<BriefcaseBusiness size={19} />}
              title="Employment Types"
              onClick={() =>
                navigate("/settings/company/employment-types")
              }
            />
          </div>
        )}
      </section>

      {/* PAYROLL CONFIGURATION */}
      <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <button
          type="button"
          onClick={() => toggleSection("payroll")}
          className="flex w-full items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-5 text-left transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <Settings2 size={20} />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Section
              </span>
              <h2 className="text-base font-semibold text-[var(--color-text)]">
                Payroll Configuration
              </h2>
            </div>
          </div>

          <ChevronDown
            size={19}
            className={`shrink-0 text-[var(--color-text-muted)] transition-transform ${
              expandedSections.payroll ? "rotate-180" : ""
            }`}
          />
        </button>

        {expandedSections.payroll && (
          <div className="divide-y divide-[var(--color-border)]">
            <SettingsItem
              icon={<WalletCards size={19} />}
              title="Advance Types"
              onClick={() =>
                navigate("/settings/payroll/advance-types")
              }
            />

            <SettingsItem
              icon={<CircleDollarSign size={19} />}
              title="Allowance Types"
              onClick={() =>
                navigate("/settings/payroll/allowance-types")
              }
            />

            <SettingsItem
              icon={<ShieldCheck size={19} />}
              title="Deduction Types"
              onClick={() =>
                navigate("/settings/payroll/deduction-types")
              }
            />

            <SettingsItem
              icon={<CalendarDays size={19} />}
              title="Leave Types"
              onClick={() =>
                navigate("/settings/payroll/leave-types")
              }
            />

            <SettingsItem
              icon={<Banknote size={19} />}
              title="Loan Types"
              onClick={() =>
                navigate("/settings/payroll/loan-types")
              }
            />
          </div>
        )}
      </section>

      {/* BANKING CONFIGURATION */}
      <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <button
          type="button"
          onClick={() => toggleSection("banking")}
          className="flex w-full items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-5 text-left transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <Building2 size={20} />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Section
              </span>
              <h2 className="text-base font-semibold text-[var(--color-text)]">
                Banking
              </h2>
            </div>
          </div>

          <ChevronDown
            size={19}
            className={`shrink-0 text-[var(--color-text-muted)] transition-transform ${
              expandedSections.banking ? "rotate-180" : ""
            }`}
          />
        </button>

        {expandedSections.banking && (
          <div className="divide-y divide-[var(--color-border)]">
            <SettingsItem
              icon={<Building2 size={18} />}
              title="Banks"
              onClick={() =>
                navigate("/settings/banking/banks")
              }
            />
            <SettingsItem
              icon={<Building2 size={18} />}
              title="Payment Methods"
              onClick={() =>
                setShowPaymentMethods(true)
              }
            />
          </div>
        )}
      </section>
      {showPaymentMethods && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowPaymentMethods(false);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  Payment Methods
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowPaymentMethods(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                aria-label="Close payment methods"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[calc(90vh-100px)] overflow-y-auto p-6">
              <PaymentMethodsPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsItem({
  icon,
  title,
  onClick,
  disabled = false,
}: {
  icon: ReactNode;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group flex w-full items-center gap-4 py-4 pl-10 pr-6 text-left transition-colors ${
        disabled
          ? "cursor-default opacity-50"
          : "hover:bg-[var(--color-surface-hover)]"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          disabled
            ? "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
            : "bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium text-[var(--color-text)]">
          {title}
        </h3>
      </div>

      {!disabled && (
        <ChevronRight
          size={19}
          className="shrink-0 text-[var(--color-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-brand)]"
        />
      )}
    </button>
  );
}