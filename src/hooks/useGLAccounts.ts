import { useContext } from "react";
import { GLAccountContext } from "../context/GLAccountContext";

export function useGLAccounts() {
    const context = useContext(GLAccountContext);

    if (!context) {
        throw new Error(
            "useGLAccounts must be used within a GLAccountProvider"
        );
    }

    return context;
}