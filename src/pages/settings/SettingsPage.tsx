import {
  ChevronRight,
  CircleDollarSign,
  Moon,
  Settings2,
  ShieldCheck,
  Sun,
  WalletCards,
  Check,
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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

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
        <div className="border-b border-[var(--color-border)] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <Sun size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-[var(--color-text)]">
                Appearance
              </h2>

              <p className="text-sm text-[var(--color-text-secondary)]">
                Customize how Payroll Core looks on your device.
              </p>
            </div>
          </div>
        </div>

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
      </section>

      {/* PAYROLL CONFIGURATION */}
      <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border)] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <Settings2 size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-[var(--color-text)]">
                Payroll Configuration
              </h2>

              <p className="text-sm text-[var(--color-text-secondary)]">
                Configure the rules and options used throughout payroll
                processing.
              </p>
            </div>
          </div>
        </div>

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
            icon={<Settings2 size={19} />}
            title="Leave Types"
            description="Configure employee leave categories and related payroll rules."
            disabled
          />

          <SettingsItem
            icon={<Settings2 size={19} />}
            title="Loan Types"
            description="Configure employee loan categories and repayment rules."
            disabled
          />
        </div>
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
      className={`group flex w-full items-center gap-4 px-6 py-5 text-left transition-colors ${
        disabled
          ? "cursor-default opacity-50"
          : "hover:bg-[var(--color-surface-hover)]"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          disabled
            ? "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
            : "bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-[var(--color-text)]">
          {title}
        </h3>

        <p className="mt-1 max-w-3xl text-sm leading-5 text-[var(--color-text-secondary)]">
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