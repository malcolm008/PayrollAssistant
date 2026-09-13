import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  AdvanceContext,
  type CreateAdvanceInput,
  type AdvanceContextValue,
} from "./AdvanceContext";

import type {
  AdvanceRecord,
  AdvanceRepayment,
  AdvanceStatus,
} from "../types/advance";

const STORAGE_KEY = "payroll-advances";

const initialAdvances: AdvanceRecord[] = [
  {
    id: "ADV-0001",
    employeeNumber: "EMP-0001",
    employeeName: "John Mwangi",
    department: "Finance",
    position: "Senior Accountant",
    basicSalary: 1850000,
    type: "Mid-Month Advance",
    amount: 500000,
    recovered: 250000,
    repaymentMethod: "Payroll Deduction",
    installments: 1,
    installmentAmount: 500000,
    firstDeductionMonth: "2026-09",
    requestDate: "2026-09-08",
    reason: "Mid-month financial assistance",
    notes: "",
    status: "Partially Recovered",
    submittedAt: "2026-09-08T09:00:00",
    approvedAt: "2026-09-08T10:00:00",
    approvedBy: "System Administrator",
    paidAt: "2026-09-08T11:00:00",
    repayments: [
      {
        id: "REP-0001",
        date: "2026-09-15",
        amount: 250000,
        method: "Payroll Deduction",
        reference: "PAY-SEP-001",
        notes: "September payroll deduction",
      },
    ],
  },

  {
    id: "ADV-0002",
    employeeNumber: "EMP-0002",
    employeeName: "Sarah Johnson",
    department: "Human Resources",
    position: "HR Officer",
    basicSalary: 2200000,
    type: "Air Ticket Advance",
    amount: 1200000,
    recovered: 600000,
    repaymentMethod: "Payroll Deduction",
    installments: 3,
    installmentAmount: 400000,
    firstDeductionMonth: "2026-10",
    requestDate: "2026-09-03",
    reason: "Official travel",
    notes: "",
    status: "Paid",
    submittedAt: "2026-09-03T08:00:00",
    approvedAt: "2026-09-03T09:00:00",
    approvedBy: "Company Admin",
    paidAt: "2026-09-03T12:00:00",
    repayments: [
      {
        id: "REP-0002",
        date: "2026-10-01",
        amount: 600000,
        method: "Payroll Deduction",
        reference: "PAY-OCT-002",
        notes: "Payroll recovery",
      },
    ],
  },

  {
    id: "ADV-0003",
    employeeNumber: "EMP-0003",
    employeeName: "Michael Smith",
    department: "IT",
    position: "Systems Administrator",
    basicSalary: 2800000,
    type: "Leave Advance",
    amount: 800000,
    recovered: 800000,
    repaymentMethod: "Payroll Deduction",
    installments: 2,
    installmentAmount: 400000,
    firstDeductionMonth: "2026-09",
    requestDate: "2026-08-28",
    reason: "Leave-related expenses",
    notes: "",
    status: "Fully Recovered",
    submittedAt: "2026-08-28T08:00:00",
    approvedAt: "2026-08-28T09:00:00",
    approvedBy: "Company Admin",
    paidAt: "2026-08-28T10:00:00",
    repayments: [
      {
        id: "REP-0003",
        date: "2026-09-01",
        amount: 400000,
        method: "Payroll Deduction",
        reference: "PAY-SEP-003",
      },
      {
        id: "REP-0004",
        date: "2026-10-01",
        amount: 400000,
        method: "Payroll Deduction",
        reference: "PAY-OCT-003",
      },
    ],
  },

  {
    id: "ADV-0004",
    employeeNumber: "EMP-0004",
    employeeName: "Amina Hassan",
    department: "Administration",
    position: "Administrative Officer",
    basicSalary: 1400000,
    type: "Emergency Advance",
    amount: 350000,
    recovered: 0,
    repaymentMethod: "Payroll Deduction",
    installments: 3,
    installmentAmount: 116667,
    firstDeductionMonth: "2026-10",
    requestDate: "2026-09-07",
    reason: "Emergency personal expense",
    notes: "",
    status: "Pending Approval",
    submittedAt: "2026-09-07T09:00:00",
    repayments: [],
  },

  {
    id: "ADV-0005",
    employeeNumber: "EMP-0005",
    employeeName: "David Mushi",
    department: "Operations",
    position: "Operations Supervisor",
    basicSalary: 1900000,
    type: "Travel Advance",
    amount: 950000,
    recovered: 0,
    repaymentMethod: "Both",
    installments: 3,
    installmentAmount: 316667,
    firstDeductionMonth: "2026-10",
    requestDate: "2026-09-05",
    reason: "Business travel",
    notes: "",
    status: "Approved",
    submittedAt: "2026-09-05T08:00:00",
    approvedAt: "2026-09-05T10:00:00",
    approvedBy: "Company Admin",
    repayments: [],
  },

  {
    id: "ADV-0006",
    employeeNumber: "EMP-0006",
    employeeName: "Grace Joseph",
    department: "Finance",
    position: "Payroll Officer",
    basicSalary: 2100000,
    type: "Salary Advance",
    amount: 700000,
    recovered: 350000,
    repaymentMethod: "Payroll Deduction",
    installments: 2,
    installmentAmount: 350000,
    firstDeductionMonth: "2026-09",
    requestDate: "2026-09-01",
    reason: "Salary advance",
    notes: "",
    status: "Partially Recovered",
    submittedAt: "2026-09-01T08:00:00",
    approvedAt: "2026-09-01T09:00:00",
    approvedBy: "Company Admin",
    paidAt: "2026-09-01T10:00:00",
    repayments: [
      {
        id: "REP-0005",
        date: "2026-09-01",
        amount: 350000,
        method: "Payroll Deduction",
        reference: "PAY-SEP-006",
      },
    ],
  },
];

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;
}

function getInitialAdvances(): AdvanceRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return initialAdvances;
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed
      : initialAdvances;
  } catch {
    return initialAdvances;
  }
}

export function AdvanceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [advances, setAdvances] =
    useState<AdvanceRecord[]>(getInitialAdvances);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(advances),
    );
  }, [advances]);

  const createAdvance = (
    data: CreateAdvanceInput,
    submitForApproval = false,
  ) => {
    const advance: AdvanceRecord = {
      id: generateId("ADV"),
      ...data,
      recovered: 0,
      status: submitForApproval
        ? "Pending Approval"
        : "Draft",
      submittedAt: submitForApproval
        ? new Date().toISOString()
        : undefined,
      repayments: [],
    };

    setAdvances((current) => [
      advance,
      ...current,
    ]);

    return advance;
  };

  const updateAdvanceStatus = (
    id: string,
    status: AdvanceStatus,
    metadata?: {
      approvedBy?: string;
      rejectionReason?: string;
    },
  ) => {
    setAdvances((current) =>
      current.map((advance) => {
        if (advance.id !== id) {
          return advance;
        }

        const now = new Date().toISOString();

        return {
          ...advance,
          status,

          approvedAt:
            status === "Approved"
              ? now
              : advance.approvedAt,

          approvedBy:
            status === "Approved"
              ? metadata?.approvedBy ??
                "Current User"
              : advance.approvedBy,

          rejectedAt:
            status === "Rejected"
              ? now
              : advance.rejectedAt,

          rejectionReason:
            status === "Rejected"
              ? metadata?.rejectionReason
              : advance.rejectionReason,

          paidAt:
            status === "Paid"
              ? now
              : advance.paidAt,
        };
      }),
    );
  };

  const recordRepayment = (
    advanceId: string,
    repayment: Omit<AdvanceRepayment, "id">,
  ) => {
    setAdvances((current) =>
      current.map((advance) => {
        if (advance.id !== advanceId) {
          return advance;
        }

        const newRecovered =
          advance.recovered + repayment.amount;

        const newStatus: AdvanceStatus =
          newRecovered >= advance.amount
            ? "Fully Recovered"
            : "Partially Recovered";

        const newRepayment: AdvanceRepayment = {
          ...repayment,
          id: generateId("REP"),
        };

        return {
          ...advance,
          recovered: Math.min(
            newRecovered,
            advance.amount,
          ),
          status: newStatus,
          repayments: [
            ...advance.repayments,
            newRepayment,
          ],
        };
      }),
    );
  };

  const getAdvance = (id: string) =>
    advances.find(
      (advance) => advance.id === id,
    );

  const deleteAdvance = (id: string) => {
    setAdvances((current) =>
      current.filter(
        (advance) => advance.id !== id,
      ),
    );
  };

  const refreshAdvances = () => {
    setAdvances(getInitialAdvances());
  };

  const value = useMemo<AdvanceContextValue>(
    () => ({
      advances,
      createAdvance,
      updateAdvanceStatus,
      recordRepayment,
      getAdvance,
      deleteAdvance,
      refreshAdvances,
    }),
    [advances],
  );

  return (
    <AdvanceContext.Provider value={value}>
      {children}
    </AdvanceContext.Provider>
  );
}