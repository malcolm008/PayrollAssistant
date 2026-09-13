import {
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type { Department } from "../types/department";
import { DepartmentContext } from "./DepartmentContext";

const STORAGE_KEY = "payroll_departments";

const DEFAULT_DEPARTMENTS: Department[] = [
    {
        id: "dept-1",
        code: "ADMIN",
        name: "Administration",
        description: "Administrative operations.",
        active: true,
    },
    {
        id: "dept-2",
        code: "FIN",
        name: "Finance",
        description: "Financial and accounting operations.",
        active: true,
    },
    {
        id: "dept-3",
        code: "HR",
        name: "Human Resources",
        description: "Human resources and employee management.",
        active: true,
    },
    {
        id: "dept-4",
        code: "IT",
        name: "Information Technology",
        description: "Technology and systems operations.",
        active: true,
    },
    {
        id: "dept-5",
        code: "OPS",
        name: "Operations",
        description: "General operational activities.",
        active: true,
    },
];


function createId(prefix: string) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

export function DepartmentProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [departments, setDepartments] =
        useState<Department[]>(() => {
        try {
            const stored =
            localStorage.getItem(STORAGE_KEY);

            if (stored) {
            return JSON.parse(stored);
            }
        } catch {
            // Ignore invalid localStorage data.
        }

        return DEFAULT_DEPARTMENTS;
        });

    useEffect(() => {
        localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(departments),
        );
    }, [departments]);

    const createDepartment = useCallback(
        (department: Omit<Department, "id">) => {
        setDepartments((current) => [
            ...current,
            {
            ...department,
            id: createId("dept"),
            },
        ]);
        },
        [],
    );

    const updateDepartment = useCallback(
        (
        id: string,
        updates: Partial<Department>,
        ) => {
        setDepartments((current) =>
            current.map((item) =>
            item.id === id
                ? { ...item, ...updates }
                : item,
            ),
        );
        },
        [],
    );

    const deleteDepartment = useCallback((id: string) => {
        setDepartments((current) =>
        current.filter((item) => item.id !== id),
        );
    }, []);

    const toggleDepartment = useCallback((id: string) => {
        setDepartments((current) =>
        current.map((item) =>
            item.id === id
            ? { ...item, active: !item.active }
            : item,
        ),
        );
    }, []);

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
    );
}