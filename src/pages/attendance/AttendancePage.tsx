import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

type AttendanceStatus = "Present" | "Absent" | "Late" | "Leave" | "Half Day";

interface AttendanceRecord {
  id: string;
  employeeNumber: string;
  name: string;
  department: string;
  position: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  overtime: number;
  status: AttendanceStatus;
  note?: string;
}

const initialAttendance: AttendanceRecord[] = [
  {
    id: "ATT-001",
    employeeNumber: "EMP-0001",
    name: "John Mwangi",
    department: "Finance",
    position: "Accountant",
    checkIn: "08:02",
    checkOut: "17:04",
    hoursWorked: 8.1,
    overtime: 0,
    status: "Present",
  },
  {
    id: "ATT-002",
    employeeNumber: "EMP-0002",
    name: "Sarah Johnson",
    department: "Human Resources",
    position: "HR Manager",
    checkIn: "08:27",
    checkOut: "17:12",
    hoursWorked: 7.8,
    overtime: 0,
    status: "Late",
    note: "Arrived 27 minutes late",
  },
  {
    id: "ATT-003",
    employeeNumber: "EMP-0003",
    name: "Michael Smith",
    department: "Information Technology",
    position: "Software Engineer",
    checkIn: "07:54",
    checkOut: "18:21",
    hoursWorked: 9.4,
    overtime: 1.4,
    status: "Present",
  },
  {
    id: "ATT-004",
    employeeNumber: "EMP-0004",
    name: "Amina Hassan",
    department: "Administration",
    position: "Administrator",
    checkIn: "-",
    checkOut: "-",
    hoursWorked: 0,
    overtime: 0,
    status: "Absent",
    note: "No attendance recorded",
  },
  {
    id: "ATT-005",
    employeeNumber: "EMP-0005",
    name: "David Mushi",
    department: "Operations",
    position: "Operations Officer",
    checkIn: "08:00",
    checkOut: "13:02",
    hoursWorked: 5,
    overtime: 0,
    status: "Half Day",
  },
  {
    id: "ATT-006",
    employeeNumber: "EMP-0006",
    name: "Grace Joseph",
    department: "Finance",
    position: "Finance Officer",
    checkIn: "-",
    checkOut: "-",
    hoursWorked: 0,
    overtime: 0,
    status: "Leave",
    note: "Annual leave",
  },
];

/* =========================================================
   WORKING DAY SETTINGS
   Change these if the company's hours differ.
========================================================= */

const WORK_START = "08:00";
const WORK_END = "17:00";
const STANDARD_HOURS = 8;
const LUNCH_BREAK_HOURS = 1;

// The timeline runs 06:00 to 20:00.
const AXIS_START = 6 * 60;
const AXIS_END = 20 * 60;
const TICKS = [6, 8, 10, 12, 14, 16, 18, 20];

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  Present: "Present",
  Late: "Late",
  Absent: "Absent",
  Leave: "On leave",
  "Half Day": "Half day",
};

const STATUS_COLOR: Record<AttendanceStatus, string> = {
  Present: "var(--color-brand)",
  Late: "var(--color-warning)",
  "Half Day": "var(--color-info)",
  Absent: "var(--color-danger)",
  Leave: "var(--color-secondary)",
};

// What each bar color on the timeline means. Shown as the key above the bars.
const BAR_KEY: { label: string; color: string; faded?: boolean }[] = [
  { label: "Present", color: STATUS_COLOR.Present },
  { label: "Late", color: STATUS_COLOR.Late },
  { label: "Half day", color: STATUS_COLOR["Half Day"] },
  { label: "Overtime", color: "var(--color-secondary)" },
  { label: "No check-out yet", color: STATUS_COLOR.Present, faded: true },
];

const isAway = (status: AttendanceStatus) =>
  status === "Absent" || status === "Leave";

/* =========================================================
   HELPERS
========================================================= */

const toMinutes = (time: string) => {
  if (!/^\d{2}:\d{2}$/.test(time)) return null;

  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

const toPercent = (minutes: number) =>
  Math.min(
    100,
    Math.max(0, ((minutes - AXIS_START) / (AXIS_END - AXIS_START)) * 100),
  );

const formatHours = (hours: number) => `${hours.toFixed(1)}h`;

const parseDate = (iso: string) => new Date(`${iso}T00:00:00`);

const toISO = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
};

const shiftDate = (iso: string, days: number) => {
  const date = parseDate(iso);
  date.setDate(date.getDate() + days);

  return toISO(date);
};

const formatDateTitle = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseDate(iso));

// Hours are worked out from the times so the timeline and the numbers always
// agree. Lunch is not deducted on half days.
function calculateHours(
  checkIn: string,
  checkOut: string,
  status: AttendanceStatus,
) {
  const start = toMinutes(checkIn);
  const end = toMinutes(checkOut);

  if (isAway(status) || start === null || end === null || end <= start) {
    return { hoursWorked: 0, overtime: 0 };
  }

  const span = (end - start) / 60;
  const lunch = span > 5 && status !== "Half Day" ? LUNCH_BREAK_HOURS : 0;
  const hoursWorked = Math.max(0, span - lunch);
  const overtime = Math.max(0, hoursWorked - STANDARD_HOURS);

  return {
    hoursWorked: Math.round(hoursWorked * 10) / 10,
    overtime: Math.round(overtime * 10) / 10,
  };
}

/* =========================================================
   PAGE
========================================================= */

export function AttendancePage() {
  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>(initialAttendance);

  const [date, setDate] = useState(() => toISO(new Date()));
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const departments = useMemo(
    () => ["All", ...new Set(attendance.map((record) => record.department))],
    [attendance],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return attendance.filter((record) => {
      const matchesSearch =
        !query ||
        record.name.toLowerCase().includes(query) ||
        record.employeeNumber.toLowerCase().includes(query) ||
        record.department.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All" || record.department === department;

      const matchesStatus = status === "All" || record.status === status;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [attendance, search, department, status]);

  // People who came in, in the order they arrived.
  const checkedIn = useMemo(
    () =>
      filtered
        .filter((record) => !isAway(record.status))
        .sort(
          (a, b) =>
            (toMinutes(a.checkIn) ?? Infinity) -
            (toMinutes(b.checkIn) ?? Infinity),
        ),
    [filtered],
  );

  const notIn = useMemo(
    () =>
      filtered
        .filter((record) => isAway(record.status))
        .sort((a, b) => a.status.localeCompare(b.status)),
    [filtered],
  );

  const hasFilters =
    search.trim() !== "" || department !== "All" || status !== "All";

  const clearFilters = () => {
    setSearch("");
    setDepartment("All");
    setStatus("All");
  };

  const counts = {
    late: attendance.filter((r) => r.status === "Late").length,
    absent: attendance.filter((r) => r.status === "Absent").length,
    leave: attendance.filter((r) => r.status === "Leave").length,
    isIn: attendance.filter((r) => !isAway(r.status)).length,
  };

  // Only people who are absent are changed. Anyone on leave stays on leave.
  const markAbsentPresent = () => {
    setAttendance((current) =>
      current.map((record) =>
        record.status === "Absent"
          ? { ...record, status: "Present", checkIn: WORK_START }
          : record,
      ),
    );
  };

  const saveRecord = (updated: AttendanceRecord) => {
    setAttendance((current) =>
      current.map((record) => (record.id === updated.id ? updated : record)),
    );
    setOpenId(null);
  };

  const toggle = (id: string) =>
    setOpenId((current) => (current === id ? null : id));

  return (
    <div>
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            Attendance
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setDate((current) => shiftDate(current, -1))}
              aria-label="Previous day"
              className="flex h-8 w-8 items-center justify-center rounded-[4px] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
            >
              <ChevronLeft size={17} />
            </button>

            <p className="min-w-[15rem] text-center text-sm font-medium text-[var(--color-text)]">
              {formatDateTitle(date)}
            </p>

            <button
              type="button"
              onClick={() => setDate((current) => shiftDate(current, 1))}
              aria-label="Next day"
              className="flex h-8 w-8 items-center justify-center rounded-[4px] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
            >
              <ChevronRight size={17} />
            </button>

            <Input
              type="date"
              aria-label="Go to date"
              value={date}
              onChange={(event) => {
                if (event.target.value) setDate(event.target.value);
              }}
              className="w-40"
            />
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={markAbsentPresent}
          disabled={counts.absent === 0}
        >
          Mark absentees present
        </Button>
      </header>

      {/* Toolbar */}
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative sm:w-72">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, number or department"
            className="pl-9"
          />
        </div>

        <FilterSelect
          label="Department"
          allLabel="All departments"
          value={department}
          options={departments.map((value) => ({ value, label: value }))}
          onChange={setDepartment}
          className="sm:w-48"
        />

        <FilterSelect
          label="Status"
          allLabel="Any status"
          value={status}
          options={(Object.keys(STATUS_LABEL) as AttendanceStatus[]).map(
            (value) => ({ value, label: STATUS_LABEL[value] }),
          )}
          onChange={setStatus}
          className="sm:w-40"
        />

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-[var(--color-brand)] hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Checked in: the day as a timeline */}
      {checkedIn.length > 0 && (
        <section className="mt-8">
          <h2 className="flex items-baseline justify-between px-3 text-sm font-semibold text-[var(--color-brand)]">
            <span>Checked in</span>
            <span className="text-xs font-normal tabular-nums text-[var(--color-text-muted)]">
              {checkedIn.length}
            </span>
          </h2>

          {/* Hour scale */}
          <div className="mt-4 hidden gap-x-4 px-3 sm:grid sm:grid-cols-[11rem_minmax(0,1fr)_8.5rem]">
            <span />

            <div className="relative mx-3 h-5" aria-hidden="true">
              {TICKS.map((hour) => (
                <span
                  key={hour}
                  className="absolute top-0 -translate-x-1/2 text-xs tabular-nums text-[var(--color-text-muted)]"
                  style={{ left: `${toPercent(hour * 60)}%` }}
                >
                  {String(hour).padStart(2, "0")}
                </span>
              ))}
            </div>

            <span />
          </div>

          <ul>
            {checkedIn.map((record) => (
              <li key={record.id}>
                <button
                  type="button"
                  onClick={() => toggle(record.id)}
                  aria-expanded={openId === record.id}
                  className="grid w-full gap-x-4 gap-y-2 px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-surface-hover)] sm:grid-cols-[11rem_minmax(0,1fr)_8.5rem] sm:items-center"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-[var(--color-text)]">
                      {record.name}
                    </span>

                    <span className="block truncate text-xs text-[var(--color-text-secondary)]">
                      {record.position}
                      {record.status !== "Present" && (
                        <span
                          className="ml-2 font-medium"
                          style={{ color: STATUS_COLOR[record.status] }}
                        >
                          {STATUS_LABEL[record.status]}
                        </span>
                      )}
                    </span>
                  </span>

                  <Track record={record} />

                  <span className="text-xs tabular-nums sm:text-right">
                    {toMinutes(record.checkIn) === null ? (
                      <span className="text-[var(--color-text-muted)]">
                        No times recorded
                      </span>
                    ) : (
                      <>
                        <span className="block text-[var(--color-text)]">
                          {record.checkIn} to{" "}
                          {toMinutes(record.checkOut) === null
                            ? "…"
                            : record.checkOut}
                        </span>

                        <span className="block text-[var(--color-text-muted)]">
                          {formatHours(record.hoursWorked)}
                          {record.overtime > 0 && (
                            <span className="ml-1.5 text-[var(--color-secondary)]">
                              +{formatHours(record.overtime)} overtime
                            </span>
                          )}
                        </span>
                      </>
                    )}
                  </span>
                </button>

                {openId === record.id && (
                  <RecordEditor
                    record={record}
                    onSave={saveRecord}
                    onCancel={() => setOpenId(null)}
                  />
                )}
              </li>
            ))}
          </ul>

            <div className="mt-8">
            <ul
                aria-label="Key to the timeline colors"
                className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 px-3 text-xs text-[var(--color-text-secondary)]"
            >
                {BAR_KEY.map((item) => (
                <li key={item.label} className="flex items-center gap-2">
                    <span
                    aria-hidden="true"
                    className="h-2.5 w-5 rounded-[2px]"
                    style={{
                        background: item.color,
                        opacity: item.faded ? 0.45 : 1,
                    }}
                    />
                    {item.label}
                </li>
                ))}

                <li className="flex items-center gap-2">
                <span
                    aria-hidden="true"
                    className="h-4 w-5 border-x border-[var(--color-border-strong)] bg-[var(--color-brand-soft)]"
                />
                Working day, {WORK_START} to {WORK_END}
                </li>
            </ul>
            </div>
        </section>
      )}

      {/* Not in */}
      {notIn.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-baseline justify-between px-3 text-sm font-semibold text-[var(--color-danger)]/75">
            <span>Not in</span>
            <span className="text-xs font-normal tabular-nums text-[var(--color-text-muted)]">
              {notIn.length}
            </span>
          </h2>

          <ul className="mt-2">
            {notIn.map((record) => (
              <li key={record.id}>
                <button
                  type="button"
                  onClick={() => toggle(record.id)}
                  aria-expanded={openId === record.id}
                  className="grid w-full gap-x-4 gap-y-1 px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-surface-hover)] sm:grid-cols-[11rem_minmax(0,1fr)]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-[var(--color-text)]">
                      {record.name}
                    </span>

                    <span className="block truncate text-xs text-[var(--color-text-secondary)]">
                      {record.position}
                    </span>
                  </span>

                  <span className="text-sm">
                    <span
                      className="font-medium"
                      style={{ color: STATUS_COLOR[record.status] }}
                    >
                      {STATUS_LABEL[record.status]}
                    </span>

                    {record.note && (
                      <span className="block text-xs text-[var(--color-text-secondary)]">
                        {record.note}
                      </span>
                    )}
                  </span>
                </button>

                {openId === record.id && (
                  <RecordEditor
                    record={record}
                    onSave={saveRecord}
                    onCancel={() => setOpenId(null)}
                  />
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Nothing to show */}
      {checkedIn.length === 0 && notIn.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-sm font-medium text-[var(--color-text)]">
            No one matches these filters
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-2 text-sm font-medium text-[var(--color-brand)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   TIMELINE TRACK
   One person's day: arrival to departure on the hour scale.
========================================================= */

function Track({ record }: { record: AttendanceRecord }) {
  const start = toMinutes(record.checkIn);
  const end = toMinutes(record.checkOut);
  const workStart = toMinutes(WORK_START) ?? 0;
  const workEnd = toMinutes(WORK_END) ?? 0;

  const color = STATUS_COLOR[record.status];

  let main: { left: number; width: number } | null = null;
  let overtime: { left: number; width: number } | null = null;

  if (start !== null) {
    const mainEnd = Math.max(start, end === null ? workEnd : Math.min(end, workEnd));

    main = {
      left: toPercent(start),
      width: Math.max(0.8, toPercent(mainEnd) - toPercent(start)),
    };

    if (end !== null && end > workEnd) {
      const overtimeStart = Math.max(start, workEnd);

      overtime = {
        left: toPercent(overtimeStart),
        width: Math.max(0.8, toPercent(end) - toPercent(overtimeStart)),
      };
    }
  }

  return (
    <span className="relative mx-3 block h-6" aria-hidden="true">
      <span
        className="absolute inset-y-0 bg-[var(--color-brand-soft)]"
        style={{
          left: `${toPercent(workStart)}%`,
          width: `${toPercent(workEnd) - toPercent(workStart)}%`,
        }}
      />

      {TICKS.map((hour) => (
        <span
          key={hour}
          className="absolute inset-y-0 w-px bg-[var(--color-border)]"
          style={{ left: `${toPercent(hour * 60)}%` }}
        />
      ))}

      {main && (
        <span
          className="absolute top-1/2 h-2.5 -translate-y-1/2 rounded-[2px]"
          style={{
            left: `${main.left}%`,
            width: `${main.width}%`,
            background: color,
            opacity: end === null ? 0.45 : 1,
          }}
        />
      )}

      {overtime && (
        <span
          className="absolute top-1/2 h-2.5 -translate-y-1/2 rounded-[2px] bg-[var(--color-secondary)]"
          style={{
            left: `${overtime.left}%`,
            width: `${overtime.width}%`,
          }}
        />
      )}
    </span>
  );
}

/* =========================================================
   INLINE EDITOR
   Opens under the person's row instead of in a popup.
========================================================= */

function RecordEditor({
  record,
  onSave,
  onCancel,
}: {
  record: AttendanceRecord;
  onSave: (updated: AttendanceRecord) => void;
  onCancel: () => void;
}) {
  const [status, setStatus] = useState<AttendanceStatus>(record.status);
  const [checkIn, setCheckIn] = useState(
    record.checkIn === "-" ? "" : record.checkIn,
  );
  const [checkOut, setCheckOut] = useState(
    record.checkOut === "-" ? "" : record.checkOut,
  );
  const [note, setNote] = useState(record.note ?? "");
  const [error, setError] = useState("");

  const away = isAway(status);

  const save = () => {
    const start = toMinutes(checkIn);
    const end = toMinutes(checkOut);

    if (!away && start !== null && end !== null && end < start) {
      setError("Check out can't be before check in.");
      return;
    }

    const { hoursWorked, overtime } = calculateHours(checkIn, checkOut, status);

    onSave({
      ...record,
      status,
      checkIn: away ? "-" : checkIn || "-",
      checkOut: away ? "-" : checkOut || "-",
      hoursWorked,
      overtime,
      note: note.trim() || undefined,
    });
  };

  return (
    <div className="mx-3 mb-4 mt-1 border-l-2 border-[var(--color-brand)] bg-[var(--color-surface-raised)] p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-2">
          <span className="block text-xs font-medium text-[var(--color-text-secondary)]">
            Status
          </span>

          <FilterSelect
            label="Status"
            value={status}
            options={(Object.keys(STATUS_LABEL) as AttendanceStatus[]).map(
              (value) => ({ value, label: STATUS_LABEL[value] }),
            )}
            onChange={(value) => setStatus(value as AttendanceStatus)}
          />
        </label>

        <label className="space-y-2">
          <span className="block text-xs font-medium text-[var(--color-text-secondary)]">
            Check in
          </span>

          <Input
            type="time"
            value={checkIn}
            disabled={away}
            onChange={(event) => setCheckIn(event.target.value)}
          />
        </label>

        <label className="space-y-2">
          <span className="block text-xs font-medium text-[var(--color-text-secondary)]">
            Check out
          </span>

          <Input
            type="time"
            value={checkOut}
            disabled={away}
            onChange={(event) => setCheckOut(event.target.value)}
          />
        </label>
      </div>

      <label className="mt-4 block space-y-2">
        <span className="block text-xs font-medium text-[var(--color-text-secondary)]">
          Note
        </span>

        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={2}
          className="w-full resize-none rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-brand)]"
        />
      </label>

      {error && (
        <p
          role="alert"
          className="mt-4 border-l-2 border-[var(--color-danger)] pl-3 text-sm text-[var(--color-danger)]"
        >
          {error}
        </p>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="button" onClick={save}>
          Save
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({
  label,
  allLabel,
  value,
  options,
  onChange,
  className = "",
}: {
  label: string;
  allLabel?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={`relative min-w-0 ${className}`}>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none truncate rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] pl-3 pr-8 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-brand)]"
      >
        {allLabel && <option value="All">{allLabel}</option>}

        {options
          .filter((option) => option.value !== "All")
          .map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>

      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
      />
    </div>
  );
}