import { Bell, Search } from "lucide-react";

interface TopBarProps {
  sidebarCollapsed: boolean;
}

export function TopBar({ sidebarCollapsed }: TopBarProps) {
  return (
    <header
      className={`fixed right-0 top-0 z-30 h-[76px] border-b border-[#202020] bg-[#090909]/95 backdrop-blur-xl transition-all duration-300 ${
        sidebarCollapsed ? "left-[76px]" : "left-[250px]"
      }`}
    >
      <div className="flex h-full items-center justify-between px-8">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]"
          />

          <input
            type="text"
            placeholder="Search employees, payroll, reports..."
            className="h-10 w-full rounded-lg border border-[#252525] bg-[#111111] pl-10 pr-4 text-sm text-[#f5f5f5] outline-none transition-all placeholder:text-[#555555] focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/20"
          />
        </div>

        {/* Right side */}
        <div className="ml-6 flex items-center gap-3">
          {/* Notifications */}
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-[#888888] transition-colors hover:border-[#2a2a2a] hover:bg-[#151515] hover:text-[#f5f5f5]"
            aria-label="Notifications"
          >
            <Bell size={19} strokeWidth={1.8} />

            <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
          </button>

          <div className="h-7 w-px bg-[#252525]" />

          {/* User */}
          <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#151515]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#242424] text-[10px] font-bold text-[#d4af37]">
              AD
            </div>

            <div className="hidden text-left md:block">
              <div className="text-xs font-semibold text-[#f5f5f5]">
                Administrator
              </div>

              <div className="text-[10px] text-[#666666]">
                Company Admin
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}