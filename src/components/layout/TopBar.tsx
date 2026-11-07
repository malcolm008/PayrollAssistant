import { Bell, Search } from "lucide-react";

interface TopBarProps {
  sidebarCollapsed: boolean;
}

export function TopBar({ sidebarCollapsed }: TopBarProps) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 h-16 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_95%,transparent)] backdrop-blur-xl transition-all duration-300 md:h-[76px] ${
        sidebarCollapsed ? "md:left-[76px]" : "md:left-[250px]"
      }`}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />

          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] pl-10 pr-4 text-sm text-[var(--color-text)] outline-none transition-all placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]/60 focus:ring-1 focus:ring-[var(--color-brand)]/20"
          />
        </div>

        {/* Right side */}
        <div className="ml-3 flex items-center gap-2 md:ml-6 md:gap-3">
          {/* Notifications */}
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
            aria-label="Notifications"
          >
            <Bell size={19} strokeWidth={1.8} />

            <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
          </button>

          <div className="h-7 w-px bg-[var(--color-border-strong)]" />

          {/* User */}
          <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--color-surface-hover)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-hover)] text-[10px] font-bold text-[var(--color-brand)]">
              AD
            </div>

            <div className="hidden text-left md:block">
              <div className="text-xs font-semibold text-[var(--color-text)]">
                Administrator
              </div>

              <div className="text-[10px] text-[var(--color-text-muted)]">
                Company Admin
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}