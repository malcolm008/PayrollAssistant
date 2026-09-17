import { useContext } from "react";
import { LoanTypeContext } from "../context/LoanTypeContext"; 

export function useLoanTypes() {
  const context = useContext(LoanTypeContext);

  if (!context) {
    throw new Error(
      "useLoanTypes must be used inside LoanTypeProvider",
    );
  }

  return context;
}