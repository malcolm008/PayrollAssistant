import type { PaymentMethod } from "../types/paymentMethod";

export const PaymentMethods: PaymentMethod[] = [
  {
    id: "PM-CASH",
    code: "CASH",
    name: "Cash",
    type: "cash",
    description: "Cash payment",
    active: true,
  },
  {
    id: "PM-BANK",
    code: "BANK",
    name: "Bank Transfer",
    type: "bank",
    description: "Payment through a bank account",
    active: true,
  },
  {
    id: "PM-MOBILE",
    code: "MOBILE",
    name: "Mobile Money",
    type: "mobile_money",
    description: "Payment through mobile money services",
    active: true,
  },
  {
    id: "PM-CHEQUE",
    code: "CHEQUE",
    name: "Cheque",
    type: "cheque",
    description: "Payment through cheque",
    active: true,
  },
];