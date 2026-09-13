import { 
    createContext,
} from "react";
import type { CompanyInformation } from "../types/company";

export interface CompanyContextValue {
    company: CompanyInformation;
    updateCompany: (
        updates: Partial<CompanyInformation>,
    ) => void;
    resetCompany: () => void;
}

export const CompanyContext = createContext<CompanyContextValue | undefined>(undefined);