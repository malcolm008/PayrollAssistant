import { createContext } from "react";
import type { Bank } from "../types/bank";
import type { BankBranch } from "../types/bankBranch";

export interface BankContextValue {
    banks: Bank[];
    branches: BankBranch[];

    createBank: (data: Omit<Bank, "id">) => void;
    updateBank: (id: string, data: Omit<Bank, "id">) => void;
    deleteBank: (id: string) => void;
    toggleBank: (id: string) => void;

    createBranch: (data: Omit<BankBranch, "id">) => void;
    updateBranch: (
        id: string,
        data: Omit<BankBranch, "id">
    ) => void;
    deleteBranch: (id: string) => void;
    toggleBranch: (id: string) => void;
}

export const BankContext = createContext<BankContextValue | undefined>(undefined);