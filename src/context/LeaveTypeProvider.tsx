import {
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type { LeaveType } from "../types/leave";
import { LeaveTypeContext } from "./LeaveTypeContext";

const STORAGE_KEY = "payroll_leave_types";

const DEFAULT_LEAVE_TYPES: LeaveType[] = [
    {
        id: "leave-1",
        code: "ANNUAL",
        name: "Annual Leave",
        description: "Regular annual employee leave.",
        calculation: "Paid",
        defaultEntitlement: 28,
        maxConsecutiveDays: 28,
        deductFromBalance: true,
        active: true,
    },
    {
        id: "leave-2",
        code: "SICK",
        name: "Sick Leave",
        description: "Leave taken due to illness or medical reasons.",
        calculation: "Paid",
        defaultEntitlement: 0,
        deductFromBalance: true,
        active: true,
    },
    {
        id: "leave-3",
        code: "MAT",
        name: "Maternity Leave",
        description: "Leave associated with childbirth and maternity.",
        calculation: "Paid",
        defaultEntitlement: 0,
        deductFromBalance: false,
        active: true,
    },
    {
        id: "leave-4",
        code: "PAT",
        name: "Paternity Leave",
        description: "Leave associated with the birth or adoption of a child.",
        calculation: "Paid",
        defaultEntitlement: 0,
        deductFromBalance: false,
        active: true,
    },
    {
        id: "leave-5",
        code: "UNPAID",
        name: "Unpaid Leave",
        description: "Approved leave without normal salary payment.",
        calculation: "Unpaid",
        defaultEntitlement: 0,
        deductFromBalance: false,
        active: true,
    },
    {
        id: "leave-6",
        code: "COMP",
        name: "Compassionate Leave",
        description: "Leave granted for qualifying personal or family circumstances.",
        calculation: "Paid",
        defaultEntitlement: 0,
        deductFromBalance: false,
        active: true,
    },
];

function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `leave-${crypto.randomUUID()}`;
  }

  return `leave-${Date.now()}`;
}

export function LeaveTypeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [leaveTypes, setLeaveTypes] =
    useState<LeaveType[]>(() => {
      try {
        const stored =
          localStorage.getItem(STORAGE_KEY);

        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // Ignore invalid localStorage data.
      }

      return DEFAULT_LEAVE_TYPES;
    });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(leaveTypes),
    );
  }, [leaveTypes]);

  const createLeaveType = useCallback(
    (leaveType: Omit<LeaveType, "id">) => {
      setLeaveTypes((current) => [
        ...current,
        {
          ...leaveType,
          id: createId(),
        },
      ]);
    },
    [],
  );

  const updateLeaveType = useCallback(
    (
      id: string,
      updates: Partial<LeaveType>,
    ) => {
      setLeaveTypes((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, ...updates }
            : item,
        ),
      );
    },
    [],
  );

  const deleteLeaveType = useCallback(
    (id: string) => {
      setLeaveTypes((current) =>
        current.filter((item) => item.id !== id),
      );
    },
    [],
  );

  const toggleLeaveType = useCallback(
    (id: string) => {
      setLeaveTypes((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                active: !item.active,
              }
            : item,
        ),
      );
    },
    [],
  );

  return (
    <LeaveTypeContext.Provider
      value={{
        leaveTypes,
        createLeaveType,
        updateLeaveType,
        deleteLeaveType,
        toggleLeaveType,
      }}
    >
      {children}
    </LeaveTypeContext.Provider>
  );
}