import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  ActiveCheckbox,
  Field,
  FormError,
  ModalShell,
  RowActions,
} from "../ui/RecordModal";
import {
  usePaymentMethods,
  type PaymentMethod,
  type PaymentMethodInput,
} from "../../hooks/usePaymentMethod";

const emptyForm: PaymentMethodInput = { name: "", active: true };

interface PaymentMethodsModalProps {
  onClose: () => void;
}

export function PaymentMethodsModal({ onClose }: PaymentMethodsModalProps) {
  const { methods, addMethod, updateMethod, deleteMethod, toggleMethodStatus } =
    usePaymentMethods();

  // null shows the list, "new" and a record show the form.
  const [editing, setEditing] = useState<PaymentMethod | "new" | null>(null);
  const [form, setForm] = useState<PaymentMethodInput>(emptyForm);
  const [error, setError] = useState("");

  const editingItem = typeof editing === "object" ? editing : null;

  const activeCount = methods.filter((method) => method.active).length;

  const closeForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
  };

  const openCreate = () => {
    setForm(emptyForm);
    setError("");
    setEditing("new");
  };

  const openEdit = (method: PaymentMethod) => {
    setForm({ name: method.name, active: method.active });
    setError("");
    setEditing(method);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      if (editingItem) {
        updateMethod(editingItem.id, form);
      } else {
        addMethod(form);
      }

      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <ModalShell title="Payment methods" onClose={onClose} maxWidth="max-w-xl">
      {editing === null ? (
        <div>
          <div className="flex justify-end">
            <Button onClick={openCreate}>
              <Plus size={16} />
              Add method
            </Button>
          </div>

          {methods.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-sm font-medium text-[var(--color-text)]">
                No payment methods yet
              </p>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Add the ways employees are paid, for example "Bank transfer".
              </p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--color-border)]">
              {methods.map((method) => (
                <li
                  key={method.id}
                  className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
                >
                  <span
                    className={`min-w-0 flex-1 basis-40 truncate text-sm font-medium ${
                      method.active
                        ? "text-[var(--color-text)]"
                        : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {method.name}
                  </span>

                  <ActiveCheckbox
                    checked={method.active}
                    onChange={(active) => setForm((current) => ({ ...current, active }))}
                  />

                  <RowActions
                    name={method.name}
                    onEdit={() => openEdit(method)}
                    onDelete={() => deleteMethod(method.id)}
                  />
                </li>
              ))}
            </ul>
          )}

          {methods.length > 0 && (
            <p className="mt-5 text-xs text-[var(--color-text-muted)]">
              {methods.length} {methods.length === 1 ? "method" : "methods"},{" "}
              {activeCount} active.
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="text-base font-semibold text-[var(--color-text)]">
            {editingItem ? "Edit payment method" : "New payment method"}
          </h3>

          <Field label="Name" required>
            <Input
              autoFocus
              required
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Bank transfer"
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
                Inactive methods won't be offered when choosing how to pay.
              </span>
            </span>
          </label>

          <FormError message={error} />

          <div className="flex justify-end gap-2 border-t border-[var(--color-border)] pt-5">
            <Button type="button" variant="ghost" onClick={closeForm}>
              Cancel
            </Button>

            <Button type="submit">
              {editingItem ? "Save changes" : "Add method"}
            </Button>
          </div>
        </form>
      )}
    </ModalShell>
  );
}