import { createContext } from "react";
import type { PaymentMethod } from "../types/paymentMethod";

interface PaymentMethodContextValue {
    paymentMethods: PaymentMethod[];

    addPaymentMethod: (
        paymentMethod: Omit<PaymentMethod, "id">,
    ) => void;

    updatePaymentMethod: (
        id: string,
        updates: Partial<Omit<PaymentMethod, "id">>,
    ) => void;

    deletePaymentMethod: (id: string) => void;

    togglePaymentMethod: (id: string) => void;
}

export const PaymentMethodContext = createContext<PaymentMethodContextValue | undefined>(undefined);