import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  WalletCards,
} from "lucide-react";

import { useAdvances } from "../../hooks/useAdvances";
import type { AdvanceRecord } from "../../types/advance";

interface AdvanceRepaymentProps {
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

export default function AdvanceRepayment({
  onViewDetails,
}: AdvanceRepaymentProps) {
  const {
    advances,
    recordRepayment,
  } = useAdvances();

  const [selectedId, setSelectedId] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [method, setMethod] =
    useState<
      "Payroll Deduction" | "Manual" | "Both"
    >("Payroll Deduction");

  const [reference, setReference] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const outstandingAdvances = useMemo(
    () =>
      advances.filter(
        (advance) =>
          advance.recovered <
            advance.amount &&
          [
            "Paid",
            "Partially Recovered",
          ].includes(advance.status),
      ),
    [advances],
  );

  const selectedAdvance =
    outstandingAdvances.find(
      (advance) =>
        advance.id === selectedId,
    );

  const totalOutstanding = outstandingAdvances.reduce(
    (sum, advance) =>
      sum +
      (advance.amount -
        advance.recovered),
    0,
  );

  const thisMonthRecovered = advances.reduce(
    (sum, advance) => {
      const currentMonth =
        new Date()
          .toISOString()
          .slice(0, 7);

      const recoveredThisMonth =
        advance.repayments
          .filter(
            (repayment) =>
              repayment.date.startsWith(
                currentMonth,
              ),
          )
          .reduce(
            (total, repayment) =>
              total + repayment.amount,
            0,
          );

      return sum + recoveredThisMonth;
    },
    0,
  );

  const handleSubmit = () => {
    if (
      !selectedAdvance ||
      !amount ||
      Number(amount) <= 0
    ) {
      return;
    }

    const repaymentAmount =
      Number(amount);

    const outstanding =
      selectedAdvance.amount -
      selectedAdvance.recovered;

    if (repaymentAmount > outstanding) {
      return;
    }

    recordRepayment(
      selectedAdvance.id,
      {
        date: new Date()
          .toISOString()
          .slice(0, 10),
        amount: repaymentAmount,
        method,
        reference:
          reference || undefined,
        notes:
          notes || undefined,
      },
    );

    setAmount("");
    setReference("");
    setNotes("");
    setSelectedId("");
  };

  return (
    <div>
      <div className="mb-6">
        <h2
          className="text-xl font-semibold"
          style={{
            color:
              "var(--color-text)",
          }}
        >
          Advance Repayment
        </h2>

        <p
          className="mt-1 text-sm"
          style={{
            color:
              "var(--color-text-secondary)",
          }}
        >
          Record employee advance repayments
          and monitor outstanding balances.
        </p>
      </div>

      {/* Repayment statistics */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor:
              "var(--color-surface)",
            borderColor:
              "var(--color-border)",
          }}
        >
          <p
            className="text-sm"
            style={{
              color:
                "var(--color-text-secondary)",
            }}
          >
            Outstanding Total
          </p>

          <p
            className="mt-2 text-2xl font-semibold"
            style={{
              color:
                "var(--color-text)",
            }}
          >
            {formatCurrency(
              totalOutstanding,
            )}
          </p>
        </div>

        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor:
              "var(--color-surface)",
            borderColor:
              "var(--color-border)",
          }}
        >
          <p
            className="text-sm"
            style={{
              color:
                "var(--color-text-secondary)",
            }}
          >
            This Month Recovered
          </p>

          <p
            className="mt-2 text-2xl font-semibold"
            style={{
              color:
                "var(--color-success)",
            }}
          >
            {formatCurrency(
              thisMonthRecovered,
            )}
          </p>
        </div>

        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor:
              "var(--color-surface)",
            borderColor:
              "var(--color-border)",
          }}
        >
          <p
            className="text-sm"
            style={{
              color:
                "var(--color-text-secondary)",
            }}
          >
            Outstanding Advances
          </p>

          <p
            className="mt-2 text-2xl font-semibold"
            style={{
              color:
                "var(--color-text)",
            }}
          >
            {outstandingAdvances.length}
          </p>
        </div>
      </div>

      {/* Repayment form */}
      <div
        className="mb-6 rounded-xl border p-6"
        style={{
          backgroundColor:
            "var(--color-surface)",
          borderColor:
            "var(--color-border)",
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{
              backgroundColor:
                "var(--color-brand-soft)",
              color:
                "var(--color-brand)",
            }}
          >
            <WalletCards size={19} />
          </div>

          <div>
            <h3
              className="font-medium"
              style={{
                color:
                  "var(--color-text)",
              }}
            >
              Record Repayment
            </h3>

            <p
              className="text-xs"
              style={{
                color:
                  "var(--color-text-muted)",
              }}
            >
              Add a recovery against an
              outstanding advance.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{
                color:
                  "var(--color-text)",
              }}
            >
              Advance
            </label>

            <select
              value={selectedId}
              onChange={(event) =>
                setSelectedId(
                  event.target.value,
                )
              }
              className="h-11 w-full rounded-lg border px-3 text-sm outline-none"
              style={{
                backgroundColor:
                  "var(--color-bg)",
                borderColor:
                  "var(--color-border)",
                color:
                  "var(--color-text)",
              }}
            >
              <option value="">
                Select advance
              </option>

              {outstandingAdvances.map(
                (advance) => (
                  <option
                    key={advance.id}
                    value={advance.id}
                  >
                    {advance.id} —{" "}
                    {advance.employeeName}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{
                color:
                  "var(--color-text)",
              }}
            >
              Amount
            </label>

            <input
              type="number"
              min="0"
              max={
                selectedAdvance
                  ? selectedAdvance.amount -
                    selectedAdvance.recovered
                  : undefined
              }
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value,
                )
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

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{
                color:
                  "var(--color-text)",
              }}
            >
              Method
            </label>

            <select
              value={method}
              onChange={(event) =>
                setMethod(
                  event.target
                    .value as
                    | "Payroll Deduction"
                    | "Manual"
                    | "Both",
                )
              }
              className="h-11 w-full rounded-lg border px-3 text-sm outline-none"
              style={{
                backgroundColor:
                  "var(--color-bg)",
                borderColor:
                  "var(--color-border)",
                color:
                  "var(--color-text)",
              }}
            >
              <option>
                Payroll Deduction
              </option>

              <option>
                Manual
              </option>

              <option>
                Both
              </option>
            </select>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              style={{
                color:
                  "var(--color-text)",
              }}
            >
              Reference
            </label>

            <input
              value={reference}
              onChange={(event) =>
                setReference(
                  event.target.value,
                )
              }
              placeholder="Payment reference"
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

        {selectedAdvance && (
          <div
            className="mt-5 rounded-lg border p-4"
            style={{
              backgroundColor:
                "var(--color-bg)",
              borderColor:
                "var(--color-border)",
            }}
          >
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div>
                <span
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                >
                  Original Amount
                </span>

                <p
                  className="mt-1 font-medium"
                  style={{
                    color:
                      "var(--color-text)",
                  }}
                >
                  {formatCurrency(
                    selectedAdvance.amount,
                  )}
                </p>
              </div>

              <div>
                <span
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                >
                  Recovered
                </span>

                <p
                  className="mt-1 font-medium"
                  style={{
                    color:
                      "var(--color-success)",
                  }}
                >
                  {formatCurrency(
                    selectedAdvance.recovered,
                  )}
                </p>
              </div>

              <div>
                <span
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                >
                  Outstanding
                </span>

                <p
                  className="mt-1 font-medium"
                  style={{
                    color:
                      "var(--color-text)",
                  }}
                >
                  {formatCurrency(
                    selectedAdvance.amount -
                      selectedAdvance.recovered,
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5">
          <label
            className="mb-2 block text-sm font-medium"
            style={{
              color:
                "var(--color-text)",
            }}
          >
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={3}
            placeholder="Optional repayment notes..."
            className="w-full rounded-lg border p-3 text-sm outline-none"
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

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !selectedAdvance ||
              !amount
            }
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor:
                "var(--color-brand)",
              color: "#090909",
            }}
          >
            <CheckCircle2 size={16} />
            Record Repayment
          </button>
        </div>
      </div>

      {/* Outstanding list */}
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          backgroundColor:
            "var(--color-surface)",
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
            Outstanding Advances
          </h3>
        </div>

        <div className="divide-y">
          {outstandingAdvances.map(
            (advance) => (
              <div
                key={advance.id}
                className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <p
                    className="font-medium"
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
                    {advance.id} ·{" "}
                    {advance.type}
                  </p>
                </div>

                <div className="text-sm">
                  <span
                    style={{
                      color:
                        "var(--color-text-muted)",
                    }}
                  >
                    Outstanding
                  </span>

                  <p
                    className="mt-1 font-semibold"
                    style={{
                      color:
                        "var(--color-text)",
                    }}
                  >
                    {formatCurrency(
                      advance.amount -
                        advance.recovered,
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onViewDetails(advance)
                  }
                  className="inline-flex items-center gap-2 self-start rounded-lg border px-3 py-2 text-sm lg:self-auto"
                  style={{
                    borderColor:
                      "var(--color-border)",
                    color:
                      "var(--color-text-secondary)",
                  }}
                >
                  <Eye size={15} />
                  Details
                </button>
              </div>
            ),
          )}

          {outstandingAdvances.length ===
            0 && (
            <div className="px-6 py-12 text-center">
              <p
                className="text-sm"
                style={{
                  color:
                    "var(--color-text-muted)",
                }}
              >
                No outstanding advances.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}