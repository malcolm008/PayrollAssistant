export type AllocationType = "salary" | "allowance" | "deduction" | "advance" | "loan" | "other";

export interface AccountAllocation {
    id: string;
    code: string;
    description: string;
    allocationType: AllocationType;
    costCenterId: string;
    debitGLAccountId: string;
    creditGLAccountId: string;

    active: boolean;
}