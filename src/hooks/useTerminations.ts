import { useContext } from "react";
import { TerminationContext } from "../context/TerminationContext";

export function useTerminations() {
    const context = useContext(TerminationContext);

    if (!context) {
        throw new Error(
        "useTerminations must be used inside TerminationProvider",
        );
    }

    return context;
}