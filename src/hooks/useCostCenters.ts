import { useContext } from "react";
import { CostCenterContext } from "../context/CostCenterContext";

export function useCostCenters() {
    const context = useContext(CostCenterContext);

    if (!context) {
        throw new Error(
            "useCostCenters must be used within a CostCenterProvider"
        );
    }

    return context;
}