import { createContext } from "react";
import type { Employee } from "../types/employees";

export interface EmployeeContextValue {
    employees: Employee[];
    addEmployee: (employee: Employee) => void;
    updateEmployee: (employee: Employee) => void;
    deleteEmployee: (employeeId: string) => void;

    getEmployee: (employeeId: string) => Employee | undefined;
}

export const EmployeeContext = createContext<EmployeeContextValue | undefined>(undefined);