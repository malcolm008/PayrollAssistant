import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

import { NavLink } from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Employees",
    path: "/employees",
    icon: Users,
  },
  {
    label: "Attendance",
    path: "/attendance",
    icon: CalendarDays,
  },
  {
    label: "Payroll",
    path: "/payroll",
    icon: Wallet,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <>
      {/* Desktop / tablet sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-[var(--color-border-strong)] bg-[var(--color-surface)] transition-all duration-300 md:flex ${
          collapsed ? "w-[76px]" : "w-[250px]"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[76px] items-center border-b border-[var(--color-border)] px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand)] text-[var(--color-bg)] shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <Wallet size={19} strokeWidth={2.5} />
            </div>

            {!collapsed && (
              <div className="overflow-hidden">
                <div className="whitespace-nowrap text-sm font-bold tracking-[0.18em] text-[var(--color-text)]">
                  PAYROLL
                </div>

                <div className="whitespace-nowrap text-[10px] font-medium tracking-[0.3em] text-[var(--color-brand)]">
                  CORE
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            {!collapsed && "Workspace"}
          </div>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative flex w-full items-center rounded-lg px-3 py-3 text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--color-surface-hover)] text-[var(--color-text)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 h-6 w-[3px] rounded-r-full bg-[var(--color-brand)]" />
                      )}

                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.2 : 1.8}
                        className={`shrink-0 ${
                          isActive
                            ? "text-[var(--color-brand)]"
                            : "text-[var(--color-text-muted)] group-hover:text-[var(--color-brand)]"
                        }`}
                      />

                      {!collapsed && (
                        <span className="ml-3 whitespace-nowrap">
                          {item.label}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* System */}
          <div className="mt-8">
            <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              {!collapsed && "System"}
            </div>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `group relative flex w-full items-center rounded-lg px-3 py-3 text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--color-surface-hover)] text-[var(--color-text)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 h-6 w-[3px] rounded-r-full bg-[var(--color-brand)]" />
                  )}

                  <Settings
                    size={19}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={`shrink-0 ${
                      isActive
                        ? "text-[var(--color-brand)]"
                        : "text-[var(--color-text-muted)] group-hover:text-[var(--color-brand)]"
                    }`}
                  />

                  {!collapsed && (
                    <span className="ml-3 whitespace-nowrap">Settings</span>
                  )}
                </>
              )}
            </NavLink>
          </div>
        </nav>

        {/* User */}
        <div className="border-t border-[var(--color-border)] p-3">
          <div
            className={`flex items-center rounded-lg bg-[var(--color-surface-raised)] ${
              collapsed ? "justify-center p-2" : "gap-3 p-3"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-brand)]">
              AD
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-[var(--color-text)]">
                  Administrator
                </div>

                <div className="truncate text-[11px] text-[var(--color-text-muted)]">
                  System Admin
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collapse button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-[68px] flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={13} />
          ) : (
            <ChevronLeft size={13} />
          )}
        </button>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-[var(--color-border-strong)] bg-[var(--color-surface)] pb-[env(safe-area-inset-bottom)] md:hidden">
        {[...navigation, { label: "Settings", path: "/settings", icon: Settings }].map(
          (item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className="relative flex flex-1 flex-col items-center justify-center gap-1"
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute top-0 h-[3px] w-8 rounded-b-full bg-[var(--color-brand)]" />
                    )}

                    <Icon
                      size={21}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={
                        isActive
                          ? "text-[var(--color-brand)]"
                          : "text-[var(--color-text-muted)]"
                      }
                    />

                    <span
                      className={`text-[10px] font-medium leading-none ${
                        isActive
                          ? "text-[var(--color-brand)]"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          }
        )}
      </nav>
    </>
  );
}