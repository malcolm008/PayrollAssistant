export interface Department {
    id: string;
    code: string;
    name: string;
    function: string;
    numberOfSections: number;
    headOfDepartment?: string;
    reportsTo?: string;
    budgetedStaff: number;
    budgetedSalary: number;
    active: boolean;
}