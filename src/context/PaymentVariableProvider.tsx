import { useMemo, useEffect, useState, type ReactNode } from "react";
import type { CreatePaymentVariableInput, PaymentVariable } from "../types/paymentVariables";
import { PaymentVariableContext } from "./PaymentVariableContext";

const STORAGE_KEY = "payroll-payment-variables";

function loadPaymentVairbles(): PaymentVariable[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (!stored) return [];

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function PaymentVariablesProvider({
    children,
}: {
    children: ReactNode;
})  {
    const [paymentVariables, setPaymentVariables] = useState<PaymentVariable[]>(loadPaymentVairbles);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(paymentVariables));
    }, [paymentVariables]);

    const addPaymentVariable = (data: CreatePaymentVariableInput) => {
        const normalizedName = data.name.trim();

        if (!normalizedName) {
            throw new Error("Payment variable name is required");
        }

        const duplicate = paymentVariables.some(
            (item) => item.name.toLowerCase() === normalizedName.toLowerCase()
        );

        if (duplicate) {
            throw new Error("This payment variable already exists.");
        }

        const nextIndex = paymentVariables.reduce((maximum, item) => Math.max(maximum, item.index), 0) + 1;

        const newVariable: PaymentVariable = {
            id: `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            index: nextIndex,
            name: normalizedName,
            category: data.category,
            active: true,
            createdAt: new Date().toISOString(),
        };

        setPaymentVariables((current) => [...current, newVariable]);
    };

    const updatePaymentVariable = (
        id: string,
        updates: CreatePaymentVariableInput
    ) => {
        const normalizedName = updates.name.trim();

        if (!normalizedName) {
            throw new Error ("Payment variable name is required.");
        }

        const duplicate = paymentVariables.some(
            (item) => item.id !== id && item.name.toLowerCase() === normalizedName.toLowerCase()
        );

        if (duplicate) {
            throw new Error("Another payment variable has this name.");
        }

        setPaymentVariables((current) => current.map((item) => item.id === id ? {
            ...item,
            name: normalizedName,
            category: updates.category,
        }: item));
    };

    const deletePaymentVariable = (id: string) => {
        setPaymentVariables((current) => current.filter((item) => item.id !== id));
    };

    const value = useMemo(
        () => ({
            paymentVariables,
            addPaymentVariable,
            updatePaymentVariable,
            deletePaymentVariable,
        }),
        [paymentVariables]
    );

    return (
        <PaymentVariableContext.Provider value={value}>
        {children}
        </PaymentVariableContext.Provider> 
    )
}