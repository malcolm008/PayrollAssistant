import { useContext } from "react";
import { AuthContext } from "../context/authContext"; // Import context from the dedicated file

// This file ONLY exports the useAuth hook.
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}