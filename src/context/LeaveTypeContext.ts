import { createContext } from "react";

import type { LeaveType } from "../types/leave";

export interface LeaveTypeContextValue {
  leaveTypes: LeaveType[];

  createLeaveType: (
    leaveType: Omit<LeaveType, "id">,
  ) => void;

  updateLeaveType: (
    id: string,
    updates: Partial<LeaveType>,
  ) => void;

  deleteLeaveType: (id: string) => void;

  toggleLeaveType: (id: string) => void;
}

export const LeaveTypeContext =
  createContext<LeaveTypeContextValue | undefined>(
    undefined,
  );