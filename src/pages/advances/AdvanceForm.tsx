import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

import { useAdvances } from "../../hooks/useAdvances";

interface AdvanceFormProps {
    onCancel: () => void;
    onCreated: () => void;
}

export default function AdvanceForm({
    onCancel,
    onCreated,
}: AdvanceFormProps) {
    const { createAdvance } = useAdvances();

    const [employeeName, setEmployeeName] = useState("");
    const [amount, setAmount] = useState("");

    const handleSave = () => {
        if (!employeeName || !amount ) {
            return;
        }

        createAdvance({
            employeeNumber: "EMP-NEW",
            employeeName,
            department: "Finance",
            position: "Employee",
            basicSalary: 0,
            type: "Other Advance",
            amount: Number(amount),
            repaymentMethod: "Payroll Deduction",
            installments: 1,
            installmentAmount: Number(amount),
            firstDeductionMonth:
                new Date().toISOString().slice(0, 7),
            requestDate:
                new Date().toISOString().slice(0, 10),
            reason: "Employee advance",
            notes: "",
        });

        onCreated();
    };

    return (
        <div>
        <div className="mb-6 flex items-center gap-3">
            <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-lg border"
            style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-secondary)",
            }}
            >
            <ArrowLeft size={17} />
            </button>

            <div>
            <h2
                className="text-xl font-semibold"
                style={{
                color: "var(--color-text)",
                }}
            >
                New Advance
            </h2>

            <p
                className="mt-1 text-sm"
                style={{
                color:
                    "var(--color-text-secondary)",
                }}
            >
                Create a new employee advance
                request.
            </p>
            </div>
        </div>

        <div
            className="rounded-xl border p-6"
            style={{
            backgroundColor:
                "var(--color-surface)",
            borderColor:
                "var(--color-border)",
            }}
        >
            <div className="grid gap-5 md:grid-cols-2">
            <div>
                <label
                className="mb-2 block text-sm font-medium"
                style={{
                    color: "var(--color-text)",
                }}
                >
                Employee
                </label>

                <input
                value={employeeName}
                onChange={(event) =>
                    setEmployeeName(
                    event.target.value,
                    )
                }
                placeholder="Employee name"
                className="h-11 w-full rounded-lg border px-3 text-sm outline-none"
                style={{
                    backgroundColor:
                    "var(--color-bg)",
                    borderColor:
                    "var(--color-border)",
                    color:
                    "var(--color-text)",
                }}
                />
            </div>

            <div>
                <label
                className="mb-2 block text-sm font-medium"
                style={{
                    color: "var(--color-text)",
                }}
                >
                Amount
                </label>

                <input
                type="number"
                value={amount}
                onChange={(event) =>
                    setAmount(event.target.value)
                }
                placeholder="0"
                className="h-11 w-full rounded-lg border px-3 text-sm outline-none"
                style={{
                    backgroundColor:
                    "var(--color-bg)",
                    borderColor:
                    "var(--color-border)",
                    color:
                    "var(--color-text)",
                }}
                />
            </div>
            </div>

            <div
            className="mt-6 flex justify-end gap-3 border-t pt-5"
            style={{
                borderColor:
                "var(--color-border)",
            }}
            >
            <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border px-4 py-2.5 text-sm"
                style={{
                borderColor:
                    "var(--color-border)",
                color:
                    "var(--color-text-secondary)",
                }}
            >
                Cancel
            </button>

            <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
                style={{
                backgroundColor:
                    "var(--color-brand)",
                color: "#090909",
                }}
            >
                <Save size={16} />
                Save Draft
            </button>
            </div>
        </div>
        </div>
    );
}