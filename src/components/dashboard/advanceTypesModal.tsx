import { useAdvances } from "../../hooks/useAdvances";
import type { AdvanceType, RepaymentMethod } from "../../types/advanceTypes";

import { NumberInput, Pill, SelectInput, TypeManagerModal } from "./typeManagerModal";

type AdvanceDraft = Omit<AdvanceType, "id">;

const blankAdvance: AdvanceDraft = {
    code: "",
    name: "",
    description: "",
    repaymentMethod: "Payroll Deduction",
    maxAmount: undefined,
    maxInstallments: undefined,
    requiresApproval: true,
    active: true,
};

const REPAYMENT_METHODS: RepaymentMethod[] = [
  "Payroll Deduction",
  "Manual",
  "Both",
];

export function AdvanceTypeModal({ onClose }: { onClose: () => void }) {
    const { 
        advanceTypes,
        createAdvanceType,
        updateAdvanceType,
        deleteAdvanceType,
        toggleAdvanceType,
    } = useAdvances();

    return (
        <TypeManagerModal<AdvanceDraft>
        title="Advance Types"
        noun="Advance Type"
        codeHint="e.g. SALARY"
        nameHint="e.g. Salary Advance"
        items={advanceTypes}
        blank={blankAdvance}
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
            <SelectInput<RepaymentMethod>
                label="Repayment"
                value={draft.repaymentMethod}
                options={REPAYMENT_METHODS}
                onChange={(value) => set({ repaymentMethod: value })}
            />
    
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>
            </div>
        )}
        toggles={[{ key: "requiresApproval", label: "Requires approval" }]}
        onCreate={createAdvanceType}
        onUpdate={updateAdvanceType}
        onDelete={deleteAdvanceType}
        onToggle={toggleAdvanceType}
        onClose={onClose}
                stats={[
            { label: "Needs approval", test: (item) => item.requiresApproval },
        ]}
        />  
    )
}