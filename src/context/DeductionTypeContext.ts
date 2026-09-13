import { createContext } from "react";
import type { DeductionType } from "../types/deduction";

export interface CreateDeductionPayload {
    code: string;
    name: string;
    description: string;
    calculationMethod: DeductionType["calculationMethod"];
    defaultValue?: number;
    statutory: boolean;
    recurring: boolean;
}

export interface DeductionTypeContextValue {
    deductionTypes: DeductionType[];

    createDeductionType: (
        payload: CreateDeductionPayload
    ) => DeductionType;

    updateDeductionType: (
        id: string,
        updates: Partial<DeductionType>
    ) => void;

    deleteDeductionType: (id: string) => void;

    toggleDeductionType: (id: string) => void;
}

export const DeductionTypeContext = createContext<DeductionTypeContextValue | undefined>(
    undefined
);