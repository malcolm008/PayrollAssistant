import { useContext } from "react";
import { DeductionTypeContext } from "../context/DeductionTypeContext";

export function useDeductionTypes() {
  const context = useContext(DeductionTypeContext);

  if (!context) {
    throw new Error(
      "useDeductionTypes must be used inside DeductionTypeProvider"
    );
  }

  return context;
}