import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { initialEmployees } from "../data/employees";
import type { Employee } from "../types/employees";
import { EmployeeContext } from "./EmployeeContext";

const STORAGE_KEY = "payroll_employees";

function loadEmployees(): Employee[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return initialEmployees;
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return initialEmployees;
        }

        return parsed;
    } catch {
        return initialEmployees;
    }
}

export function EmployeeProvider({ children }: { children: ReactNode }) {
    const [employees, setEmployees] = useState<Employee[]>(loadEmployees);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    }, [employees]);

    const addEmployee = useCallback((employee: Employee) => {
        setEmployees((current) => [...current, employee]);
    }, []);

    const updateEmployee = useCallback((employee: Employee) => {
        setEmployees((current) => current.map((item) => item.id === employee.id ? employee : item));
    }, []);

    const deleteEmployee = useCallback((employeeId: string) => {
        setEmployees((current) => current.filter((employee) => employee.id !== employeeId));
    }, []);

    const getEmployee = useCallback((employeeId: string) => employees.find((employee) => employee.id === employeeId), [employees]);

    const value = useMemo(() => ({
        employees,
        addEmployee,
        updateEmployee,
        getEmployee,
        deleteEmployee,
    }), [
        employees,
        addEmployee,
        updateEmployee,
        getEmployee,
        deleteEmployee,
    ]);

    return (
        <EmployeeContext.Provider value={value}> {children} </EmployeeContext.Provider>
    );
}