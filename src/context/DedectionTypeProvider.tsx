import {
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { DeductionType } from "../types/deduction";

import {
    DeductionTypeContext,
    type DeductionTypeContextValue,
} from "./DeductionTypeContext";

const STORAGE_KEY = "payroll-deduction-types";

const defaultDeductionTypes: DeductionType[] = [
    {
        id: "DET-001",
        code: "PAYE",
        name: "PAYE",
        description: "Pay As You Earn income tax deduction.",
        calculationMethod: "Manual Entry",
        statutory: true,
        recurring: true,
        active: true,
    },
    {
        id: "DET-002",
        code: "SOCIAL",
        name: "Social Security",
        description: "Employee social security contribution.",
        calculationMethod: "Percentage of Basic Salary",
        defaultValue: 0,
        statutory: true,
        recurring: true,
        active: true,
    },
    {
        id: "DET-003",
        code: "LOAN",
        name: "Loan Repayment",
        description: "Deduction applied toward employee loan repayment.",
        calculationMethod: "Manual Entry",
        statutory: false,
        recurring: true,
        active: true,
    },
    {
        id: "DET-004",
        code: "ADVANCE",
        name: "Advance Recovery",
        description: "Recovery of employee advances through payroll.",
        calculationMethod: "Manual Entry",
        statutory: false,
        recurring: true,
        active: true,
    },
];

const createId = () =>
  `DET-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function DeductionTypeProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [deductionTypes, setDeductionTypes] = useState<DeductionType[]>(
        () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);

            if (stored) {
            return JSON.parse(stored) as DeductionType[];
            }
        } catch {
            // Ignore malformed local storage data.
        }

        return defaultDeductionTypes;
        }
    );

    useEffect(() => {
        localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(deductionTypes)
        );
    }, [deductionTypes]);

    const value = useMemo<DeductionTypeContextValue>(
        () => ({
        deductionTypes,

        createDeductionType: (payload) => {
            const newType: DeductionType = {
            id: createId(),
            ...payload,
            active: true,
            };

            setDeductionTypes((current) => [
            ...current,
            newType,
            ]);

            return newType;
        },

        updateDeductionType: (id, updates) => {
            setDeductionTypes((current) =>
            current.map((item) =>
                item.id === id
                ? {
                    ...item,
                    ...updates,
                    }
                : item
            )
            );
        },

        deleteDeductionType: (id) => {
            setDeductionTypes((current) =>
            current.filter((item) => item.id !== id)
            );
        },

        toggleDeductionType: (id) => {
            setDeductionTypes((current) =>
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
        }),
        [deductionTypes]
    );

    return (
        <DeductionTypeContext.Provider value={value}>
        {children}
        </DeductionTypeContext.Provider>
    );
}

