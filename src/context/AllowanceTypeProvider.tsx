import {
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { 
    AllowanceTypeContext,
    type AllowanceTypeContextValue,
} from "./AllowanceTypeContext";
import type { AllowanceType } from "../types/allowance";


const STORAGE_KEY = "payroll-allowance-types";

const defaultAllowanceTypes: AllowanceType[] = [
    {
        id: "ALT-001",
        code: "TRANSPORT",
        name: "Transport Allowance",
        description: "Allowance provided to support employee transportation costs.",
        calculationMethod: "Fixed Amount",
        defaultValue: 0,
        taxable: true,
        recurring: true,
        active: true,
    },
    {
        id: "ALT-002",
        code: "HOUSING",
        name: "Housing Allowance",
        description: "Allowance provided toward employee accommodation expenses.",
        calculationMethod: "Percentage of Basic Salary",
        defaultValue: 0,
        taxable: true,
        recurring: true,
        active: true,
    },
    {
        id: "ALT-003",
        code: "MEAL",
        name: "Meal Allowance",
        description: "Allowance provided for employee meal expenses.",
        calculationMethod: "Fixed Amount",
        defaultValue: 0,
        taxable: false,
        recurring: true,
        active: true,
    },
    {
        id: "ALT-004",
        code: "OVERTIME",
        name: "Overtime Allowance",
        description: "Allowance generated from approved overtime work.",
        calculationMethod: "Manual Entry",
        taxable: true,
        recurring: false,
        active: true,
    },
];

const createId = () => `ALT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function AllowanceTypeProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [allowanceTypes, setAllowanceTypes] = useState<AllowanceType[]>(
        () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);

            if (stored) {
            return JSON.parse(stored) as AllowanceType[];
            }
        } catch {
            // Ignore malformed local storage data.
        }

        return defaultAllowanceTypes;
        }
    );

    useEffect(() => {
        localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(allowanceTypes)
        );
    }, [allowanceTypes]);

    const value = useMemo<AllowanceTypeContextValue>(
        () => ({
        allowanceTypes,

        createAllowanceType: (payload) => {
            const newType: AllowanceType = {
            id: createId(),
            ...payload,
            active: true,
            };

            setAllowanceTypes((current) => [
            ...current,
            newType,
            ]);

            return newType;
        },

        updateAllowanceType: (id, updates) => {
            setAllowanceTypes((current) =>
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

        deleteAllowanceType: (id) => {
            setAllowanceTypes((current) =>
            current.filter((item) => item.id !== id)
            );
        },

        toggleAllowanceType: (id) => {
            setAllowanceTypes((current) =>
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
        [allowanceTypes]
    );

    return (
        <AllowanceTypeContext.Provider value={value}>
        {children}
        </AllowanceTypeContext.Provider>
    );
}
