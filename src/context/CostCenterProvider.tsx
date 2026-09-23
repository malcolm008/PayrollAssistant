import {
    useState,
    useEffect,
    useCallback,
    useMemo,
    type ReactNode
} from "react";

import type { CostCenter } from "../types/costCenter";
import { CostCenterContext } from "./CostCenterContext";

const STORAGE_KEY = "payroll_cost_centers";

function normalizeCostCenter(
    costCenter: Partial<CostCenter>
): CostCenter {
    return {
        id: costCenter.id ?? crypto.randomUUID(),
        code: costCenter.code ?? "",
        name: costCenter.name ?? "",
        description: costCenter.description ?? "",
        active: costCenter.active ?? true,
    };
}

function loadCostCenters(): CostCenter[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.map(normalizeCostCenter);
    } catch {
        return [];
    }
}

export function CostCenterProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [costCenters, setCostCenters] =
        useState<CostCenter[]>(loadCostCenters);

    useEffect(() => {
        localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(costCenters)
        );
    }, [costCenters]);

    const addCostCenter = useCallback(
        (costCenter: Omit<CostCenter, "id">) => {
        const newCostCenter: CostCenter = {
            ...costCenter,
            id: crypto.randomUUID(),
        };

        setCostCenters((current) => [
            ...current,
            newCostCenter,
        ]);
        },
        []
    );

    const updateCostCenter = useCallback(
        (
        id: string,
        costCenter: Omit<CostCenter, "id">
        ) => {
        setCostCenters((current) =>
            current.map((item) =>
            item.id === id
                ? {
                    ...costCenter,
                    id,
                }
                : item
            )
        );
        },
        []
    );

    const deleteCostCenter = useCallback((id: string) => {
        setCostCenters((current) =>
        current.filter((item) => item.id !== id)
        );
    }, []);

    const toggleCostCenterStatus = useCallback(
        (id: string) => {
        setCostCenters((current) =>
            current.map((item) =>
            item.id === id
                ? {
                    ...item,
                    active: !item.active,
                }
                : item
            )
        );
        },
        []
    );

    const value = useMemo(
        () => ({
        costCenters,
        addCostCenter,
        updateCostCenter,
        deleteCostCenter,
        toggleCostCenterStatus,
        }),
        [
        costCenters,
        addCostCenter,
        updateCostCenter,
        deleteCostCenter,
        toggleCostCenterStatus,
        ]
    );

    return (
        <CostCenterContext.Provider value={value}>
        {children}
        </CostCenterContext.Provider>
    );
}