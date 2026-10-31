import { useContext } from "react";
import { PaymentVariableContext } from "../context/PaymentVariableContext";

export function usePaymentVaribles() {
    const context = useContext(PaymentVariableContext);

    if (!context) {
        throw new Error( "usePaymentVariables must be used inside PaymentVariableProvider." );
    }

    return context;
}