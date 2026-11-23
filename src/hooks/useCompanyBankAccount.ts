import { useEffect, useState } from "react";

export interface CompanyBankAccount {
    id: string;
    accountNumber: string;
    bankName: string;
    branch: string;
    address: string;
    accountName: string;
    currency: string;
}

export type CompanyBankAccountInput = Omit<CompanyBankAccount, "id">;

const STORAGE_KEY = "payroll_company_bank_accounts";

function load(): CompanyBankAccount[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function useCompanyBankAccounts() {
    const [accounts, setAccounts] = useState<CompanyBankAccount[]>(load);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    }, [accounts]);

    const clean = (
        input: CompanyBankAccountInput,
        ignoreId?: string,
    ): CompanyBankAccountInput => {
        const cleaned = {
            accountNumber: input.accountNumber.trim(),
            bankName: input.bankName.trim(),
            branch: input.branch.trim(),
            address: input.address.trim(),
            accountName: input.accountName.trim(),
            currency: input.currency,
        };

        if (!cleaned.bankName) throw new Error("Enter the bank name.");
        if (!cleaned.accountName) throw new Error("Enter the account name.");
        if (!cleaned.accountNumber) throw new Error("Enter the account number.");

        const duplicate = accounts.some((account) => account.id !== ignoreId && account.accountNumber.toLowerCase() === cleaned.accountNumber.toLowerCase() && account.bankName.toLowerCase() === cleaned.bankName.toLowerCase());

        if (duplicate) {
            throw new Error(
                `Account ${cleaned.accountNumber} at ${cleaned.bankName} is already recorded.`,
            );
        }

        return cleaned;
    };

    const addAccount = (input: CompanyBankAccountInput) => {
        const cleaned = clean(input);

        setAccounts((current) => [...current, { id: crypto.randomUUID(), ...cleaned }]);
    };

    const updateAccount = (id: string, input: CompanyBankAccountInput) => {
        const cleaned = clean(input, id);

        setAccounts((current) => current.map((account) => account.id === id ? { ...account, ...cleaned } : account));
    };

    const deleteAccount = (id: string) => {
        setAccounts((current) => current.filter((account) => account.id !== id));
    };

    return { accounts, addAccount, updateAccount, deleteAccount };
}