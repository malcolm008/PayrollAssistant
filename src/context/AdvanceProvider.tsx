import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  AdvanceContext,
  type AdvanceContextValue,
  type CreateAdvanceInput,
  type CreateAdvanceTypeInput,
} from "./AdvanceContext";

import type {
  AdvanceRecord,
  AdvanceRepayment,
  AdvanceStatus,
} from "../types/advance";

import type { AdvanceType } from "../types/advanceTypes";

import { initialAdvances } from "../data/advances";
import { defaultAdvanceTypes } from "../types/advanceTypes";

const ADVANCES_STORAGE_KEY = "payroll-advances";
const ADVANCE_TYPES_STORAGE_KEY = "payroll_advance_types";

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;
}

function getInitialAdvances(): AdvanceRecord[] {
  try {
    const stored = localStorage.getItem(ADVANCES_STORAGE_KEY);

    if (!stored) {
      return initialAdvances;
    }

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed)
      ? (parsed as AdvanceRecord[])
      : initialAdvances;
  } catch {
    return initialAdvances;
  }
}

function getInitialAdvanceTypes(): AdvanceType[] {
  try {
    const stored = localStorage.getItem(ADVANCE_TYPES_STORAGE_KEY);

    if (!stored) {
      return defaultAdvanceTypes;
    }

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed)
      ? (parsed as AdvanceType[])
      : defaultAdvanceTypes;
  } catch {
    return defaultAdvanceTypes;
  }
}

export function AdvanceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [advances, setAdvances] =
    useState<AdvanceRecord[]>(getInitialAdvances);

  const [advanceTypes, setAdvanceTypes] =
    useState<AdvanceType[]>(getInitialAdvanceTypes);

  // Persist employee advance transactions.
  useEffect(() => {
    localStorage.setItem(
      ADVANCES_STORAGE_KEY,
      JSON.stringify(advances),
    );
  }, [advances]);

  // Persist advance type configuration separately.
  useEffect(() => {
    localStorage.setItem(
      ADVANCE_TYPES_STORAGE_KEY,
      JSON.stringify(advanceTypes),
    );
  }, [advanceTypes]);

  // ---------------------------------------------
  // ADVANCE TYPE CONFIGURATION
  // ---------------------------------------------

  const createAdvanceType = (
    data: CreateAdvanceTypeInput,
  ): AdvanceType => {
    const newType: AdvanceType = {
      ...data,
      id: generateId("AT"),
    };

    setAdvanceTypes((current) => [
      ...current,
      newType,
    ]);

    return newType;
  };

  const updateAdvanceType = (
    id: string,
    updates: Partial<CreateAdvanceTypeInput>,
  ) => {
    setAdvanceTypes((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, ...updates, id: item.id }
          : item,
      ),
    );
  };

  const deleteAdvanceType = (id: string) => {
    setAdvanceTypes((current) =>
      current.filter((item) => item.id !== id),
    );
  };

  const toggleAdvanceType = (id: string) => {
    setAdvanceTypes((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, active: !item.active }
          : item,
      ),
    );
  };

  // ---------------------------------------------
  // EMPLOYEE ADVANCE TRANSACTIONS
  // ---------------------------------------------

  const createAdvance = (
    data: CreateAdvanceInput,
    submitForApproval = false,
  ): AdvanceRecord => {
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
              ? metadata?.approvedBy ?? "Current User"
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

        // Ignore invalid or non-positive repayments.
        if (
          !Number.isFinite(repayment.amount) ||
          repayment.amount <= 0
        ) {
          return advance;
        }

        const outstanding = Math.max(
          advance.amount - advance.recovered,
          0,
        );

        if (outstanding <= 0) {
          return advance;
        }

        const appliedAmount = Math.min(
          repayment.amount,
          outstanding,
        );

        const newRecovered =
          advance.recovered + appliedAmount;

        const newStatus: AdvanceStatus =
          newRecovered >= advance.amount
            ? "Fully Recovered"
            : "Partially Recovered";

        const newRepayment: AdvanceRepayment = {
          ...repayment,
          amount: appliedAmount,
          id: generateId("REP"),
        };

        return {
          ...advance,
          recovered: newRecovered,
          status: newStatus,
          repayments: [
            ...advance.repayments,
            newRepayment,
          ],
        };
      }),
    );
  };

  const getAdvance = (
    id: string,
  ): AdvanceRecord | undefined =>
    advances.find((advance) => advance.id === id);

  const refreshAdvances = () => {
    setAdvances(getInitialAdvances());
    setAdvanceTypes(getInitialAdvanceTypes());
  };

  const value = useMemo<AdvanceContextValue>(
    () => ({
      advanceTypes,
      createAdvanceType,
      updateAdvanceType,
      deleteAdvanceType,
      toggleAdvanceType,

      advances,
      createAdvance,
      updateAdvanceStatus,
      recordRepayment,
      getAdvance,
      refreshAdvances,
    }),
    [advanceTypes, advances],
  );

  return (
    <AdvanceContext.Provider value={value}>
      {children}
    </AdvanceContext.Provider>
  );
}