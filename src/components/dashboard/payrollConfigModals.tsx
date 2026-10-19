import { useAllowanceTypes } from "../../hooks/useAllowanceTypes";
import { useDeductionTypes } from "../../hooks/useDeductionTypes";
import { useLeaveTypes } from "../../hooks/useLeaveTypes";
import { useLoanTypes } from "../../hooks/useLoanTypes";
import type {
  AllowanceCalculationMethod,
  AllowanceType,
} from "../../types/allowance";
import type {
  DeductionCalculationMethod,
  DeductionType,
} from "../../types/deduction";
import type { LeaveCalculation, LeaveType } from "../../types/leave";
import type { LoanRepaymentMethod, LoanType } from "../../types/loan";

import {
  NumberInput,
  Pill,
  SelectInput,
  TypeManagerModal,
} from "./typeManagerModal";

const formatDefault = (method: string, value?: number) => {
  if (value === undefined) return "—";

  return method.includes("Percentage")
    ? `${value}%`
    : value.toLocaleString();
};

interface ModalProps {
  onClose: () => void;
}

/* =========================================================
   ALLOWANCE TYPES
========================================================= */

type AllowanceDraft = Omit<AllowanceType, "id">;

const ALLOWANCE_METHODS: AllowanceCalculationMethod[] = [
  "Fixed Amount",
  "Percentage of Basic Salary",
  "Percentage of Gross Salary",
  "Manual Entry",
];

const blankAllowance: AllowanceDraft = {
  code: "",
  name: "",
  description: "",
  calculationMethod: "Fixed Amount",
  defaultValue: undefined,
  taxable: true,
  recurring: true,
  active: true,
};

export function AllowanceTypesModal({ onClose }: ModalProps) {
  const {
    allowanceTypes,
    createAllowanceType,
    updateAllowanceType,
    deleteAllowanceType,
    toggleAllowanceType,
  } = useAllowanceTypes();

  return (
    <TypeManagerModal<AllowanceDraft>
      title="Allowance Types"
      noun="Allowance"
      codeHint="e.g. TRANSPORT"
      nameHint="e.g. Transport Allowance"
      items={allowanceTypes}
      blank={blankAllowance}
      stats={[
        { label: "Taxable", test: (item) => item.taxable },
        { label: "Recurring", test: (item) => item.recurring },
      ]}
      columns={[
        {
          header: "Calculation",
          render: (item) => item.calculationMethod,
        },
        {
          header: "Default",
          render: (item) =>
            formatDefault(item.calculationMethod, item.defaultValue),
        },
        {
          header: "Rules",
          render: (item) =>
            item.taxable || item.recurring ? (
              <div className="flex flex-wrap gap-1.5">
                {item.taxable && <Pill tone="brand">Taxable</Pill>}
                {item.recurring && <Pill tone="brand">Recurring</Pill>}
              </div>
            ) : (
              "—"
            ),
        },
      ]}
      renderFields={(draft, set) => {
        const isPercent = draft.calculationMethod.includes("Percentage");

        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectInput<AllowanceCalculationMethod>
              label="Calculation"
              value={draft.calculationMethod}
              options={ALLOWANCE_METHODS}
              onChange={(value) => set({ calculationMethod: value })}
            />

            <NumberInput
              label={isPercent ? "Default Percentage" : "Default Amount"}
              suffix={isPercent ? "%" : undefined}
              step={isPercent ? 0.01 : 1}
              value={draft.defaultValue}
              onChange={(value) => set({ defaultValue: value })}
            />
          </div>
        );
      }}
      toggles={[
        { key: "taxable", label: "Taxable" },
        { key: "recurring", label: "Recurring" },
      ]}
      onCreate={createAllowanceType}
      onUpdate={updateAllowanceType}
      onDelete={deleteAllowanceType}
      onToggle={toggleAllowanceType}
      onClose={onClose}
    />
  );
}

/* =========================================================
   DEDUCTION TYPES
========================================================= */

type DeductionDraft = Omit<DeductionType, "id">;

const DEDUCTION_METHODS: DeductionCalculationMethod[] = [
  "Fixed Amount",
  "Percentage of Basic Salary",
  "Percentage of Gross Salary",
  "Manual Entry",
];

const blankDeduction: DeductionDraft = {
  code: "",
  name: "",
  description: "",
  calculationMethod: "Fixed Amount",
  defaultValue: undefined,
  statutory: false,
  recurring: true,
  active: true,
};

export function DeductionTypesModal({ onClose }: ModalProps) {
  const {
    deductionTypes,
    createDeductionType,
    updateDeductionType,
    deleteDeductionType,
    toggleDeductionType,
  } = useDeductionTypes();

  return (
    <TypeManagerModal<DeductionDraft>
      title="Deduction Types"
      noun="Deduction"
      codeHint="e.g. PAYE"
      nameHint="e.g. PAYE"
      items={deductionTypes}
      blank={blankDeduction}
      stats={[
        { label: "Statutory", test: (item) => item.statutory },
        { label: "Recurring", test: (item) => item.recurring },
      ]}
      columns={[
        {
          header: "Calculation",
          render: (item) => item.calculationMethod,
        },
        {
          header: "Default",
          render: (item) =>
            formatDefault(item.calculationMethod, item.defaultValue),
        },
        {
          header: "Category",
          render: (item) => (
            <div className="flex flex-wrap gap-1.5">
              <Pill tone={item.statutory ? "warning" : "brand"}>
                {item.statutory ? "Statutory" : "Non-Statutory"}
              </Pill>
              {item.recurring && <Pill tone="info">Recurring</Pill>}
            </div>
          ),
        },
      ]}
      renderFields={(draft, set) => {
        const isPercent = draft.calculationMethod.includes("Percentage");

        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectInput<DeductionCalculationMethod>
              label="Calculation"
              value={draft.calculationMethod}
              options={DEDUCTION_METHODS}
              onChange={(value) => set({ calculationMethod: value })}
            />

            <NumberInput
              label={isPercent ? "Default Percentage" : "Default Amount"}
              suffix={isPercent ? "%" : undefined}
              step={isPercent ? 0.01 : 1}
              value={draft.defaultValue}
              onChange={(value) => set({ defaultValue: value })}
            />
          </div>
        );
      }}
      toggles={[
        { key: "statutory", label: "Statutory" },
        { key: "recurring", label: "Recurring" },
      ]}
      onCreate={createDeductionType}
      onUpdate={updateDeductionType}
      onDelete={deleteDeductionType}
      onToggle={toggleDeductionType}
      onClose={onClose}
    />
  );
}

/* =========================================================
   LEAVE TYPES
========================================================= */

type LeaveDraft = Omit<LeaveType, "id">;

const LEAVE_PAYMENT: LeaveCalculation[] = ["Paid", "Unpaid"];

const blankLeave: LeaveDraft = {
  code: "",
  name: "",
  description: "",
  calculation: "Paid",
  defaultEntitlement: 0,
  maxConsecutiveDays: undefined,
  deductFromBalance: true,
  active: true,
};

export function LeaveTypesModal({ onClose }: ModalProps) {
  const {
    leaveTypes,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType,
    toggleLeaveType,
  } = useLeaveTypes();

  return (
    <TypeManagerModal<LeaveDraft>
      title="Leave Types"
      noun="Leave Type"
      codeHint="e.g. ANNUAL"
      nameHint="e.g. Annual Leave"
      items={leaveTypes}
      blank={blankLeave}
      stats={[
        { label: "Paid", test: (item) => item.calculation === "Paid" },
      ]}
      columns={[
        {
          header: "Payment",
          render: (item) => (
            <Pill tone={item.calculation === "Paid" ? "success" : "warning"}>
              {item.calculation}
            </Pill>
          ),
        },
        {
          header: "Entitlement",
          render: (item) =>
            item.defaultEntitlement > 0
              ? `${item.defaultEntitlement} days`
              : "—",
        },
        {
          header: "Balance",
          render: (item) => (item.deductFromBalance ? "Deduct" : "No"),
        },
      ]}
      renderFields={(draft, set) => (
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectInput<LeaveCalculation>
            label="Payment"
            value={draft.calculation}
            options={LEAVE_PAYMENT}
            onChange={(value) => set({ calculation: value })}
          />

          <NumberInput
            label="Entitlement"
            suffix="days"
            value={draft.defaultEntitlement}
            onChange={(value) => set({ defaultEntitlement: value ?? 0 })}
          />

          <NumberInput
            label="Max Consecutive"
            suffix="days"
            value={draft.maxConsecutiveDays}
            onChange={(value) =>
              set({ maxConsecutiveDays: value || undefined })
            }
          />
        </div>
      )}
      toggles={[
        { key: "deductFromBalance", label: "Deduct from leave balance" },
      ]}
      onCreate={createLeaveType}
      onUpdate={updateLeaveType}
      onDelete={deleteLeaveType}
      onToggle={toggleLeaveType}
      onClose={onClose}
    />
  );
}

/* =========================================================
   LOAN TYPES
========================================================= */

type LoanDraft = Omit<LoanType, "id">;

const LOAN_REPAYMENT: LoanRepaymentMethod[] = [
  "Payroll Deduction",
  "Manual",
  "Both",
];

const blankLoan: LoanDraft = {
  code: "",
  name: "",
  description: "",
  repaymentMethod: "Payroll Deduction",
  maxAmount: undefined,
  maxInstallments: undefined,
  interestRate: 0,
  requiresApproval: true,
  active: true,
};

export function LoanTypesModal({ onClose }: ModalProps) {
  const {
    loanTypes,
    createLoanType,
    updateLoanType,
    deleteLoanType,
    toggleLoanType,
  } = useLoanTypes();

  return (
    <TypeManagerModal<LoanDraft>
      title="Loan Types"
      noun="Loan Type"
      codeHint="e.g. STAFF"
      nameHint="e.g. Staff Loan"
      items={loanTypes}
      blank={blankLoan}
      stats={[
        { label: "Needs approval", test: (item) => item.requiresApproval },
      ]}
      columns={[
        { header: "Repayment", render: (item) => item.repaymentMethod },
        {
          header: "Max Amount",
          render: (item) =>
            item.maxAmount !== undefined
              ? item.maxAmount.toLocaleString()
              : "No limit",
        },
        {
          header: "Installments",
          render: (item) => item.maxInstallments ?? "No limit",
        },
        {
          header: "Approval",
          render: (item) => (
            <Pill tone={item.requiresApproval ? "warning" : "muted"}>
              {item.requiresApproval ? "Required" : "Not Required"}
            </Pill>
          ),
        },
      ]}
      renderFields={(draft, set) => (
        <div className="space-y-4">
          <SelectInput<LoanRepaymentMethod>
            label="Repayment"
            value={draft.repaymentMethod}
            options={LOAN_REPAYMENT}
            onChange={(value) => set({ repaymentMethod: value })}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <NumberInput
              label="Max Amount"
              step={0.01}
              value={draft.maxAmount}
              onChange={(value) => set({ maxAmount: value })}
            />

            <NumberInput
              label="Max Installments"
              suffix="months"
              value={draft.maxInstallments}
              onChange={(value) => set({ maxInstallments: value })}
            />

            <NumberInput
              label="Interest Rate"
              suffix="%"
              step={0.01}
              value={draft.interestRate}
              onChange={(value) => set({ interestRate: value })}
            />
          </div>
        </div>
      )}
      toggles={[{ key: "requiresApproval", label: "Requires approval" }]}
      onCreate={createLoanType}
      onUpdate={updateLoanType}
      onDelete={deleteLoanType}
      onToggle={toggleLoanType}
      onClose={onClose}
    />
  );
}