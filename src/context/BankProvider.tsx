import {
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type { Bank } from "../types/bank";
import type { BankBranch } from "../types/bankBranch";
import { BankContext } from "./BankContext";


const defaultBanks: Bank[] = [
  {
    id: "bank-001",
    code: "NMB",
    name: "NMB Bank",
    swiftCode: "",
    active: true,
  },
  {
    id: "bank-002",
    code: "CRDB",
    name: "CRDB Bank",
    swiftCode: "",
    active: true,
  },
  {
    id: "bank-003",
    code: "NBC",
    name: "NBC Bank",
    swiftCode: "",
    active: true,
  },
];

const defaultBankBranches: BankBranch[] = [];

const BANKS_STORAGE_KEY = "payroll_banks";
const BRANCHES_STORAGE_KEY = "payroll_bank_branches";

function generateId(prefix: string) {
    if ( typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function loadBanks(): Bank[] {
    try {
        const stored = localStorage.getItem(BANKS_STORAGE_KEY);

        if (!stored) {
            return defaultBanks;
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return defaultBanks;
        }

        return parsed.map((bank: Partial<Bank>) => ({
            id: bank.id || generateId("bank"),
            code: bank.code || "",
            name: bank.name || "",
            swiftCode: bank.swiftCode || "",
            active: bank.active ?? true,
        }));
    } catch (error) {
        console.error("Failed to load banks:", error);
        return defaultBanks;
    }
}

function loadBranches(): BankBranch[] {
    try {
        const stored = localStorage.getItem(BRANCHES_STORAGE_KEY);

        if (!stored) {
            return defaultBankBranches;
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return defaultBankBranches;
        }

        return parsed.map((branch: Partial<BankBranch>) => ({
            id: branch.id || generateId("branch"),
            bankId: branch.bankId || "",
            code: branch.code || "",
            name: branch.name || "",
            address: branch.address || "",
            active: branch.active ?? true,
        }));
    } catch (error) {
        console.error("Failed to load bank branches", error);
        return defaultBankBranches;
    }
}

export function BankProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [banks, setBanks] = useState<Bank[]>(loadBanks);
    const [branches, setBranches] = useState<BankBranch[]>(loadBranches);

    useEffect(() => {
        localStorage.setItem(
            BANKS_STORAGE_KEY,
            JSON.stringify(banks)
        );
    }, [banks]);

    useEffect(() => {
        localStorage.setItem(
            BRANCHES_STORAGE_KEY,
            JSON.stringify(branches)
        );
    }, [branches]);

    //bank configurations
    const createBank = (data: Omit<Bank, "id">) => {
        const newBank: Bank = {
            ...data,
            id: generateId("bank"),
        };

        setBanks((current) => [
            ...current,
            newBank,
        ]);
    };

    const updateBank = (id: string, data: Omit<Bank, "id">) => {
        setBanks((current) => current.filter((bank) => bank.id === id ? {
            ...data,
            id,
        }: bank));
    };

    const deleteBank = (id: string) => {
        setBanks((current) => current.filter((bank) => bank.id !== id));

        setBranches((current) => current.filter((branch) => branch.bankId !== id));
    };

    const toggleBank = (id: string) => {
        setBanks((current) => current.map((bank) => bank.id === id ? {
            ...bank,
            active: !bank.active,
        }: bank));
    };

    // branches configuration

    const createBranch = (data: Omit<BankBranch, "id">) => {
        const newBranch: BankBranch = {
            ...data,
            id: generateId("branch"),
        };
        setBranches((current) => [
            ...current,
            newBranch,
        ]);
    };

    const updateBranch = (id: string, data: Omit<BankBranch, "id">) => {
        setBranches((current) => current.map((branch) => branch.id === id ? {
            ...data,
            id,
        }: branch));
    };

    const deleteBranch = (id: string) => {
        setBranches((current) => current.filter((branch) => branch.id !== id));
    };

    const toggleBranch = (id: string) => {
        setBranches((current) => current.map((branch) => branch.id === id ? {
            ...branch,
            active: !branch.active,
        }: branch));
    };

    return (
        <BankContext.Provider
        value={{
            banks,
            branches,

            createBank,
            updateBank,
            deleteBank,
            toggleBank,

            createBranch,
            updateBranch,
            deleteBranch,
            toggleBranch,
        }}
        >
        {children}
        </BankContext.Provider> 
    );
}