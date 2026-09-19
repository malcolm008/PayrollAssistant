import {
    BriefcaseBusiness,
    Edit3,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useJobTitles } from "../../../hooks/useJobTitles";
import type { JobTitle } from "../../../types/jobTItle";

interface JobTitlesModalProps {
  onClose: () => void;
}

export function JobTitlesModal({
  onClose,
}: JobTitlesModalProps) {
  const {
    jobTitles,
    createJobTitle,
    updateJobTitle,
    deleteJobTitle,
    toggleJobTitle,
  } = useJobTitles();

  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  const [editingJobTitle, setEditingJobTitle] =
    useState<JobTitle | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<JobTitle | null>(null);

  const filteredJobTitles = useMemo(() => {
    const query = search.toLowerCase().trim();

    return jobTitles.filter((item) => {
      const matchesSearch =
        !query ||
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.description
          .toLowerCase()
          .includes(query);

      const matchesActive =
        !activeOnly || item.active;

      return matchesSearch && matchesActive;
    });
  }, [jobTitles, search, activeOnly]);

  const activeCount = jobTitles.filter(
    (item) => item.active,
  ).length;

  function handleDelete() {
    if (!deleteTarget) return;

    deleteJobTitle(deleteTarget.id);
    setDeleteTarget(null);
  }

  function openCreate() {
    setEditingJobTitle({
      id: "",
      code: "",
      name: "",
      description: "",
      active: true,
    });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          background: "var(--color-surface)",
          borderColor:
            "var(--color-border-strong)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-5"
          style={{
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background:
                  "var(--color-brand-soft)",
                color: "var(--color-brand)",
              }}
            >
              <BriefcaseBusiness size={20} />
            </div>

            <div>
              <h2
                className="text-lg font-semibold"
                style={{
                  color: "var(--color-text)",
                }}
              >
                Job Titles
              </h2>

              <p
                className="mt-0.5 text-sm"
                style={{
                  color:
                    "var(--color-text-secondary)",
                }}
              >
                Configure job titles used throughout
                employee management.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-[var(--color-surface-hover)]"
            style={{
              color:
                "var(--color-text-secondary)",
            }}
          >
            <X size={19} />
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 border-b p-4 sm:grid-cols-3">
          <SummaryCard
            label="Total Job Titles"
            value={jobTitles.length}
          />

          <SummaryCard
            label="Active"
            value={activeCount}
          />

          <SummaryCard
            label="Inactive"
            value={jobTitles.length - activeCount}
          />
        </div>

        {/* Toolbar */}
        <div
          className="flex flex-col gap-3 border-b p-4 sm:flex-row"
          style={{
            borderColor: "var(--color-border)",
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
              placeholder="Search job titles..."
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

          <button
            type="button"
            onClick={() =>
              setActiveOnly((value) => !value)
            }
            className="rounded-lg border px-4 py-2.5 text-sm transition"
            style={{
              borderColor: activeOnly
                ? "var(--color-brand)"
                : "var(--color-border)",
              background: activeOnly
                ? "var(--color-brand-soft)"
                : "var(--color-surface-raised)",
              color: activeOnly
                ? "var(--color-brand)"
                : "var(--color-text-secondary)",
            }}
          >
            {activeOnly
              ? "Active Only"
              : "All Records"}
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
            style={{
              background:
                "var(--color-brand)",
              color: "var(--color-bg)",
            }}
          >
            <Plus size={16} />
            Add Job Title
          </button>
        </div>

        {/* Table */}
        <div className="min-h-0 flex-1 overflow-auto">
          {filteredJobTitles.length === 0 ? (
            <EmptyState />
          ) : (
            <table className="w-full min-w-[700px]">
              <thead
                className="sticky top-0"
                style={{
                  background:
                    "var(--color-surface)",
                }}
              >
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
                    Job Title
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Description
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
                {filteredJobTitles.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b transition hover:bg-[var(--color-surface-hover)]"
                    style={{
                      borderColor:
                        "var(--color-border)",
                    }}
                  >
                    <td
                      className="px-6 py-4 text-sm font-semibold"
                      style={{
                        color:
                          "var(--color-brand)",
                      }}
                    >
                      {item.code}
                    </td>

                    <td
                      className="px-6 py-4 text-sm font-medium"
                      style={{
                        color:
                          "var(--color-text)",
                      }}
                    >
                      {item.name}
                    </td>

                    <td
                      className="max-w-sm px-6 py-4 text-sm"
                      style={{
                        color:
                          "var(--color-text-secondary)",
                      }}
                    >
                      {item.description || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <StatusToggle
                        active={item.active}
                        onClick={() =>
                          toggleJobTitle(item.id)
                        }
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingJobTitle(item)
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
                            setDeleteTarget(item)
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between border-t px-6 py-4"
          style={{
            borderColor:
              "var(--color-border)",
          }}
        >
          <span
            className="text-xs"
            style={{
              color:
                "var(--color-text-muted)",
            }}
          >
            Showing {filteredJobTitles.length} of{" "}
            {jobTitles.length} job titles
          </span>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
            style={{
              borderColor:
                "var(--color-border)",
              color:
                "var(--color-text-secondary)",
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Job Title Form */}
      {editingJobTitle && (
        <JobTitleFormModal
          value={editingJobTitle}
          onClose={() =>
            setEditingJobTitle(null)
          }
          onSave={(data) => {
            if (editingJobTitle.id) {
              updateJobTitle(
                editingJobTitle.id,
                data,
              );
            } else {
              createJobTitle(data);
            }

            setEditingJobTitle(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onClose={() =>
            setDeleteTarget(null)
          }
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background:
          "var(--color-surface-raised)",
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
        {label}
      </p>

      <p
        className="mt-1 text-xl font-semibold"
        style={{
          color: "var(--color-text)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function StatusToggle({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        background: active
          ? "rgba(74,222,128,0.10)"
          : "var(--color-surface-hover)",
        color: active
          ? "var(--color-success)"
          : "var(--color-text-muted)",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: active
            ? "var(--color-success)"
            : "var(--color-text-muted)",
        }}
      />

      {active ? "Active" : "Inactive"}
    </button>
  );
}

function JobTitleFormModal({
    value,
    onClose,
    onSave,
}: {
    value: JobTitle;
    onClose: () => void;
    onSave: (
        value: Omit<JobTitle, "id">,
    ) => void;
}) {
    const [form, setForm] =
        useState<JobTitle>(value);

    const [error, setError] =
        useState("");

    function save() {
        if (!form.code.trim()) {
        setError("Job title code is required.");
        return;
        }

        if (!form.name.trim()) {
        setError("Job title name is required.");
        return;
        }

        onSave({
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        description:
            form.description.trim(),
        active: form.active,
        });
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl"
            style={{
            background:
                "var(--color-surface)",
            borderColor:
                "var(--color-border-strong)",
            }}
        >
            <div
            className="flex items-center justify-between border-b px-6 py-4"
            style={{
                borderColor:
                "var(--color-border)",
            }}
            >
            <div>
                <h3
                className="font-semibold"
                style={{
                    color:
                    "var(--color-text)",
                }}
                >
                {value.id
                    ? "Edit Job Title"
                    : "Add Job Title"}
                </h3>

                <p
                className="mt-1 text-xs"
                style={{
                    color:
                    "var(--color-text-secondary)",
                }}
                >
                Configure the job title details.
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
                <X size={17} />
            </button>
            </div>

            <div className="space-y-5 p-6">
            <Field
                label="Code"
                value={form.code}
                onChange={(value) =>
                setForm((current) => ({
                    ...current,
                    code: value,
                }))
                }
                placeholder="e.g. DEV"
                required
            />

            <Field
                label="Job Title"
                value={form.name}
                onChange={(value) =>
                setForm((current) => ({
                    ...current,
                    name: value,
                }))
                }
                placeholder="e.g. Software Developer"
                required
            />

            <Field
                label="Description"
                value={form.description}
                onChange={(value) =>
                setForm((current) => ({
                    ...current,
                    description: value,
                }))
                }
                placeholder="Describe this job title"
                textarea
            />

            <ToggleField
                label="Active"
                value={form.active}
                onChange={(value) =>
                setForm((current) => ({
                    ...current,
                    active: value,
                }))
                }
            />

            {error && (
                <p
                className="text-sm"
                style={{
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
                : "Create Job Title"}
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
            color: "var(--color-text)",
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

function DeleteModal({
    name,
    onClose,
    onConfirm,
}: {
    name: string;
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
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

            <h3
                className="mt-4 font-semibold"
                style={{
                color:
                    "var(--color-text)",
                }}
            >
                Delete job title?
            </h3>

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

    function EmptyState() {
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
            No job titles found
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