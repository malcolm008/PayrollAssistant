import { useContext } from "react";
import { JobTitleContext } from "../context/jobTItleContext";

export function useJobTitles() {
  const context = useContext(JobTitleContext);

  if (!context) {
    throw new Error(
      "useJobTitles must be used inside JobTitleProvider",
    );
  }

  return context;
}