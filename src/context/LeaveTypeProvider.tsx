import {
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type { LeaveType } from "../types/leave";
import { LeaveTypeContext } from "./LeaveTypeContext";
import { DEFAULT_LEAVE_TYPES } from "../data/leave";

const STORAGE_KEY = "payroll_leave_types";

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