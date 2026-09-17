import { useState } from "react";
import {
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
      "A clean light interface with the Payroll Assistant Core gold Accent.",
    icon: Sun,
  },
];

type SectionKey = "appearance" | "company" | "payroll";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [expandedSections, setExpandedSections] = useState<
    Record<SectionKey, boolean>
  >({
    appearance: true,
    company: true,
    payroll: true,
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

        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Manage your application preferences and payroll system
          configuration.
        </p>
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

              <p className="text-sm text-[var(--color-text-secondary)]">
                Customize how Payroll Core looks on your device.
              </p>
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

              <p className="text-sm text-[var(--color-text-secondary)]">
                Configure your organization's identity, structure and employment settings.
              </p>
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
              description="Configure company name, business details, addresses and contact information."
              onClick={() =>
                navigate("/settings/company")
              }
            />

            <SettingsItem
              icon={<Users size={19} />}
              title="Job Titles & Departments"
              description="Configure the organizational job titles and departments used throughout the payroll system."
              onClick={() =>
                navigate("/settings/company/job-titles-departments")
              }
            />

            <SettingsItem
              icon={<BriefcaseBusiness size={19} />}
              title="Employment Types"
              description="Configure the employment categories available for employee records."
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

              <p className="text-sm text-[var(--color-text-secondary)]">
                Configure the rules and options used throughout payroll
                processing.
              </p>
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
              description="Configure employee advance types, repayment methods, approval requirements and advance limits."
              onClick={() =>
                navigate("/settings/payroll/advance-types")
              }
            />

            <SettingsItem
              icon={<CircleDollarSign size={19} />}
              title="Allowance Types"
              description="Configure the allowances that can be assigned to employees and included during payroll processing."
              onClick={() =>
                navigate("/settings/payroll/allowance-types")
              }
            />

            <SettingsItem
              icon={<ShieldCheck size={19} />}
              title="Deduction Types"
              description="Configure statutory and non-statutory deductions that can be applied during payroll processing."
              onClick={() =>
                navigate("/settings/payroll/deduction-types")
              }
            />

            <SettingsItem
              icon={<CalendarDays size={19} />}
              title="Leave Types"
              description="Configure employee leave categories, payment rules and leave balance settings."
              onClick={() =>
                navigate("/settings/payroll/leave-types")
              }
            />

            <SettingsItem
              icon={<Banknote size={19} />}
              title="Loan Types"
              description="Configure employee loan categories, repayment methods, limits and approval requirements."
              onClick={() =>
                navigate("/settings/payroll/loan-types")
              }
            />
          </div>
        )}
      </section>
    </div>
  );
}

function SettingsItem({
  icon,
  title,
  description,
  onClick,
  disabled = false,
}: {
  icon: ReactNode;
  title: string;
  description: string;
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

        <p className="mt-0.5 max-w-3xl text-xs leading-5 text-[var(--color-text-secondary)]">
          {description}
        </p>
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