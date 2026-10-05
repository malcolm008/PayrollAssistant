import {
  ArrowRight,
  Building2,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { companies, type Company } from "../../data/companies";

interface CompanySelectPageProps {
  onSelect: (company: Company) => void;
}

export function CompanySelectPage({
  onSelect,
}: CompanySelectPageProps) {
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] =
    useState<Company | null>(null);

  const filteredCompanies = companies.filter((company) => {
    const value = search.toLowerCase();

    return (
      company.name.toLowerCase().includes(value) ||
      company.code.toLowerCase().includes(value)
    );
  });

  const handleContinue = () => {
    if (selectedCompany) {
      onSelect(selectedCompany);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-brand)]/20 bg-[var(--color-brand)]/[0.06] text-[var(--color-brand)]">
          <Building2 size={25} />
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand)]">
          Welcome
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text)] sm:text-3xl">
          Select your company
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">
          Select the organization you are authorized to access.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-[var(--color-border)] p-5">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />

            <Input
              placeholder="Search company..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="pl-10"
            />
          </div>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {filteredCompanies.map((company) => {
            const selected =
              selectedCompany?.id === company.id;

            return (
              <button
                key={company.id}
                onClick={() =>
                  setSelectedCompany(company)
                }
                className={`flex w-full items-center gap-4 p-5 text-left transition-colors ${
                  selected
                    ? "bg-[var(--color-brand)]/[0.04]"
                    : "hover:bg-[var(--color-surface-hover)]"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    selected
                      ? "bg-[var(--color-brand)] text-[var(--color-bg)]"
                      : "bg-[var(--color-border-strong)] text-[var(--color-brand)]"
                  }`}
                >
                  {company.code.slice(0, 2)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-[var(--color-text)]">
                    {company.name}
                  </div>

                  <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {company.code} · {company.employees} employees
                  </div>
                </div>

                <ArrowRight
                  size={16}
                  className={
                    selected
                      ? "text-[var(--color-brand)]"
                      : "text-[var(--color-text-muted)]"
                  }
                />
              </button>
            );
          })}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="p-12 text-center text-sm text-[var(--color-text-muted)]">
            No authorized companies found.
          </div>
        )}

        <div className="flex justify-end border-t border-[var(--color-border)] p-5">
          <Button
            disabled={!selectedCompany}
            onClick={handleContinue}
          >
            Continue
            <ArrowRight size={16} />
          </Button>
        </div>
      </Card>

      <p className="mt-5 text-center text-[11px] text-[var(--color-text-disabled)]">
        Only organizations associated with your account are
        displayed.
      </p>
    </div>
  );
}