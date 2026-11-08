import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ActiveT, Field, FormError, ModalShell, RowActions, inputClass, StatusTabs } from "../ui/RecordModal";
import { matchesStatus, type StatusFilter } from "../../types/costCenter";
import { useCostCenters } from "../../hooks/useCostCenters";
import type { CostCenter } from "../../types/costCenter";

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

interface CostCentersModalProps {
  onClose: () => void;
}

export function CostCentersModal({ onClose }: CostCentersModalProps) {
  const {
    costCenters,
    addCostCenter,
    updateCostCenter,
    deleteCostCenter,
    toggleCostCenterStatus,
  } = useCostCenters();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  // null shows the list, "new" and a record show the form.
  const [editing, setEditing] = useState<CostCenter | "new" | null>(null);
  const [form, setForm] = useState<CostCenterForm>(emptyForm);
  const [error, setError] = useState("");

  const editingItem = typeof editing === "object" ? editing : null;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return costCenters.filter((item) => {
      const matchesSearch =
        !query ||
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesSearch && matchesStatus(status, item.active);
    });
  }, [costCenters, search, status]);

  const openCreate = () => {
    setForm(emptyForm);
    setError("");
    setEditing("new");
  };

  const openEdit = (item: CostCenter) => {
    setForm({
      code: item.code,
      name: item.name,
      description: item.description,
      active: item.active,
    });
    setError("");
    setEditing(item);
  };

  const closeForm = () => {
    setEditing(null);
    setError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = form.code.trim();
    const name = form.name.trim();
    const description = form.description.trim();

    if (!code || !name) {
      setError("Enter a code and a name.");
      return;
    }

    const duplicate = costCenters.some(
      (item) =>
        item.code.toLowerCase() === code.toLowerCase() &&
        item.id !== editingItem?.id,
    );

    if (duplicate) {
      setError("A cost center with this code already exists.");
      return;
    }

    const payload = { code, name, description, active: form.active };

    if (editingItem) {
      updateCostCenter(editingItem.id, payload);
    } else {
      addCostCenter(payload);
    }

    closeForm();
  };

  return (
    <ModalShell title="Cost centers" onClose={onClose}>
      {editing === null ? (
        <div>
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative sm:w-64">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by code or name"
                className="pl-9"
              />
            </div>

            <StatusTabs value={status} onChange={setStatus} />

            <div className="sm:ml-auto">
              <Button onClick={openCreate}>
                <Plus size={16} />
                New cost center
              </Button>
            </div>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-sm font-medium text-[var(--color-text)]">
                {costCenters.length === 0
                  ? "No cost centers yet"
                  : "Nothing matches that search"}
              </p>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {costCenters.length === 0
                  ? "Add the first one to start allocating payroll costs."
                  : "Try a different search or status."}
              </p>
            </div>
          ) : (
            <ul className="mt-5 divide-y divide-[var(--color-border)]">
              {filtered.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
                >
                  <div className="min-w-0 flex-1 basis-56">
                    <p className="truncate text-sm">
                      <span
                        className={`font-medium ${
                          item.active
                            ? "text-[var(--color-text)]"
                            : "text-[var(--color-text-muted)]"
                        }`}
                      >
                        {item.name}
                      </span>

                      <span className="ml-2 text-xs tabular-nums text-[var(--color-text-muted)]">
                        {item.code}
                      </span>
                    </p>

                    {item.description && (
                      <p className="truncate text-xs text-[var(--color-text-secondary)]">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <ActiveT
                    active={item.active}
                    onToggle={() => toggleCostCenterStatus(item.id)}
                  />

                  <RowActions
                    name={item.name}
                    onEdit={() => openEdit(item)}
                    onDelete={() => deleteCostCenter(item.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="text-base font-semibold text-[var(--color-text)]">
            {editingItem ? "Edit cost center" : "New cost center"}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Code" required>
              <Input
                value={form.code}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    code: event.target.value,
                  }))
                }
                placeholder="CC-001"
                required
              />
            </Field>

            <Field label="Name" required>
              <Input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Human Resources"
                required
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={3}
              className={`${inputClass} h-auto resize-none py-2.5`}
            />
          </Field>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  active: event.target.checked,
                }))
              }
              className="mt-0.5 h-4 w-4 accent-[var(--color-brand)]"
            />

            <span>
              <span className="block text-sm font-medium text-[var(--color-text)]">
                Active
              </span>

              <span className="block text-xs text-[var(--color-text-muted)]">
                Inactive cost centers can't be chosen for new allocations.
              </span>
            </span>
          </label>

          <FormError message={error} />

          <div className="flex justify-end gap-2 border-t border-[var(--color-border)] pt-5">
            <Button type="button" variant="ghost" onClick={closeForm}>
              Cancel
            </Button>

            <Button type="submit">
              {editingItem ? "Save changes" : "Create cost center"}
            </Button>
          </div>
        </form>
      )}
    </ModalShell>
  );
}