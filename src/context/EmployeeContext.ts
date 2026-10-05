import { createContext, useContext } from "react";
import type { Employee } from "../types/employees";

export interface EmployeeContextValue {
    employees: Employee[];
    addEmployee: (employee: Employee) => void;
    updateEmployee: (employee: Employee) => void;
    deleteEmployee: (employeeId: string) => void;

    getEmployee: (employeeId: string) => Employee | undefined;
}

export function useEmployees() {
    const context = useContext(EmployeeContext);

    if (!context) {
        throw new Error("useEmployees must be used inside EmployeeProvider");
    }

    return context;
}

export const EmployeeContext = createContext<EmployeeContextValue | undefined>(undefined);