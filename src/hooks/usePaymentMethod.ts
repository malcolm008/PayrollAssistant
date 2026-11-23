import { useEffect, useState } from "react";

export interface PaymentMethod {
    id: string;
    name: string;
    active: boolean;
}

export interface PaymentMethodInput {
    name: string;
    active: boolean;
}

const STORAGE_KEY = "payroll_payment_methods";

function load(): PaymentMethod[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function usePaymentMethods() {
    const [methods, setMethods] = useState<PaymentMethod[]>(load);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(methods));
    }, [methods]);

    const cleanName = (name: string, ignoreId?: string) => {
        const trimmed = name.trim();

        if (!trimmed) throw new Error("Enter a name");

        const duplicate = methods.some((method) => method.id !== ignoreId && method.name.toLowerCase() === trimmed.toLowerCase());

        if (duplicate) throw new Error(`"${trimmed}" already exists.`);

        return trimmed;
    }

    const addMethod = (input: PaymentMethodInput) => {
        const name = cleanName(input.name);

        setMethods((current) => [
            ...current, { id: crypto.randomUUID(), name, active: input.active },
        ]);
    };

    const updateMethod = (id: string, input: PaymentMethodInput) => {
        const name = cleanName(input.name, id);

        setMethods((current) => current.map((method) => method.id === id ? { ...method, name, active: input.active }: method));
    };

    const deleteMethod = (id: string) => {
        setMethods((current) => current.filter((method) => method.id !== id));
    };

    const toggleMethodStatus = (id: string) => {
        setMethods((current) => current.map((method) => method.id === id ? { ...method, active: !method.active }: method ));
    };

    return {
        methods,
        addMethod,
        updateMethod,
        deleteMethod,
        toggleMethodStatus,
    };
}