export type LoanRepaymentMethod = "Payroll Deduction" | "Manual" | "Both";

export interface LoanType {
    id: string;
    code: string;
    name: string;
    description: string;
    repaymentMethod: LoanRepaymentMethod;
    maxAmount?: number;
    maxInstallments?: number;
    interestRate?: number;
    requiresApproval: boolean;
    active: boolean;
}