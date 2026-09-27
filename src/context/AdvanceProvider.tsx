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

import { initialAdvances } from "../data/advances";

const STORAGE_KEY = "payroll-advances";

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