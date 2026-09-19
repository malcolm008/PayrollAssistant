import {
    ArrowLeft,
    Building2,
    Check,
    Edit3,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    Users,
    BriefcaseBusiness,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDepartments } from "../../../hooks/useDepartments";
import type { Department } from "../../../types/department";
import { JobTitlesModal } from "./JobTitlesModal";

type DepartmentForm = Omit<Department, "id">;

const emptyForm: DepartmentForm = {
  code: "",
  name: "",
  function: "",
  numberOfSections: 1,
  headOfDepartment: "",
  reportsTo: "",
  budgetedStaff: 0,
  budgetedSalary: 0,
  active: true,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function DepartmentsPage() {
    const navigate = useNavigate();

    const {
        departments,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        toggleDepartment,
    } = useDepartments();

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState<
        "All" | "Active" | "Inactive"
    >("All");

    const [editingDepartment, setEditingDepartment] =
        useState<Department | null>(null);

    const [deleteTarget, setDeleteTarget] =
        useState<Department | null>(null);

    const [showJobTitles, setShowJobTitles] =
        useState(false);

    const filteredDepartments = useMemo(() => {
        const query = search.toLowerCase().trim();

        return departments.filter((department) => {
        const matchesSearch =
            !query ||
            department.code
            .toLowerCase()
            .includes(query) ||
            department.name
            .toLowerCase()
            .includes(query) ||
            department.function
            .toLowerCase()
            .includes(query);

        const matchesStatus =
            status === "All" ||
            (status === "Active" &&
            department.active) ||
            (status === "Inactive" &&
            !department.active);

        return matchesSearch && matchesStatus;
        });
    }, [departments, search, status]);

    const activeCount = departments.filter(
        (item) => item.active,
    ).length;

    const totalStaffBudget = departments.reduce(
        (total, item) =>
        total + item.budgetedStaff,
        0,
    );

    const totalSalaryBudget = departments.reduce(
        (total, item) =>
        total + item.budgetedSalary,
        0,
    );

    function openCreate() {
        setEditingDepartment({
        id: "",
        ...emptyForm,
        });
    }

    function handleDelete() {
        if (!deleteTarget) return;

        deleteDepartment(deleteTarget.id);
        setDeleteTarget(null);
    }

    return (
        <div
        className="space-y-6"
        style={{
            color: "var(--color-text)",
        }}
        >
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
            <button
                type="button"
                onClick={() => navigate("/settings")}
                className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition hover:bg-[var(--color-surface-hover)]"
                style={{
                background:
                    "var(--color-surface)",
                borderColor:
                    "var(--color-border)",
                color:
                    "var(--color-text-secondary)",
                }}
            >
                <ArrowLeft size={17} />
            </button>

            <div>
                <div className="flex items-center gap-2">
                <Building2
                    size={20}
                    style={{
                    color:
                        "var(--color-brand)",
                    }}
                />

                <h1
                    className="text-2xl font-semibold"
                    style={{
                    color:
                        "var(--color-text)",
                    }}
                >
                    Departments
                </h1>
                </div>

                <p
                className="mt-1 text-sm"
                style={{
                    color:
                    "var(--color-text-secondary)",
                }}
                >
                Configure departments, organizational
                structure, reporting lines and budgets.
                </p>
            </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
            {/* Job Titles */}
            <button
                type="button"
                onClick={() => setShowJobTitles(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--color-surface-hover)]"
                style={{
                background:
                    "var(--color-surface)",
                borderColor:
                    "var(--color-border-strong)",
                color:
                    "var(--color-text)",
                }}
            >
                <BriefcaseBusiness size={16} />
                Job Titles
            </button>

            {/* Add Department */}
            <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition"
                style={{
                background:
                    "var(--color-brand)",
                color:
                    "var(--color-bg)",
                }}
            >
                <Plus size={16} />
                Add Department
            </button>
            </div>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
            icon={<Building2 size={18} />}
            label="Total Departments"
            value={departments.length}
            />

            <SummaryCard
            icon={<Check size={18} />}
            label="Active Departments"
            value={activeCount}
            />

            <SummaryCard
            icon={<Users size={18} />}
            label="Budgeted Staff"
            value={totalStaffBudget}
            />

            <SummaryCard
            icon={<span className="text-xs font-bold">TZS</span>}
            label="Salary Budget"
            value={formatCurrency(totalSalaryBudget)}
            />
        </div>

        {/* Main */}
        <section
            className="overflow-hidden rounded-xl border"
            style={{
            background:
                "var(--color-surface)",
            borderColor:
                "var(--color-border)",
            }}
        >
            {/* Toolbar */}
            <div
            className="flex flex-col gap-3 border-b p-4 sm:flex-row"
            style={{
                borderColor:
                "var(--color-border)",
            }}
            >
            <div className="relative flex-1">
                <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{
                    color:
                    "var(--color-text-muted)",
                }}
                />

                <input
                value={search}
                onChange={(event) =>
                    setSearch(event.target.value)
                }
                placeholder="Search departments..."
                className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none"
                style={{
                    background:
                    "var(--color-surface-raised)",
                    borderColor:
                    "var(--color-border)",
                    color:
                    "var(--color-text)",
                }}
                />
            </div>

            <div className="flex rounded-lg border p-1">
                {(
                ["All", "Active", "Inactive"] as const
                ).map((item) => (
                <button
                    key={item}
                    type="button"
                    onClick={() => setStatus(item)}
                    className="rounded-md px-4 py-2 text-sm transition"
                    style={{
                    background:
                        status === item
                        ? "var(--color-brand-soft)"
                        : "transparent",
                    color:
                        status === item
                        ? "var(--color-brand)"
                        : "var(--color-text-secondary)",
                    }}
                >
                    {item}
                </button>
                ))}
            </div>
            </div>

            {/* Table */}
            {filteredDepartments.length === 0 ? (
            <EmptyDepartmentState />
            ) : (
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1150px]">
                <thead>
                    <tr
                    className="border-b text-left text-xs uppercase tracking-wide"
                    style={{
                        borderColor:
                        "var(--color-border)",
                        color:
                        "var(--color-text-muted)",
                    }}
                    >
                    <th className="px-6 py-4 font-medium">
                        Code
                    </th>

                    <th className="px-6 py-4 font-medium">
                        Department
                    </th>

                    <th className="px-6 py-4 font-medium">
                        Function
                    </th>

                    <th className="px-6 py-4 font-medium">
                        Sections
                    </th>

                    <th className="px-6 py-4 font-medium">
                        Head of Department
                    </th>

                    <th className="px-6 py-4 font-medium">
                        Reports To
                    </th>

                    <th className="px-6 py-4 font-medium">
                        Staff Budget
                    </th>

                    <th className="px-6 py-4 font-medium">
                        Salary Budget
                    </th>

                    <th className="px-6 py-4 font-medium">
                        Status
                    </th>

                    <th className="px-6 py-4 text-right font-medium">
                        Actions
                    </th>
                    </tr>
                </thead>

                <tbody>
                    {filteredDepartments.map(
                    (department) => {
                        const parent =
                        departments.find(
                            (item) =>
                            item.id ===
                            department.reportsTo,
                        );

                        return (
                        <tr
                            key={department.id}
                            className="border-b transition hover:bg-[var(--color-surface-hover)]"
                            style={{
                            borderColor:
                                "var(--color-border)",
                            }}
                        >
                            <td className="px-6 py-4">
                            <span
                                className="rounded-md px-2 py-1 text-xs font-semibold"
                                style={{
                                background:
                                    "var(--color-brand-soft)",
                                color:
                                    "var(--color-brand)",
                                }}
                            >
                                {department.code}
                            </span>
                            </td>

                            <td
                            className="px-6 py-4 text-sm font-medium"
                            style={{
                                color:
                                "var(--color-text)",
                            }}
                            >
                            {department.name}
                            </td>

                            <td
                            className="max-w-[220px] px-6 py-4 text-sm"
                            style={{
                                color:
                                "var(--color-text-secondary)",
                            }}
                            >
                            {department.function ||
                                "—"}
                            </td>

                            <td
                            className="px-6 py-4 text-sm"
                            style={{
                                color:
                                "var(--color-text)",
                            }}
                            >
                            {department.numberOfSections}
                            </td>

                            <td
                            className="px-6 py-4 text-sm"
                            style={{
                                color:
                                "var(--color-text-secondary)",
                            }}
                            >
                            {department.headOfDepartment ||
                                "—"}
                            </td>

                            <td
                            className="px-6 py-4 text-sm"
                            style={{
                                color:
                                "var(--color-text-secondary)",
                            }}
                            >
                            {parent
                                ? `${parent.code} — ${parent.name}`
                                : "—"}
                            </td>

                            <td
                            className="px-6 py-4 text-sm"
                            style={{
                                color:
                                "var(--color-text)",
                            }}
                            >
                            {Number(department.budgetedSalary || 0).toLocaleString("en-TZ")}
                            </td>

                            <td
                            className="px-6 py-4 text-sm font-medium"
                            style={{
                                color:
                                "var(--color-text)",
                            }}
                            >
                            {formatCurrency(
                                department.budgetedSalary,
                            )}
                            </td>

                            <td className="px-6 py-4">
                            <button
                                type="button"
                                onClick={() =>
                                toggleDepartment(
                                    department.id,
                                )
                                }
                                className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium"
                                style={{
                                background:
                                    department.active
                                    ? "rgba(74,222,128,0.10)"
                                    : "var(--color-surface-hover)",
                                color:
                                    department.active
                                    ? "var(--color-success)"
                                    : "var(--color-text-muted)",
                                }}
                            >
                                <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{
                                    background:
                                    department.active
                                        ? "var(--color-success)"
                                        : "var(--color-text-muted)",
                                }}
                                />

                                {department.active
                                ? "Active"
                                : "Inactive"}
                            </button>
                            </td>

                            <td className="px-6 py-4">
                            <div className="flex justify-end gap-1">
                                <button
                                type="button"
                                onClick={() =>
                                    setEditingDepartment(
                                    department,
                                    )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[var(--color-brand-soft)]"
                                style={{
                                    color:
                                    "var(--color-text-muted)",
                                }}
                                title="Edit"
                                >
                                <Edit3 size={15} />
                                </button>

                                <button
                                type="button"
                                onClick={() =>
                                    setDeleteTarget(
                                    department,
                                    )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[var(--color-danger)]/10"
                                style={{
                                    color:
                                    "var(--color-text-muted)",
                                }}
                                title="Delete"
                                >
                                <Trash2 size={15} />
                                </button>

                                <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[var(--color-surface-hover)]"
                                style={{
                                    color:
                                    "var(--color-text-muted)",
                                }}
                                title="More"
                                >
                                <MoreHorizontal
                                    size={15}
                                />
                                </button>
                            </div>
                            </td>
                        </tr>
                        );
                    },
                    )}
                </tbody>
                </table>
            </div>
            )}

            {/* Footer */}
            <div
            className="border-t px-6 py-4 text-xs"
            style={{
                borderColor:
                "var(--color-border)",
                color:
                "var(--color-text-muted)",
            }}
            >
            Showing {filteredDepartments.length} of{" "}
            {departments.length} departments
            </div>
        </section>

        {/* Department Modal */}
        {editingDepartment && (
            <DepartmentModal
            value={editingDepartment}
            departments={departments}
            onClose={() =>
                setEditingDepartment(null)
            }
            onSave={(data) => {
                if (editingDepartment.id) {
                updateDepartment(
                    editingDepartment.id,
                    data,
                );
                } else {
                createDepartment(data);
                }

                setEditingDepartment(null);
            }}
            />
        )}

        {/* Delete Modal */}
        {deleteTarget && (
            <DeleteDepartmentModal
            name={deleteTarget.name}
            onClose={() =>
                setDeleteTarget(null)
            }
            onConfirm={handleDelete}
            />
        )}

        {/* Job Titles Modal */}
        {showJobTitles && (
            <JobTitlesModal
            onClose={() =>
                setShowJobTitles(false)
            }
            />
        )}
        </div>
    );
}

function DepartmentModal({
  value,
  departments,
  onClose,
  onSave,
}: {
  value: Department;
  departments: Department[];
  onClose: () => void;
  onSave: (
    value: Omit<Department, "id">,
  ) => void;
}) {
  const [form, setForm] = useState<Department>(
    value,
  );

  const [error, setError] =
    useState("");

  function updateField<K extends keyof Department>(
    field: K,
    value: Department[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  function save() {
    if (!form.code.trim()) {
      setError("Department code is required.");
      return;
    }

    if (!form.name.trim()) {
      setError("Department name is required.");
      return;
    }

    if (!form.function.trim()) {
      setError(
        "Function in organization is required.",
      );
      return;
    }

    if (form.numberOfSections < 1) {
      setError(
        "Number of sections must be at least 1.",
      );
      return;
    }

    if (form.budgetedStaff < 0) {
      setError(
        "Budgeted staff cannot be negative.",
      );
      return;
    }

    if (form.budgetedSalary < 0) {
      setError(
        "Budgeted salary cannot be negative.",
      );
      return;
    }

    onSave({
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      function: form.function.trim(),
      numberOfSections:
        form.numberOfSections,
      headOfDepartment:
        form.headOfDepartment?.trim() || "",
      reportsTo: form.reportsTo || "",
      budgetedStaff: form.budgetedStaff,
      budgetedSalary: form.budgetedSalary,
      active: form.active,
    });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          background:
            "var(--color-surface)",
          borderColor:
            "var(--color-border-strong)",
        }}
      >
        <div
          className="flex items-center justify-between border-b px-6 py-5"
          style={{
            borderColor:
              "var(--color-border)",
          }}
        >
          <div>
            <h2
              className="text-lg font-semibold"
              style={{
                color:
                  "var(--color-text)",
              }}
            >
              {value.id
                ? "Edit Department"
                : "Add Department"}
            </h2>

            <p
              className="mt-1 text-sm"
              style={{
                color:
                  "var(--color-text-secondary)",
              }}
            >
              Configure department structure,
              reporting and budget information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              color:
                "var(--color-text-muted)",
            }}
          >
            <XIcon />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Department Code"
              value={form.code}
              onChange={(value) =>
                updateField(
                  "code",
                  value.toUpperCase(),
                )
              }
              placeholder="e.g. FIN"
              required
            />

            <Field
              label="Department Name"
              value={form.name}
              onChange={(value) =>
                updateField("name", value)
              }
              placeholder="e.g. Finance"
              required
            />
          </div>

          <Field
            label="Function in Organization"
            value={form.function}
            onChange={(value) =>
              updateField("function", value)
            }
            placeholder="Describe the department's function..."
            textarea
            required
          />

          <div className="grid gap-5 md:grid-cols-2">
            <NumberField
              label="Number of Sections"
              value={form.numberOfSections}
              min={1}
              onChange={(value) =>
                updateField(
                  "numberOfSections",
                  value,
                )
              }
            />

            <Field
              label="Head of Department"
              value={
                form.headOfDepartment ?? ""
              }
              onChange={(value) =>
                updateField(
                  "headOfDepartment",
                  value,
                )
              }
              placeholder="Employee name / ID"
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
              Reports To
            </label>

            <select
              value={form.reportsTo ?? ""}
              onChange={(event) =>
                updateField(
                  "reportsTo",
                  event.target.value,
                )
              }
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
              style={{
                background:
                  "var(--color-surface-raised)",
                borderColor:
                  "var(--color-border)",
                color:
                  "var(--color-text)",
              }}
            >
              <option value="">
                No parent department
              </option>

              {departments
                .filter(
                  (item) =>
                    item.id !== value.id,
                )
                .map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.code} — {item.name}
                  </option>
                ))}
            </select>
          </div>

          <div
            className="border-t pt-5"
            style={{
              borderColor:
                "var(--color-border)",
            }}
          >
            <p
              className="mb-4 text-sm font-semibold"
              style={{
                color:
                  "var(--color-text)",
              }}
            >
              Budget Configuration
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              <NumberField
                label="Budgeted Number of Staff"
                value={form.budgetedStaff}
                min={0}
                onChange={(value) =>
                  updateField(
                    "budgetedStaff",
                    value,
                  )
                }
              />

              <NumberField
                label="Budgeted Salary"
                value={form.budgetedSalary}
                min={0}
                suffix="TZS"
                onChange={(value) =>
                  updateField(
                    "budgetedSalary",
                    value,
                  )
                }
              />
            </div>
          </div>

          <ToggleField
            label="Active Department"
            value={form.active}
            onChange={(value) =>
              updateField("active", value)
            }
          />

          {error && (
            <p
              className="rounded-lg border px-3 py-2 text-sm"
              style={{
                borderColor:
                  "rgba(255,77,79,0.25)",
                background:
                  "rgba(255,77,79,0.08)",
                color:
                  "var(--color-danger)",
              }}
            >
              {error}
            </p>
          )}
        </div>

        <div
          className="flex justify-end gap-3 border-t px-6 py-4"
          style={{
            borderColor:
              "var(--color-border)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
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
            onClick={save}
            className="rounded-lg px-4 py-2.5 text-sm font-medium"
            style={{
              background:
                "var(--color-brand)",
              color:
                "var(--color-bg)",
            }}
          >
            {value.id
              ? "Save Changes"
              : "Create Department"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea = false,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span
        className="mb-2 block text-sm font-medium"
        style={{
          color:
            "var(--color-text)",
        }}
      >
        {label}

        {required && (
          <span
            className="ml-1"
            style={{
              color:
                "var(--color-danger)",
            }}
          >
            *
          </span>
        )}
      </span>

      {textarea ? (
        <textarea
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none"
          style={{
            background:
              "var(--color-surface-raised)",
            borderColor:
              "var(--color-border)",
            color:
              "var(--color-text)",
          }}
        />
      ) : (
        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
          style={{
            background:
              "var(--color-surface-raised)",
            borderColor:
              "var(--color-border)",
            color:
              "var(--color-text)",
          }}
        />
      )}
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span
        className="mb-2 block text-sm font-medium"
        style={{
          color:
            "var(--color-text)",
        }}
      >
        {label}
      </span>

      <div className="relative">
        <input
          type="number"
          min={min}
          value={value}
          onChange={(event) => {
            const parsed = Number(
              event.target.value,
            );

            onChange(
              Number.isFinite(parsed)
                ? parsed
                : 0,
            );
          }}
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
          style={{
            background:
              "var(--color-surface-raised)",
            borderColor:
              "var(--color-border)",
            color:
              "var(--color-text)",
            paddingRight: suffix
              ? "4rem"
              : undefined,
          }}
        />

        {suffix && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
            style={{
              color:
                "var(--color-text-muted)",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left"
      style={{
        background:
          "var(--color-surface-raised)",
        borderColor:
          "var(--color-border)",
      }}
    >
      <span
        className="text-sm font-medium"
        style={{
          color:
            "var(--color-text)",
        }}
      >
        {label}
      </span>

      <span
        className="relative h-6 w-11 rounded-full transition"
        style={{
          background: value
            ? "var(--color-brand)"
            : "var(--color-border-strong)",
        }}
      >
        <span
          className="absolute top-1 h-4 w-4 rounded-full bg-white transition"
          style={{
            left: value
              ? "1.5rem"
              : "0.25rem",
          }}
        />
      </span>
    </button>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background:
          "var(--color-surface)",
        borderColor:
          "var(--color-border)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            background:
              "var(--color-brand-soft)",
            color:
              "var(--color-brand)",
          }}
        >
          {icon}
        </div>

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
            className="mt-0.5 text-xl font-semibold"
            style={{
              color:
                "var(--color-text)",
            }}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyDepartmentState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          background:
            "var(--color-surface-hover)",
          color:
            "var(--color-text-muted)",
        }}
      >
        <Search size={20} />
      </div>

      <h3
        className="mt-4 text-sm font-medium"
        style={{
          color:
            "var(--color-text)",
        }}
      >
        No departments found
      </h3>

      <p
        className="mt-1 text-sm"
        style={{
          color:
            "var(--color-text-secondary)",
        }}
      >
        Try changing your search or filter.
      </p>
    </div>
  );
}

function DeleteDepartmentModal({
  name,
  onClose,
  onConfirm,
}: {
  name: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border shadow-2xl"
        style={{
          background:
            "var(--color-surface)",
          borderColor:
            "var(--color-border)",
        }}
      >
        <div className="p-6">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={{
              background:
                "rgba(255,77,79,0.10)",
              color:
                "var(--color-danger)",
            }}
          >
            <Trash2 size={19} />
          </div>

          <h2
            className="mt-4 font-semibold"
            style={{
              color:
                "var(--color-text)",
            }}
          >
            Delete department?
          </h2>

          <p
            className="mt-2 text-sm leading-6"
            style={{
              color:
                "var(--color-text-secondary)",
            }}
          >
            Are you sure you want to delete{" "}
            <strong
              style={{
                color:
                  "var(--color-text)",
              }}
            >
              {name}
            </strong>
            ? This action cannot be undone.
          </p>
        </div>

        <div
          className="flex justify-end gap-3 border-t px-6 py-4"
          style={{
            borderColor:
              "var(--color-border)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
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
            onClick={onConfirm}
            className="rounded-lg px-4 py-2.5 text-sm font-medium"
            style={{
              background:
                "var(--color-danger)",
              color: "#fff",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function XIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}