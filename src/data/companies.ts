export interface Company {
  id: string;
  name: string;
  code: string;
  employees: number;
}

export const companies: Company[] = [
  {
    id: "acme",
    name: "Sound and Vision Limited",
    code: "ACME",
    employees: 248,
  },
  {
    id: "global",
    name: "Benson Group Ltd",
    code: "GIL",
    employees: 521,
  },
  {
    id: "summit",
    name: "Summit Enterprises",
    code: "SUM",
    employees: 137,
  },
];