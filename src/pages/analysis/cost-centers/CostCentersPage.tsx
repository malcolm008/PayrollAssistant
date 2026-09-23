import { useMemo, useState } from "react";
import {
  Building2,
  Check,
  Edit3,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useCostCenters } from "../../../hooks/useCostCenters";
import type { CostCenter } from "../../../types/costCenter";

interface CostCenterForm {
  code: string;
  name: string;
  description: string;
  active: boolean;
}

const emptyForm: CostCenterForm = {
  code: "",
  name: "",
  description: "",
  active: true,
};

export function CostCentersPage() {
  const {
    costCenters,
    addCostCenter,
    updateCostCenter,
    deleteCostCenter,
    toggleCostCenterStatus,
  } = useCostCenters();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingCostCenter, setEditingCostCenter] =
    useState<CostCenter | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<CostCenter | null>(null);

  const [form, setForm] =
    useState<CostCenterForm>(emptyForm);

  const filteredCostCenters = useMemo(() => {
    const query = search.trim().toLowerCase();

    return costCenters.filter((costCenter) => {
      const matchesSearch =
        !query ||
        costCenter.code.toLowerCase().includes(query) ||
        costCenter.name.toLowerCase().includes(query) ||
        costCenter.description
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          costCenter.active) ||
        (statusFilter === "inactive" &&
          !costCenter.active);

      return matchesSearch && matchesStatus;
    });
  }, [costCenters, search, statusFilter]);

  const activeCount = costCenters.filter(
    (item) => item.active
  ).length;

  function openCreateModal() {
    setEditingCostCenter(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function openEditModal(costCenter: CostCenter) {
    setEditingCostCenter(costCenter);

    setForm({
      code: costCenter.code,
      name: costCenter.name,
      description: costCenter.description,
      active: costCenter.active,
    });

    setIsFormOpen(true);
  }

  function closeFormModal() {
    setIsFormOpen(false);
    setEditingCostCenter(null);
    setForm(emptyForm);
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const code = form.code.trim();
    const name = form.name.trim();
    const description = form.description.trim();

    if (!code || !name) {
      return;
    }

    const duplicate = costCenters.some(
      (item) =>
        item.code.toLowerCase() === code.toLowerCase() &&
        item.id !== editingCostCenter?.id
    );

    if (duplicate) {
      window.alert(
        "A cost center with this code already exists."
      );
      return;
    }

    const payload = {
      code,
      name,
      description,
      active: form.active,
    };

    if (editingCostCenter) {
      updateCostCenter(
        editingCostCenter.id,
        payload
      );
    } else {
      addCostCenter(payload);
    }

    closeFormModal();
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    deleteCostCenter(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-full bg-[var(--color-bg)]">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <Building2 size={14} />

              <span>Dashboard</span>
              <span>/</span>
              <span>Input Operations</span>
              <span>/</span>

              <span className="text-[var(--color-text-secondary)]">
                Cost Centers
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)] sm:text-3xl">
              Cost Centers
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-secondary)]">
              Create and maintain the organizational cost centers
              used for payroll and accounting allocation.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 text-sm font-semibold text-black transition-colors hover:bg-[var(--color-brand-hover)]"
          >
            <Plus size={17} />
            New Cost Center
          </button>
        </div>

        {/* SUMMARY */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Total Cost Centers"
            value={costCenters.length.toString()}
            icon={Building2}
          />

          <SummaryCard
            label="Active"
            value={activeCount.toString()}
            icon={Check}
          />

          <SummaryCard
            label="Inactive"
            value={(costCenters.length - activeCount).toString()}
            icon={FileText}
          />
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">

          {/* TOOLBAR */}
          <div className="flex flex-col gap-3 border-b border-[var(--color-border)] p-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search cost centers..."
                className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] pl-9 pr-4 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
              />
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-1">
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
            </div>
          </div>

          {/* DATA TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Cost Center
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Name
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Description
                  </th>

                  <th className="px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Status
                  </th>

                  <th className="w-32 px-4 py-3" />
                </tr>
              </thead>

              <tbody>
                {filteredCostCenters.map(
                  (costCenter) => (
                    <tr
                      key={costCenter.id}
                      className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)]"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm font-semibold text-[var(--color-brand)]">
                          {costCenter.code}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-[var(--color-text)]">
                          {costCenter.name}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {costCenter.description ||
                            "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            toggleCostCenterStatus(
                              costCenter.id
                            )
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            costCenter.active
                              ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                              : "bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              costCenter.active
                                ? "bg-[var(--color-success)]"
                                : "bg-[var(--color-text-muted)]"
                            }`}
                          />

                          {costCenter.active
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
                                costCenter
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
                                costCenter
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
                  )
                )}
              </tbody>
            </table>

            {filteredCostCenters.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-brand-soft)]">
                  <Building2
                    size={20}
                    className="text-[var(--color-brand)]"
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[var(--color-text)]">
                  No cost centers found
                </h3>

                <p className="mt-1 max-w-sm text-xs text-[var(--color-text-secondary)]">
                  {search
                    ? "Try changing your search criteria."
                    : "Create your first cost center to get started."}
                </p>

                {!search && (
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-3 py-2 text-xs font-semibold text-black hover:bg-[var(--color-brand-hover)]"
                  >
                    <Plus size={14} />
                    Create Cost Center
                  </button>
                )}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between border-t border-[var(--color-border)] px-5 py-3">
            <span className="text-[10px] text-[var(--color-text-muted)]">
              Showing {filteredCostCenters.length} of{" "}
              {costCenters.length} cost centers
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
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl">

            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <div>
                <h2 className="text-base font-semibold text-[var(--color-text)]">
                  {editingCostCenter
                    ? "Edit Cost Center"
                    : "New Cost Center"}
                </h2>

                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  {editingCostCenter
                    ? "Update the cost center details."
                    : "Create a new organizational cost center."}
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Cost Center Code"
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
                      placeholder="e.g. CC-001"
                      className={inputClass}
                      required
                    />
                  </FormField>

                  <FormField
                    label="Cost Center Name"
                    required
                  >
                    <input
                      value={form.name}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      placeholder="e.g. Human Resources"
                      className={inputClass}
                      required
                    />
                  </FormField>
                </div>

                <FormField label="Description">
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description:
                          event.target.value,
                      }))
                    }
                    placeholder="Describe the purpose or scope of this cost center..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
                  />
                </FormField>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--color-border)] p-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      Active Cost Center
                    </p>

                    <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                      Inactive cost centers won't be
                      available for new allocations.
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
                  {editingCostCenter
                    ? "Save Changes"
                    : "Create Cost Center"}
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
              Delete Cost Center?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              You are about to delete{" "}
              <span className="font-semibold text-[var(--color-text)]">
                {deleteTarget.code} —{" "}
                {deleteTarget.name}
              </span>
              . This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-[var(--color-danger)] px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90"
              >
                Delete Cost Center
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