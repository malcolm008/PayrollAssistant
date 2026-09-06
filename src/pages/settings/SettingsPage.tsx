import { Moon, Sun, Check } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

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
    description: "The default Payroll Core dark interface.",
    icon: Moon,
  },
  {
    id: "light",
    name: "Light",
    description: "A clean light interface with the Payroll Core gold accent.",
    icon: Sun,
  },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">
          Settings
        </h1>

        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Manage your application preferences and system settings.
        </p>
      </div>

      {/* Appearance */}
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
    </div>
  );
}