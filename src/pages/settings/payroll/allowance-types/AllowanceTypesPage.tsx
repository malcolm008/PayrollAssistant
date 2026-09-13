import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CircleDollarSign,
  MoreHorizontal,
  Pencil,
  Plus,
  Power,
  Search,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAllowanceTypes } from "../../../../hooks/useAllowanceTypes";
import type {
  AllowanceCalculationMethod,
  AllowanceType,
} from "../../../../types/allowance";

const calculationMethods: AllowanceCalculationMethod[] = [
  "Fixed Amount",
  "Percentage of Basic Salary",
  "Percentage of Gross Salary",
  "Manual Entry",
];

const emptyForm = {
  code: "",
  name: "",
  description: "",
  calculationMethod: "Fixed Amount" as AllowanceCalculationMethod,
  defaultValue: "",
  taxable: true,
  recurring: true,
};

export function AllowanceTypesPage() {
  const navigate = useNavigate();

  const {
    allowanceTypes,
    createAllowanceType,
    updateAllowanceType,
    deleteAllowanceType,
    toggleAllowanceType,
  } = useAllowanceTypes();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">(
    "all"
  );

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AllowanceType | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);

  const filteredTypes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allowanceTypes.filter((item) => {
      const matchesSearch =
        !query ||
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      const matchesStatus =
        status === "all" ||
        (status === "active" && item.active) ||
        (status === "inactive" && !item.active);

      return matchesSearch && matchesStatus;
    });
  }, [allowanceTypes, search, status]);

  const activeCount = allowanceTypes.filter(
    (item) => item.active
  ).length;

  const taxableCount = allowanceTypes.filter(
    (item) => item.taxable
  ).length;

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(item: AllowanceType) {
    setEditing(item);

    setForm({
      code: item.code,
      name: item.name,
      description: item.description,
      calculationMethod: item.calculationMethod,
      defaultValue:
        item.defaultValue !== undefined
          ? String(item.defaultValue)
          : "",
      taxable: item.taxable,
      recurring: item.recurring,
    });

    setShowModal(true);
    setMenuId(null);
  }

  function save() {
    if (!form.code.trim() || !form.name.trim()) {
      return;
    }

    const value =
      form.defaultValue.trim() === ""
        ? undefined
        : Number(form.defaultValue);

    if (editing) {
      updateAllowanceType(editing.id, {
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        description: form.description.trim(),
        calculationMethod: form.calculationMethod,
        defaultValue: value,
        taxable: form.taxable,
        recurring: form.recurring,
      });
    } else {
      createAllowanceType({
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        description: form.description.trim(),
        calculationMethod: form.calculationMethod,
        defaultValue: value,
        taxable: form.taxable,
        recurring: form.recurring,
      });
    }

    setShowModal(false);
    setEditing(null);
    setForm(emptyForm);
  }

  function handleDelete(item: AllowanceType) {
    const confirmed = window.confirm(
      `Delete "${item.name}"? This configuration will be removed from the frontend configuration store.`
    );

    if (!confirmed) return;

    deleteAllowanceType(item.id);
    setMenuId(null);
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-brand)]"
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-[var(--color-text)]">
                Allowance Types
              </h1>

              <span className="rounded-full bg-[var(--color-brand-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-brand)]">
                {allowanceTypes.length}
              </span>
            </div>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Configure the allowance categories available throughout
              payroll.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 text-sm font-semibold text-[var(--color-bg)] transition-colors hover:bg-[var(--color-brand-hover)]"
        >
          <Plus size={17} />
          New Allowance Type
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Total Types"
          value={allowanceTypes.length}
          icon={<CircleDollarSign size={18} />}
        />

        <SummaryCard
          label="Active"
          value={activeCount}
          icon={<Power size={18} />}
        />

        <SummaryCard
          label="Taxable"
          value={taxableCount}
          icon={<Check size={18} />}
        />
      </div>

      {/* REGISTER */}
      <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-[var(--color-text)]">
              Allowance Configuration
            </h2>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Define how allowances behave when payroll is processed.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search allowance types..."
                className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] pl-9 pr-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)] sm:w-64"
              />
            </div>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as
                    | "all"
                    | "active"
                    | "inactive"
                )
              }
              className="h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                  Code
                </th>

                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                  Allowance
                </th>

                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                  Calculation
                </th>

                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                  Default
                </th>

                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                  Payroll Rules
                </th>

                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                  Status
                </th>

                <th className="w-12 px-3 py-3" />
              </tr>
            </thead>

            <tbody>
              {filteredTypes.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-hover)]"
                >
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-[var(--color-brand)]">
                      {item.code}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {item.name}
                      </p>

                      <p className="mt-1 max-w-sm truncate text-xs text-[var(--color-text-muted)]">
                        {item.description || "No description"}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                    {item.calculationMethod}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--color-text)]">
                    {item.defaultValue !== undefined
                      ? item.calculationMethod.includes("Percentage")
                        ? `${item.defaultValue}%`
                        : item.defaultValue.toLocaleString()
                      : "—"}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {item.taxable && (
                        <Tag>Taxable</Tag>
                      )}

                      {item.recurring && (
                        <Tag>Recurring</Tag>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge active={item.active} />
                  </td>

                  <td className="relative px-3 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        setMenuId(
                          menuId === item.id
                            ? null
                            : item.id
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {menuId === item.id && (
                      <div className="absolute right-4 top-12 z-20 w-44 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] py-1 shadow-xl">
                        <MenuButton
                          icon={<Pencil size={15} />}
                          label="Edit"
                          onClick={() => openEdit(item)}
                        />

                        <MenuButton
                          icon={<Power size={15} />}
                          label={item.active ? "Deactivate" : "Activate"}
                          onClick={() => {
                            toggleAllowanceType(item.id);
                            setMenuId(null);
                          }}
                        />

                        <MenuButton
                          danger
                          icon={<Trash2 size={15} />}
                          label="Delete"
                          onClick={() => handleDelete(item)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTypes.length === 0 && (
            <div className="px-6 py-16 text-center">
              <CircleDollarSign
                size={28}
                className="mx-auto text-[var(--color-text-muted)]"
              />

              <p className="mt-3 text-sm font-medium text-[var(--color-text)]">
                No allowance types found
              </p>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Try changing your search or create a new allowance type.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
              <div>
                <h2 className="font-semibold text-[var(--color-text)]">
                  {editing
                    ? "Edit Allowance Type"
                    : "New Allowance Type"}
                </h2>

                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  Configure how this allowance behaves in payroll.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Code"
                  value={form.code}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      code: value,
                    }))
                  }
                  placeholder="e.g. TRANSPORT"
                />

                <Field
                  label="Name"
                  value={form.name}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      name: value,
                    }))
                  }
                  placeholder="e.g. Transport Allowance"
                />
              </div>

              <Field
                label="Description"
                value={form.description}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    description: value,
                  }))
                }
                placeholder="Describe this allowance..."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Calculation Method"
                  value={form.calculationMethod}
                  options={calculationMethods}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      calculationMethod:
                        value as AllowanceCalculationMethod,
                    }))
                  }
                />

                <Field
                  label={
                    form.calculationMethod.includes("Percentage")
                      ? "Default Percentage"
                      : "Default Amount"
                  }
                  type="number"
                  value={form.defaultValue}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      defaultValue: value,
                    }))
                  }
                  placeholder="0"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Checkbox
                  checked={form.taxable}
                  label="Taxable"
                  description="Include this allowance when calculating taxable income."
                  onChange={(checked) =>
                    setForm((current) => ({
                      ...current,
                      taxable: checked,
                    }))
                  }
                />

                <Checkbox
                  checked={form.recurring}
                  label="Recurring"
                  description="Automatically make this allowance available for recurring payroll."
                  onChange={(checked) =>
                    setForm((current) => ({
                      ...current,
                      recurring: checked,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={save}
                disabled={!form.code.trim() || !form.name.trim()}
                className="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)] hover:bg-[var(--color-brand-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editing ? "Save Changes" : "Create Allowance"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--color-text-secondary)]">
          {label}
        </span>

        <div className="text-[var(--color-brand)]">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-semibold text-[var(--color-text)]">
        {value}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[var(--color-text-secondary)]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[var(--color-text-secondary)]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({
  checked,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 accent-[var(--color-brand)]"
      />

      <span>
        <span className="block text-sm font-medium text-[var(--color-text)]">
          {label}
        </span>

        <span className="mt-1 block text-xs leading-5 text-[var(--color-text-secondary)]">
          {description}
        </span>
      </span>
    </label>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[var(--color-brand-soft)] px-2 py-1 text-[10px] font-medium text-[var(--color-brand)]">
      {children}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
          : "bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)]"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm ${
        danger
          ? "text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}