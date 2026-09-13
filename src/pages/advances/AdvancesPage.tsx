import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  WalletCards,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useAdvances } from "../../hooks/useAdvances";
import type {
  AdvanceRecord,
  AdvanceStatus,
} from "../../types/advance";

import AdvanceApproval from "./AdvanceApproval";
import AdvanceDetails from "./AdvanceDetails";
import AdvanceForm from "./AdvanceForm";
import AdvanceRepayment from "./AdvanceRepayment";

type AdvanceTab =
  | "register"
  | "new"
  | "approval"
  | "repayment";

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

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status: AdvanceStatus) {
  switch (status) {
    case "Draft":
      return {
        background: "var(--color-surface-hover)",
        color: "var(--color-text-secondary)",
      };

    case "Pending Approval":
      return {
        background: "var(--color-brand-soft)",
        color: "var(--color-brand)",
      };

    case "Approved":
      return {
        background: "var(--color-info)",
        color: "white",
      };

    case "Paid":
      return {
        background: "var(--color-success)",
        color: "white",
      };

    case "Partially Recovered":
      return {
        background: "var(--color-brand-soft)",
        color: "var(--color-brand)",
      };

    case "Fully Recovered":
      return {
        background: "var(--color-success)",
        color: "white",
      };

    case "Rejected":
      return {
        background: "var(--color-danger)",
        color: "white",
      };

    case "Cancelled":
      return {
        background: "var(--color-surface-hover)",
        color: "var(--color-text-muted)",
      };

    default:
      return {
        background: "var(--color-surface-hover)",
        color: "var(--color-text-secondary)",
      };
  }
}

function StatusBadge({
  status,
}: {
  status: AdvanceStatus;
}) {
  const style = getStatusClass(status);

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        backgroundColor: style.background,
        color: style.color,
      }}
    >
      {status}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-sm"
            style={{
              color: "var(--color-text-secondary)",
            }}
          >
            {label}
          </p>

          <p
            className="mt-2 text-2xl font-semibold tracking-tight"
            style={{
              color: "var(--color-text)",
            }}
          >
            {value}
          </p>
        </div>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{
            backgroundColor:
              "var(--color-brand-soft)",
            color: "var(--color-brand)",
          }}
        >
          {icon}
        </div>
      </div>

      <p
        className="mt-3 text-xs"
        style={{
          color: "var(--color-text-muted)",
        }}
      >
        {description}
      </p>
    </div>
  );
}

export function AdvancesPage() {
  const { advances, updateAdvanceStatus } =
    useAdvances();

  const [activeTab, setActiveTab] =
    useState<AdvanceTab>("register");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AdvanceStatus | "All">("All");
  const [typeFilter, setTypeFilter] =
    useState<string>("All");

  const [selectedAdvance, setSelectedAdvance] =
    useState<AdvanceRecord | null>(null);

  const [openMenu, setOpenMenu] =
    useState<string | null>(null);

  const advanceTypes = useMemo(() => {
    return Array.from(
      new Set(
        advances.map(
          (advance) => advance.type,
        ),
      ),
    );
  }, [advances]);

  const filteredAdvances = useMemo(() => {
    const query = search.trim().toLowerCase();

    return advances.filter((advance) => {
      const matchesSearch =
        !query ||
        advance.id
          .toLowerCase()
          .includes(query) ||
        advance.employeeName
          .toLowerCase()
          .includes(query) ||
        advance.employeeNumber
          .toLowerCase()
          .includes(query) ||
        advance.department
          .toLowerCase()
          .includes(query) ||
        advance.type
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        advance.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        advance.type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    advances,
    search,
    statusFilter,
    typeFilter,
  ]);

  const totalAdvanced = useMemo(
    () =>
      advances.reduce(
        (sum, advance) =>
          sum + advance.amount,
        0,
      ),
    [advances],
  );

  const totalRecovered = useMemo(
    () =>
      advances.reduce(
        (sum, advance) =>
          sum + advance.recovered,
        0,
      ),
    [advances],
  );

  const totalOutstanding =
    totalAdvanced - totalRecovered;

  const pendingApproval = advances.filter(
    (advance) =>
      advance.status === "Pending Approval",
  ).length;

  const handleOpenAdvance = (
    advance: AdvanceRecord,
  ) => {
    setSelectedAdvance(advance);
    setOpenMenu(null);
  };

  const handleMarkAsPaid = (
    advance: AdvanceRecord,
  ) => {
    updateAdvanceStatus(
      advance.id,
      "Paid",
    );

    setOpenMenu(null);
  };

  const handleCancel = (
    advance: AdvanceRecord,
  ) => {
    updateAdvanceStatus(
      advance.id,
      "Cancelled",
    );

    setOpenMenu(null);
  };

  const tabs = [
    {
      id: "register" as const,
      label: "Register",
      count: advances.length,
    },
    {
      id: "new" as const,
      label: "New Advance",
    },
    {
      id: "approval" as const,
      label: "Approval",
      count: pendingApproval,
    },
    {
      id: "repayment" as const,
      label: "Repayment",
    },
  ];

  return (
    <div
      className="min-h-full p-6 lg:p-8"
      style={{
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Header */}
      <div className="mb-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div
              className="mb-2 flex items-center gap-2 text-sm"
              style={{
                color: "var(--color-text-muted)",
              }}
            >
              <span>Payroll</span>

              <span>/</span>

              <span
                style={{
                  color: "var(--color-brand)",
                }}
              >
                Advances
              </span>
            </div>

            <h1
              className="text-3xl font-semibold tracking-tight"
              style={{
                color: "var(--color-text)",
              }}
            >
              Advances
            </h1>

            <p
              className="mt-2 max-w-2xl text-sm"
              style={{
                color:
                  "var(--color-text-secondary)",
              }}
            >
              Manage employee advances,
              approvals, repayments and
              outstanding balances.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setActiveTab("new")
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-all"
            style={{
              backgroundColor:
                "var(--color-brand)",
              color: "#090909",
            }}
          >
            <Plus size={18} />
            New Advance
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Advances"
          value={formatCurrency(totalAdvanced)}
          icon={<WalletCards size={19} />}
          description={`${advances.length} advance records`}
        />

        <StatCard
          label="Outstanding"
          value={formatCurrency(
            totalOutstanding,
          )}
          icon={<Clock3 size={19} />}
          description="Amount still to be recovered"
        />

        <StatCard
          label="Recovered"
          value={formatCurrency(totalRecovered)}
          icon={<CheckCircle2 size={19} />}
          description="Total amount recovered"
        />

        <StatCard
          label="Pending Approval"
          value={String(pendingApproval)}
          icon={<Clock3 size={19} />}
          description="Requests waiting for review"
        />
      </div>

      {/* Module navigation */}
      <div
        className="mb-6 overflow-x-auto rounded-xl border"
        style={{
          backgroundColor:
            "var(--color-surface)",
          borderColor:
            "var(--color-border)",
        }}
      >
        <div className="flex min-w-max">
          {tabs.map((tab) => {
            const active =
              activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className="relative flex h-14 items-center gap-2 px-5 text-sm font-medium transition-colors"
                style={{
                  color: active
                    ? "var(--color-brand)"
                    : "var(--color-text-secondary)",
                }}
              >
                {tab.label}

                {typeof tab.count ===
                  "number" && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px]"
                    style={{
                      backgroundColor:
                        active
                          ? "var(--color-brand-soft)"
                          : "var(--color-surface-hover)",
                      color: active
                        ? "var(--color-brand)"
                        : "var(--color-text-muted)",
                    }}
                  >
                    {tab.count}
                  </span>
                )}

                {active && (
                  <span
                    className="absolute inset-x-4 bottom-0 h-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        "var(--color-brand)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* REGISTER */}
      {activeTab === "register" && (
        <div>
          {/* Filters */}
          <div
            className="mb-5 rounded-xl border p-4"
            style={{
              backgroundColor:
                "var(--color-surface)",
              borderColor:
                "var(--color-border)",
            }}
          >
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search employee, advance number, department..."
                  className="h-11 w-full rounded-lg border pl-10 pr-4 text-sm outline-none transition"
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

              <div className="relative">
                <Filter
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target
                        .value as
                        | AdvanceStatus
                        | "All",
                    )
                  }
                  className="h-11 min-w-48 appearance-none rounded-lg border pl-9 pr-10 text-sm outline-none"
                  style={{
                    backgroundColor:
                      "var(--color-bg)",
                    borderColor:
                      "var(--color-border)",
                    color:
                      "var(--color-text)",
                  }}
                >
                  <option value="All">
                    All Statuses
                  </option>

                  <option value="Draft">
                    Draft
                  </option>

                  <option value="Pending Approval">
                    Pending Approval
                  </option>

                  <option value="Approved">
                    Approved
                  </option>

                  <option value="Paid">
                    Paid
                  </option>

                  <option value="Partially Recovered">
                    Partially Recovered
                  </option>

                  <option value="Fully Recovered">
                    Fully Recovered
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                />
              </div>

              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(
                      event.target.value,
                    )
                  }
                  className="h-11 min-w-48 appearance-none rounded-lg border px-4 pr-10 text-sm outline-none"
                  style={{
                    backgroundColor:
                      "var(--color-bg)",
                    borderColor:
                      "var(--color-border)",
                    color:
                      "var(--color-text)",
                  }}
                >
                  <option value="All">
                    All Advance Types
                  </option>

                  {advanceTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    ),
                  )}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Register table */}
          <div
            className="overflow-hidden rounded-xl border"
            style={{
              backgroundColor:
                "var(--color-surface)",
              borderColor:
                "var(--color-border)",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr
                    style={{
                      borderBottom:
                        "1px solid var(--color-border)",
                    }}
                  >
                    {[
                      "Advance",
                      "Employee",
                      "Type",
                      "Amount",
                      "Recovered",
                      "Outstanding",
                      "Request Date",
                      "Status",
                      "",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider"
                        style={{
                          color:
                            "var(--color-text-muted)",
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredAdvances.map(
                    (advance) => {
                      const outstanding =
                        Math.max(
                          advance.amount -
                            advance.recovered,
                          0,
                        );

                      return (
                        <tr
                          key={advance.id}
                          className="transition-colors"
                          style={{
                            borderBottom:
                              "1px solid var(--color-border)",
                          }}
                        >
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenAdvance(
                                  advance,
                                )
                              }
                              className="font-medium hover:underline"
                              style={{
                                color:
                                  "var(--color-brand)",
                              }}
                            >
                              {advance.id}
                            </button>
                          </td>

                          <td className="px-5 py-4">
                            <div>
                              <p
                                className="text-sm font-medium"
                                style={{
                                  color:
                                    "var(--color-text)",
                                }}
                              >
                                {
                                  advance.employeeName
                                }
                              </p>

                              <p
                                className="mt-0.5 text-xs"
                                style={{
                                  color:
                                    "var(--color-text-muted)",
                                }}
                              >
                                {
                                  advance.employeeNumber
                                }
                              </p>
                            </div>
                          </td>

                          <td
                            className="px-5 py-4 text-sm"
                            style={{
                              color:
                                "var(--color-text-secondary)",
                            }}
                          >
                            {advance.type}
                          </td>

                          <td
                            className="px-5 py-4 text-sm font-medium"
                            style={{
                              color:
                                "var(--color-text)",
                            }}
                          >
                            {formatCurrency(
                              advance.amount,
                            )}
                          </td>

                          <td
                            className="px-5 py-4 text-sm"
                            style={{
                              color:
                                "var(--color-success)",
                            }}
                          >
                            {formatCurrency(
                              advance.recovered,
                            )}
                          </td>

                          <td
                            className="px-5 py-4 text-sm font-medium"
                            style={{
                              color:
                                "var(--color-text)",
                            }}
                          >
                            {formatCurrency(
                              outstanding,
                            )}
                          </td>

                          <td
                            className="px-5 py-4 text-sm"
                            style={{
                              color:
                                "var(--color-text-secondary)",
                            }}
                          >
                            {formatDate(
                              advance.requestDate,
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge
                              status={
                                advance.status
                              }
                            />
                          </td>

                          <td className="px-5 py-4">
                            <div className="relative flex justify-end">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenMenu(
                                    openMenu ===
                                      advance.id
                                      ? null
                                      : advance.id,
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                                style={{
                                  color:
                                    "var(--color-text-secondary)",
                                }}
                              >
                                <MoreHorizontal
                                  size={18}
                                />
                              </button>

                              {openMenu ===
                                advance.id && (
                                <div
                                  className="absolute right-0 top-10 z-20 w-48 overflow-hidden rounded-lg border p-1 shadow-xl"
                                  style={{
                                    backgroundColor:
                                      "var(--color-surface-raised)",
                                    borderColor:
                                      "var(--color-border)",
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenAdvance(
                                        advance,
                                      )
                                    }
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm"
                                    style={{
                                      color:
                                        "var(--color-text-secondary)",
                                    }}
                                  >
                                    <Eye
                                      size={15}
                                    />
                                    View Details
                                  </button>

                                  {advance.status ===
                                    "Pending Approval" && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenMenu(
                                          null,
                                        );
                                        setActiveTab(
                                          "approval",
                                        );
                                      }}
                                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm"
                                      style={{
                                        color:
                                          "var(--color-text-secondary)",
                                      }}
                                    >
                                      <CheckCircle2
                                        size={15}
                                      />
                                      Review
                                    </button>
                                  )}

                                  {advance.status ===
                                    "Approved" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleMarkAsPaid(
                                          advance,
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm"
                                      style={{
                                        color:
                                          "var(--color-text-secondary)",
                                      }}
                                    >
                                      <CheckCircle2
                                        size={15}
                                      />
                                      Mark as Paid
                                    </button>
                                  )}

                                  {[
                                    "Paid",
                                    "Partially Recovered",
                                  ].includes(
                                    advance.status,
                                  ) && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenMenu(
                                          null,
                                        );
                                        setActiveTab(
                                          "repayment",
                                        );
                                      }}
                                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm"
                                      style={{
                                        color:
                                          "var(--color-text-secondary)",
                                      }}
                                    >
                                      <WalletCards
                                        size={15}
                                      />
                                      Record Repayment
                                    </button>
                                  )}

                                  {[
                                    "Draft",
                                    "Pending Approval",
                                    "Approved",
                                  ].includes(
                                    advance.status,
                                  ) && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleCancel(
                                          advance,
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm"
                                      style={{
                                        color:
                                          "var(--color-danger)",
                                      }}
                                    >
                                      <XCircle
                                        size={15}
                                      />
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>

            {filteredAdvances.length === 0 && (
              <div className="px-6 py-16 text-center">
                <WalletCards
                  size={32}
                  className="mx-auto mb-3"
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                />

                <p
                  className="text-sm font-medium"
                  style={{
                    color:
                      "var(--color-text)",
                  }}
                >
                  No advances found
                </p>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                >
                  Try changing your search or
                  filters.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEW ADVANCE */}
      {activeTab === "new" && (
        <AdvanceForm
          onCancel={() =>
            setActiveTab("register")
          }
          onCreated={() =>
            setActiveTab("register")
          }
        />
      )}

      {/* APPROVAL */}
      {activeTab === "approval" && (
        <AdvanceApproval
          onViewDetails={(advance) =>
            setSelectedAdvance(advance)
          }
        />
      )}

      {/* REPAYMENT */}
      {activeTab === "repayment" && (
        <AdvanceRepayment
          onViewDetails={(advance) =>
            setSelectedAdvance(advance)
          }
        />
      )}

      {/* DETAILS */}
      {selectedAdvance && (
        <AdvanceDetails
          advance={selectedAdvance}
          onClose={() =>
            setSelectedAdvance(null)
          }
          onRecordRepayment={() => {
            setSelectedAdvance(null);
            setActiveTab("repayment");
          }}
        />
      )}
    </div>
  );
}