import { useState, type ReactNode } from "react";
import { AuthContext } from "./authContext"; // Import context from the other file
import type { User, Company } from "../types/authTypes";

// This file ONLY exports the AuthProvider component.
// It does NOT create or export the context.
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [company, setCompany] = useState<Company | null>(null);

    const login = async (username: string, password: string) => {
        if (!username || !password || !company) {
            return false;
        }

        setUser({
            id: "USR-001",
            name: "Administrator",
            username,
            role: "Administrator",
        });

        return true;
    };

    const logout = () => {
        setUser(null);
        setCompany(null);
    };

    const selectCompany = (selectedCompany: Company) => {
        setCompany(selectedCompany);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                company,
                isAuthenticated: !!user,
                login,
                logout,
                selectCompany,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}