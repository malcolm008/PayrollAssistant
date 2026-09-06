import type { ReactNode } from "react";

interface Tab {
    id: string;
    label: string;
    content: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
    const active = tabs.find((tab) => tab.id === activeTab);

    return (
        <div>
        <div className="flex gap-1 border-b border-[#242424]">
            {tabs.map((tab) => (
            <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`relative px-4 py-3 text-xs font-medium transition-colors ${
                activeTab === tab.id
                    ? "text-[#d4af37]"
                    : "text-[#666666] hover:text-[#f5f5f5]"
                }`}
            >
                {tab.label}

                {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d4af37]" />
                )}
            </button>
            ))}
        </div>

        <div className="pt-6">
            {active?.content}
        </div>
        </div>
    );
}