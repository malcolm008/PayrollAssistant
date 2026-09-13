import {
    CheckCircle2,
    Eye,
    XCircle,
} from "lucide-react";

import { useAdvances } from "../../hooks/useAdvances";
import type { AdvanceRecord } from "../../types/advance";

interface AdvanceApprovalProps {
    onViewDetails: (
        advance: AdvanceRecord,
    ) => void;
}

const currencyFormatter = new Intl.NumberFormat(
    "en-TZ",
    {
        style: "currency",
        currency: "TZS",
        maximumFractionDigits: 0,
    },
);

function formatCurrency(value: number) {
    return currencyFormatter.format(value);
}

export default function AdvanceApproval({
    onViewDetails,
}: AdvanceApprovalProps) {
    const {
        advances,
        updateAdvanceStatus,
    } = useAdvances();

    const pending = advances.filter(
        (advance) => advance.status === "Pending Approval",
    );

    const handleApprove = (
        advance: AdvanceRecord,
    ) => {
        updateAdvanceStatus(
            advance.id,
            "Approved",
            {
                approvedBy: "Curernt User",
            },
        );
    };

    const handleReject = (
        advance: AdvanceRecord,
    ) => {
        updateAdvanceStatus(
            advance.id,
            "Rejected",
            {
                rejectionReason: "Request rejected during review",
            },
        );
    };

    return (
        <div>
        <div className="mb-6">
            <h2
            className="text-xl font-semibold"
            style={{
                color: "var(--color-text)",
            }}
            >
            Advance Approval
            </h2>

            <p
            className="mt-1 text-sm"
            style={{
                color:
                "var(--color-text-secondary)",
            }}
            >
            Review and approve employee advance
            requests.
            </p>
        </div>

        <div
            className="overflow-hidden rounded-xl border"
            style={{
            backgroundColor:
                "var(--color-surface)",
            borderColor:
                "var(--color-border)",
            }}
        >
            {pending.length === 0 ? (
            <div className="px-6 py-16 text-center">
                <CheckCircle2
                size={34}
                className="mx-auto mb-3"
                style={{
                    color:
                    "var(--color-success)",
                }}
                />

                <p
                className="font-medium"
                style={{
                    color:
                    "var(--color-text)",
                }}
                >
                No pending approvals
                </p>

                <p
                className="mt-1 text-sm"
                style={{
                    color:
                    "var(--color-text-muted)",
                }}
                >
                All advance requests have been
                reviewed.
                </p>
            </div>
            ) : (
            <div className="divide-y"
                style={{
                borderColor:
                    "var(--color-border)",
                }}
            >
                {pending.map((advance) => (
                <div
                    key={advance.id}
                    className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between"
                    style={{
                    borderColor:
                        "var(--color-border)",
                    }}
                >
                    <div>
                    <button
                        type="button"
                        onClick={() =>
                        onViewDetails(advance)
                        }
                        className="font-medium"
                        style={{
                        color:
                            "var(--color-brand)",
                        }}
                    >
                        {advance.id}
                    </button>

                    <p
                        className="mt-1 text-sm font-medium"
                        style={{
                        color:
                            "var(--color-text)",
                        }}
                    >
                        {advance.employeeName}
                    </p>

                    <p
                        className="mt-1 text-xs"
                        style={{
                        color:
                            "var(--color-text-muted)",
                        }}
                    >
                        {advance.department} ·{" "}
                        {advance.type}
                    </p>
                    </div>

                    <div>
                    <p
                        className="text-sm font-semibold"
                        style={{
                        color:
                            "var(--color-text)",
                        }}
                    >
                        {formatCurrency(
                        advance.amount,
                        )}
                    </p>

                    <p
                        className="mt-1 text-xs"
                        style={{
                        color:
                            "var(--color-text-muted)",
                        }}
                    >
                        Requested{" "}
                        {advance.requestDate}
                    </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() =>
                        onViewDetails(advance)
                        }
                        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                        style={{
                        borderColor:
                            "var(--color-border)",
                        color:
                            "var(--color-text-secondary)",
                        }}
                    >
                        <Eye size={15} />
                        Review
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                        handleApprove(advance)
                        }
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
                        style={{
                        backgroundColor:
                            "var(--color-success)",
                        color: "#ffffff",
                        }}
                    >
                        <CheckCircle2 size={15} />
                        Approve
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                        handleReject(advance)
                        }
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
                        style={{
                        backgroundColor:
                            "var(--color-danger)",
                        color: "#ffffff",
                        }}
                    >
                        <XCircle size={15} />
                        Reject
                    </button>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    );
}