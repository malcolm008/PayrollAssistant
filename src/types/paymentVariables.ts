export type PaymentCategory = "Permanent" | "Temporary";

export interface PaymentVariable {
    id: string;
    index: number;
    name: string;
    category: PaymentCategory;
    active: boolean;
    createdAt: string;
}

export type CreatePaymentVariableInput = Pick<PaymentVariable, "name" | "category">;
