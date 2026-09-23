import { createContext } from "react";
import type { CostCenter } from "../types/costCenter";

export interface CostCenterContextValue {
    costCenters: CostCenter[];

    addCostCenter: (
        costCenter: Omit<CostCenter, "id">
    ) => void;

    updateCostCenter: (
        id: string,
        costCenter: Omit<CostCenter, "id">
    ) => void;

    deleteCostCenter: (id: string) => void;

    toggleCostCenterStatus: (id: string) => void;
}

export const CostCenterContext = createContext<CostCenterContextValue | undefined>(undefined);