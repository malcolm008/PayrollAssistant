import {
    ArrowLeft,
    ChevronDown,
    Eye,
    EyeOff,
    Pencil,
    Power,
    RefreshCw,
    Search,
    UserPlus,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
    Field,
    ModalShell,
    fieldInputClass,
    fieldSelectClass,
} from "../../components/ui/ModalShell";
import type { SystemUser } from "../../types/systemUser";
import type { RoleId, ModuleId, AccessLevel } from "../../types/systemUser";
import { MODULES, LEVELS } from "../../types/systemUser";
import { accessFor, ROLES, ROLE_IDS } from "../../data/roles";
import { defaultUsers } from "../../data/users";

const getInitials = (name: string) => name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatLastLogin = (iso: string | null) => iso ? new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
}).format(new Date(iso)) : "Never";

const nextUserId = (users: SystemUser[]) => {
    const max = users.reduce((highest, user) => Math.max(highest, Number(user.id.replace("USR-", "")) || 0), 0);

    return `USR-${String(max + 1).padStart(4, "0")}`;
};

const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    const values = new Uint32Array(12);
    crypto.getRandomValues(values);

    return Array.from(values, (value) => chars[value % chars.length]).join("");
};

const StatusBadge = ({ status }: { status: SystemUser["status"] }) => (
    <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${
        status === "Active"
            ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
            : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)]"
        }`}
    >
        {status}
    </span>
);

const RoleBadge = ({ role }: { role: RoleId }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${ROLES[role].badge}`}
  >
    {ROLES[role].label}
  </span>
);

interface FormState {
    name: string;
    username: string;
    email: string;
    role: RoleId;
    status: SystemUser["status"];
    access: Record<ModuleId, AccessLevel>;
    resetPassword: boolean;
    password: string;
    mustChangePassword: boolean;
};

function UserForm({
    users,
    editingUser,
    currentUserId,
    lockedAdmin,
    onCancel,
    onSave,
}: {
    users: SystemUser[];
    editingUser: SystemUser | null;
    currentUserId?: string;
    lockedAdmin: boolean;
    onCancel: () => void;
    onSave: (user: SystemUser, password?: string) => void;
}) {
    const isNew = editingUser === null;
    const [ draft, setDraft ] = useState<FormState>(() => editingUser ? {
        name: editingUser.name,
        username: editingUser.username,
        email: editingUser.email,
        role: editingUser.role,
        status: editingUser.status,
        access: { ...editingUser.access },
        resetPassword: false,
        password: "",
        mustChangePassword: true,
    }: {
        name: "",
        username: "",
        email: "",
        role: "auditor",
        status: "Active",
        access: accessFor("auditor"),
        resetPassword: false,
        password: generatePassword(),
        mustChangePassword: true,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const needsPassword = isNew || draft.resetPassword;
    const statusLocked = lockedAdmin || (editingUser?.id !== undefined && editingUser.id === currentUserId);

    const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setDraft((current) => ({ ...current, [key]: value }));
    
    const errors = useMemo(() => {
        const result: Partial<Record<"name" | "username" | "email" | "password", string>> = {};

        const username = draft.username.trim().toLowerCase();

        
        if (!username) {
            result.username = "Required";
        } else if (!/^[a-z0-9._-]{3,}$/.test(username)) {
            result.username = "Min 3 characters: letter, numbers, . _ -";
        } else if (
            users.some(
                (user) => user.id !== editingUser?.id && user.username.toLowerCase() === username,
            )
        ) {
            result.username = "Already in use";
        }


        if (!draft.email.trim()) {
            result.email = "Required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
            result.email = "Invalid email";
        }


        if (needsPassword && draft.password.length < 0) {
            result.password = "Minium 8 character";
        }

        return result;
    }, [draft, users, editingUser, needsPassword]);

    const isCustom = MODULES.some((module) => draft.access[module.id] !== ROLES[draft.role].access[module.id]);

    const handleSubmit = () => {
        setSubmitted(true);

        if (Object.keys(errors).length > 0) return;

        const user: SystemUser = {
            id: editingUser?.id ?? nextUserId(users),
            name: draft.name.trim(),
            username: draft.username.trim().toLowerCase(),
            email: draft.email.trim(),
            role: draft.role,
            status: draft.status,
            access: draft.access,
            mustChangePassword: needsPassword ? draft.mustChangePassword : (editingUser?.mustChangePassword ?? false),
            lastLogin: editingUser?.lastLogin ?? null,
        };

        onSave(user, needsPassword ? draft.password : undefined);
    };

    const fieldError = (key: keyof typeof errors) => submitted && errors[key] ? (
        <span className="block text-[11px] text-[var(--color-danger)]">
            {errors[key]}
        </span>
    ) : null;

    const invalidClass = (key: keyof typeof errors) =>  submitted && errors[key] ? "!border-[var(--color-danger)]/60" : "";

    return (
        <div className="space-y-6">
        <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
        >
            <ArrowLeft size={14} />
            Back to users
        </button>
    
        {/* Account */}
        <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
            Account
            </p>
    
            <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name">
                <>
                <input
                    value={draft.name}
                    onChange={(event) => set("name", event.target.value)}
                    className={`${fieldInputClass} ${invalidClass("name")}`}
                />
                {fieldError("name")}
                </>
            </Field>
    
            <Field label="Username">
                <>
                <input
                    value={draft.username}
                    onChange={(event) => set("username", event.target.value)}
                    autoComplete="off"
                    className={`${fieldInputClass} ${invalidClass("username")}`}
                />
                {fieldError("username")}
                </>
            </Field>
    
            <Field label="Email">
                <>
                <input
                    type="email"
                    value={draft.email}
                    onChange={(event) => set("email", event.target.value)}
                    className={`${fieldInputClass} ${invalidClass("email")}`}
                />
                {fieldError("email")}
                </>
            </Field>
    
            <Field label="Status">
                <div className="relative">
                <select
                    value={draft.status}
                    onChange={(event) =>
                    set("status", event.target.value as SystemUser["status"])
                    }
                    disabled={statusLocked}
                    title={statusLocked ? "Can't deactivate this account" : undefined}
                    className={`${fieldSelectClass} disabled:opacity-50`}
                >
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
    
                <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />
                </div>
            </Field>
            </div>
        </div>
    
        {/* Role + access */}
        <div className="border-t border-[var(--color-border)] pt-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
            Role
            </p>
    
            <div className="grid items-end gap-4 sm:grid-cols-2">
            <Field label="Assigned Role">
                <div className="relative">
                <select
                    value={draft.role}
                    onChange={(event) => {
                    const role = event.target.value as RoleId;
                    setDraft((current) => ({
                        ...current,
                        role,
                        access: accessFor(role),
                    }));
                    }}
                    disabled={lockedAdmin}
                    title={
                    lockedAdmin
                        ? "Last active administrator — assign another first"
                        : undefined
                    }
                    className={`${fieldSelectClass} disabled:opacity-50`}
                >
                    {ROLE_IDS.map((id) => (
                    <option key={id} value={id}>
                        {ROLES[id].label}
                    </option>
                    ))}
                </select>
    
                <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />
                </div>
            </Field>
    
            <p className="pb-2.5 text-xs text-[var(--color-text-secondary)]">
                {ROLES[draft.role].summary}
            </p>
            </div>
    
            <div className="mt-5 rounded-xl border border-[var(--color-border)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
                <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Module Access
                </span>
    
                {isCustom && (
                    <span className="rounded-full bg-[var(--color-warning)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--color-warning)]">
                    Custom
                    </span>
                )}
                </div>
    
                {isCustom && (
                <button
                    type="button"
                    onClick={() => set("access", accessFor(draft.role))}
                    className="text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-brand)]"
                >
                    Reset to role
                </button>
                )}
            </div>
    
            <div className="divide-y divide-[var(--color-border)]">
                {MODULES.map((module) => (
                <div
                    key={module.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5"
                >
                    <span className="text-xs font-medium text-[var(--color-text)]">
                    {module.label}
                    </span>
    
                    <div
                    role="group"
                    aria-label={`${module.label} access`}
                    className="inline-flex rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-0.5"
                    >
                    {LEVELS.map((level) => {
                        const active = draft.access[module.id] === level.value;
    
                        return (
                        <button
                            key={level.value}
                            type="button"
                            aria-pressed={active}
                            onClick={() =>
                            set("access", {
                                ...draft.access,
                                [module.id]: level.value,
                            })
                            }
                            className={`rounded-md px-3 py-1 text-[11px] font-medium transition-colors ${
                            active
                                ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
                                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                            }`}
                        >
                            {level.label}
                        </button>
                        );
                    })}
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
    
        {/* Security */}
        <div className="border-t border-[var(--color-border)] pt-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
            Security
            </p>
    
            {!isNew && (
            <label className="mb-4 flex cursor-pointer items-center gap-3">
                <input
                type="checkbox"
                checked={draft.resetPassword}
                onChange={(event) => {
                    set("resetPassword", event.target.checked);
                    if (event.target.checked && !draft.password) {
                    set("password", generatePassword());
                    }
                }}
                className="h-4 w-4 accent-[var(--color-brand)]"
                />
                <span className="text-xs text-[var(--color-text-secondary)]">
                Reset password
                </span>
            </label>
            )}
    
            {needsPassword && (
            <div className="space-y-4">
                <Field label="Temporary Password">
                <>
                    <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                        type={showPassword ? "text" : "password"}
                        value={draft.password}
                        onChange={(event) => set("password", event.target.value)}
                        autoComplete="new-password"
                        className={`${fieldInputClass} pr-10 ${invalidClass("password")}`}
                        />
    
                        <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                        >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
    
                    <button
                        type="button"
                        onClick={() => set("password", generatePassword())}
                        className="flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border-strong)] px-3 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)]"
                    >
                        <RefreshCw size={13} />
                        Generate
                    </button>
                    </div>
                    {fieldError("password")}
                </>
                </Field>
    
                <label className="flex cursor-pointer items-center gap-3">
                <input
                    type="checkbox"
                    checked={draft.mustChangePassword}
                    onChange={(event) =>
                    set("mustChangePassword", event.target.checked)
                    }
                    className="h-4 w-4 accent-[var(--color-brand)]"
                />
                <span className="text-xs text-[var(--color-text-secondary)]">
                    Require change at next sign-in
                </span>
                </label>
            </div>
            )}
        </div>
    
        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
            <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)]"
            >
            Cancel
            </button>
    
            <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-90"
            >
            {isNew ? "Create User" : "Save Changes"}
            </button>
        </div>
        </div>
    );

}

function UserList({
    users,
    currentUserId,
    getStatusLock,
    onAdd,
    onEdit,
    onToggleStatus,
}: {
    users: SystemUser[];
    currentUserId?: string;
    getStatusLock: (user: SystemUser) => string | null;
    onAdd: () => void;
    onEdit: (user: SystemUser) => void;
    onToggleStatus: (user: SystemUser) => void;
}) {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | RoleId>("all");

    const filtered = useMemo(() => {
        const query = search.toLowerCase().trim();

        return users.filter((user) => {
            const matchesSearch = !query || user.name.toLowerCase().includes(query) || user.username.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);

            return ( matchesSearch && (roleFilter === "all" || user.role === roleFilter));
        });
    }, [users, search, roleFilter]);

    const activeCount = users.filter((u) => u.status === "Active").length;
    
    return (
        <div className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
            <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />
    
            <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, username or email..."
                className={`${fieldInputClass} pl-10`}
            />
            </div>
    
            <div className="relative md:w-48">
            <select
                value={roleFilter}
                onChange={(event) =>
                setRoleFilter(event.target.value as "all" | RoleId)
                }
                className={fieldSelectClass}
            >
                <option value="all">All roles</option>
                {ROLE_IDS.map((id) => (
                <option key={id} value={id}>
                    {ROLES[id].label}
                </option>
                ))}
            </select>
    
            <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />
            </div>
    
            <button
            type="button"
            onClick={onAdd}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 text-xs font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-90"
            >
            <UserPlus size={15} />
            Add User
            </button>
        </div>
    
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <div className="min-w-[700px]">
            <div className="grid grid-cols-[1fr_150px_90px_110px_80px] gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                <span>User</span>
                <span>Role</span>
                <span>Status</span>
                <span>Last Login</span>
                <span className="text-right">Actions</span>
            </div>
    
            <div className="max-h-[420px] overflow-y-auto">
                {filtered.map((user) => {
                const lock = getStatusLock(user);
    
                return (
                    <div
                    key={user.id}
                    className="grid grid-cols-[1fr_150px_90px_110px_80px] items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 last:border-b-0 hover:bg-[var(--color-surface-hover)]"
                    >
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[10px] font-bold text-[var(--color-brand)]">
                        {getInitials(user.name)}
                        </div>
    
                        <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[var(--color-text)]">
                            {user.name}
                            {user.id === currentUserId && (
                            <span className="ml-2 text-[10px] font-normal text-[var(--color-text-muted)]">
                                You
                            </span>
                            )}
                        </p>
    
                        <p className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">
                            {user.username} · {user.email}
                        </p>
                        </div>
                    </div>
    
                    <div>
                        <RoleBadge role={user.role} />
                    </div>
    
                    <div>
                        <StatusBadge status={user.status} />
                    </div>
    
                    <span className="text-xs text-[var(--color-text-secondary)]">
                        {formatLastLogin(user.lastLogin)}
                    </span>
    
                    <div className="flex justify-end gap-1">
                        <button
                        type="button"
                        onClick={() => onEdit(user)}
                        title="Edit user"
                        className="rounded-md p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                        >
                        <Pencil size={14} />
                        </button>
    
                        <button
                        type="button"
                        onClick={() => onToggleStatus(user)}
                        disabled={Boolean(lock)}
                        title={
                            lock ??
                            (user.status === "Active"
                            ? "Deactivate user"
                            : "Activate user")
                        }
                        className={`rounded-md p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                            user.status === "Active"
                            ? "text-[var(--color-text-muted)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
                            : "text-[var(--color-text-muted)] hover:bg-[var(--color-success)]/10 hover:text-[var(--color-success)]"
                        }`}
                        >
                        <Power size={14} />
                        </button>
                    </div>
                    </div>
                );
                })}
    
                {filtered.length === 0 && (
                <div className="p-12 text-center">
                    <Search
                    size={20}
                    className="mx-auto text-[var(--color-text-muted)]"
                    />
                    <p className="mt-3 text-sm text-[var(--color-text)]">
                    No users found
                    </p>
                </div>
                )}
            </div>
            </div>
        </div>
    
        <p className="text-xs text-[var(--color-text-muted)]">
            {users.length} users · {activeCount} active
        </p>
        </div>
    )
}

interface SystemUsersModalProps {
    users?: SystemUser[];
    currentUserId?: string;
    onClose: () => void;
    onSaveUser?: (user: SystemUser, password?: string) => void;
    onStatusChange?: (user: SystemUser) => void;
}

export function SystemUsersModal({
    users: initialUsers = defaultUsers,
    currentUserId,
    onClose,
    onSaveUser,
    onStatusChange,
}: SystemUsersModalProps) {
    const [users, setUsers] = useState<SystemUser[]>(initialUsers);
    const [editing, setEditing] = useState<string | null>(null);

    const activeAdminCount = users.filter((user) => user.role === "administrator" && user.status === "Active").length;

    const isLastActiveAdmin = (user: SystemUser) => user.role === "administrator" && user.status === "Active" && activeAdminCount === 1;

    const getStatusLock = (user: SystemUser) => {
        if (user.id === currentUserId) return "You can't deactivate yourself";
        if (isLastActiveAdmin(user)) return "Last active administrator";
        return null;
    };

    const toggleStatus = (user: SystemUser) => {
        if (getStatusLock(user)) return;

        const updated: SystemUser = {
            ...user,
            status: user.status === "Active" ? "Inactive" : "Active",
        };

        setUsers((current) => current.map((item) => (item.id === user.id ? updated : item)));

        onStatusChange?.(updated);
    };

    const handleSave = (user: SystemUser, password?: string) => {
        setUsers((current) => current.some((item) => item.id === user.id) ? current?.map((item) => (item.id === user.id ? user : item)) : [...current, user]);
        onSaveUser?.(user, password);
        setEditing(null);
    }

    const editingUser = editing && editing !== "new" ? (users.find((user) => user.id === editing) ?? null) : null;

    return (
        <ModalShell
        title={
            editing === null
            ? "System Users"
            : editing === "new"
                ? "Add User"
                : "Edit User"
        }
        onClose={onClose}
        maxWidth="max-w-4xl"
        >
        {editing === null ? (
            <UserList
            users={users}
            currentUserId={currentUserId}
            getStatusLock={getStatusLock}
            onAdd={() => setEditing("new")}
            onEdit={(user) => setEditing(user.id)}
            onToggleStatus={toggleStatus}
            />
        ) : (
            <UserForm
            key={editing}
            users={users}
            editingUser={editingUser}
            currentUserId={currentUserId}
            lockedAdmin={Boolean(
                editingUser && isLastActiveAdmin(editingUser),
            )}
            onCancel={() => setEditing(null)}
            onSave={handleSave}
            />
        )}
        </ModalShell>
    );
}