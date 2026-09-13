import {
  CheckCircle2,
  Clock3,
  X,
} from "lucide-react";

import type { AdvanceRecord } from "../../types/advance";

interface AdvanceDetailsProps {
  advance: AdvanceRecord;
  onClose: () => void;
  onRecordRepayment: () => void;
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

function formatDate(date: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

export default function AdvanceDetails({
  advance,
  onClose,
  onRecordRepayment,
}: AdvanceDetailsProps) {
  const outstanding = Math.max(
    advance.amount -
      advance.recovered,
    0,
  );

  const recoveryPercentage =
    advance.amount > 0
      ? Math.min(
          (advance.recovered /
            advance.amount) *
            100,
          100,
        )
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{
          backgroundColor:
            "rgba(0, 0, 0, 0.65)",
        }}
      />

      <div
        className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border shadow-2xl"
        style={{
          backgroundColor:
            "var(--color-surface)",
          borderColor:
            "var(--color-border)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between border-b px-6 py-5"
          style={{
            backgroundColor:
              "var(--color-surface)",
            borderColor:
              "var(--color-border)",
          }}
        >
          <div>
            <p
              className="text-xs uppercase tracking-wider"
              style={{
                color:
                  "var(--color-text-muted)",
              }}
            >
              Advance Details
            </p>

            <h2
              className="mt-1 text-xl font-semibold"
              style={{
                color:
                  "var(--color-text)",
              }}
            >
              {advance.id}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{
              color:
                "var(--color-text-secondary)",
              backgroundColor:
                "var(--color-surface-hover)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor:
                  "var(--color-bg)",
                borderColor:
                  "var(--color-border)",
              }}
            >
              <p
                className="text-xs"
                style={{
                  color:
                    "var(--color-text-muted)",
                }}
              >
                Original Amount
              </p>

              <p
                className="mt-2 text-xl font-semibold"
                style={{
                  color:
                    "var(--color-text)",
                }}
              >
                {formatCurrency(
                  advance.amount,
                )}
              </p>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor:
                  "var(--color-bg)",
                borderColor:
                  "var(--color-border)",
              }}
            >
              <p
                className="text-xs"
                style={{
                  color:
                    "var(--color-text-muted)",
                }}
              >
                Recovered
              </p>

              <p
                className="mt-2 text-xl font-semibold"
                style={{
                  color:
                    "var(--color-success)",
                }}
              >
                {formatCurrency(
                  advance.recovered,
                )}
              </p>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor:
                  "var(--color-bg)",
                borderColor:
                  "var(--color-border)",
              }}
            >
              <p
                className="text-xs"
                style={{
                  color:
                    "var(--color-text-muted)",
                }}
              >
                Outstanding
              </p>

              <p
                className="mt-2 text-xl font-semibold"
                style={{
                  color:
                    "var(--color-text)",
                }}
              >
                {formatCurrency(
                  outstanding,
                )}
              </p>
            </div>
          </div>

          {/* Recovery progress */}
          <div>
            <div className="mb-2 flex justify-between">
              <span
                className="text-sm"
                style={{
                  color:
                    "var(--color-text-secondary)",
                }}
              >
                Recovery Progress
              </span>

              <span
                className="text-sm font-medium"
                style={{
                  color:
                    "var(--color-text)",
                }}
              >
                {Math.round(
                  recoveryPercentage,
                )}
                %
              </span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full"
              style={{
                backgroundColor:
                  "var(--color-surface-hover)",
              }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${recoveryPercentage}%`,
                  backgroundColor:
                    "var(--color-brand)",
                }}
              />
            </div>
          </div>

          {/* Employee + advance information */}
          <div
            className="rounded-xl border"
            style={{
              borderColor:
                "var(--color-border)",
            }}
          >
            <div
              className="border-b px-5 py-4"
              style={{
                borderColor:
                  "var(--color-border)",
              }}
            >
              <h3
                className="font-medium"
                style={{
                  color:
                    "var(--color-text)",
                }}
              >
                Advance Information
              </h3>
            </div>

            <div className="grid gap-5 p-5 md:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Employee"
                value={advance.employeeName}
              />

              <InfoItem
                label="Employee Number"
                value={advance.employeeNumber}
              />

              <InfoItem
                label="Department"
                value={advance.department}
              />

              <InfoItem
                label="Position"
                value={advance.position}
              />

              <InfoItem
                label="Basic Salary"
                value={formatCurrency(
                  advance.basicSalary,
                )}
              />

              <InfoItem
                label="Advance Type"
                value={advance.type}
              />

              <InfoItem
                label="Request Date"
                value={formatDate(
                  advance.requestDate,
                )}
              />

              <InfoItem
                label="Repayment Method"
                value={
                  advance.repaymentMethod
                }
              />

              <InfoItem
                label="Installments"
                value={String(
                  advance.installments,
                )}
              />

              <InfoItem
                label="Installment Amount"
                value={formatCurrency(
                  advance.installmentAmount,
                )}
              />

              <InfoItem
                label="First Deduction"
                value={
                  advance.firstDeductionMonth
                }
              />

              <InfoItem
                label="Status"
                value={advance.status}
              />
            </div>
          </div>

          {/* Reason */}
          <div
            className="rounded-xl border p-5"
            style={{
              borderColor:
                "var(--color-border)",
            }}
          >
            <h3
              className="mb-2 font-medium"
              style={{
                color:
                  "var(--color-text)",
              }}
            >
              Reason
            </h3>

            <p
              className="text-sm leading-6"
              style={{
                color:
                  "var(--color-text-secondary)",
              }}
            >
              {advance.reason || "—"}
            </p>

            {advance.notes && (
              <>
                <h3
                  className="mb-2 mt-5 font-medium"
                  style={{
                    color:
                      "var(--color-text)",
                  }}
                >
                  Notes
                </h3>

                <p
                  className="text-sm leading-6"
                  style={{
                    color:
                      "var(--color-text-secondary)",
                  }}
                >
                  {advance.notes}
                </p>
              </>
            )}
          </div>

          {/* Approval */}
          <div
            className="rounded-xl border"
            style={{
              borderColor:
                "var(--color-border)",
            }}
          >
            <div
              className="border-b px-5 py-4"
              style={{
                borderColor:
                  "var(--color-border)",
              }}
            >
              <h3
                className="font-medium"
                style={{
                  color:
                    "var(--color-text)",
                }}
              >
                Approval Information
              </h3>
            </div>

            <div className="grid gap-5 p-5 md:grid-cols-3">
              <InfoItem
                label="Submitted"
                value={
                  advance.submittedAt
                    ? formatDate(
                        advance.submittedAt,
                      )
                    : "Not submitted"
                }
              />

              <InfoItem
                label="Approved By"
                value={
                  advance.approvedBy ||
                  "—"
                }
              />

              <InfoItem
                label="Approved"
                value={
                  advance.approvedAt
                    ? formatDate(
                        advance.approvedAt,
                      )
                    : "—"
                }
              />
            </div>

            {advance.rejectionReason && (
              <div
                className="border-t p-5"
                style={{
                  borderColor:
                    "var(--color-border)",
                }}
              >
                <p
                  className="text-xs uppercase tracking-wider"
                  style={{
                    color:
                      "var(--color-danger)",
                  }}
                >
                  Rejection Reason
                </p>

                <p
                  className="mt-2 text-sm"
                  style={{
                    color:
                      "var(--color-text-secondary)",
                  }}
                >
                  {
                    advance.rejectionReason
                  }
                </p>
              </div>
            )}
          </div>

          {/* Repayment history */}
          <div
            className="rounded-xl border"
            style={{
              borderColor:
                "var(--color-border)",
            }}
          >
            <div
              className="flex items-center justify-between border-b px-5 py-4"
              style={{
                borderColor:
                  "var(--color-border)",
              }}
            >
              <div>
                <h3
                  className="font-medium"
                  style={{
                    color:
                      "var(--color-text)",
                  }}
                >
                  Repayment History
                </h3>

                <p
                  className="mt-1 text-xs"
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                >
                  {advance.repayments.length}{" "}
                  repayment
                  {advance.repayments.length !==
                  1
                    ? "s"
                    : ""}
                </p>
              </div>

              {outstanding > 0 &&
                [
                  "Paid",
                  "Partially Recovered",
                ].includes(
                  advance.status,
                ) && (
                  <button
                    type="button"
                    onClick={
                      onRecordRepayment
                    }
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
                    style={{
                      backgroundColor:
                        "var(--color-brand)",
                      color: "#090909",
                    }}
                  >
                    <CheckCircle2
                      size={15}
                    />
                    Record Repayment
                  </button>
                )}
            </div>

            {advance.repayments.length ===
            0 ? (
              <div className="px-5 py-10 text-center">
                <Clock3
                  size={28}
                  className="mx-auto mb-2"
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                />

                <p
                  className="text-sm"
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                >
                  No repayments recorded
                  yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">
                  <thead>
                    <tr
                      style={{
                        borderBottom:
                          "1px solid var(--color-border)",
                      }}
                    >
                      <th className="px-5 py-3 text-left text-xs uppercase tracking-wider">
                        Date
                      </th>

                      <th className="px-5 py-3 text-left text-xs uppercase tracking-wider">
                        Amount
                      </th>

                      <th className="px-5 py-3 text-left text-xs uppercase tracking-wider">
                        Method
                      </th>

                      <th className="px-5 py-3 text-left text-xs uppercase tracking-wider">
                        Reference
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {advance.repayments.map(
                      (repayment) => (
                        <tr
                          key={
                            repayment.id
                          }
                          style={{
                            borderBottom:
                              "1px solid var(--color-border)",
                          }}
                        >
                          <td className="px-5 py-4 text-sm">
                            {formatDate(
                              repayment.date,
                            )}
                          </td>

                          <td
                            className="px-5 py-4 text-sm font-medium"
                            style={{
                              color:
                                "var(--color-success)",
                            }}
                          >
                            {formatCurrency(
                              repayment.amount,
                            )}
                          </td>

                          <td className="px-5 py-4 text-sm">
                            {
                              repayment.method
                            }
                          </td>

                          <td className="px-5 py-4 text-sm">
                            {
                              repayment.reference ||
                              "—"
                            }
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p
        className="text-xs"
        style={{
          color:
            "var(--color-text-muted)",
        }}
      >
        {label}
      </p>

      <p
        className="mt-1 text-sm font-medium"
        style={{
          color:
            "var(--color-text)",
        }}
      >
        {value}
      </p>
    </div>
  );
}