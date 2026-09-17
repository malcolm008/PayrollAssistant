export type LeaveCalculation = "Paid" | "Unpaid";

export interface LeaveType {
    id: string;
    code: string;
    name: string;
    description: string;
    calculation: LeaveCalculation;
    defaultEntitlement: number;
    maxConsecutiveDays?: number;
    deductFromBalance: boolean;
    active: boolean;
}