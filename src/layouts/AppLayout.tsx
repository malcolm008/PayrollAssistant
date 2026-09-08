import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { TopBar } from "../components/layout/TopBar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((value) => !value)}
      />

      <TopBar sidebarCollapsed={sidebarCollapsed} />

      <main
        className={`min-h-screen pt-16 pb-16 transition-all duration-300 md:pb-0 md:pt-[76px] ${
          sidebarCollapsed ? "md:pl-[76px]" : "md:pl-[250px]"
        }`}
      >
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}