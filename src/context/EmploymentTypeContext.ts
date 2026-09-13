import {
  createContext,
} from "react";
import type { EmploymentType } from "../types/employmentType";


export interface EmploymentTypeContextValue {
  employmentTypes: EmploymentType[];
  createEmploymentType: (
    employmentType: Omit<EmploymentType, "id">,
  ) => void;
  updateEmploymentType: (
    id: string,
    updates: Partial<EmploymentType>,
  ) => void;
  deleteEmploymentType: (id: string) => void;
  toggleEmploymentType: (id: string) => void;
}

export const EmploymentTypeContext = createContext<EmploymentTypeContextValue | undefined>(undefined);
