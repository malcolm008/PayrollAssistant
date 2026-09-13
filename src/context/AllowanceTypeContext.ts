import { createContext } from "react";
import type { AllowanceType } from "../types/allowance";

export interface CreateAllowancePayload {
    code: string;
    name: string;
    description: string;
    calculationMethod: AllowanceType["calculationMethod"];
    defaultValue?: number;
    taxable: boolean;
    recurring: boolean;
}

export interface AllowanceTypeContextValue {
    allowanceTypes: AllowanceType[];

    createAllowanceType: (
        payload: CreateAllowancePayload
    ) => AllowanceType;

    updateAllowanceType: (
        id: string,
        updates: Partial<AllowanceType>
    ) => void;

    deleteAllowanceType: (id: string) => void;

    toggleAllowanceType: (id: string) => void;
}

export const AllowanceTypeContext =
  createContext<AllowanceTypeContextValue | undefined>(
    undefined
  );