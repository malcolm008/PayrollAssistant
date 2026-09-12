export type AdvanceStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Paid"
  | "Partially Recovered"
  | "Fully Recovered"
  | "Rejected"
  | "Cancelled";

export type RepaymentMethod =
  | "Payroll Deduction"
  | "Manual"
  | "Both";

export interface AdvanceRepayment {
  id: string;
  date: string;
  amount: number;
  method: RepaymentMethod;
  reference?: string;
  notes?: string;
}

export interface AdvanceRecord {
  id: string;

  employeeNumber: string;
  employeeName: string;
  department: string;
  position: string;
  basicSalary: number;

  type: string;

  amount: number;
  recovered: number;

  repaymentMethod: RepaymentMethod;
  installments: number;
  installmentAmount: number;
  firstDeductionMonth: string;

  requestDate: string;

  reason: string;
  notes?: string;

  status: AdvanceStatus;

  submittedAt?: string;

  approvedAt?: string;
  approvedBy?: string;

  rejectedAt?: string;
  rejectionReason?: string;

  paidAt?: string;

  repayments: AdvanceRepayment[];
}