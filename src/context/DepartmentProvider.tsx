import {
    useState,
    useEffect,
    type ReactNode,
} from  "react";

import type { Department } from "../types/department";
import { DepartmentContext } from "./DepartmentContext";
import { defaultDepartments } from "../data/department";

const STORAGE_KEY = "payroll_departments";

function generateId() {
    if ( typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `department-${Date.now()}`;
}

export function DepartmentProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [departments, setDepartments] = useState<Department[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return defaultDepartments;
        }

        try {
            return JSON.parse(stored) as Department[];
        } catch {
            return defaultDepartments;
        }
    });

    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(departments),
        );
    }, [departments]);

    const createDepartment = (
        data: Omit<Department, "id">,
    ) => {
        setDepartments((current) => [
            ...current,
            {
                ...data,
                id: generateId(),
            },
        ]);
    };

    const updateDepartment = (
        id: string,
        data: Omit<Department, "id">,
    ) => {
        setDepartments((current) => current.map((department) => department.id === id ? {
            ...data,
            id,
        }: department));
    };

    const deleteDepartment = (id: string) => {
        setDepartments((current) => current.filter((department) => department.id !== id));
    };

    const toggleDepartment = (id: string) => {
        setDepartments((current) =>
        current.map((department) =>
            department.id === id
            ? {
                ...department,
                active: !department.active,
                }
            : department,
        ),
        );
    };

    return (
        <DepartmentContext.Provider
        value={{
            departments,
            createDepartment,
            updateDepartment,
            deleteDepartment,
            toggleDepartment,
        }}
        >
        {children}
        </DepartmentContext.Provider>
    )
}