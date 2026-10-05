import type { ReactNode } from "react";
import { ShieldCheck, Wallet } from "lucide-react";

interface AuthLayoutProps {
    children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
        {/* Background glow */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[var(--color-brand)]/[0.04] blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[var(--color-brand)]/[0.025] blur-[120px]" />

        {/* Grid */}
        <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
            backgroundImage:
                "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            }}
        />

        <div className="relative flex min-h-screen flex-col">
            {/* Header */}
            <header className="flex h-20 items-center justify-between border-b border-[var(--color-border)] px-6 lg:px-10">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand)] text-[var(--color-bg)]">
                <Wallet size={18} strokeWidth={2.5} />
                </div>

                <div>
                <div className="text-sm font-bold tracking-[0.18em] text-[var(--color-text)]">
                    PAYROLL
                </div>

                <div className="text-[9px] font-medium tracking-[0.3em] text-[var(--color-brand)]">
                    CORE
                </div>
                </div>
            </div>

            <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)] sm:flex">
                <ShieldCheck size={14} />
                Secure Payroll Platform
            </div>
            </header>

            {/* Content */}
            <main className="flex flex-1 items-center justify-center px-5 py-12">
            {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-[var(--color-border)] px-6 py-5 text-center text-[10px] tracking-wide text-[var(--color-text-disabled)]">
            Payroll Core · Secure Workforce Management
            </footer>
        </div>
        </div>
    );
}