import { useContext } from "react";
import { AccountAllocationContext } from "../context/AccountAllocationContext";

export function useAccountAllocations() {
    const context = useContext(AccountAllocationContext);

    if (!context) {
        throw new Error(
            "useAccountAllocations must be used within an AccountAllocationProvider"
        );
    }

    return context;
}