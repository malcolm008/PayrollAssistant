import { useContext } from "react";
import { AllowanceTypeContext } from "../context/AllowanceTypeContext";

export function useAllowanceTypes() {
  const context = useContext(AllowanceTypeContext);

  if (!context) {
    throw new Error(
      "useAllowanceTypes must be used inside AllowanceTypeProvider"
    );
  }

  return context;
}