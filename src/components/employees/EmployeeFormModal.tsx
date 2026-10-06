import {
    BriefcaseBusiness,
    CalendarDays,
    Check,
    CircleDollarSign,
    Home,
    IdCard,
    Mail,
    User,
    X,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import type {
    Employee,
    EmployeeAllowance,
    Gender,
} from "../../types/employees";

interface EmployeeFormModalProps {
    employee?: Employee | null;
    nextEmployeeNumber?: string;
    onClose: () => void;
    onSubmit: (employee: Employee) => void;
}

interface FormState {
    employeeNumber: string;

    surname: string;
    name: string;
    gender: Gender;
    dateOfBirth: string;

    employmentType: string;
    department: string;
    costCode: string;
    jobTitle: string;

    currency: string;
    salary: string;
    paidOvertime: boolean;

    email: string;
    phone: string;

    wcfNumber: string;
    nationalIdNumber: string;
    tinNumber: string;
    sdlExemption: boolean;

    residence: string;
    companyHouse: boolean;
    rentedHouseRentAmount: string;

    leaveDaysEntitled: string;

    status: "Active" | "Inactive";

    allowances: EmployeeAllowance[];
}

interface AllowanceTypeOption {
    id: string;
    code: string;
    name: string;
    active: boolean;
}

const DEFAULT_ALLOWANCE_TYPES: AllowanceTypeOption[] = [
    {
        id: "housing",
        code: "HOUSE",
        name: "Housing Allowance",
        active: true,
    },
    {
        id: "transport",
        code: "TRANS",
        name: "Transport Allowance",
        active: true,
    },
    {
        id: "meal",
        code: "MEAL",
        name: "Meal Allowance",
        active: true,
    },
];

function loadAllowanceTypes(): AllowanceTypeOption[] {
    try {
        const stored = localStorage.getItem("payroll_allowance_types");

        if (!stored) {
        return DEFAULT_ALLOWANCE_TYPES;
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
        return DEFAULT_ALLOWANCE_TYPES;
        }

        return parsed
        .filter((item) => item && item.active !== false)
        .map((item) => ({
            id: String(item.id),
            code: String(item.code ?? ""),
            name: String(item.name ?? item.description ?? ""),
            active: item.active !== false,
        }));
    } catch {
        return DEFAULT_ALLOWANCE_TYPES;
    }
}

function createEmptyForm(employeeNumber: string): FormState {
    return {
        employeeNumber,

        surname: "",
        name: "",
        gender: "Male",
        dateOfBirth: "",

        employmentType: "Full Time",
        department: "",
        costCode: "",
        jobTitle: "",

        currency: "TZS",
        salary: "",
        paidOvertime: true,

        email: "",
        phone: "",

        wcfNumber: "",
        nationalIdNumber: "",
        tinNumber: "",
        sdlExemption: false,

        residence: "",
        companyHouse: false,
        rentedHouseRentAmount: "",

        leaveDaysEntitled: "28",

        status: "Active",

        allowances: [],
    };
}

function employeeToForm(employee: Employee): FormState {
    return {
        employeeNumber: employee.employeeNumber,

        surname: employee.surname,
        name: employee.name,
        gender: employee.gender,
        dateOfBirth: employee.dateOfBirth,

        employmentType: employee.employmentType,
        department: employee.department,
        costCode: employee.costCode,
        jobTitle: employee.jobTitle,

        currency: employee.currency,
        salary: String(employee.salary),
        paidOvertime: employee.paidOvertime,

        email: employee.email,
        phone: employee.phone,

        wcfNumber: employee.wcfNumber,
        nationalIdNumber: employee.nationalIdNumber,
        tinNumber: employee.tinNumber,
        sdlExemption: employee.sdlExemption,

        residence: employee.residence,
        companyHouse: employee.companyHouse,
        rentedHouseRentAmount: String(employee.rentedHouseRentAmount),

        leaveDaysEntitled: String(employee.leaveDaysEntitled),

        status: employee.status,

        allowances: employee.allowances ?? [],
    };
}

export default function EmployeeFormModal({
    employee,
    nextEmployeeNumber,
    onClose,
    onSubmit,
}: EmployeeFormModalProps) {
    const isEditing = Boolean(employee);

    const [form, setForm] = useState<FormState>(() =>
        employee
        ? employeeToForm(employee)
        : createEmptyForm(nextEmployeeNumber ?? ""),
    );

        const allowanceTypes = loadAllowanceTypes();

    const [error, setError] = useState("");


    const update = <K extends keyof FormState>(
        field: K,
        value: FormState[K],
    ) => {
        setForm((current) => ({
        ...current,
        [field]: value,
        }));
    };

    const updateAllowance = (
        allowanceTypeId: string,
        amount: string,
    ) => {
        const numericAmount = Number(amount) || 0;

        setForm((current) => {
        const existing = current.allowances.find(
            (item) => item.allowanceTypeId === allowanceTypeId,
        );

        if (existing) {
            return {
            ...current,
            allowances: current.allowances.map((item) =>
                item.allowanceTypeId === allowanceTypeId
                ? {
                    ...item,
                    amount: numericAmount,
                    }
                : item,
            ),
            };
        }

        return {
            ...current,
            allowances: [
            ...current.allowances,
            {
                allowanceTypeId,
                amount: numericAmount,
            },
            ],
        };
        });
    };

    const getAllowanceAmount = (allowanceTypeId: string) => {
        return (
        form.allowances.find(
            (item) => item.allowanceTypeId === allowanceTypeId,
        )?.amount ?? 0
        );
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.employeeNumber.trim()) {
        setError("Employee number is required.");
        return;
        }

        if (!form.surname.trim()) {
        setError("Surname is required.");
        return;
        }

        if (!form.name.trim()) {
        setError("Name is required.");
        return;
        }

        if (!form.department.trim()) {
        setError("Department is required.");
        return;
        }

        if (!form.jobTitle.trim()) {
        setError("Job title is required.");
        return;
        }

        if (!form.salary || Number(form.salary) < 0) {
        setError("Enter a valid basic salary.");
        return;
        }

        const result: Employee = {
        id: employee?.id ?? crypto.randomUUID(),

        employeeNumber: form.employeeNumber.trim(),

        surname: form.surname.trim(),
        name: form.name.trim(),
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,

        employmentType: form.employmentType,
        department: form.department.trim(),
        costCode: form.costCode.trim(),
        jobTitle: form.jobTitle.trim(),

        currency: form.currency,
        salary: Number(form.salary) || 0,
        paidOvertime: form.paidOvertime,

        email: form.email.trim(),
        phone: form.phone.trim(),

        wcfNumber: form.wcfNumber.trim(),
        nationalIdNumber: form.nationalIdNumber.trim(),
        tinNumber: form.tinNumber.trim(),
        sdlExemption: form.sdlExemption,

        residence: form.residence.trim(),
        companyHouse: form.companyHouse,
        rentedHouseRentAmount: form.companyHouse
            ? 0
            : Number(form.rentedHouseRentAmount) || 0,

        leaveDaysEntitled:
            Number(form.leaveDaysEntitled) || 0,

        status: form.status,

        allowances: form.allowances,
        };

        onSubmit(result);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl">

            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-5">
            <div>
                <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                    <User size={17} />
                </div>

                <div>
                    <h2 className="text-base font-semibold text-[var(--color-text)]">
                    {isEditing
                        ? "Edit Employee"
                        : "Add Employee"}
                    </h2>

                    <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    {isEditing
                        ? "Update the employee's payroll and workforce information."
                        : "Create a complete employee payroll record."}
                    </p>
                </div>
                </div>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
            >
                <X size={18} />
            </button>
            </div>

            {/* Body */}
            <form
            onSubmit={handleSubmit}
            className="min-h-0 flex-1 overflow-y-auto"
            >
            <div className="space-y-8 p-6">

                {error && (
                <div className="rounded-lg border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-[var(--color-danger)]">
                    {error}
                </div>
                )}

                {/* PERSONAL INFORMATION */}
                <FormSection
                icon={<User size={16} />}
                title="Personal Information"
                description="Basic employee identity information."
                >
                <div className="grid gap-4 md:grid-cols-3">
                    <Field
                    label="Employee Number"
                    required
                    >
                    <input
                        value={form.employeeNumber}
                        onChange={(e) =>
                        update("employeeNumber", e.target.value)
                        }
                        className={inputClass}
                        disabled={isEditing}
                    />
                    </Field>

                    <Field label="Surname" required>
                    <input
                        value={form.surname}
                        onChange={(e) =>
                        update("surname", e.target.value)
                        }
                        placeholder="e.g. Mwangi"
                        className={inputClass}
                    />
                    </Field>

                    <Field label="Name" required>
                    <input
                        value={form.name}
                        onChange={(e) =>
                        update("name", e.target.value)
                        }
                        placeholder="e.g. John"
                        className={inputClass}
                    />
                    </Field>

                    <Field label="Gender" required>
                    <select
                        value={form.gender}
                        onChange={(e) =>
                        update(
                            "gender",
                            e.target.value as Gender,
                        )
                        }
                        className={inputClass}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    </Field>

                    <Field label="Date of Birth">
                    <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) =>
                        update("dateOfBirth", e.target.value)
                        }
                        className={inputClass}
                    />
                    </Field>
                </div>
                </FormSection>

                {/* EMPLOYMENT */}
                <FormSection
                icon={<BriefcaseBusiness size={16} />}
                title="Employment"
                description="Organizational and employment classification."
                >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Field label="Employment Type" required>
                    <select
                        value={form.employmentType}
                        onChange={(e) =>
                        update(
                            "employmentType",
                            e.target.value,
                        )
                        }
                        className={inputClass}
                    >
                        <option>Full Time</option>
                        <option>Part Time</option>
                        <option>Contract</option>
                        <option>Temporary</option>
                    </select>
                    </Field>

                    <Field label="Department" required>
                    <input
                        value={form.department}
                        onChange={(e) =>
                        update("department", e.target.value)
                        }
                        placeholder="e.g. Finance"
                        className={inputClass}
                    />
                    </Field>

                    <Field label="Cost Code">
                    <input
                        value={form.costCode}
                        onChange={(e) =>
                        update("costCode", e.target.value)
                        }
                        placeholder="e.g. FIN-001"
                        className={inputClass}
                    />
                    </Field>

                    <Field label="Job Title" required>
                    <input
                        value={form.jobTitle}
                        onChange={(e) =>
                        update("jobTitle", e.target.value)
                        }
                        placeholder="e.g. Accountant"
                        className={inputClass}
                    />
                    </Field>
                </div>
                </FormSection>

                {/* PAYROLL */}
                <FormSection
                icon={<CircleDollarSign size={16} />}
                title="Payroll"
                description="Basic salary, currency, overtime and configured allowances."
                >
                <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Currency" required>
                    <select
                        value={form.currency}
                        onChange={(e) =>
                        update("currency", e.target.value)
                        }
                        className={inputClass}
                    >
                        <option value="TZS">TZS — Tanzanian Shilling</option>
                        <option value="USD">USD — US Dollar</option>
                        <option value="EUR">EUR — Euro</option>
                        <option value="GBP">GBP — British Pound</option>
                    </select>
                    </Field>

                    <Field label="Basic Salary" required>
                    <input
                        type="number"
                        min="0"
                        value={form.salary}
                        onChange={(e) =>
                        update("salary", e.target.value)
                        }
                        placeholder="0"
                        className={inputClass}
                    />
                    </Field>

                    <div className="flex items-end">
                    <label className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3">
                        <input
                        type="checkbox"
                        checked={form.paidOvertime}
                        onChange={(e) =>
                            update(
                            "paidOvertime",
                            e.target.checked,
                            )
                        }
                        className="h-4 w-4 accent-[var(--color-brand)]"
                        />

                        <span className="text-sm text-[var(--color-text-secondary)]">
                        Paid overtime
                        </span>
                    </label>
                    </div>
                </div>

                <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] p-4">
                    <div className="mb-4">
                    <p className="text-xs font-semibold text-[var(--color-text)]">
                        Allowances
                    </p>

                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                        Enter the employee's amount for each configured allowance.
                    </p>
                    </div>

                    {allowanceTypes.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[var(--color-border-strong)] p-5 text-center">
                        <p className="text-xs text-[var(--color-text-muted)]">
                        No active allowance types configured.
                        </p>
                    </div>
                    ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {allowanceTypes.map((allowance) => (
                        <Field
                            key={allowance.id}
                            label={`${allowance.name}${allowance.code ? ` (${allowance.code})` : ""}`}
                        >
                            <input
                            type="number"
                            min="0"
                            value={getAllowanceAmount(
                                allowance.id,
                            ) || ""}
                            onChange={(e) =>
                                updateAllowance(
                                allowance.id,
                                e.target.value,
                                )
                            }
                            placeholder="0"
                            className={inputClass}
                            />
                        </Field>
                        ))}
                    </div>
                    )}
                </div>
                </FormSection>

                {/* CONTACT */}
                <FormSection
                icon={<Mail size={16} />}
                title="Contact Information"
                description="Employee contact details."
                >
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Email Address">
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                        update("email", e.target.value)
                        }
                        placeholder="employee@example.com"
                        className={inputClass}
                    />
                    </Field>

                    <Field label="Phone Number">
                    <input
                        value={form.phone}
                        onChange={(e) =>
                        update("phone", e.target.value)
                        }
                        placeholder="+255..."
                        className={inputClass}
                    />
                    </Field>
                </div>
                </FormSection>

                {/* STATUTORY */}
                <FormSection
                icon={<IdCard size={16} />}
                title="Statutory Information"
                description="Government and statutory payroll identifiers."
                >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Field label="WCF Number">
                    <input
                        value={form.wcfNumber}
                        onChange={(e) =>
                        update("wcfNumber", e.target.value)
                        }
                        className={inputClass}
                    />
                    </Field>

                    <Field label="National ID Number">
                    <input
                        value={form.nationalIdNumber}
                        onChange={(e) =>
                        update(
                            "nationalIdNumber",
                            e.target.value,
                        )
                        }
                        className={inputClass}
                    />
                    </Field>

                    <Field label="TIN Number">
                    <input
                        value={form.tinNumber}
                        onChange={(e) =>
                        update("tinNumber", e.target.value)
                        }
                        className={inputClass}
                    />
                    </Field>

                    <div className="flex items-end">
                    <label className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3">
                        <input
                        type="checkbox"
                        checked={form.sdlExemption}
                        onChange={(e) =>
                            update(
                            "sdlExemption",
                            e.target.checked,
                            )
                        }
                        className="h-4 w-4 accent-[var(--color-brand)]"
                        />

                        <span className="text-sm text-[var(--color-text-secondary)]">
                        SDL exempt
                        </span>
                    </label>
                    </div>
                </div>
                </FormSection>

                {/* HOUSING */}
                <FormSection
                icon={<Home size={16} />}
                title="Residence & Housing"
                description="Employee residence and company housing information."
                >
                <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Residence">
                    <input
                        value={form.residence}
                        onChange={(e) =>
                        update("residence", e.target.value)
                        }
                        placeholder="e.g. Arusha"
                        className={inputClass}
                    />
                    </Field>

                    <div className="flex items-end">
                    <label className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3">
                        <input
                        type="checkbox"
                        checked={form.companyHouse}
                        onChange={(e) =>
                            update(
                            "companyHouse",
                            e.target.checked,
                            )
                        }
                        className="h-4 w-4 accent-[var(--color-brand)]"
                        />

                        <span className="text-sm text-[var(--color-text-secondary)]">
                        Stay in company house
                        </span>
                    </label>
                    </div>

                    {!form.companyHouse && (
                    <Field label="Rented House Rent Amount">
                        <input
                        type="number"
                        min="0"
                        value={form.rentedHouseRentAmount}
                        onChange={(e) =>
                            update(
                            "rentedHouseRentAmount",
                            e.target.value,
                            )
                        }
                        placeholder="0"
                        className={inputClass}
                        />
                    </Field>
                    )}
                </div>
                </FormSection>

                {/* LEAVE */}
                <FormSection
                icon={<CalendarDays size={16} />}
                title="Leave"
                description="Employee annual leave entitlement."
                >
                <div className="max-w-xs">
                    <Field label="Leave Days Entitled">
                    <input
                        type="number"
                        min="0"
                        value={form.leaveDaysEntitled}
                        onChange={(e) =>
                        update(
                            "leaveDaysEntitled",
                            e.target.value,
                        )
                        }
                        className={inputClass}
                    />
                    </Field>
                </div>
                </FormSection>

                {/* STATUS */}
                <FormSection
                icon={<Check size={16} />}
                title="Employee Status"
                description="Controls whether the employee is currently active."
                >
                <div className="max-w-xs">
                    <Field label="Status">
                    <select
                        value={form.status}
                        onChange={(e) =>
                        update(
                            "status",
                            e.target.value as
                            | "Active"
                            | "Inactive",
                        )
                        }
                        className={inputClass}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">
                        Inactive
                        </option>
                    </select>
                    </Field>
                </div>
                </FormSection>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex shrink-0 items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-4">
                <p className="text-xs text-[var(--color-text-muted)]">
                Fields marked with * are required.
                </p>

                <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-[var(--color-border-strong)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[var(--color-brand-hover)]"
                >
                    <Check size={16} />

                    {isEditing
                    ? "Save Changes"
                    : "Create Employee"}
                </button>
                </div>
            </div>
            </form>
        </div>
        </div>
    );
}



const inputClass = "h-10 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-60";

function FormSection({
    icon,
    title,
    description,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <section>
        <div className="mb-4 flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
            {icon}
            </div>

            <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
                {title}
            </h3>

            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                {description}
            </p>
            </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] p-5">
            {children}
        </div>
        </section>
    );
}

function Field({
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