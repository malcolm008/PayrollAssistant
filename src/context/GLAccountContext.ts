import { createContext } from "react";
import type { GLAccount } from "../types/glAccount";

export interface GLAccountContextValue {
    accounts: GLAccount[];

    addAccount: (
        account: Omit<GLAccount, "id">
    ) => void;

    updateAccount: (
        id: string,
        account: Omit<GLAccount, "id">
    ) => void;

    deleteAccount: (id: string) => void;

    toggleAccountStatus: (id: string) => void;
}

export const GLAccountContext = createContext<GLAccountContextValue | undefined>(undefined);