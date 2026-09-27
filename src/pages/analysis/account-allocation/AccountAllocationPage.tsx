import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  Edit3,
  FileText,
  GitBranch,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useAccountAllocations } from "../../../hooks/useAccountAllocation";
import { useCostCenters } from "../../../hooks/useCostCenters";
import { useGLAccounts } from "../../../hooks/useGLAccounts";

import type { AccountAllocation, AllocationType } from "../../../types/accountAllocation";

interface AllocationForm {
  code: string;
  description: string;
  allocationType: AllocationType;
  costCenterId: string;
  debitGLAccountId: string;
  creditGLAccountId: string;
  active: boolean;
}

const emptyForm: AllocationForm = {
  code: "",
  description: "",
  allocationType: "salary",
  costCenterId: "",
  debitGLAccountId: "",
  creditGLAccountId: "",
  active: true,
};

const allocationTypeLabels: Record<
  AllocationType,
  string
> = {
  salary: "Salary",
  allowance: "Allowance",
  deduction: "Deduction",
  advance: "Advance",
  loan: "Loan",
  other: "Other",
};

export function AccountAllocationPage() {
  const {
    allocations,
    addAllocation,
    updateAllocation,
    deleteAllocation,
    toggleAllocationStatus,
  } = useAccountAllocations();

  const { costCenters } = useCostCenters();
  const { accounts } = useGLAccounts();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [typeFilter, setTypeFilter] =
    useState<"all" | AllocationType>("all");

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [editingAllocation, setEditingAllocation] =
    useState<AccountAllocation | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<AccountAllocation | null>(null);

  const [form, setForm] =
    useState<AllocationForm>(emptyForm);

  const filteredAllocations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allocations.filter((allocation) => {
      const costCenter = costCenters.find(
        (item) => item.id === allocation.costCenterId
      );

      const debitAccount = accounts.find(
        (item) =>
          item.id === allocation.debitGLAccountId
      );

      const creditAccount = accounts.find(
        (item) =>
          item.id === allocation.creditGLAccountId
      );

      const searchableText = [
        allocation.code,
        allocation.description,
        allocationTypeLabels[
          allocation.allocationType
        ],
        costCenter?.code ?? "",
        costCenter?.name ?? "",
        debitAccount?.accountNumber ?? "",
        debitAccount?.description ?? "",
        creditAccount?.accountNumber ?? "",
        creditAccount?.description ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          allocation.active) ||
        (statusFilter === "inactive" &&
          !allocation.active);

      const matchesType =
        typeFilter === "all" ||
        allocation.allocationType === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    allocations,
    costCenters,
    accounts,
    search,
    statusFilter,
    typeFilter,
  ]);

  const activeCount = allocations.filter(
    (item) => item.active
  ).length;

  function getCostCenter(id: string) {
    return costCenters.find(
      (item) => item.id === id
    );
  }

  function getGLAccount(id: string) {
    return accounts.find(
      (item) => item.id === id
    );
  }

  function openCreateModal() {
    setEditingAllocation(null);

    setForm({
      ...emptyForm,
      costCenterId:
        costCenters.find((item) => item.active)?.id ??
        "",
      debitGLAccountId:
        accounts.find((item) => item.active)?.id ??
        "",
      creditGLAccountId:
        accounts.find((item) => item.active)?.id ??
        "",
    });

    setIsFormOpen(true);
  }

  function openEditModal(
    allocation: AccountAllocation
  ) {
    setEditingAllocation(allocation);

    setForm({
      code: allocation.code,
      description: allocation.description,
      allocationType: allocation.allocationType,
      costCenterId: allocation.costCenterId,
      debitGLAccountId:
        allocation.debitGLAccountId,
      creditGLAccountId:
        allocation.creditGLAccountId,
      active: allocation.active,
    });

    setIsFormOpen(true);
  }

  function closeFormModal() {
    setIsFormOpen(false);
    setEditingAllocation(null);
    setForm(emptyForm);
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const code = form.code.trim();
    const description = form.description.trim();

    if (
      !code ||
      !description ||
      !form.costCenterId ||
      !form.debitGLAccountId ||
      !form.creditGLAccountId
    ) {
      return;
    }

    if (
      form.debitGLAccountId ===
      form.creditGLAccountId
    ) {
      window.alert(
        "Debit and Credit GL accounts must be different."
      );
      return;
    }

    const duplicate = allocations.some(
      (allocation) =>
        allocation.code.toLowerCase() ===
          code.toLowerCase() &&
        allocation.id !== editingAllocation?.id
    );

    if (duplicate) {
      window.alert(
        "An account allocation with this code already exists."
      );
      return;
    }

    const payload = {
      code,
      description,
      allocationType: form.allocationType,
      costCenterId: form.costCenterId,
      debitGLAccountId:
        form.debitGLAccountId,
      creditGLAccountId:
        form.creditGLAccountId,
      active: form.active,
    };

    if (editingAllocation) {
      updateAllocation(
        editingAllocation.id,
        payload
      );
    } else {
      addAllocation(payload);
    }

    closeFormModal();
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    deleteAllocation(deleteTarget.id);
    setDeleteTarget(null);
  }

  const activeCostCenters = costCenters.filter(
    (item) => item.active
  );

  const activeGLAccounts = accounts.filter(
    (item) => item.active
  );

  return (
    <div className="min-h-full bg-[var(--color-bg)]">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <GitBranch size={14} />

              <span>Dashboard</span>
              <span>/</span>
              <span>Input Operations</span>
              <span>/</span>

              <span className="text-[var(--color-text-secondary)]">
                Account Allocation
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)] sm:text-3xl">
              Account Allocation
            </h1>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 text-sm font-semibold text-black transition-colors hover:bg-[var(--color-brand-hover)]"
          >
            <Plus size={17} />
            New Allocation
          </button>
        </div>

        {/* SUMMARY */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Total Allocations"
            value={allocations.length.toString()}
            icon={GitBranch}
          />

          <SummaryCard
            label="Active Allocations"
            value={activeCount.toString()}
            icon={Check}
          />

          <SummaryCard
            label="Inactive Allocations"
            value={(allocations.length - activeCount).toString()}
            icon={FileText}
          />
        </div>

        {/* ALLOCATION FLOW */}
        <div className="mb-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 lg:p-6">
        <div className="mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand)]">
            Nominal Analysis
            </p>

            <h2 className="mt-1 text-sm font-semibold text-[var(--color-text)]">
            Allocation Flow
            </h2>
        </div>

        {/* Desktop: horizontal / Tablet & Mobile: vertical */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-3">

            {/* 01 — Payroll Item */}
            <div className="min-w-0 flex-1">
            <FlowItem
                number="01"
                title="Payroll Item"
                description="Salary / allowance / deduction"
            />
            </div>

            {/* Arrow */}
            <FlowArrow />

            {/* 02 — Cost Center */}
            <div className="min-w-0 flex-1">
            <FlowItem
                number="02"
                title="Cost Center"
                description="Organizational destination"
            />
            </div>

            {/* Arrow */}
            <FlowArrow />

            {/* Debit / Credit */}
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <FlowAccount
                type="Debit"
                icon={ArrowUpRight}
            />

            <FlowAccount
                type="Credit"
                icon={ArrowDownLeft}
            />
            </div>
        </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">

          {/* TOOLBAR */}
          <div className="flex flex-col gap-3 border-b border-[var(--color-border)] p-4 xl:flex-row xl:items-center xl:justify-between">

            <div className="relative w-full xl:max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search allocation..."
                className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] pl-9 pr-4 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FilterButton
                label="All"
                active={statusFilter === "all"}
                onClick={() =>
                  setStatusFilter("all")
                }
              />

              <FilterButton
                label="Active"
                active={statusFilter === "active"}
                onClick={() =>
                  setStatusFilter("active")
                }
              />

              <FilterButton
                label="Inactive"
                active={statusFilter === "inactive"}
                onClick={() =>
                  setStatusFilter("inactive")
                }
              />

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(
                    event.target.value as
                      | "all"
                      | AllocationType
                  )
                }
                className="h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-xs text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-brand)]"
              >
                <option value="all">
                  All Types
                </option>

                {(
                  Object.keys(
                    allocationTypeLabels
                  ) as AllocationType[]
                ).map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {allocationTypeLabels[type]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Allocation
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Type
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Cost Center
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Debit GL
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Credit GL
                  </th>

                  <th className="px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Status
                  </th>

                  <th className="w-32 px-4 py-3" />
                </tr>
              </thead>

              <tbody>
                {filteredAllocations.map(
                  (allocation) => {
                    const costCenter =
                      getCostCenter(
                        allocation.costCenterId
                      );

                    const debitAccount =
                      getGLAccount(
                        allocation.debitGLAccountId
                      );

                    const creditAccount =
                      getGLAccount(
                        allocation.creditGLAccountId
                      );

                    return (
                      <tr
                        key={allocation.id}
                        className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)]"
                      >
                        <td className="px-5 py-4">
                          <div>
                            <span className="font-mono text-sm font-semibold text-[var(--color-brand)]">
                              {allocation.code}
                            </span>

                            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                              {allocation.description}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-[var(--color-brand-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--color-brand)]">
                            {
                              allocationTypeLabels[
                                allocation.allocationType
                              ]
                            }
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {costCenter ? (
                            <div>
                              <p className="font-mono text-xs font-semibold text-[var(--color-text)]">
                                {costCenter.code}
                              </p>

                              <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                                {costCenter.name}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-[var(--color-danger)]">
                              Missing cost center
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {debitAccount ? (
                            <div>
                              <p className="font-mono text-xs font-semibold text-[var(--color-danger)]">
                                {debitAccount.accountNumber}
                              </p>

                              <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                                {debitAccount.description}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-[var(--color-danger)]">
                              Missing account
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {creditAccount ? (
                            <div>
                              <p className="font-mono text-xs font-semibold text-[var(--color-success)]">
                                {creditAccount.accountNumber}
                              </p>

                              <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                                {creditAccount.description}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-[var(--color-danger)]">
                              Missing account
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              toggleAllocationStatus(
                                allocation.id
                              )
                            }
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              allocation.active
                                ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                                : "bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)]"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                allocation.active
                                  ? "bg-[var(--color-success)]"
                                  : "bg-[var(--color-text-muted)]"
                              }`}
                            />

                            {allocation.active
                              ? "Active"
                              : "Inactive"}
                          </button>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              title="Edit"
                              onClick={() =>
                                openEditModal(
                                  allocation
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand)]"
                            >
                              <Edit3 size={15} />
                            </button>

                            <button
                              type="button"
                              title="Delete"
                              onClick={() =>
                                setDeleteTarget(
                                  allocation
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
                            >
                              <Trash2 size={15} />
                            </button>

                            <button
                              type="button"
                              title="More"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                            >
                              <MoreHorizontal size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>

            {filteredAllocations.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-brand-soft)]">
                  <GitBranch
                    size={20}
                    className="text-[var(--color-brand)]"
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[var(--color-text)]">
                  No allocations found
                </h3>

                <p className="mt-1 max-w-sm text-xs text-[var(--color-text-secondary)]">
                  {search
                    ? "Try changing your search criteria."
                    : "Create your first account allocation to get started."}
                </p>

                {!search && (
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-3 py-2 text-xs font-semibold text-black hover:bg-[var(--color-brand-hover)]"
                  >
                    <Plus size={14} />
                    Create Allocation
                  </button>
                )}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between border-t border-[var(--color-border)] px-5 py-3">
            <span className="text-[10px] text-[var(--color-text-muted)]">
              Showing {filteredAllocations.length} of{" "}
              {allocations.length} allocations
            </span>

            <span className="text-[10px] text-[var(--color-text-muted)]">
              Active:{" "}
              <span className="font-semibold text-[var(--color-text-secondary)]">
                {activeCount}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl">

            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <div>
                <h2 className="text-base font-semibold text-[var(--color-text)]">
                  {editingAllocation
                    ? "Edit Account Allocation"
                    : "New Account Allocation"}
                </h2>

                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  Configure the debit and credit accounts
                  for this nominal analysis rule.
                </p>
              </div>

              <button
                type="button"
                onClick={closeFormModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5 p-6">

                {/* BASIC INFORMATION */}
                <div>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand)]">
                    Allocation Information
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <FormField
                      label="Allocation Code"
                      required
                    >
                      <input
                        value={form.code}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            code: event.target.value,
                          }))
                        }
                        placeholder="e.g. SAL-001"
                        className={inputClass}
                        required
                      />
                    </FormField>

                    <FormField
                      label="Allocation Type"
                      required
                    >
                      <select
                        value={form.allocationType}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            allocationType:
                              event.target.value as AllocationType,
                          }))
                        }
                        className={inputClass}
                      >
                        {(
                          Object.keys(
                            allocationTypeLabels
                          ) as AllocationType[]
                        ).map((type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {
                              allocationTypeLabels[
                                type
                              ]
                            }
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <div className="sm:col-span-2">
                      <FormField
                        label="Description"
                        required
                      >
                        <input
                          value={form.description}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              description:
                                event.target.value,
                            }))
                          }
                          placeholder="e.g. Basic salary allocation"
                          className={inputClass}
                          required
                        />
                      </FormField>
                    </div>
                  </div>
                </div>

                {/* COST CENTER */}
                <div>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand)]">
                    Organizational Allocation
                  </p>

                  <FormField
                    label="Cost Center"
                    required
                  >
                    <select
                      value={form.costCenterId}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          costCenterId:
                            event.target.value,
                        }))
                      }
                      className={inputClass}
                      required
                    >
                      <option value="">
                        Select cost center
                      </option>

                      {activeCostCenters.map(
                        (costCenter) => (
                          <option
                            key={costCenter.id}
                            value={costCenter.id}
                          >
                            {costCenter.code} —{" "}
                            {costCenter.name}
                          </option>
                        )
                      )}
                    </select>

                    {activeCostCenters.length ===
                      0 && (
                      <p className="mt-2 text-[10px] text-[var(--color-danger)]">
                        No active cost centers are
                        available. Create a cost
                        center first.
                      </p>
                    )}
                  </FormField>
                </div>

                {/* DEBIT / CREDIT */}
                <div>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand)]">
                    Nominal Analysis
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div className="rounded-xl border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/[0.03] p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-danger)]/10">
                          <ArrowUpRight
                            size={16}
                            className="text-[var(--color-danger)]"
                          />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-[var(--color-text)]">
                            Debit Account
                          </p>

                          <p className="text-[10px] text-[var(--color-text-muted)]">
                            Expense / asset side
                          </p>
                        </div>
                      </div>

                      <select
                        value={
                          form.debitGLAccountId
                        }
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            debitGLAccountId:
                              event.target.value,
                          }))
                        }
                        className={inputClass}
                        required
                      >
                        <option value="">
                          Select debit GL account
                        </option>

                        {activeGLAccounts.map(
                          (account) => (
                            <option
                              key={account.id}
                              value={account.id}
                            >
                              {account.accountNumber} —{" "}
                              {account.description}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="rounded-xl border border-[var(--color-success)]/20 bg-[var(--color-success)]/[0.03] p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-success)]/10">
                          <ArrowDownToLine
                            size={16}
                            className="text-[var(--color-success)]"
                          />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-[var(--color-text)]">
                            Credit Account
                          </p>

                          <p className="text-[10px] text-[var(--color-text-muted)]">
                            Liability / income side
                          </p>
                        </div>
                      </div>

                      <select
                        value={
                          form.creditGLAccountId
                        }
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            creditGLAccountId:
                              event.target.value,
                          }))
                        }
                        className={inputClass}
                        required
                      >
                        <option value="">
                          Select credit GL account
                        </option>

                        {activeGLAccounts.map(
                          (account) => (
                            <option
                              key={account.id}
                              value={account.id}
                            >
                              {account.accountNumber} —{" "}
                              {account.description}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  {activeGLAccounts.length ===
                    0 && (
                    <p className="mt-2 text-[10px] text-[var(--color-danger)]">
                      No active GL accounts are
                      available. Create GL accounts
                      first.
                    </p>
                  )}
                </div>

                {/* STATUS */}
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--color-border)] p-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      Active Allocation
                    </p>

                    <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                      Active allocations can be used
                      during payroll processing.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        active:
                          event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[var(--color-brand)]"
                  />
                </label>
              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[var(--color-brand)] px-4 py-2.5 text-xs font-semibold text-black hover:bg-[var(--color-brand-hover)]"
                >
                  {editingAllocation
                    ? "Save Changes"
                    : "Create Allocation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 shadow-2xl">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-danger)]/10">
              <Trash2
                size={20}
                className="text-[var(--color-danger)]"
              />
            </div>

            <h2 className="mt-4 text-base font-semibold text-[var(--color-text)]">
              Delete Account Allocation?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              You are about to delete{" "}
              <span className="font-semibold text-[var(--color-text)]">
                {deleteTarget.code} —{" "}
                {deleteTarget.description}
              </span>
              . This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-[var(--color-danger)] px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90"
              >
                Delete Allocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =============================================================
   SUPPORTING COMPONENTS
============================================================= */

const inputClass =
  "h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]";

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[var(--color-text-secondary)]">
        {label}

        {required && (
          <span className="ml-1 text-[var(--color-danger)]">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)]">
          <Icon
            size={16}
            className="text-[var(--color-brand)]"
          />
        </div>
      </div>

      <p className="mt-4 text-xl font-semibold text-[var(--color-text)]">
        {value}
      </p>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
        active
          ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
      }`}
    >
      {label}
    </button>
  );
}

function FlowItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
      <span className="font-mono text-[10px] text-[var(--color-brand)]">
        {number}
      </span>

      <p className="mt-2 text-xs font-semibold text-[var(--color-text)]">
        {title}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-[var(--color-text-muted)]">
        {description}
      </p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="hidden items-center justify-center md:flex">
      <div className="h-px w-full bg-[var(--color-border)]" />
      <span className="px-2 text-[var(--color-brand)]">
        →
      </span>
    </div>
  );
}

function FlowAccount({
  type,
  icon: Icon,
}: {
  type: "Debit" | "Credit";
  icon: React.ElementType;
}) {
  const isDebit = type === "Debit";

  return (
    <div
      className={`rounded-xl border p-3 ${
        isDebit
          ? "border-[var(--color-danger)]/20 bg-[var(--color-danger)]/[0.03]"
          : "border-[var(--color-success)]/20 bg-[var(--color-success)]/[0.03]"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon
          size={14}
          className={
            isDebit
              ? "text-[var(--color-danger)]"
              : "text-[var(--color-success)]"
          }
        />

        <span className="text-xs font-semibold text-[var(--color-text)]">
          {type}
        </span>
      </div>

      <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
        GL Account
      </p>
    </div>
  );
}