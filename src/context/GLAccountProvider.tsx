import {
    useState,
    useEffect,
    useMemo,
    useCallback,
    type ReactNode,
} from "react";

import type { GLAccount } from "../types/glAccount";
import { GLAccountContext } from "./GLAccountContext";

const STORAGE_KEY = "payroll_gl_accounts";

function normalizeAccount(account: Partial<GLAccount>): GLAccount {
    return {
        id: account.id ?? crypto.randomUUID(),
        accountNumber: account.accountNumber ?? "",
        description: account.description ?? "",
        debit: Number(account.debit ?? 0),
        credit: Number(account.credit ?? 0),
        active: account.active ?? true,
    };
}

function loadAccounts(): GLAccount[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.map(normalizeAccount);
    } catch {
        return [];
    }
}

export function GLAccountProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [accounts, setAccounts] = useState<GLAccount[]>(loadAccounts);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    }, [accounts]);

    const addAccount  = useCallback(
        (account: Omit<GLAccount, "id">) => {
            const newAccount: GLAccount = {
                ...account,
                id: crypto.randomUUID(),
                debit: Number(account.debit || 0),
                credit: Number(account.credit || 0),
            };

            setAccounts((current) => [...current, newAccount]);
        }, []
    );

    const updateAccount = useCallback(
        (id: string, account: Omit<GLAccount, "id">) => {
            setAccounts((current) => current.map((item) => item.id === id ? {
                ...account,
                id,
                debit: Number(account.debit || 0),
                credit: Number(account.credit || 0),
            }: item));
        }, []
    );

    const deleteAccount = useCallback((id: string) => {
        setAccounts((current) => current.filter((item) => item.id !== id));
    }, []);

    const toggleAccountStatus = useCallback((id: string) => {
        setAccounts((current) => current.map((item) => item.id === id ? {
            ...item,
            active: !item.active,
        }: item));
    }, []);

    const value = useMemo(
        () => ({
        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
        toggleAccountStatus,
        }),
        [
        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
        toggleAccountStatus,
        ]
    );

    return (
        <GLAccountContext.Provider value={value}>
        {children}
        </GLAccountContext.Provider>
    );
}