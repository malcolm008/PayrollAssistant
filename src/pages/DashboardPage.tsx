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
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#d4af37]">
          <span className="h-px w-6 bg-[#d4af37]" />
          Overview
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-[#f5f5f5]">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-[#777777]">
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
              className="group rounded-xl border border-[#242424] bg-[#111111] p-5 transition-all duration-200 hover:border-[#3a3320] hover:shadow-[0_0_24px_rgba(212,175,55,0.05)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1810] text-[#d4af37]">
                  <Icon size={19} strokeWidth={1.8} />
                </div>

                <ArrowUpRight
                  size={16}
                  className="text-[#555555] transition-colors group-hover:text-[#d4af37]"
                />
              </div>

              <div className="mt-5">
                <p className="text-xs font-medium text-[#777777]">
                  {stat.label}
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-[#f5f5f5]">
                  {stat.value}
                </p>

                <p className="mt-2 text-[11px] text-[#35c759]">
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
        <div className="rounded-xl border border-[#242424] bg-[#111111] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#f5f5f5]">
                Payroll Overview
              </h2>

              <p className="mt-1 text-xs text-[#666666]">
                Monthly payroll expenditure
              </p>
            </div>

            <button className="rounded-lg border border-[#2a2a2a] px-3 py-2 text-xs text-[#888888] transition-colors hover:border-[#d4af37]/40 hover:text-[#d4af37]">
              This year
            </button>
          </div>

          {/* Temporary chart area */}
          <div className="mt-8 flex h-[280px] items-end gap-3 border-b border-[#242424] px-4 pb-0">
            {[45, 58, 52, 68, 61, 76, 72, 84, 78, 91, 87, 96].map(
              (height, index) => (
                <div
                  key={index}
                  className="group relative flex h-full flex-1 items-end"
                >
                  <div
                    style={{ height: `${height}%` }}
                    className="w-full rounded-t-md bg-[#25200f] transition-all duration-300 group-hover:bg-[#d4af37]"
                  />
                </div>
              ),
            )}
          </div>

          <div className="mt-3 flex justify-between px-4 text-[10px] text-[#555555]">
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
        <div className="rounded-xl border border-[#242424] bg-[#111111] p-6">
          <div>
            <h2 className="text-sm font-semibold text-[#f5f5f5]">
              Payroll Status
            </h2>

            <p className="mt-1 text-xs text-[#666666]">
              Current processing overview
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {[
              ["Processed", "72%", "#35c759"],
              ["Pending", "18%", "#d4af37"],
              ["Draft", "10%", "#666666"],
            ].map(([label, value, color]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-[#999999]">{label}</span>
                  <span className="text-[#f5f5f5]">{value}</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#222222]">
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

          <div className="mt-10 rounded-lg border border-[#2a2a2a] bg-[#151515] p-4">
            <div className="text-xs font-medium text-[#888888]">
              Current payroll
            </div>

            <div className="mt-1 text-xl font-semibold text-[#f5f5f5]">
              August 2026
            </div>

            <div className="mt-3 text-[11px] text-[#666666]">
              Last updated today at 09:30
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}