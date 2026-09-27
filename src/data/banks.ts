import type { Bank } from "../types/bank";
import type { BankBranch } from "../types/bankBranch";

export const defaultBanks: Bank[] = [
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

export const defaultBankBranches: BankBranch[] = [];