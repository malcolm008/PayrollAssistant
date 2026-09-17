import { createContext } from "react";
import  type { LoanType } from "../types/loan";

export interface LoanTypeContextValue {
    loanTypes: LoanType[];

    createLoanType: (
        loanType: Omit<LoanType, "id">,
    ) => void;

    updateLoanType: (
        id: string,
        updates: Partial<LoanType>,
    ) => void;

    deleteLoanType: (id: string) => void;

    toggleLoanType: (id: string) => void;
}

export const LoanTypeContext =  createContext<LoanTypeContextValue | undefined>(undefined);
