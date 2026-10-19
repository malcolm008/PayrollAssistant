export type RepaymentMethod = "Payroll Deduction" | "Manual" | "Both";

export interface AdvanceType {
    id: string;
    code: string;
    name: string;
    description: string;
    repaymentMethod: RepaymentMethod;
    requiresApproval: boolean;
    maxAmount?: number;
    maxInstallments?: number;
    active: boolean;
}

export const defaultAdvanceTypes: AdvanceType[] = [
    {
        id: "ADV-001",
        code: "MID_MONTH",
        name: "Mid-Month Advance",
        description: "Advance issued to an employee before the normal payroll date.",
        repaymentMethod: "Payroll Deduction",
        requiresApproval: true,
        maxAmount: 0.5,
        maxInstallments: 1,
        active: true,
    },
    {
        id: "ADV-002",
        code: "AIR_TICKET",
        name: "Air Ticket Advance",
        description: "Advance provided for approved air travel and ticket expenses.",
        repaymentMethod: "Payroll Deduction",
        requiresApproval: true,
        maxInstallments: 3,
        active: true,
    },
    {
        id: "ADV-003",
        code: "LEAVE",
        name: "Leave Advance",
        description: "Advance associated with an approved employee leave period.",
        repaymentMethod: "Payroll Deduction",
        requiresApproval: true,
        maxInstallments: 2,
        active: true,
    },
    {
        id: "ADV-004",
        code: "TRAVEL",
        name: "Travel Advance",
        description: "Advance issued for approved business travel expenses.",
        repaymentMethod: "Both",
        requiresApproval: true,
        maxInstallments: 3,
        active: true,
    },
    {
        id: "ADV-005",
        code: "EMERGENCY",
        name: "Emergency Advance",
        description: "Advance issued for approved emergency employee needs.",
        repaymentMethod: "Payroll Deduction",
        requiresApproval: true,
        maxInstallments: 3,
        active: true,
    },
    {
        id: "ADV-006",
        code: "SALARY",
        name: "Salary Advance",
        description: "General salary advance requested by an employee.",
        repaymentMethod: "Payroll Deduction",
        requiresApproval: true,
        maxInstallments: 6,
        active: true,
    },
    {
        id: "ADV-007",
        code: "OTHER",
        name: "Other Advance",
        description: "Other approved employee advance.",
        repaymentMethod: "Both",
        requiresApproval: true,
        maxInstallments: 6,
        active: true,
    },
];

