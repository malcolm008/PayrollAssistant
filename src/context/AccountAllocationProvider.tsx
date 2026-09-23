import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from "react";

import type { AccountAllocation } from "../types/accountAllocation";
import { AccountAllocationContext } from "./AccountAllocationContext";

const STORAGE_KEY =  "payroll_account_allocations";

function normalizeAllocation(
    allocation: Partial<AccountAllocation>
): AccountAllocation {
    return {
        id: allocation.id ?? crypto.randomUUID(),
        code: allocation.code ?? "",
        description: allocation.description ?? "",
        allocationType: allocation.allocationType ?? "other",
        costCenterId: allocation.costCenterId ?? "",
        debitGLAccountId: allocation.debitGLAccountId ?? "",
        creditGLAccountId: allocation.creditGLAccountId ?? "",
        active: allocation.active ?? true,
    };
}

function loadAllocations(): AccountAllocation[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray) {
            return [];
        }

        return parsed.map(normalizeAllocation);
    } catch {
        return [];
    }
}

export function AccountAllocationProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [allocations, setAllocations] =
        useState<AccountAllocation[]>(loadAllocations);

    useEffect(() => {
        localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(allocations)
        );
    }, [allocations]);

    const addAllocation = useCallback(
        (allocation: Omit<AccountAllocation, "id">) => {
        const newAllocation: AccountAllocation = {
            ...allocation,
            id: crypto.randomUUID(),
        };

        setAllocations((current) => [
            ...current,
            newAllocation,
        ]);
        },
        []
    );

    const updateAllocation = useCallback(
        (
        id: string,
        allocation: Omit<AccountAllocation, "id">
        ) => {
        setAllocations((current) =>
            current.map((item) =>
            item.id === id
                ? {
                    ...allocation,
                    id,
                }
                : item
            )
        );
        },
        []
    );

    const deleteAllocation = useCallback((id: string) => {
        setAllocations((current) =>
        current.filter((item) => item.id !== id)
        );
    }, []);

    const toggleAllocationStatus = useCallback(
        (id: string) => {
        setAllocations((current) =>
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
        allocations,
        addAllocation,
        updateAllocation,
        deleteAllocation,
        toggleAllocationStatus,
        }),
        [
        allocations,
        addAllocation,
        updateAllocation,
        deleteAllocation,
        toggleAllocationStatus,
        ]
    );

    return (
        <AccountAllocationContext.Provider value={value}>
        {children}
        </AccountAllocationContext.Provider>
    );
}