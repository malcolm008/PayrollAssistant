export interface AdvanceEmployee {
    employeeNumber: string;
    name: string;
    department: string;
    position: string;
    basicSalary: number;
}

export const advanceEmployees: AdvanceEmployee[] = [
  {
    employeeNumber: "EMP-0001",
    name: "John Mwangi",
    department: "Finance",
    position: "Senior Accountant",
    basicSalary: 1850000,
  },
  {
    employeeNumber: "EMP-0002",
    name: "Sarah Johnson",
    department: "Human Resources",
    position: "HR Officer",
    basicSalary: 2200000,
  },
  {
    employeeNumber: "EMP-0003",
    name: "Michael Smith",
    department: "IT",
    position: "Systems Administrator",
    basicSalary: 2800000,
  },
  {
    employeeNumber: "EMP-0004",
    name: "Amina Hassan",
    department: "Administration",
    position: "Administrative Officer",
    basicSalary: 1400000,
  },
  {
    employeeNumber: "EMP-0005",
    name: "David Mushi",
    department: "Operations",
    position: "Operations Supervisor",
    basicSalary: 1900000,
  },
  {
    employeeNumber: "EMP-0006",
    name: "Grace Joseph",
    department: "Finance",
    position: "Payroll Officer",
    basicSalary: 2100000,
  },
];