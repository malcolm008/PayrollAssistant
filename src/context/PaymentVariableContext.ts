import { createContext } from "react";
import type { PaymentVariable, CreatePaymentVariableInput } from "../types/paymentVariables";

export interface PaymentVariableContextValue {
    paymentVariables: PaymentVariable[];
    addPaymentVariable: (data: CreatePaymentVariableInput) => void;
    updatePaymentVariable: (
        id: string,
        updates: CreatePaymentVariableInput
    ) => void;
    deletePaymentVariable: (id: string) => void;
}

export const PaymentVariableContext = createContext<PaymentVariableContextValue | undefined>(undefined);