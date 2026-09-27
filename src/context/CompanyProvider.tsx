import {
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type { CompanyInformation } from "../types/company";
import { CompanyContext } from "./CompanyContext";
import { DEFAULT_COMPANY } from "../data/company";

const STORAGE_KEY = "payroll_company_information";


export function CompanyProvider({
    children,
}: {
    children: ReactNode;
}) {
  const [company, setCompany] =
    useState<CompanyInformation>(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
          return {
            ...DEFAULT_COMPANY,
            ...JSON.parse(stored),
          };
        }
      } catch {
        // Ignore invalid localStorage data.
      }

      return DEFAULT_COMPANY;
    });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(company),
    );
  }, [company]);

  const updateCompany = useCallback(
    (updates: Partial<CompanyInformation>) => {
      setCompany((current) => ({
        ...current,
        ...updates,
      }));
    },
    [],
  );

  const resetCompany = useCallback(() => {
    setCompany(DEFAULT_COMPANY);
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        company,
        updateCompany,
        resetCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}