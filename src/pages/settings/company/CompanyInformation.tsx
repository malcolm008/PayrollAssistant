import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCompany } from "../../../hooks/useCompany";

export function CompanyInformationPage() {
  const navigate = useNavigate();
  const { company, updateCompany } = useCompany();

  const [form, setForm] = useState(company);
  const [saved, setSaved] = useState(false);

  function updateField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  function handleSave() {
    updateCompany(form);
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
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
              <Building2
                size={20}
                className="text-[var(--color-brand)]"
              />
              <h1 className="text-2xl font-semibold text-[var(--color-text)]">
                General Information
              </h1>
            </div>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Configure your company's identity, business and
              contact information.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-sm font-medium text-[var(--color-bg)] transition hover:bg-[var(--color-brand-hover)]"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      {saved && (
        <div className="rounded-lg border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 px-4 py-3 text-sm text-[var(--color-success)]">
          Company information has been saved successfully.
        </div>
      )}

      {/* Company identity */}
      <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <SectionHeader
          icon={<Building2 size={18} />}
          title="Company Identity"
          description="Basic information used to identify the organization."
        />

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <Field
            label="Company Name"
            required
            value={form.companyName}
            onChange={(value) =>
              updateField("companyName", value)
            }
            placeholder="Enter company name"
          />

          <Field
            label="Incorporated As"
            value={form.incorporatedAs}
            onChange={(value) =>
              updateField("incorporatedAs", value)
            }
            placeholder="e.g. Limited Company"
          />

          <div className="md:col-span-2">
            <Field
              label="Nature of Business"
              value={form.natureOfBusiness}
              onChange={(value) =>
                updateField("natureOfBusiness", value)
              }
              placeholder="Describe the nature of the company's business"
              textarea
            />
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <SectionHeader
          icon={<MapPin size={18} />}
          title="Address Information"
          description="Postal and physical location details for the organization."
        />

        <div className="grid gap-5 p-6">
          <Field
            label="Address"
            value={form.address}
            onChange={(value) =>
              updateField("address", value)
            }
            placeholder="P.O. Box or postal address"
          />

          <Field
            label="Physical Address"
            value={form.physicalAddress}
            onChange={(value) =>
              updateField("physicalAddress", value)
            }
            placeholder="Street, building, plot or physical location"
          />
        </div>
      </section>

      {/* Contact */}
      <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <SectionHeader
          icon={<Phone size={18} />}
          title="Contact Information"
          description="Contact details displayed across company documents and reports."
        />

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <Field
            label="Phone"
            value={form.phone}
            onChange={(value) =>
              updateField("phone", value)
            }
            placeholder="+255 ..."
            icon={<Phone size={16} />}
          />

          <Field
            label="Fax"
            value={form.fax}
            onChange={(value) =>
              updateField("fax", value)
            }
            placeholder="+255 ..."
          />

          <Field
            label="Email Address"
            type="email"
            value={form.emailAddress}
            onChange={(value) =>
              updateField("emailAddress", value)
            }
            placeholder="info@company.com"
            icon={<Mail size={16} />}
          />

          <Field
            label="Website Link"
            value={form.website}
            onChange={(value) =>
              updateField("website", value)
            }
            placeholder="https://www.company.com"
            icon={<Globe size={16} />}
          />
        </div>
      </section>

      {/* Bottom save */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-5 py-2.5 text-sm font-medium text-[var(--color-bg)] transition hover:bg-[var(--color-brand-hover)]"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-6 py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
        {icon}
      </div>

      <div>
        <h2 className="font-semibold text-[var(--color-text)]">
          {title}
        </h2>

        <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  textarea = false,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  icon?: React.ReactNode;
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

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-3 text-[var(--color-text-muted)]">
            {icon}
          </span>
        )}

        {textarea ? (
          <textarea
            value={value}
            onChange={(event) =>
              onChange(event.target.value)
            }
            placeholder={placeholder}
            rows={3}
            className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(event) =>
              onChange(event.target.value)
            }
            placeholder={placeholder}
            className={`w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] py-2.5 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 ${
              icon ? "pl-10 pr-3" : "px-3"
            }`}
          />
        )}
      </div>
    </label>
  );
}