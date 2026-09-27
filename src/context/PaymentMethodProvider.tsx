import { useEffect, useMemo, useState, type ReactNode } from "react";
import { PaymentMethodContext } from "./PaymentMethodContext";
import type { PaymentMethod } from "../types/paymentMethod";
import { PaymentMethods } from "../data/paymentMethods";

const STORAGE_KEY = "payroll_payment_methods";

function loadPaymentMethods(): PaymentMethod[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return PaymentMethods;
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return PaymentMethods;
        }

        return parsed;
    } catch {
        return PaymentMethods;
    }
}

export function PaymentMethodProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(loadPaymentMethods);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(paymentMethods),);
    }, [paymentMethods]);

    const addPaymentMethod = (
        paymentMethod: Omit<PaymentMethod, "id">,
    ) => {
        const newPaymentMethod: PaymentMethod = {
            ...paymentMethod,
            id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `PM-${Date.now()}`,
        };

        setPaymentMethods((current) => [
            ...current,
            newPaymentMethod,
        ]);
    };

    const updatePaymentMethod = (
        id: string,
        updates: Partial<Omit<PaymentMethod, "id">>,
    ) => {
        setPaymentMethods((current) => current.map((paymentMethod) => paymentMethod.id === id ? {
            ...paymentMethod,
            ...updates,
        }: paymentMethod));
    };

    const deletePaymentMethod = (id: string) => {
        setPaymentMethods((current) => current.filter((paymentMethod) => paymentMethod.id !== id));
    };

    const togglePaymentMethod = (id: string) => {
        setPaymentMethods((current) => current.map((paymentMethod) => paymentMethod.id === id ? {
            ...paymentMethod,
            active: !paymentMethod.active,
        }: paymentMethod));
    };

    const value = useMemo(() => ({
        paymentMethods,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        togglePaymentMethod,
    }), [paymentMethods]);

    return (
        <PaymentMethodContext.Provider value={value}>
        {children}
        </PaymentMethodContext.Provider>
    );
}
