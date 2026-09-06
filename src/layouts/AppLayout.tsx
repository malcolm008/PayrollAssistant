import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { TopBar } from "../components/layout/TopBar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#090909] text-[#f5f5f5]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((value) => !value)}
      />

      <TopBar sidebarCollapsed={sidebarCollapsed} />

      <main
        className={`min-h-screen pt-[76px] transition-all duration-300 ${
          sidebarCollapsed ? "pl-[76px]" : "pl-[250px]"
        }`}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}