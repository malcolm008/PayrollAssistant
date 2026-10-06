import { createContext } from "react";

import type { EmployeeTermination } from "../types/termination";

export interface TerminationContextValue {
    terminations: EmployeeTermination[];

    addTermination: ( termination: EmployeeTermination ) => void;

    getTermination: ( employeeId: string ) => EmployeeTermination | undefined;

    deleteTermination: ( terminationId: string ) => void;
}

export const TerminationContext = createContext<TerminationContextValue | undefined>(undefined);