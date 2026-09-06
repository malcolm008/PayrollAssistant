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
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[#2a2a2a] bg-[#0d0d0d] transition-all duration-300 ${
        collapsed ? "w-[76px]" : "w-[250px]"
      }`}
    >
      {/* Brand */}
      <div className="flex h-[76px] items-center border-b border-[#202020] px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d4af37] text-[#090909] shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <Wallet size={19} strokeWidth={2.5} />
          </div>

          {!collapsed && (
            <div className="overflow-hidden">
              <div className="whitespace-nowrap text-sm font-bold tracking-[0.18em] text-[#f5f5f5]">
                PAYROLL
              </div>

              <div className="whitespace-nowrap text-[10px] font-medium tracking-[0.3em] text-[#d4af37]">
                CORE
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#666666]">
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
                      ? "bg-[#171717] text-[#f5f5f5]"
                      : "text-[#888888] hover:bg-[#151515] hover:text-[#f5f5f5]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 h-6 w-[3px] rounded-r-full bg-[#d4af37]" />
                    )}

                    <Icon
                      size={19}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={`shrink-0 ${
                        isActive
                          ? "text-[#d4af37]"
                          : "text-[#777777] group-hover:text-[#d4af37]"
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
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#666666]">
            {!collapsed && "System"}
          </div>

          <button className="group relative flex w-full items-center rounded-lg px-3 py-3 text-sm text-[#888888] transition-all duration-200 hover:bg-[#151515] hover:text-[#f5f5f5]">
            <Settings
              size={19}
              strokeWidth={1.8}
              className="shrink-0 text-[#777777] group-hover:text-[#d4af37]"
            />

            {!collapsed && (
              <span className="ml-3 whitespace-nowrap">Settings</span>
            )}
          </button>
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-[#202020] p-3">
        <div
          className={`flex items-center rounded-lg bg-[#111111] ${
            collapsed ? "justify-center p-2" : "gap-3 p-3"
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#242424] text-xs font-semibold text-[#d4af37]">
            AD
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-[#f5f5f5]">
                Administrator
              </div>

              <div className="truncate text-[11px] text-[#666666]">
                System Admin
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[68px] flex h-6 w-6 items-center justify-center rounded-full border border-[#333333] bg-[#171717] text-[#888888] transition-colors hover:border-[#d4af37] hover:text-[#d4af37]"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight size={13} />
        ) : (
          <ChevronLeft size={13} />
        )}
      </button>
    </aside>
  );
}