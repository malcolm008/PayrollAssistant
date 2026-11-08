import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { type StatusFilter } from "../../types/costCenter";

export const inputClass = "h-10 w-full rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]";

export function ModalShell({
  title,
  onClose,
  children,
  maxWidth = "max-w-3xl",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`flex max-h-[88vh] w-full ${maxWidth} flex-col rounded-[6px] border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] shadow-2xl`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-[4px] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-[var(--color-text-secondary)]">
        {label}

        {required && (
          <span className="ml-1.5 font-normal text-[var(--color-text-muted)]">
            (required)
          </span>
        )}
      </span>

      {children}

      {hint && (
        <span className="mt-1.5 block text-xs text-[var(--color-text-muted)]">
          {hint}
        </span>
      )}
    </label>
  );
}

export function StatusTabs({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
  const options: { id: StatusFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "inactive", label: "Inactive" },
  ];

  return (
    <div role="group" aria-label="Status" className="flex gap-5 text-sm">
      {options.map((option) => {
        const isOn = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isOn}
            onClick={() => onChange(option.id)}
            className={`transition-colors ${
              isOn
                ? "font-medium text-[var(--color-text)] underline decoration-[var(--color-brand)] decoration-2 underline-offset-[6px]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function ActiveT({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={active ? "Mark as inactive" : "Mark as active"}
      className="flex items-center gap-2 rounded-[4px] px-1.5 py-1 text-xs text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-[var(--color-success)]"
            : "bg-[var(--color-text-disabled)]"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </button>
  );
}

// Edit and Delete as plain text. Delete asks for confirmation in place, so
// there is no second popup on top of the modal.
export function RowActions({
  name,
  onEdit,
  onDelete,
}: {
  name: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="flex items-center gap-3 text-xs">
        <span className="text-[var(--color-text-secondary)]">
          Delete {name}?
        </span>

        <button
          type="button"
          onClick={onDelete}
          className="font-medium text-[var(--color-danger)] hover:underline"
        >
          Yes, delete
        </button>

        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
        >
          Keep
        </button>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-3 text-xs">
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${name}`}
        className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-brand)]"
      >
        Edit
      </button>

      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${name}`}
        className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-danger)]"
      >
        Delete
      </button>
    </span>
  );
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="border-l-2 border-[var(--color-danger)] pl-3 text-sm text-[var(--color-danger)]"
    >
      {message}
    </p>
  );
}