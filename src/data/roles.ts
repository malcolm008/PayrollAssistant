import type { RoleId, ModuleId, AccessLevel } from "../types/systemUser";

export const ROLES: Record<RoleId, {
    label: string;
    summary: string;
    badge: string;
    access: Record<ModuleId, AccessLevel>;
}> = {
    administrator: {
        label: "Administrator",
        summary: "Full access to every module",
        badge: "bg-[var(--color-brand-soft)] text-[var(--color-brand)]",
        access: {
            employees: 3,
            attendance: 3,
            leave: 3,
            payroll: 3,
            increments: 3,
            accounting: 3,
            reports: 3,
            administration: 3,
        },
    },
    payroll_officer: {
        label: "Payroll Officer",
        summary: "Runs payroll operations and increments",
        badge: "bg-[var(--color-info)]/10 text-[var(--color-info)]",
        access: {
            employees: 2,
            attendance: 2,
            leave: 1,
            payroll: 3,
            increments: 2,
            accounting: 1,
            reports: 2,
            administration: 0,
        },
    },
    hr_officer: {
        label: "HR Officer",
        summary: "Manage employees, attendance and leave",
        badge: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
        access: {
            employees: 3,
            attendance: 3,
            leave: 3,
            payroll: 1,
            increments: 1,
            accounting: 0,
            reports: 1,
            administration: 0,
        },
    },
    accountant: {
        label: "Accounting",
        summary: "Accounting setup and financial reports",
        badge: "bg-purple-400/10 text-purple-400",
        access: {
            employees: 1,
            attendance: 0,
            leave: 0,
            payroll: 1,
            increments: 0,
            accounting: 3,
            reports: 3,
            administration: 0,
        },
    },
    auditor: {
        label: "Auditor",
        summary: "Read-only access",
        badge: "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-secondary)]",
        access: {
            employees: 1,
            attendance: 1,
            leave: 1,
            payroll: 1,
            increments: 1,
            accounting: 1,
            reports: 1,
            administration: 0,
        },
    },
};

export const ROLE_IDS = Object.keys(ROLES) as RoleId[];

export const accessFor = (role: RoleId): Record<ModuleId, AccessLevel> => ({
    ...ROLES[role].access,
});