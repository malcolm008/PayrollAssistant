import {
    useCallback,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import type { LoanType } from "../types/loan";
import { LoanTypeContext } from "./LoanTypeContext";

const STORAGE_KEY = "payroll_loan_types";

const DEFAULT_LOAN_TYPES: LoanType[] = [
    {
        id: "loan-1",
        code: "STAFF",
        name: "Staff Loan",
        description: "General employee loan.",
        repaymentMethod: "Payroll Deduction",
        maxAmount: undefined,
        maxInstallments: 24,
        interestRate: 0,
        requiresApproval: true,
        active: true,
    },
    {
        id: "loan-2",
        code: "EMERGENCY",
        name: "Emergency Loan",
        description: "Loan provided for qualifying emergency situations.",
        repaymentMethod: "Payroll Deduction",
        maxAmount: undefined,
        maxInstallments: 12,
        interestRate: 0,
        requiresApproval: true,
        active: true,
    },
    {
        id: "loan-3",
        code: "PERSONAL",
        name: "Personal Loan",
        description: "General-purpose personal employee loan.",
        repaymentMethod: "Payroll Deduction",
        maxAmount: undefined,
        maxInstallments: 24,
        interestRate: 0,
        requiresApproval: true,
        active: true,
    },
];

function createId() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return `loan-${crypto.randomUUID()}`;
    }

    return `loan-${Date.now()}`;
}

export function LoanTypeProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [loanTypes, setLoanTypes] =
        useState<LoanType[]>(() => {
        try {
            const stored =
            localStorage.getItem(STORAGE_KEY);

            if (stored) {
            return JSON.parse(stored);
            }
        } catch {
            // Ignore invalid localStorage data.
        }

        return DEFAULT_LOAN_TYPES;
        });

    useEffect(() => {
        localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(loanTypes),
        );
    }, [loanTypes]);

    const createLoanType = useCallback(
        (loanType: Omit<LoanType, "id">) => {
        setLoanTypes((current) => [
            ...current,
            {
            ...loanType,
            id: createId(),
            },
        ]);
        },
        [],
    );

    const updateLoanType = useCallback(
        (
        id: string,
        updates: Partial<LoanType>,
        ) => {
        setLoanTypes((current) =>
            current.map((item) =>
            item.id === id
                ? { ...item, ...updates }
                : item,
            ),
        );
        },
        [],
    );

    const deleteLoanType = useCallback(
        (id: string) => {
        setLoanTypes((current) =>
            current.filter((item) => item.id !== id),
        );
        },
        [],
    );

    const toggleLoanType = useCallback(
        (id: string) => {
        setLoanTypes((current) =>
            current.map((item) =>
            item.id === id
                ? {
                    ...item,
                    active: !item.active,
                }
                : item,
            ),
        );
        },
        [],
    );

    return (
        <LoanTypeContext.Provider
        value={{
            loanTypes,
            createLoanType,
            updateLoanType,
            deleteLoanType,
            toggleLoanType,
        }}
        >
        {children}
        </LoanTypeContext.Provider>
    );
}