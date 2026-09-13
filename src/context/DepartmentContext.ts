import { createContext } from "react";
import type { Department } from "../types/department";

export interface DepartmentContextValue {
  departments: Department[];
  createDepartment: (
    department: Omit<Department, "id">,
  ) => void;
  updateDepartment: (
    id: string,
    updates: Partial<Department>,
  ) => void;
  deleteDepartment: (id: string) => void;
  toggleDepartment: (id: string) => void;
}

export const DepartmentContext = createContext<DepartmentContextValue | undefined>(undefined);