import {
  ArrowUpRight,
  Banknote,
  Clock3,
  Users,
  WalletCards,
} from "lucide-react";

const stats = [
  {
    label: "Total Employees",
    value: "1,284",
    change: "+4.8%",
    icon: Users,
  },
  {
    label: "Gross Payroll",
    value: "TZS 482.9M",
    change: "+8.4%",
    icon: Banknote,
  },
  {
    label: "Net Payroll",
    value: "TZS 361.4M",
    change: "+6.7%",
    icon: WalletCards,
  },
  {
    label: "Pending Payroll",
    value: "TZS 24.8M",
    change: "12 items",
    icon: Clock3,
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-brand)]">
          <span className="h-px w-6 bg-[var(--color-brand)]" />
          Overview
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Here's what's happening with your payroll today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="group rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] p-5 transition-all duration-200 hover:border-[var(--color-brand)]/30 hover:shadow-[0_0_24px_rgba(212,175,55,0.05)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                  <Icon size={19} strokeWidth={1.8} />
                </div>

                <ArrowUpRight
                  size={16}
                  className="text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-brand)]"
                />
              </div>

              <div className="mt-5">
                <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                  {stat.label}
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
                  {stat.value}
                </p>

                <p className="mt-2 text-[11px] text-[var(--color-success)]">
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main dashboard panels */}
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        {/* Payroll overview */}
        <div className="rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[var(--color-text)]">
                Payroll Overview
              </h2>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Monthly payroll expenditure
              </p>
            </div>

            <button className="rounded-lg border border-[var(--color-border-strong)] px-3 py-2 text-xs text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-brand)]/40 hover:text-[var(--color-brand)]">
              This year
            </button>
          </div>

          {/* Temporary chart area */}
          <div className="mt-8 flex h-[280px] items-end gap-3 border-b border-[var(--color-border-strong)] px-4 pb-0">
            {[45, 58, 52, 68, 61, 76, 72, 84, 78, 91, 87, 96].map(
              (height, index) => (
                <div
                  key={index}
                  className="group relative flex h-full flex-1 items-end"
                >
                  <div
                    style={{ height: `${height}%` }}
                    className="w-full rounded-t-md bg-[var(--color-brand-soft)] transition-all duration-300 group-hover:bg-[var(--color-brand)]"
                  />
                </div>
              ),
            )}
          </div>

          <div className="mt-3 flex justify-between px-4 text-[10px] text-[var(--color-text-muted)]">
            {[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>

        {/* Payroll status */}
        <div className="rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] p-6">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Payroll Status
            </h2>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Current processing overview
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {[
              ["Processed", "72%", "var(--color-success)"],
              ["Pending", "18%", "var(--color-brand)"],
              ["Draft", "10%", "var(--color-text-muted)"],
            ].map(([label, value, color]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-[var(--color-text-secondary)]">
                    {label}
                  </span>

                  <span className="text-[var(--color-text)]">
                    {value}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
                  <div
                    style={{
                      width: value,
                      backgroundColor: color,
                    }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-hover)] p-4">
            <div className="text-xs font-medium text-[var(--color-text-secondary)]">
              Current payroll
            </div>

            <div className="mt-1 text-xl font-semibold text-[var(--color-text)]">
              August 2026
            </div>

            <div className="mt-3 text-[11px] text-[var(--color-text-muted)]">
              Last updated today at 09:30
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}