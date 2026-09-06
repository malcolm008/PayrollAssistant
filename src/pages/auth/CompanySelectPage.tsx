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
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/[0.06] text-[#d4af37]">
          <Building2 size={25} />
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
          Welcome
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Select your company
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#666666]">
          Select the organization you are authorized to access.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-[#202020] p-5">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555555]"
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

        <div className="divide-y divide-[#202020]">
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
                    ? "bg-[#d4af37]/[0.04]"
                    : "hover:bg-[#151515]"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    selected
                      ? "bg-[#d4af37] text-[#090909]"
                      : "bg-[#222222] text-[#d4af37]"
                  }`}
                >
                  {company.code.slice(0, 2)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-[#f5f5f5]">
                    {company.name}
                  </div>

                  <div className="mt-1 text-xs text-[#666666]">
                    {company.code} · {company.employees} employees
                  </div>
                </div>

                <ArrowRight
                  size={16}
                  className={
                    selected
                      ? "text-[#d4af37]"
                      : "text-[#555555]"
                  }
                />
              </button>
            );
          })}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="p-12 text-center text-sm text-[#666666]">
            No authorized companies found.
          </div>
        )}

        <div className="flex justify-end border-t border-[#202020] p-5">
          <Button
            disabled={!selectedCompany}
            onClick={handleContinue}
          >
            Continue
            <ArrowRight size={16} />
          </Button>
        </div>
      </Card>

      <p className="mt-5 text-center text-[11px] text-[#444444]">
        Only organizations associated with your account are
        displayed.
      </p>
    </div>
  );
}