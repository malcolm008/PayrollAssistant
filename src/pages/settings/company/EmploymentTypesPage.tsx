import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  Edit3,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmploymentTypes } from "../../../hooks/useEmployementTypes";
import type { EmploymentType } from "../../../types/employmentType";

export function EmploymentTypesPage() {
  const navigate = useNavigate();

  const {
    employmentTypes,
    createEmploymentType,
    updateEmploymentType,
    deleteEmploymentType,
    toggleEmploymentType,
  } = useEmploymentTypes();

  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  const [editing, setEditing] =
    useState<EmploymentType | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<EmploymentType | null>(null);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return employmentTypes.filter((item) => {
      const matchesSearch =
        !query ||
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      const matchesActive =
        !activeOnly || item.active;

      return matchesSearch && matchesActive;
    });
  }, [employmentTypes, search, activeOnly]);

  const activeCount = employmentTypes.filter(
    (item) => item.active,
  ).length;

  function handleDelete() {
    if (!deleteTarget) return;

    deleteEmploymentType(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <BriefcaseBusiness
                size={20}
                className="text-[var(--color-brand)]"
              />

              <h1 className="text-2xl font-semibold text-[var(--color-text)]">
                Employment Types
              </h1>
            </div>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Configure the employment categories available when
              creating employee records.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditing({
              id: "",
              code: "",
              name: "",
              description: "",
              active: true,
            })
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)] transition hover:bg-[var(--color-brand-hover)]"
        >
          <Plus size={16} />
          Add Employment Type
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<BriefcaseBusiness size={18} />}
          label="Total Types"
          value={employmentTypes.length}
        />

        <SummaryCard
          icon={<Check size={18} />}
          label="Active"
          value={activeCount}
        />

        <SummaryCard
          icon={<Users size={18} />}
          label="Inactive"
          value={
            employmentTypes.length - activeCount
          }
        />
      </div>

      {/* Table */}
      <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex flex-col gap-3 border-b border-[var(--color-border)] p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search employment types..."
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] py-2.5 pl-10 pr-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
            />
          </div>

          <button
            type="button"
            onClick={() => setActiveOnly((value) => !value)}
            className={`rounded-lg border px-4 py-2.5 text-sm transition ${
              activeOnly
                ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
                : "border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
            }`}
          >
            {activeOnly ? "Active Only" : "All Records"}
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
              <Search size={20} />
            </div>

            <h3 className="mt-4 text-sm font-medium text-[var(--color-text)]">
              No employment types found
            </h3>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                  <th className="px-6 py-4 font-medium">
                    Code
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Employment Type
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

              <tbody className="divide-y divide-[var(--color-border)]">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-[var(--color-surface-hover)]"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[var(--color-brand)]">
                      {item.code}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-[var(--color-text)]">
                      {item.name}
                    </td>

                    <td className="max-w-sm px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                      {item.description || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          toggleEmploymentType(item.id)
                        }
                        className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.active
                            ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                            : "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.active
                              ? "bg-[var(--color-success)]"
                              : "bg-[var(--color-text-muted)]"
                          }`}
                        />

                        {item.active
                          ? "Active"
                          : "Inactive"}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setEditing(item)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand)]"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget(item)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editing && (
        <EmploymentTypeModal
          value={editing}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing.id) {
              updateEmploymentType(
                editing.id,
                data,
              );
            } else {
              createEmploymentType(data);
            }

            setEditing(null);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
          {icon}
        </div>

        <div>
          <p className="text-xs text-[var(--color-text-muted)]">
            {label}
          </p>

          <p className="mt-0.5 text-xl font-semibold text-[var(--color-text)]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmploymentTypeModal({
  value,
  onClose,
  onSave,
}: {
  value: EmploymentType;
  onClose: () => void;
  onSave: (
    value: Omit<EmploymentType, "id">,
  ) => void;
}) {
  const [form, setForm] = useState(value);

  function save() {
    if (!form.code.trim() || !form.name.trim()) {
      return;
    }

    onSave({
      code: form.code.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      active: form.active,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <h2 className="font-semibold text-[var(--color-text)]">
            {value.id
              ? "Edit Employment Type"
              : "Add Employment Type"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
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
                code: value.toUpperCase(),
              }))
            }
            placeholder="e.g. FT"
            required
          />

          <Field
            label="Employment Type"
            value={form.name}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                name: value,
              }))
            }
            placeholder="e.g. Full Time"
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
            placeholder="Describe this employment type"
            textarea
          />

          <button
            type="button"
            onClick={() =>
              setForm((current) => ({
                ...current,
                active: !current.active,
              }))
            }
            className="flex w-full items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3"
          >
            <span className="text-sm font-medium text-[var(--color-text)]">
              Active
            </span>

            <span
              className={`relative h-6 w-11 rounded-full transition ${
                form.active
                  ? "bg-[var(--color-brand)]"
                  : "bg-[var(--color-border-strong)]"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  form.active
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </span>
          </button>
        </div>

        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)] hover:bg-[var(--color-brand-hover)]"
          >
            Save
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
      <span className="mb-2 block text-sm font-medium text-[var(--color-text)]">
        {label}
        {required && (
          <span className="ml-1 text-[var(--color-danger)]">
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
          className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
        />
      ) : (
        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
        />
      )}
    </label>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)]">
            <Trash2 size={19} />
          </div>

          <h2 className="mt-4 font-semibold text-[var(--color-text)]">
            Delete employment type?
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Are you sure you want to delete{" "}
            <strong className="text-[var(--color-text)]">
              {name}
            </strong>
            ? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[var(--color-danger)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}