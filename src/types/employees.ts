export type EmployeeStatus = "Active" | "Inactive";

export type EmploymentType = "Full Time" | "Part TIme" | "Contract" | "Temporary";

export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  department: string;
  position: string;
  employmentType: EmploymentType;
  salary: number;
  status: EmployeeStatus;
  email: string;
  phone: string;
}

