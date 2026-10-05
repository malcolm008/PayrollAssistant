export type Gender = "Male" | "Female" | "Other";

export type EmployeeStatus = "Active" | "Inactive";
export type EmploymentType = string;

export interface EmployeeAllowance {
  allowanceTypeId: string;
  amount: number;
}

export interface Employee {
  id: string;

  employeeNumber: string;
  surname: string;
  name: string;
  gender: Gender;
  dateOfBirth: string;

  employmentType: EmploymentType;
  department: string;
  costCode: string;
  jobTitle: string;

  currency: string;
  salary: number;
  allowances: EmployeeAllowance[];
  paidOvertime: boolean;

  email: string;
  phone: string;

  wcfNumber: string;
  nationalIdNumber: string;
  tinNumber: string;
  sdlExemption: boolean;

  residence: string;
  companyHouse: boolean;
  rentedHouseRentAmount: number;

  leaveDaysEntitled: number;

  status: EmployeeStatus;
}