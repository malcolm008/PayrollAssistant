import type { EmploymentType } from "../types/employmentType";

export const DEFAULT_EMPLOYMENT_TYPES: EmploymentType[] = [
  {
    id: "employment-1",
    code: "FT",
    name: "Full Time",
    description: "Full-time employment.",
    active: true,
  },
  {
    id: "employment-2",
    code: "PT",
    name: "Part Time",
    description: "Part-time employment.",
    active: true,
  },
  {
    id: "employment-3",
    code: "CT",
    name: "Contract",
    description: "Fixed-term or contractual employment.",
    active: true,
  },
  {
    id: "employment-4",
    code: "TEMP",
    name: "Temporary",
    description: "Temporary employment.",
    active: true,
  },
  {
    id: "employment-5",
    code: "CAS",
    name: "Casual",
    description: "Casual employment.",
    active: true,
  },
  {
    id: "employment-6",
    code: "INT",
    name: "Internship",
    description: "Internship or training placement.",
    active: true,
  },
];