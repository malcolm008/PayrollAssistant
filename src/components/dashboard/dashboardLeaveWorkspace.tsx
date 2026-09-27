import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Settings2,
  Users,
  X,
} from "lucide-react";

type LeaveOperation =
  | "calendar"
  | "approvers"
  | "application"
  | "outstanding"
  | null;

type CalendarDayStatus = "working" | "resting" | "holiday";

interface CalendarDay {
  date: string;
  status: CalendarDayStatus;
  label?: string;
}

interface LeaveApprover {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  active: boolean;
}

interface LeaveApplication {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
}

const CALENDAR_STORAGE_KEY = "payroll_leave_calendar";
const APPROVERS_STORAGE_KEY = "payroll_leave_approvers";
const APPLICATIONS_STORAGE_KEY = "payroll_leave_applications";

const employees = [
  {
    id: "EMP-0001",
    name: "John Mwangi",
    department: "Finance",
  },
  {
    id: "EMP-0002",
    name: "Sarah Johnson",
    department: "Human Resources",
  },
  {
    id: "EMP-0003",
    name: "Michael Smith",
    department: "Information Technology",
  },
  {
    id: "EMP-0004",
    name: "Amina Hassan",
    department: "Administration",
  },
];

const leaveTypes = [
  "Annual Leave",
  "Sick Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Compassionate Leave",
  "Study Leave",
  "Unpaid Leave",
];

function createDefaultCalendar(month: string): CalendarDay[] {
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();

  const generated: CalendarDay[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthNumber - 1, day);
    const weekday = date.getDay();

    generated.push({
      date: `${month}-${String(day).padStart(2, "0")}`,
      status: weekday === 0 || weekday === 6 ? "resting" : "working",
    });
  }

  return generated;
}

function getInitialMonth() {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}`;
}

function calculateWorkingDays(
  fromDate: string,
  toDate: string,
  calendar?: Record<string, CalendarDay[]>,
) {
  if (!fromDate || !toDate) return 0;

  const start = new Date(`${fromDate}T00:00:00`);
  const end = new Date(`${toDate}T00:00:00`);

  if (start > end) return 0;

  let count = 0;
  const cursor = new Date(start);

  while (cursor <= end) {
    const dateString = cursor.toISOString().slice(0, 10);
    const month = dateString.slice(0, 7);

    const configuredDay = calendar?.[month]?.find(
      (day) => day.date === dateString,
    );

    if (configuredDay) {
      if (configuredDay.status === "working") {
        count++;
      }
    } else {
      const weekday = cursor.getDay();

      if (weekday !== 0 && weekday !== 6) {
        count++;
      }
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return count;
}

export function DashboardLeaveWorkspace() {
  const [openOperation, setOpenOperation] =
    useState<LeaveOperation>(null);

  const [calendar, setCalendar] = useState<
    Record<string, CalendarDay[]>
  >(() => {
    try {
      return JSON.parse(
        localStorage.getItem(CALENDAR_STORAGE_KEY) || "{}",
      );
    } catch {
      return {};
    }
  });

  const [approvers, setApprovers] = useState<LeaveApprover[]>(() => {
    try {
      const saved = localStorage.getItem(APPROVERS_STORAGE_KEY);

      if (saved) {
        return JSON.parse(saved);
      }

      return [
        {
          id: "APR-001",
          employeeId: "EMP-0001",
          name: "John Mwangi",
          department: "Finance",
          active: true,
        },
        {
          id: "APR-002",
          employeeId: "EMP-0002",
          name: "Sarah Johnson",
          department: "Human Resources",
          active: true,
        },
        {
          id: "APR-003",
          employeeId: "EMP-0003",
          name: "Michael Smith",
          department: "Information Technology",
          active: false,
        },
      ];
    } catch {
      return [];
    }
  });

  const [applications, setApplications] = useState<
    LeaveApplication[]
  >(() => {
    try {
      return JSON.parse(
        localStorage.getItem(APPLICATIONS_STORAGE_KEY) || "[]",
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      CALENDAR_STORAGE_KEY,
      JSON.stringify(calendar),
    );
  }, [calendar]);

  useEffect(() => {
    localStorage.setItem(
      APPROVERS_STORAGE_KEY,
      JSON.stringify(approvers),
    );
  }, [approvers]);

  useEffect(() => {
    localStorage.setItem(
      APPLICATIONS_STORAGE_KEY,
      JSON.stringify(applications),
    );
  }, [applications]);

  return (
    <>
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[var(--color-text)]">
                Leave Operations
              </h2>

              <span className="rounded-full bg-[var(--color-brand-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-brand)]">
                4
              </span>
            </div>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Manage leave applications, working calendars and approvals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <LeaveOperationButton
            title="Edit Calendar"
            description="Working days, resting days and holidays"
            icon={CalendarDays}
            onClick={() => setOpenOperation("calendar")}
          />

          <LeaveOperationButton
            title="Approving Managers"
            description="Configure employees who approve leave"
            icon={Users}
            onClick={() => setOpenOperation("approvers")}
          />

          <LeaveOperationButton
            title="Apply for Leave"
            description="Submit a new employee leave application"
            icon={FileText}
            onClick={() => setOpenOperation("application")}
          />

          <LeaveOperationButton
            title="Outstanding Leave"
            description="View balances and pending leave"
            icon={Clock3}
            onClick={() => setOpenOperation("outstanding")}
          />
        </div>
      </section>

      {openOperation === "calendar" && (
        <LeaveCalendarModal
          calendar={calendar}
          onClose={() => setOpenOperation(null)}
          onSave={(month, days) => {
            setCalendar((current) => ({
              ...current,
              [month]: days,
            }));

            setOpenOperation(null);
          }}
        />
      )}

      {openOperation === "approvers" && (
        <LeaveApproversModal
          approvers={approvers}
          onClose={() => setOpenOperation(null)}
          onSave={(updated) => {
            setApprovers(updated);
            setOpenOperation(null);
          }}
        />
      )}

      {openOperation === "application" && (
        <LeaveApplicationModal
          calendar={calendar}
          applications={applications}
          onClose={() => setOpenOperation(null)}
          onSubmit={(application) => {
            setApplications((current) => [
              application,
              ...current,
            ]);

            setOpenOperation(null);
          }}
        />
      )}

      {openOperation === "outstanding" && (
        <OutstandingLeaveModal
          applications={applications}
          onClose={() => setOpenOperation(null)}
        />
      )}
    </>
  );
}

/* =========================================================
   OPERATION BUTTON
========================================================= */

interface LeaveOperationButtonProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}

function LeaveOperationButton({
  title,
  description,
  icon: Icon,
  onClick,
}: LeaveOperationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-brand)]/40 hover:bg-[var(--color-surface-hover)] hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-soft)]">
          <Icon
            size={19}
            className="text-[var(--color-brand)]"
            strokeWidth={1.8}
          />
        </div>

        <ChevronRight
          size={16}
          className="text-[var(--color-text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-brand)]"
        />
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          {title}
        </h3>

        <p className="mt-1 text-[11px] leading-5 text-[var(--color-text-muted)]">
          {description}
        </p>
      </div>
    </button>
  );
}

/* =========================================================
   MODAL SHELL
========================================================= */

interface LeaveModalProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}

function LeaveModal({
  title,
  description,
  icon: Icon,
  children,
  onClose,
  wide = false,
}: LeaveModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        className={`max-h-[90vh] w-full overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl ${
          wide ? "max-w-4xl" : "max-w-2xl"
        }`}
      >
        <div className="flex items-start justify-between border-b border-[var(--color-border)] p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-soft)]">
              <Icon
                size={18}
                className="text-[var(--color-brand)]"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[var(--color-text)]">
                {title}
              </h2>

              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="max-h-[calc(90vh-90px)] overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CALENDAR MODAL
========================================================= */

interface LeaveCalendarModalProps {
  calendar: Record<string, CalendarDay[]>;
  onClose: () => void;
  onSave: (month: string, days: CalendarDay[]) => void;
}

function LeaveCalendarModal({
  calendar,
  onClose,
  onSave,
}: LeaveCalendarModalProps) {
  const initialMonth = getInitialMonth();

  const [month, setMonth] = useState(initialMonth);

  const [days, setDays] = useState<CalendarDay[]>(() =>
    calendar[initialMonth]?.length
      ? calendar[initialMonth]
      : createDefaultCalendar(initialMonth),
  );

  const handleMonthChange = (nextMonth: string) => {
    setMonth(nextMonth);

    setDays(
      calendar[nextMonth]?.length
        ? calendar[nextMonth]
        : createDefaultCalendar(nextMonth),
    );
  };

  const monthLabel = new Date(
    `${month}-01T00:00:00`,
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const workingDays = days.filter(
    (day) => day.status === "working",
  ).length;

  const restingDays = days.filter(
    (day) => day.status === "resting",
  ).length;

  const holidays = days.filter(
    (day) => day.status === "holiday",
  ).length;

  const updateDay = (
    date: string,
    status: CalendarDayStatus,
    label?: string,
  ) => {
    setDays((current) =>
      current.map((day) =>
        day.date === date
          ? {
              ...day,
              status,
              label:
                status === "holiday"
                  ? label ?? day.label
                  : undefined,
            }
          : day,
      ),
    );
  };

  return (
    <LeaveModal
      title="Edit Leave Calendar"
      description="Configure working days, resting days and custom holidays."
      icon={CalendarDays}
      onClose={onClose}
      wide
    >
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Payroll Month
          </label>

          <input
            type="month"
            value={month}
            onChange={(event) =>
              handleMonthChange(event.target.value)
            }
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-brand)]"
          />
        </div>

        <div className="flex gap-2">
          <CalendarStat
            label="Working"
            value={workingDays}
          />
          <CalendarStat
            label="Resting"
            value={restingDays}
          />
          <CalendarStat
            label="Holidays"
            value={holidays}
          />
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
        <div className="flex items-center gap-2">
          <Settings2
            size={15}
            className="text-[var(--color-brand)]"
          />

          <span className="text-xs font-semibold text-[var(--color-text)]">
            {monthLabel}
          </span>
        </div>

        <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
          Monday to Friday are working by default. Saturday and
          Sunday are resting days.
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {[
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun",
        ].map((day) => (
          <div
            key={day}
            className="py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
          >
            {day}
          </div>
        ))}

        {days.map((day) => (
          <CalendarDayEditor
            key={day.date}
            day={day}
            onChange={updateDay}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t border-[var(--color-border)] pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => onSave(month, days)}
          className="rounded-xl bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-[var(--color-brand-hover)]"
        >
          Save Calendar
        </button>
      </div>
    </LeaveModal>
  );
}

interface CalendarDayEditorProps {
  day: CalendarDay;
  onChange: (
    date: string,
    status: CalendarDayStatus,
    label?: string,
  ) => void;
}

function CalendarDayEditor({
  day,
  onChange,
}: CalendarDayEditorProps) {
  const [showHolidayInput, setShowHolidayInput] =
    useState(false);

  const dayNumber = Number(day.date.slice(-2));

  const statusClasses = {
    working:
      "border-[var(--color-success)]/30 bg-[var(--color-success)]/10",
    resting:
      "border-[var(--color-border)] bg-[var(--color-surface)]",
    holiday:
      "border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10",
  };

  return (
    <div
      className={`relative min-h-[82px] rounded-xl border p-2 ${statusClasses[day.status]}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-[var(--color-text)]">
          {dayNumber}
        </span>

        {day.status === "holiday" && (
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-warning)]" />
        )}
      </div>

      <select
        value={day.status}
        onChange={(event) => {
          const value = event.target.value as CalendarDayStatus;

          if (value === "holiday") {
            setShowHolidayInput(true);
          } else {
            setShowHolidayInput(false);
            onChange(day.date, value);
          }
        }}
        className="mt-3 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-1.5 py-1 text-[9px] text-[var(--color-text)] outline-none"
      >
        <option value="working">Working</option>
        <option value="resting">Resting</option>
        <option value="holiday">Holiday</option>
      </select>

      {day.label && (
        <p className="mt-1 truncate text-[9px] text-[var(--color-warning)]">
          {day.label}
        </p>
      )}

      {showHolidayInput && (
        <input
          autoFocus
          placeholder="Holiday name"
          defaultValue={day.label ?? ""}
          onBlur={(event) => {
            onChange(
              day.date,
              "holiday",
              event.target.value || "Holiday",
            );

            setShowHolidayInput(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onChange(
                day.date,
                "holiday",
                event.currentTarget.value || "Holiday",
              );

              setShowHolidayInput(false);
            }
          }}
          className="mt-1 w-full rounded-lg border border-[var(--color-warning)]/40 bg-[var(--color-surface)] px-2 py-1 text-[9px] text-[var(--color-text)] outline-none"
        />
      )}
    </div>
  );
}

function CalendarStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2">
      <p className="text-[9px] uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-semibold text-[var(--color-text)]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   APPROVERS
========================================================= */

interface LeaveApproversModalProps {
  approvers: LeaveApprover[];
  onClose: () => void;
  onSave: (approvers: LeaveApprover[]) => void;
}

function LeaveApproversModal({
  approvers,
  onClose,
  onSave,
}: LeaveApproversModalProps) {
  const [localApprovers, setLocalApprovers] =
    useState(approvers);

  const toggleApprover = (id: string) => {
    setLocalApprovers((current) =>
      current.map((approver) =>
        approver.id === id
          ? {
              ...approver,
              active: !approver.active,
            }
          : approver,
      ),
    );
  };

  return (
    <LeaveModal
      title="Leave Approving Managers"
      description="Select the employees who can approve leave applications."
      icon={Users}
      onClose={onClose}
    >
      <div className="space-y-3">
        {localApprovers.map((approver) => (
          <button
            key={approver.id}
            type="button"
            onClick={() => toggleApprover(approver.id)}
            className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${
              approver.active
                ? "border-[var(--color-brand)]/40 bg-[var(--color-brand-soft)]"
                : "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-brand-soft)]">
                <Users
                  size={15}
                  className="text-[var(--color-brand)]"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-[var(--color-text)]">
                  {approver.name}
                </p>

                <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                  {approver.department}
                </p>
              </div>
            </div>

            <div
              className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                approver.active
                  ? "border-[var(--color-brand)] bg-[var(--color-brand)]"
                  : "border-[var(--color-border-strong)]"
              }`}
            >
              {approver.active && (
                <Check size={13} className="text-black" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t border-[var(--color-border)] pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => onSave(localApprovers)}
          className="rounded-xl bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-black hover:bg-[var(--color-brand-hover)]"
        >
          Save Approvers
        </button>
      </div>
    </LeaveModal>
  );
}

/* =========================================================
   APPLICATION
========================================================= */

interface LeaveApplicationModalProps {
  calendar: Record<string, CalendarDay[]>;
  applications: LeaveApplication[];
  onClose: () => void;
  onSubmit: (application: LeaveApplication) => void;
}

function LeaveApplicationModal({
  calendar,
  applications,
  onClose,
  onSubmit,
}: LeaveApplicationModalProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [leaveType, setLeaveType] = useState(
    leaveTypes[0],
  );
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const employee = employees.find(
    (item) => item.id === employeeId,
  );

  const days = useMemo(
    () =>
      calculateWorkingDays(
        fromDate,
        toDate,
        calendar,
      ),
    [fromDate, toDate, calendar],
  );

  const handleSubmit = () => {
    setError("");

    if (!employeeId || !fromDate || !toDate) {
      setError(
        "Please select an employee and leave dates.",
      );
      return;
    }

    if (days <= 0) {
      setError(
        "The selected period does not contain any working days.",
      );
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setError(
        "The start date cannot be after the end date.",
      );
      return;
    }

    const duplicate = applications.some(
      (application) =>
        application.employeeId === employeeId &&
        application.status === "Pending" &&
        application.fromDate === fromDate &&
        application.toDate === toDate,
    );

    if (duplicate) {
      setError(
        "A pending application already exists for this period.",
      );
      return;
    }

    onSubmit({
      id:
        typeof crypto !== "undefined" &&
        crypto.randomUUID
          ? crypto.randomUUID()
          : `LEAVE-${Date.now()}`,
      employeeId,
      employeeName: employee?.name ?? "",
      leaveType,
      fromDate,
      toDate,
      days,
      reason,
      status: "Pending",
      submittedAt: new Date().toISOString(),
    });
  };

  return (
    <LeaveModal
      title="Apply for Leave"
      description="Create a new employee leave application."
      icon={FileText}
      onClose={() => null}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Employee">
          <select
            value={employeeId}
            onChange={(event) =>
              setEmployeeId(event.target.value)
            }
            className="form-input"
          >
            <option value="">Select employee</option>

            {employees.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — {item.id}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Leave Type">
          <select
            value={leaveType}
            onChange={(event) =>
              setLeaveType(event.target.value)
            }
            className="form-input"
          >
            {leaveTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </FormField>

        <FormField label="From Date">
          <input
            type="date"
            value={fromDate}
            onChange={(event) =>
              setFromDate(event.target.value)
            }
            className="form-input"
          />
        </FormField>

        <FormField label="To Date">
          <input
            type="date"
            value={toDate}
            onChange={(event) =>
              setToDate(event.target.value)
            }
            className="form-input"
          />
        </FormField>

        <div className="sm:col-span-2">
          <FormField label="Reason">
            <textarea
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              rows={4}
              placeholder="Enter the reason for this leave request..."
              className="form-input resize-none"
            />
          </FormField>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-[var(--color-brand)]/20 bg-[var(--color-brand-soft)] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
              Requested working days
            </p>

            <p className="mt-1 text-xl font-semibold text-[var(--color-text)]">
              {days}
            </p>
          </div>

          <CalendarDays
            size={22}
            className="text-[var(--color-brand)]"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-3 text-xs text-[var(--color-danger)]">
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2 border-t border-[var(--color-border)] pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-xl bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-black hover:bg-[var(--color-brand-hover)]"
        >
          Submit Application
        </button>
      </div>
    </LeaveModal>
  );
}

/* =========================================================
   OUTSTANDING LEAVE
========================================================= */

interface OutstandingLeaveModalProps {
  applications: LeaveApplication[];
  onClose: () => void;
}

function OutstandingLeaveModal({
  applications,
  onClose,
}: OutstandingLeaveModalProps) {
  const balances = employees.map((employee) => {
    const entitlement = 28;

    const taken = applications
      .filter(
        (application) =>
          application.employeeId === employee.id &&
          application.status === "Approved",
      )
      .reduce(
        (total, application) =>
          total + application.days,
        0,
      );

    const pending = applications
      .filter(
        (application) =>
          application.employeeId === employee.id &&
          application.status === "Pending",
      )
      .reduce(
        (total, application) =>
          total + application.days,
        0,
      );

    return {
      ...employee,
      entitlement,
      taken,
      pending,
      outstanding:
        entitlement - taken - pending,
    };
  });

  return (
    <LeaveModal
      title="Outstanding Leave"
      description="Review employee leave balances and pending applications."
      icon={Clock3}
      onClose={onClose}
      wide
    >
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]">
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Employee
              </th>

              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Entitlement
              </th>

              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Taken
              </th>

              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Pending
              </th>

              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Outstanding
              </th>
            </tr>
          </thead>

          <tbody>
            {balances.map((employee) => (
              <tr
                key={employee.id}
                className="border-b border-[var(--color-border)] last:border-0"
              >
                <td className="px-4 py-4">
                  <p className="text-xs font-semibold text-[var(--color-text)]">
                    {employee.name}
                  </p>

                  <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                    {employee.department}
                  </p>
                </td>

                <td className="px-4 py-4 text-xs text-[var(--color-text-secondary)]">
                  {employee.entitlement} days
                </td>

                <td className="px-4 py-4 text-xs text-[var(--color-text-secondary)]">
                  {employee.taken} days
                </td>

                <td className="px-4 py-4 text-xs text-[var(--color-warning)]">
                  {employee.pending} days
                </td>

                <td className="px-4 py-4">
                  <span className="rounded-full bg-[var(--color-success)]/10 px-2.5 py-1 text-[10px] font-semibold text-[var(--color-success)]">
                    {employee.outstanding} days
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
        <p className="text-[10px] leading-5 text-[var(--color-text-muted)]">
          Leave balances are currently frontend demonstration data.
          Employee balances and leave types can later be connected to
          the payroll backend.
        </p>
      </div>
    </LeaveModal>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </span>

      {children}
    </label>
  );
}