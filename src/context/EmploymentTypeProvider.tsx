import {
  useCallback,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { EmploymentType } from "../types/employmentType";
import { EmploymentTypeContext } from "./EmploymentTypeContext";
import { DEFAULT_EMPLOYMENT_TYPES } from "../data/employemt";

const STORAGE_KEY = "payroll_employment_types";

function createId(prefix: string) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

export function EmploymentTypeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [employmentTypes, setEmploymentTypes] =
    useState<EmploymentType[]>(() => {
      try {
        const stored =
          localStorage.getItem(STORAGE_KEY);

        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // Ignore invalid localStorage data.
      }

      return DEFAULT_EMPLOYMENT_TYPES;
    });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(employmentTypes),
    );
  }, [employmentTypes]);

  const createEmploymentType = useCallback(
    (
      employmentType: Omit<EmploymentType, "id">,
    ) => {
      setEmploymentTypes((current) => [
        ...current,
        {
          ...employmentType,
          id: createId("employment"),
        },
      ]);
    },
    [],
  );

  const updateEmploymentType = useCallback(
    (
      id: string,
      updates: Partial<EmploymentType>,
    ) => {
      setEmploymentTypes((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, ...updates }
            : item,
        ),
      );
    },
    [],
  );

  const deleteEmploymentType = useCallback(
    (id: string) => {
      setEmploymentTypes((current) =>
        current.filter((item) => item.id !== id),
      );
    },
    [],
  );

  const toggleEmploymentType = useCallback(
    (id: string) => {
      setEmploymentTypes((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, active: !item.active }
            : item,
        ),
      );
    },
    [],
  );

  return (
    <EmploymentTypeContext.Provider
      value={{
        employmentTypes,
        createEmploymentType,
        updateEmploymentType,
        deleteEmploymentType,
        toggleEmploymentType,
      }}
    >
      {children}
    </EmploymentTypeContext.Provider>
  );
}