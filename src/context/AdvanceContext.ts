import { createContext } from "react";
import type {
    AdvanceRecord,
    AdvanceRepayment,
    AdvanceStatus,
    RepaymentMethod,
} from "../pages/advances/advance";

export interface CreateAdvanceInput {
    employeeNumber: string;
    employeeName: string;
    department: string;
    position: string;
    basicSalary: number;
    type: string;
    amount: number;
    repaymentMethod: RepaymentMethod;
    installments: number;
    installmentAmount: number;
    firstDeductionMonth: string;
    requestDate: string;
    reason: string;
    notes?: string;
}

export interface AdvanceContextValue {
    advances: AdvanceRecord[];

    createAdvance: (
        data: CreateAdvanceInput,
        submitForApproval?: boolean,
    ) => AdvanceRecord;

    updateAdvanceStatus: (
        id: string,
        status: AdvanceStatus,
        metadata?: {
            approvedBy?: string;
            rejectionReason?: string;
        },
    ) => void;

    recordRepayment: (
        advanceId: string,
        repayment: Omit<AdvanceRepayment, "id">,
    ) => void;

    getAdvance: (id: string) => AdvanceRecord | undefined;

    deleteAdvance: (id: string) => void;

    refreshAdvances: () => void;
}

export const AdvanceContext = createContext<AdvanceContextValue | undefined>(undefined);