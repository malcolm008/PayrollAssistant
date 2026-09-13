import {
  ArrowLeft,
  Building2,
  Check,
  Edit3,
  Plus,
  Search,
  Trash2,
  BriefcaseBusiness,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobTitles } from "../../../hooks/useJobTitles";
import { useDepartments } from "../../../hooks/useDepartments";
import type { JobTitle } from "../../../types/jobTItle";
import type { Department } from "../../../types/department";

type Tab = "job-titles" | "departments";

export function JobTitlesDepartmentsPage() {
  const navigate = useNavigate();

  const {
    jobTitles,
    createJobTitle,
    updateJobTitle,
    deleteJobTitle,
    toggleJobTitle,
  } = useJobTitles();

  const {
    departments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    toggleDepartment,
  } = useDepartments();

  const [tab, setTab] = useState<Tab>("job-titles");
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  const [editingJobTitle, setEditingJobTitle] =
    useState<JobTitle | null>(null);

  const [editingDepartment, setEditingDepartment] =
    useState<Department | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<
      | { type: "job"; item: JobTitle }
      | { type: "department"; item: Department }
      | null
    >(null);

  const filteredJobTitles = useMemo(() => {
    const query = search.toLowerCase().trim();

    return jobTitles.filter((item) => {
      const matchesSearch =
        !query ||
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      const matchesActive =
        !activeOnly || item.active;

      return matchesSearch && matchesActive;
    });
  }, [jobTitles, search, activeOnly]);

  const filteredDepartments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return departments.filter((item) => {
      const matchesSearch =
        !query ||
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      const matchesActive =
        !activeOnly || item.active;

      return matchesSearch && matchesActive;
    });
  }, [departments, search, activeOnly]);

  const activeCount =
    tab === "job-titles"
      ? jobTitles.filter((item) => item.active).length
      : departments.filter((item) => item.active).length;

  const totalCount =
    tab === "job-titles"
      ? jobTitles.length
      : departments.length;

  function handleDelete() {
    if (!deleteTarget) return;

    if (deleteTarget.type === "job") {
      deleteJobTitle(deleteTarget.item.id);
    } else {
      deleteDepartment(deleteTarget.item.id);
    }

    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
              <Building2
                size={20}
                className="text-[var(--color-brand)]"
              />

              <h1 className="text-2xl font-semibold text-[var(--color-text)]">
                Job Titles & Departments
              </h1>
            </div>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Configure the organizational structure used throughout
              employee management and payroll.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            tab === "job-titles"
              ? setEditingJobTitle({
                  id: "",
                  code: "",
                  name: "",
                  description: "",
                  active: true,
                })
              : setEditingDepartment({
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
          Add {tab === "job-titles" ? "Job Title" : "Department"}
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={
            tab === "job-titles" ? (
              <BriefcaseBusiness size={18} />
            ) : (
              <Building2 size={18} />
            )
          }
          label="Total"
          value={totalCount}
        />

        <SummaryCard
          icon={<Check size={18} />}
          label="Active"
          value={activeCount}
        />

        <SummaryCard
          icon={<Users size={18} />}
          label="Inactive"
          value={totalCount - activeCount}
        />
      </div>

      {/* Main */}
      <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {/* Tabs */}
        <div className="border-b border-[var(--color-border)] px-6 pt-4">
          <div className="flex gap-6">
            <TabButton
              active={tab === "job-titles"}
              onClick={() => {
                setTab("job-titles");
                setSearch("");
              }}
              icon={<BriefcaseBusiness size={16} />}
              label="Job Titles"
              count={jobTitles.length}
            />

            <TabButton
              active={tab === "departments"}
              onClick={() => {
                setTab("departments");
                setSearch("");
              }}
              icon={<Building2 size={16} />}
              label="Departments"
              count={departments.length}
            />
          </div>
        </div>

        {/* Toolbar */}
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
              placeholder={`Search ${
                tab === "job-titles"
                  ? "job titles"
                  : "departments"
              }...`}
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

        {/* Table */}
        {tab === "job-titles" ? (
          <JobTitleTable
            items={filteredJobTitles}
            onEdit={setEditingJobTitle}
            onDelete={(item) =>
              setDeleteTarget({
                type: "job",
                item,
              })
            }
            onToggle={toggleJobTitle}
          />
        ) : (
          <DepartmentTable
            items={filteredDepartments}
            onEdit={setEditingDepartment}
            onDelete={(item) =>
              setDeleteTarget({
                type: "department",
                item,
              })
            }
            onToggle={toggleDepartment}
          />
        )}
      </section>

      {editingJobTitle && (
        <JobTitleModal
          value={editingJobTitle}
          onClose={() => setEditingJobTitle(null)}
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

      {editingDepartment && (
        <DepartmentModal
          value={editingDepartment}
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

      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.item.name}
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

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition ${
        active
          ? "text-[var(--color-brand)]"
          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
      }`}
    >
      {icon}

      {label}

      <span className="rounded-full bg-[var(--color-surface-hover)] px-2 py-0.5 text-xs">
        {count}
      </span>

      {active && (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--color-brand)]" />
      )}
    </button>
  );
}

function JobTitleTable({
  items,
  onEdit,
  onDelete,
  onToggle,
}: {
  items: JobTitle[];
  onEdit: (item: JobTitle) => void;
  onDelete: (item: JobTitle) => void;
  onToggle: (id: string) => void;
}) {
  if (items.length === 0) {
    return <EmptyState label="job titles" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
            <th className="px-6 py-4 font-medium">Code</th>
            <th className="px-6 py-4 font-medium">Job Title</th>
            <th className="px-6 py-4 font-medium">Description</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 text-right font-medium">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--color-border)]">
          {items.map((item) => (
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
                <StatusToggle
                  active={item.active}
                  onClick={() => onToggle(item.id)}
                />
              </td>

              <td className="px-6 py-4">
                <ActionButtons
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DepartmentTable({
  items,
  onEdit,
  onDelete,
  onToggle,
}: {
  items: Department[];
  onEdit: (item: Department) => void;
  onDelete: (item: Department) => void;
  onToggle: (id: string) => void;
}) {
  if (items.length === 0) {
    return <EmptyState label="departments" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
            <th className="px-6 py-4 font-medium">Code</th>
            <th className="px-6 py-4 font-medium">Department</th>
            <th className="px-6 py-4 font-medium">Description</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 text-right font-medium">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--color-border)]">
          {items.map((item) => (
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
                <StatusToggle
                  active={item.active}
                  onClick={() => onToggle(item.id)}
                />
              </td>

              <td className="px-6 py-4">
                <ActionButtons
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
          : "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-[var(--color-success)]"
            : "bg-[var(--color-text-muted)]"
        }`}
      />

      {active ? "Active" : "Inactive"}
    </button>
  );
}

function ActionButtons({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-end gap-1">
      <button
        type="button"
        onClick={onEdit}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand)]"
        title="Edit"
      >
        <Edit3 size={15} />
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
        title="Delete"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
        <Search size={20} />
      </div>

      <h3 className="mt-4 text-sm font-medium text-[var(--color-text)]">
        No {label} found
      </h3>

      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
        Try changing your search or filter.
      </p>
    </div>
  );
}

function JobTitleModal({
  value,
  onClose,
  onSave,
}: {
  value: JobTitle;
  onClose: () => void;
  onSave: (value: Omit<JobTitle, "id">) => void;
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
    <Modal
      title={value.id ? "Edit Job Title" : "Add Job Title"}
      onClose={onClose}
      onSave={save}
    >
      <Field
        label="Code"
        value={form.code}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            code: value.toUpperCase(),
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
    </Modal>
  );
}

function DepartmentModal({
  value,
  onClose,
  onSave,
}: {
  value: Department;
  onClose: () => void;
  onSave: (value: Omit<Department, "id">) => void;
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
    <Modal
      title={value.id ? "Edit Department" : "Add Department"}
      onClose={onClose}
      onSave={save}
    >
      <Field
        label="Code"
        value={form.code}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            code: value.toUpperCase(),
          }))
        }
        placeholder="e.g. FIN"
        required
      />

      <Field
        label="Department"
        value={form.name}
        onChange={(value) =>
          setForm((current) => ({
            ...current,
            name: value,
          }))
        }
        placeholder="e.g. Finance"
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
        placeholder="Describe this department"
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
    </Modal>
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
      className="flex w-full items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3 text-left"
    >
      <span className="text-sm font-medium text-[var(--color-text)]">
        {label}
      </span>

      <span
        className={`relative h-6 w-11 rounded-full transition ${
          value
            ? "bg-[var(--color-brand)]"
            : "bg-[var(--color-border-strong)]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            value ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function Modal({
  title,
  children,
  onClose,
  onSave,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <h2 className="font-semibold text-[var(--color-text)]">
            {title}
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
          {children}
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
            onClick={onSave}
            className="rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)] hover:bg-[var(--color-brand-hover)]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
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
            Delete configuration?
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