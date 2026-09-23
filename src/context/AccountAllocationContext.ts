import { createContext } from "react";
import type { AccountAllocation } from "../types/accountAllocation";

export interface AccountAllocationContextValue {
    allocations: AccountAllocation[];

    addAllocation: (
        allocation: Omit<AccountAllocation, "id">
    ) => void;

    updateAllocation: (
        id: string,
        allocation: Omit<AccountAllocation, "id">
    ) => void;

    deleteAllocation: (id: string) => void;

    toggleAllocationStatus: (id: string) => void;
}

export const AccountAllocationContext = createContext<AccountAllocationContextValue | undefined>(undefined);