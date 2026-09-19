import { createContext } from "react";

import type { Department } from "../types/department";

export interface DepartmentContextValue {
  departments: Department[];

  createDepartment: (
    data: Omit<Department, "id">
  ) => void;

  updateDepartment: (
    id: string,
    data: Omit<Department, "id">,
  ) => void;

  deleteDepartment: (id: string) => void;

  toggleDepartment: (id: string) => void;
}

export const DepartmentContext = createContext<DepartmentContextValue | undefined>(undefined);