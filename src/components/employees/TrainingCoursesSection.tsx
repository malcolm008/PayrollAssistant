import { ChevronDown, Plus, Search, Trash2, X } from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { Employee } from "../../types/employees";
import type { TrainingCourse } from "../../types/trainingCourse";
import {
  formatCurrency,
  TRAINING_TYPES,
  emptyForm,
} from "../../types/trainingCourse";

interface TrainingCoursesSectionProps {
  employees: Employee[];
}

const STORAGE_KEY = "payroll_training_courses";

/* =========================================================
   DATE HELPERS
   Dates are stored as yyyy-mm-dd strings, so plain string
   comparison orders them correctly.
========================================================= */

const toDate = (iso: string) => new Date(`${iso}T00:00:00`);

const todayISO = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
};

const daysBetween = (from: string, to: string) =>
  Math.round((toDate(to).getTime() - toDate(from).getTime()) / 86_400_000);

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(toDate(iso));

const formatShortDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(toDate(iso));

function calculateDuration(start: string, end: string) {
  if (!start || !end) return 0;

  const difference = daysBetween(start, end) + 1;

  return difference > 0 ? difference : 0;
}

/* =========================================================
   COURSE TIMING
   Courses are grouped by where they are in time, which is
   what someone scanning this list actually wants to know.
========================================================= */

const GROUPS = [
  { kind: "running", title: "In progress" },
  { kind: "upcoming", title: "Upcoming" },
  { kind: "done", title: "Completed" },
] as const;

type Kind = (typeof GROUPS)[number]["kind"];

const kindOf = (course: TrainingCourse, today: string): Kind =>
  today < course.startingDate
    ? "upcoming"
    : today > course.endingDate
      ? "done"
      : "running";

function timingLabel(course: TrainingCourse, today: string) {
  const kind = kindOf(course, today);

  if (kind === "upcoming") {
    const days = daysBetween(today, course.startingDate);

    return days === 1 ? "Starts tomorrow" : `Starts in ${plural(days, "day")}`;
  }

  if (kind === "done") {
    const days = daysBetween(course.endingDate, today);

    return days === 1
      ? "Finished yesterday"
      : `Finished ${plural(days, "day")} ago`;
  }

  return `Day ${daysBetween(course.startingDate, today) + 1} of ${course.duration}`;
}

const dotClass: Record<Kind, string> = {
  running: "bg-[var(--color-brand)]",
  upcoming: "bg-[var(--color-secondary)]",
  done: "bg-[var(--color-text-disabled)]",
};

const fullNameOf = (employee: Employee) =>
  `${employee.name} ${employee.surname}`;

/* =========================================================
   SECTION
========================================================= */

export function TrainingCoursesSection({
  employees,
}: TrainingCoursesSectionProps) {
  const [courses, setCourses] = useState<TrainingCourse[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  const today = todayISO();

  const groups = useMemo(() => {
    const byKind: Record<Kind, TrainingCourse[]> = {
      running: [],
      upcoming: [],
      done: [],
    };

    for (const course of courses) {
      byKind[kindOf(course, today)].push(course);
    }

    byKind.running.sort((a, b) => a.endingDate.localeCompare(b.endingDate));
    byKind.upcoming.sort((a, b) =>
      a.startingDate.localeCompare(b.startingDate),
    );
    byKind.done.sort((a, b) => b.endingDate.localeCompare(a.endingDate));

    return GROUPS.map((group) => ({
      ...group,
      courses: byKind[group.kind],
    })).filter((group) => group.courses.length > 0);
  }, [courses, today]);

  // Look the selection up by id, and fall back to the first course in the
  // list so the record pane is never empty while courses exist.
  const selected =
    courses.find((course) => course.id === selectedId) ??
    groups[0]?.courses[0] ??
    null;

  const totalTrainees = courses.reduce(
    (total, course) => total + course.numberOfTrainees,
    0,
  );

  const totalTrainingCost = courses.reduce(
    (total, course) => total + course.costs,
    0,
  );

  const selectCourse = (id: string) => {
    setSelectedId(id);

    // On narrow screens the record sits below the list, so bring it into view.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAddCourse = (course: TrainingCourse) => {
    setCourses((current) => [course, ...current]);
    setSelectedId(course.id);
    setShowAddModal(false);
  };

  const handleDeleteCourse = (course: TrainingCourse) => {
    const confirmed = window.confirm(
      `Delete "${course.courseName}"? This can't be undone.`,
    );

    if (!confirmed) return;

    setCourses((current) => current.filter((item) => item.id !== course.id));
  };

  const summary =
    courses.length === 0
      ? "No courses recorded yet."
      : `${plural(courses.length, "course")}, ${plural(totalTrainees, "trainee")} in total, ${formatCurrency(totalTrainingCost)} in costs.`;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-text-secondary)]">{summary}</p>

        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Add course
        </Button>
      </div>

      {courses.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm font-medium text-[var(--color-text)]">
            No training courses yet
          </p>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Add a course and choose the employees attending it.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[19rem_minmax(0,1fr)]">
          {/* Course list */}
          <nav
            aria-label="Training courses"
            className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-12rem)] lg:self-start lg:overflow-y-auto"
          >
            {groups.map((group) => (
              <section key={group.kind} className="mb-5 last:mb-0">
                <h3 className="mb-1 flex items-baseline justify-between px-3 text-xs text-[var(--color-text-muted)]">
                  <span>{group.title}</span>
                  <span className="tabular-nums">{group.courses.length}</span>
                </h3>

                <ul>
                  {group.courses.map((course) => {
                    const isSelected = course.id === selected?.id;

                    return (
                      <li key={course.id}>
                        <button
                          type="button"
                          onClick={() => selectCourse(course.id)}
                          aria-current={isSelected ? "true" : undefined}
                          className={`block w-full border-l-2 py-2 pl-3 pr-2 text-left transition-colors ${
                            isSelected
                              ? "border-[var(--color-brand)] bg-[var(--color-surface-raised)]"
                              : "border-transparent hover:bg-[var(--color-surface-hover)]"
                          }`}
                        >
                          <span
                            className={`block truncate text-sm text-[var(--color-text)] ${
                              isSelected ? "font-semibold" : "font-medium"
                            }`}
                          >
                            {course.courseName}
                          </span>

                          <span className="block text-xs tabular-nums text-[var(--color-text-secondary)]">
                            {course.startingDate === course.endingDate
                              ? formatShortDate(course.startingDate)
                              : `${formatShortDate(course.startingDate)} to ${formatShortDate(course.endingDate)}`}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </nav>

          {/* Course record */}
          <div
            ref={detailRef}
            className="min-w-0 scroll-mt-6 lg:border-l lg:border-[var(--color-border)] lg:pl-10"
          >
            {selected && (
              <CourseRecord
                course={selected}
                employees={employees}
                today={today}
                onDelete={() => handleDeleteCourse(selected)}
              />
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <AddTrainingCourseModal
          employees={employees}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCourse}
        />
      )}
    </div>
  );
}

/* =========================================================
   COURSE RECORD
========================================================= */

function CourseRecord({
  course,
  employees,
  today,
  onDelete,
}: {
  course: TrainingCourse;
  employees: Employee[];
  today: string;
  onDelete: () => void;
}) {
  const kind = kindOf(course, today);

  const participants = employees.filter((employee) =>
    course.participantIds.includes(employee.id),
  );

  // Employees removed from the roster after the course was saved.
  const formerParticipants = course.participantIds.length - participants.length;

  return (
    <article>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            {course.courseName}
          </h2>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {course.trainingType}
          </p>

          <p className="mt-1 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <span className={`h-1.5 w-1.5 rounded-full ${dotClass[kind]}`} />
            <span>
              {timingLabel(course, today)}, {formatDate(course.startingDate)}
              {course.startingDate !== course.endingDate &&
                ` to ${formatDate(course.endingDate)}`}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="flex h-9 items-center gap-2 rounded-[4px] px-3 text-sm text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/10"
        >
          <Trash2 size={15} />
          Delete
        </button>
      </header>

      <Section title="Details">
        <ul className="space-y-2 text-sm">
          <Line label="Duration" value={plural(course.duration, "day")} />
          <Line label="Organizer" value={course.organizer || "—"} />
          <Line label="Chief lecturer" value={course.chiefLecturer || "—"} />
          <Line label="Location" value={course.location || "—"} />
          <Line
            label="Expertise needed"
            value={course.expertiseNeeded || "—"}
          />
          <Line label="Cost" value={formatCurrency(course.costs)} />
        </ul>
      </Section>

      {course.remarks && (
        <Section title="Remarks">
          <p className="max-w-prose whitespace-pre-line text-sm leading-6 text-[var(--color-text-secondary)]">
            {course.remarks}
          </p>
        </Section>
      )}

      <Section title={`Participants (${participants.length})`}>
        {participants.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            None of the original participants are on the roster any more.
          </p>
        ) : (
          <ul className="space-y-2">
            {participants.map((employee) => (
              <li
                key={employee.id}
                className="flex items-baseline justify-between gap-4"
              >
                <span className="min-w-0 truncate text-sm text-[var(--color-text)]">
                  {fullNameOf(employee)}
                  <span className="ml-2 text-xs tabular-nums text-[var(--color-text-muted)]">
                    {employee.employeeNumber}
                  </span>
                </span>

                <span className="hidden shrink-0 text-xs text-[var(--color-text-secondary)] sm:block">
                  {employee.jobTitle}, {employee.department}
                </span>
              </li>
            ))}
          </ul>
        )}

        {formerParticipants > 0 && participants.length > 0 && (
          <p className="mt-3 text-xs text-[var(--color-text-muted)]">
            {plural(formerParticipants, "other participant")} no longer on the
            roster.
          </p>
        )}
      </Section>
    </article>
  );
}

/* =========================================================
   ADD COURSE MODAL
========================================================= */

function AddTrainingCourseModal({
  employees,
  onClose,
  onAdd,
}: {
  employees: Employee[];
  onClose: () => void;
  onAdd: (course: TrainingCourse) => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [participantSearch, setParticipantSearch] = useState("");
  const [error, setError] = useState("");

  const duration = calculateDuration(form.startingDate, form.endingDate);

  const filteredEmployees = useMemo(() => {
    const query = participantSearch.toLowerCase().trim();

    if (!query) return employees;

    return employees.filter(
      (employee) =>
        fullNameOf(employee).toLowerCase().includes(query) ||
        employee.employeeNumber.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query),
    );
  }, [employees, participantSearch]);

  const toggleParticipant = (employeeId: string) => {
    setParticipantIds((current) =>
      current.includes(employeeId)
        ? current.filter((id) => id !== employeeId)
        : [...current, employeeId],
    );
  };

  const updateField = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    setError("");

    if (!form.courseName.trim() || !form.startingDate || !form.endingDate) {
      setError("Enter a course name, a starting date and an ending date.");
      return;
    }

    if (!duration) {
      setError("The ending date can't be before the starting date.");
      return;
    }

    if (participantIds.length === 0) {
      setError("Select at least one participant.");
      return;
    }

    const course: TrainingCourse = {
      id: crypto.randomUUID(),
      courseName: form.courseName.trim(),
      trainingType: form.trainingType,
      startingDate: form.startingDate,
      endingDate: form.endingDate,
      duration,
      organizer: form.organizer.trim(),
      chiefLecturer: form.chiefLecturer.trim(),
      location: form.location.trim(),
      expertiseNeeded: form.expertiseNeeded.trim(),
      costs: Number(form.costs) || 0,
      numberOfTrainees: participantIds.length,
      remarks: form.remarks.trim(),
      participantIds,
      createdAt: new Date().toISOString(),
    };

    onAdd(course);
  };

  return (
    <ModalShell title="Add training course" onClose={onClose} maxWidth="max-w-4xl">
      <div className="space-y-8">
        {/* Course */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text)]">
            Course
          </h3>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormField
              label="Course name"
              value={form.courseName}
              onChange={(value) => updateField("courseName", value)}
              required
            />

            <label className="block space-y-2">
              <span className="block text-xs font-medium text-[var(--color-text-secondary)]">
                Type of training
              </span>

              <div className="relative">
                <select
                  value={form.trainingType}
                  onChange={(event) =>
                    updateField("trainingType", event.target.value)
                  }
                  className="h-10 w-full appearance-none rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] pl-3 pr-9 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-brand)]"
                >
                  {TRAINING_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />
              </div>
            </label>

            <FormField
              label="Starting date"
              type="date"
              value={form.startingDate}
              onChange={(value) => updateField("startingDate", value)}
              required
            />

            <FormField
              label="Ending date"
              type="date"
              value={form.endingDate}
              onChange={(value) => updateField("endingDate", value)}
              required
            />

            <div className="space-y-2">
              <span className="block text-xs font-medium text-[var(--color-text-secondary)]">
                Duration
              </span>

              <div className="flex h-10 items-center rounded-[4px] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text)]">
                {duration ? (
                  plural(duration, "day")
                ) : (
                  <span className="text-[var(--color-text-muted)]">
                    Worked out from the dates
                  </span>
                )}
              </div>
            </div>

            <FormField
              label="Organizer"
              value={form.organizer}
              onChange={(value) => updateField("organizer", value)}
            />

            <FormField
              label="Chief lecturer"
              value={form.chiefLecturer}
              onChange={(value) => updateField("chiefLecturer", value)}
            />

            <FormField
              label="Location"
              value={form.location}
              onChange={(value) => updateField("location", value)}
            />

            <FormField
              label="Expertise needed"
              value={form.expertiseNeeded}
              onChange={(value) => updateField("expertiseNeeded", value)}
            />

            <FormField
              label="Cost"
              type="number"
              value={form.costs}
              onChange={(value) => updateField("costs", value)}
            />
          </div>

          <label className="mt-4 block space-y-2">
            <span className="block text-xs font-medium text-[var(--color-text-secondary)]">
              Remarks
            </span>

            <textarea
              value={form.remarks}
              onChange={(event) => updateField("remarks", event.target.value)}
              rows={3}
              className="w-full resize-none rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
            />
          </label>
        </div>

        {/* Participants */}
        <div className="border-t border-[var(--color-border)] pt-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Participants
            </h3>

            <p className="text-xs text-[var(--color-text-secondary)]">
              {participantIds.length} selected
            </p>
          </div>

          <div className="relative mt-4">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />

            <Input
              value={participantSearch}
              onChange={(event) => setParticipantSearch(event.target.value)}
              placeholder="Search by name, number or department"
              className="pl-9"
            />
          </div>

          <ul className="mt-3 max-h-64 overflow-y-auto">
            {filteredEmployees.length === 0 ? (
              <li className="py-6 text-sm text-[var(--color-text-muted)]">
                No employees match that search.
              </li>
            ) : (
              filteredEmployees.map((employee) => {
                const checked = participantIds.includes(employee.id);

                return (
                  <li key={employee.id}>
                    <label
                      className={`flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors ${
                        checked
                          ? "bg-[var(--color-brand-soft)]"
                          : "hover:bg-[var(--color-surface-hover)]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleParticipant(employee.id)}
                        className="h-4 w-4 shrink-0 accent-[var(--color-brand)]"
                      />

                      <span className="min-w-0 flex-1 truncate text-sm text-[var(--color-text)]">
                        {fullNameOf(employee)}
                        <span className="ml-2 text-xs tabular-nums text-[var(--color-text-muted)]">
                          {employee.employeeNumber}
                        </span>
                      </span>

                      <span className="hidden shrink-0 text-xs text-[var(--color-text-secondary)] sm:block">
                        {employee.jobTitle}, {employee.department}
                      </span>
                    </label>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {error && (
          <p
            role="alert"
            className="border-l-2 border-[var(--color-danger)] pl-3 text-sm text-[var(--color-danger)]"
          >
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="button" onClick={handleSubmit}>
            Save course
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

/* =========================================================
   SMALL PIECES
========================================================= */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 border-t border-[var(--color-border)] pt-6">
      <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
        {title}
      </h3>

      {children}
    </section>
  );
}

// Label, dotted leader, value.
function Line({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-end gap-3">
      <span className="shrink-0 text-[var(--color-text-secondary)]">
        {label}
      </span>

      <span
        aria-hidden="true"
        className="mb-1.5 min-w-4 flex-1 border-b border-dotted border-[var(--color-border-strong)]"
      />

      <span className="min-w-0 break-words text-right tabular-nums text-[var(--color-text)]">
        {value}
      </span>
    </li>
  );
}

function ModalShell({
  title,
  children,
  onClose,
  maxWidth = "max-w-2xl",
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
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
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-[6px] border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] shadow-2xl`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[4px] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-xs font-medium text-[var(--color-text-secondary)]">
        {label}

        {required && (
          <span className="ml-1.5 font-normal text-[var(--color-text-muted)]">
            (required)
          </span>
        )}
      </span>

      <Input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}