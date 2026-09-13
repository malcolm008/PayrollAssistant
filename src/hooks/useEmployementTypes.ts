import { useContext } from "react";
import { EmploymentTypeContext } from "../context/EmploymentTypeContext";

export function useEmploymentTypes() {
  const context = useContext(
    EmploymentTypeContext,
  );

  if (!context) {
    throw new Error(
      "useEmploymentTypes must be used inside EmploymentTypeProvider",
    );
  }

  return context;
}