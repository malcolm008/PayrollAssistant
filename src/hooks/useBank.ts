import { useContext } from "react";
import { BankContext } from "../context/BankContext";

export function useBanks() {
    const context = useContext(BankContext);

    if (!context) {
        throw new Error("useBanks must be within a BankProvider");
    }

    return context;
}