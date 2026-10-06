import {useState, useMemo, useEffect, type ReactNode } from "react";
import { TerminationContext } from "./TerminationContext";
import type { EmployeeTermination } from "../types/termination";

const STORAGE_KEY = "payroll_employee_terminations";

function loadTerminations(): EmployeeTermination[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function TerminationProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [terminations, setTerminations] = useState<EmployeeTermination[]>(loadTerminations);

    useEffect(() => {
        localStorage.setItem( STORAGE_KEY, JSON.stringify(terminations));
    }, [terminations]);

    const addTermination = (
        termination: EmployeeTermination,
    ) => {
        setTerminations((current) => [...current, termination]);
    };

    const getTermination = (employeeId: string) => terminations.find((termination) => termination.employeeId === employeeId);

    const deleteTermination = (terminationId: string) => {
        setTerminations((current) => current.filter((termination) => termination.id !== terminationId));
    };

    const value = useMemo(() => ({
        terminations,
        addTermination,
        getTermination,
        deleteTermination,
    }), [terminations]);
    
    return (
        <TerminationContext.Provider value={value}>
        {children}
        </TerminationContext.Provider>
    );
}
