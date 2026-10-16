import type { SystemUser } from "../types/systemUser";
import { accessFor } from "./roles";

export const defaultUsers: SystemUser[] = [
    {
        id: "USR-0001",
        name: "System Administrator",
        username: "admin",
        email: "admin@company.co.tz",
        role: "administrator",
        status: "Active",
        access: accessFor("administrator"),
        mustChangePassword: false,
        lastLogin: "2026-10-16T08:42:00",
    },
    {
        id: "USR-0002",
        name: "Sarah Johnson",
        username: "sjohnson",
        email: "sarah.johnson@company.co.tz",
        role: "hr_officer",
        status: "Active",
        access: accessFor("hr_officer"),
        mustChangePassword: false,
        lastLogin: "2026-10-15T16:10:00",
    },
    {
        id: "USR-0003",
        name: "John Mwangi",
        username: "jmwangi",
        email: "john.mwangi@company.co.tz",
        role: "payroll_officer",
        status: "Active",
        access: accessFor("payroll_officer"),
        mustChangePassword: false,
        lastLogin: "2026-10-16T07:55:00",
    },
    {
        id: "USR-0004",
        name: "Amina Hassan",
        username: "ahassan",
        email: "amina.hassan@company.co.tz",
        role: "accountant",
        status: "Inactive",
        access: accessFor("accountant"),
        mustChangePassword: false,
        lastLogin: "2026-09-02T11:20:00",
    },
]