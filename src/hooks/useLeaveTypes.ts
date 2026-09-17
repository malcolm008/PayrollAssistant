import { useContext } from "react";
import { LeaveTypeContext } from "../context/LeaveTypeContext";

export function useLeaveTypes() {
  const context = useContext(LeaveTypeContext);

  if (!context) {
    throw new Error(
      "useLeaveTypes must be used inside LeaveTypeProvider",
    );
  }

  return context;
}