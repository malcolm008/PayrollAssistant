export type PayrollPeriodStatus = "Open" | "Closed" | "Locked";

export const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

export interface PayrollPeriod {
    id: string;
    name: string;
    frequency: "Monthly";
    startDate: string;
    endDate: string;
    paymentDate: string;
    inputCutoffDate: string;
    status: PayrollPeriodStatus;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

