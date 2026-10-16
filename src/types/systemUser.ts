export type AccessLevel = 0 | 1 | 2 | 3;
export type ModuleId = "employees" | "attendance" | "leave" | "payroll" | "increments" | "accounting" | "reports" | "administration";
export type RoleId = "administrator" | "payroll_officer" | "hr_officer" | "accountant" | "auditor";

export interface SystemUser {
    id: string;
    name: string;
    username: string;
    email: string;
    role: RoleId;
    status: "Active" | "Inactive";
    access: Record<ModuleId, AccessLevel>;
    mustChangePassword: boolean;
    lastLogin: string | null;
}

export const MODULES: { id: ModuleId; label: string }[] = [
    { id: "employees", label: "Employee" },
    { id: "attendance", label: "Attendance" },
    { id: "leave", label: "Leave"  },
    { id: "payroll", label: "Payroll" },
    { id: "increments", label: "Increments" },
    { id: "accounting", label: "Accounting" },
    { id: "reports", label: "Reports" },
    { id: "administration", label: "Administration" },
];

export const LEVELS: { value: AccessLevel; label: string }[] = [
    { value: 0, label: "None" },
    { value: 1, label: "View" },
    { value: 2, label: "Edit" },
    { value: 3, label: "Full" },
];

