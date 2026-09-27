export type PaymentMethodType = "cash" | "bank" | "mobile_money" | "cheque" | "other";

export interface PaymentMethod {
    id: string;
    code: string;
    name: string;
    type: PaymentMethodType;
    description: string;
    active: boolean;
}