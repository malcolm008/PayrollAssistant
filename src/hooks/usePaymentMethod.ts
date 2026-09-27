import { useContext } from "react";
import { PaymentMethodContext } from "../context/PaymentMethodContext";

export function usePaymentMethods() {
    const context = useContext(PaymentMethodContext);

    if (!context) {
        throw new Error(
            "usePaymentMethods must be used within a PaymentMethodProvider",
        );
    }

    return context;
}