export type EmployeeStatus = "Active" | "Inactive";

export type EmploymentType = "Full Time" | "Part TIme" | "Contract" | "Temporary";

export interface Employee {
    id: string;
    employeeNumber: string;

    firstName: string;
    middleName: string;
    lastName: string;

    email?: string;
    phone?: string;

    department: string;
    position: string;
    
    employmentType: EmploymentType;
    status: EmployeeStatus;

    hireDate: string;

    basicSalary: number;
}