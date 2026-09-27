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
import { defaultAllowanceTypes } from "../data/allowance";


const STORAGE_KEY = "payroll-allowance-types";


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
