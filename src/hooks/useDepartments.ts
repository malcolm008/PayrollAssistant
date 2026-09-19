import { useContext } from "react";

import { DepartmentContext } from "../context/DepartmentContext";

export function useDepartments() {
  const context = useContext(DepartmentContext);

  if (!context) {
    throw new Error(
      "useDepartments must be used within a DepartmentProvider",
    );
  }

  return context;
}