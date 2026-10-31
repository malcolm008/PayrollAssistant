import { createContext } from "react";

import type {
  AdvanceRecord,
  AdvanceRepayment,
  AdvanceStatus,
  RepaymentMethod as AdvanceRepaymentMethod,
} from "../types/advance";

import type { AdvanceType } from "../types/advanceTypes";

export interface CreateAdvanceInput {
  employeeNumber: string;
  employeeName: string;
  department: string;
  position: string;
  basicSalary: number;
  type: string;
  amount: number;
  repaymentMethod: AdvanceRepaymentMethod;
  installments: number;
  installmentAmount: number;
  firstDeductionMonth: string;
  requestDate: string;
  reason: string;
  notes?: string;
}

export type CreateAdvanceTypeInput = Omit<AdvanceType, "id">;

export interface AdvanceContextValue {
  // Advance type configuration
  advanceTypes: AdvanceType[];

  createAdvanceType: (
    data: CreateAdvanceTypeInput,
  ) => AdvanceType;

  updateAdvanceType: (
    id: string,
    updates: Partial<CreateAdvanceTypeInput>,
  ) => void;

  deleteAdvanceType: (id: string) => void;

  toggleAdvanceType: (id: string) => void;

  // Employee advance transactions
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

  refreshAdvances: () => void;
}

export const AdvanceContext =
  createContext<AdvanceContextValue | undefined>(undefined);