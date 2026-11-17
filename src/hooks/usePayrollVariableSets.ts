import { useEffect, useState } from "react";
import  type { PaymentCategory } from "../types/paymentVariables";

export type VariableKind = "deduction" | "bill" | "advance";

export interface PayrollVariable {
    id: string;
    kind: VariableKind;
    name: string;
    category: PaymentCategory;
}

export interface PayrollVariableInput {
    name: string;
    category: PaymentCategory;
}

const STORAGE_KEY = "payroll_variable_sets";

function load(): PayrollVariable[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function usePayrollVariableSets() {
    const [items, setItems] = useState<PayrollVariable[]>(load());

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);
    

    const variablesOf = (kind: VariableKind) => items.filter((item) => item.kind === kind).map((item, position) => ({ ...item, index: position + 1}));

    const validate = (
        kind: VariableKind,
        input: PayrollVariableInput,
        ignoreId?: string,
    ) => {
        const name = input.name.trim();

        if (!name) throw new Error("Enter a name.");

        const duplicate = items.some((item) => item.kind === kind && item.id !== ignoreId && item.name.toLowerCase() === name.toLowerCase());

        if (duplicate) throw new Error(`"${name}" already exists.`);

        return name;
    };

    const addVariable = (kind: VariableKind, input: PayrollVariableInput) => {
        const name = validate(kind, input);

        setItems((current) => [
            ...current,
            { id: crypto.randomUUID(), kind, name, category: input.category },
        ]);
    };

    const updateVariable = (id: string, input: PayrollVariableInput) => {
        const target = items.find((item) => item.id === id);

        if (!target) return;

        const name = validate(target.kind, input, id);

        setItems((current) => current.map((item) => item.id === id ? { ...item, name, category: input.category} : item));
    };

    const deleteVariable = (id: string) => {
        setItems((current) => current.filter((item) => item.id !== id));
    };

    return { variablesOf, addVariable, updateVariable, deleteVariable };
}



