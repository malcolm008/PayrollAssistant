import {
    Clock3,
    GraduationCap,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
    Users,
    X,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import type { TrainingEmployee, TrainingCourse } from "../../types/trainingCourse";
import { formatCurrency, TRAINING_TYPES, emptyForm } from "../../types/trainingCourse";

interface TrainingCoursesSectionProps {
    employees: TrainingEmployee[];
}

const STORAGE_KEY = "payroll_training_courses";

function calculateDuration(start: string, end: string) {
    if (!start || !end) return 0;

    const startDate = new Date(`${start}T00:00:00`);
    const endDate = new Date(`${end}T00:00:00`);

    const difference = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return difference > 0 ? difference : 0;
}

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
    const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    }, [courses]);

    const totalTrainees = courses.reduce((total, course) => total + course.numberOfTrainees, 0);

    const totalTrainingCost = courses.reduce((total, course) => total + course.costs, 0);

    const handleAddCourse = (course: TrainingCourse) => {
        setCourses((current) => [course, ...current]);
        setShowAddModal(false);
    };

    const handleDeleteCourse = (course: TrainingCourse) => {
        const confirmed = window.confirm(`Are you sure want to remove "${course.courseName}"?`);

        if (!confirmed) return;

        setCourses((current) => current.filter((item) => item.id !== course.id));
    };

    return (
        <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-brand)]">
                <span className="h-px w-5 bg-[var(--color-brand)]" />
                HR Development
            </div>

            <h2 className="text-xl font-semibold text-[var(--color-text)]">
                Training & Development
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Manage employee training courses, participants and training
                costs.
            </p>
            </div>

            <Button onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Add Training Course
            </Button>
        </div>

        {/* SUMMARY */}
        <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
            <div className="flex items-start justify-between">
                <div>
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                    Training Courses
                </p>

                <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                    {courses.length}
                </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                <GraduationCap size={17} />
                </div>
            </div>
            </Card>

            <Card className="p-5">
            <div className="flex items-start justify-between">
                <div>
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                    Total Trainees
                </p>

                <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                    {totalTrainees}
                </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                <Users size={17} />
                </div>
            </div>
            </Card>

            <Card className="p-5">
            <div className="flex items-start justify-between">
                <div>
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                    Training Costs
                </p>

                <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">
                    {formatCurrency(totalTrainingCost)}
                </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                <GraduationCap size={17} />
                </div>
            </div>
            </Card>
        </div>

        {/* COURSE TABLE */}
        <Card className="overflow-hidden">
            <div className="border-b border-[var(--color-border)] px-5 py-4">
            <p className="text-xs font-medium text-[var(--color-text-muted)]">
                {courses.length} training{" "}
                {courses.length === 1 ? "course" : "courses"} registered
            </p>
            </div>

            {courses.length === 0 ? (
            <div className="p-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)]">
                <GraduationCap size={22} />
                </div>

                <p className="mt-4 text-sm font-medium text-[var(--color-text)]">
                No training courses yet
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Add a training course and select the employees who will
                participate.
                </p>

                <Button
                className="mt-5"
                onClick={() => setShowAddModal(true)}
                >
                <Plus size={16} />
                Add Training Course
                </Button>
            </div>
            ) : (
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left">
                <thead>
                    <tr className="border-b border-[var(--color-border)] text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                    <th className="px-5 py-4 font-medium">
                        Course
                    </th>

                    <th className="px-5 py-4 font-medium">
                        Training Type
                    </th>

                    <th className="px-5 py-4 font-medium">
                        Period
                    </th>

                    <th className="px-5 py-4 font-medium">
                        Duration
                    </th>

                    <th className="px-5 py-4 font-medium">
                        Organizer
                    </th>

                    <th className="px-5 py-4 font-medium">
                        Trainees
                    </th>

                    <th className="px-5 py-4 font-medium">
                        Cost
                    </th>

                    <th className="w-16 px-5 py-4" />
                    </tr>
                </thead>

                <tbody className="divide-y divide-[var(--color-border)]">
                    {courses.map((course) => (
                    <tr
                        key={course.id}
                        className="group transition-colors hover:bg-[var(--color-surface-hover)]"
                    >
                        <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                            <GraduationCap size={17} />
                            </div>

                            <div>
                            <p className="text-sm font-medium text-[var(--color-text)]">
                                {course.courseName}
                            </p>

                            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                                {course.chiefLecturer || "No lecturer specified"}
                            </p>
                            </div>
                        </div>
                        </td>

                        <td className="px-5 py-4">
                        <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1 text-[10px] font-medium text-[var(--color-text-secondary)]">
                            {course.trainingType}
                        </span>
                        </td>

                        <td className="px-5 py-4">
                        <div className="text-xs text-[var(--color-text-secondary)]">
                            {course.startingDate}
                        </div>

                        <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                            to {course.endingDate}
                        </div>
                        </td>

                        <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                            <Clock3 size={14} />
                            {course.duration}{" "}
                            {course.duration === 1 ? "day" : "days"}
                        </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                        {course.organizer || "—"}
                        </td>

                        <td className="px-5 py-4">
                        <button
                            type="button"
                            onClick={() => setSelectedCourse(course)}
                            className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand)] hover:underline"
                        >
                            <Users size={14} />
                            {course.numberOfTrainees}
                        </button>
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-[var(--color-text)]">
                        {formatCurrency(course.costs)}
                        </td>

                        <td className="relative px-5 py-4">
                        <CourseActions
                            onView={() => setSelectedCourse(course)}
                            onDelete={() => handleDeleteCourse(course)}
                        />
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </Card>

        {/* ADD COURSE MODAL */}
        {showAddModal && (
            <AddTrainingCourseModal
            employees={employees}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddCourse}
            />
        )}

        {/* DETAILS MODAL */}
        {selectedCourse && (
            <TrainingCourseDetailsModal
            course={selectedCourse}
            employees={employees}
            onClose={() => setSelectedCourse(null)}
            />
        )}
        </div>
    );
}

function CourseActions({
    onView,
    onDelete,
}: {
    onView: () => void;
    onDelete: () => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
        <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
        >
            <MoreHorizontal size={17} />
        </button>

        {open && (
            <div className="absolute right-5 top-10 z-20 w-40 overflow-hidden rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] p-1 shadow-xl">
            <button
                type="button"
                onClick={() => {
                setOpen(false);
                onView();
                }}
                className="flex w-full items-center rounded-md px-3 py-2 text-left text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
            >
                View course
            </button>

            <button
                type="button"
                onClick={() => {
                setOpen(false);
                onDelete();
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
            >
                <Trash2 size={14} />
                Delete course
            </button>
            </div>
        )}
        </div>
    );
}

function AddTrainingCourseModal({
    employees,
    onClose,
    onAdd,
}: {
    employees: TrainingEmployee[];
    onClose: () => void;
    onAdd: (course: TrainingCourse) => void; 
}) {
    const [form, setForm] = useState(emptyForm);
    const [participantIds, setParticipantIds] = useState<string[]>([]);
    const [participantSearch, setParticipantSearch] = useState("");
    const [error, setError] = useState("");

    const duration = calculateDuration(
        form.startingDate,
        form.endingDate,
    );

    const filteredEmployees = useMemo(() => {
        const query = participantSearch.toLowerCase().trim();
        
        if (!query) return employees;

        return employees.filter(
            (employee) => employee.name.toLowerCase().includes(query) || employee.employeeNumber.toLowerCase().includes(query) || employee.department.toLowerCase().includes(query),
        );
    }, [employees, participantSearch]);

    const toggleParticipant = (employeeId: string) => {
        setParticipantIds((current) => current.includes(employeeId) ? current.filter((id) => id !== employeeId): [...current, employeeId],);
    };

    const updateField = (
        field: keyof typeof emptyForm,
        value: string,
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        setError("");

        if (!form.courseName || !form.startingDate || !form.endingDate) {
            setError("Course name, string date and ending date are required.");

            return;
        }

        if (!duration) {
            setError(
                "Ending date must be the same as or later than the starting date.",
            );
            return;
        }

        if (setParticipantIds.length === 0) {
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
        <ModalShell
        title="Add Training Course"
        onClose={onClose}
        maxWidth="max-w-5xl"
        >
        <div className="space-y-6">
            {/* COURSE INFORMATION */}
            <div>
            <SectionHeading
                icon={<GraduationCap size={16} />}
                title="Course Information"
            />

            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <FormField
                label="Course Name"
                value={form.courseName}
                onChange={(value) =>
                    updateField("courseName", value)
                }
                placeholder="e.g. Advanced Payroll Management"
                required
                />

                <label className="block space-y-2">
                <span className="block text-xs font-medium text-[var(--color-text-secondary)]">
                    Type of Training
                </span>

                <select
                    value={form.trainingType}
                    onChange={(event) =>
                    updateField(
                        "trainingType",
                        event.target.value,
                    )
                    }
                    className="h-10 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)]"
                >
                    {TRAINING_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                    ))}
                </select>
                </label>

                <FormField
                label="Starting Date"
                type="date"
                value={form.startingDate}
                onChange={(value) =>
                    updateField("startingDate", value)
                }
                required
                />

                <FormField
                label="Ending Date"
                type="date"
                value={form.endingDate}
                onChange={(value) =>
                    updateField("endingDate", value)
                }
                required
                />

                <div>
                <span className="block text-xs font-medium text-[var(--color-text-secondary)]">
                    Duration
                </span>

                <div className="mt-2 flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3">
                    <Clock3
                    size={15}
                    className="text-[var(--color-brand)]"
                    />

                    <span className="text-sm text-[var(--color-text)]">
                    {duration
                        ? `${duration} ${
                            duration === 1 ? "day" : "days"
                        }`
                        : "Calculated from dates"}
                    </span>
                </div>
                </div>

                <FormField
                label="Organizer"
                value={form.organizer}
                onChange={(value) =>
                    updateField("organizer", value)
                }
                placeholder="e.g. HR Department"
                />

                <FormField
                label="Chief Lecturer"
                value={form.chiefLecturer}
                onChange={(value) =>
                    updateField("chiefLecturer", value)
                }
                placeholder="e.g. Jane Doe"
                />

                <FormField
                label="Location"
                value={form.location}
                onChange={(value) =>
                    updateField("location", value)
                }
                placeholder="e.g. Training Room A"
                />

                <FormField
                label="Expertise Needed"
                value={form.expertiseNeeded}
                onChange={(value) =>
                    updateField("expertiseNeeded", value)
                }
                placeholder="e.g. Payroll, HR, Finance"
                />

                <FormField
                label="Costs"
                type="number"
                value={form.costs}
                onChange={(value) =>
                    updateField("costs", value)
                }
                placeholder="e.g. 500000"
                />
            </div>

            <div className="mt-4">
                <label className="block space-y-2">
                <span className="block text-xs font-medium text-[var(--color-text-secondary)]">
                    Remarks
                </span>

                <textarea
                    value={form.remarks}
                    onChange={(event) =>
                    updateField("remarks", event.target.value)
                    }
                    rows={3}
                    placeholder="Additional information about this training..."
                    className="w-full resize-none rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
                />
                </label>
            </div>
            </div>

            {/* PARTICIPANTS */}
            <div className="border-t border-[var(--color-border)] pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <SectionHeading
                icon={<Users size={16} />}
                title="Training Participants"
                />

                <div className="rounded-full bg-[var(--color-brand-soft)] px-3 py-1.5 text-xs font-medium text-[var(--color-brand)]">
                {participantIds.length} trainee
                {participantIds.length === 1 ? "" : "s"} selected
                </div>
            </div>

            <div className="relative mt-4">
                <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                />

                <Input
                value={participantSearch}
                onChange={(event) =>
                    setParticipantSearch(event.target.value)
                }
                placeholder="Search employees by name, number or department..."
                className="pl-9"
                />
            </div>

            <div className="mt-3 max-h-64 overflow-y-auto rounded-lg border border-[var(--color-border)]">
                {filteredEmployees.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--color-text-muted)]">
                    No employees found.
                </div>
                ) : (
                filteredEmployees.map((employee) => {
                    const selected = participantIds.includes(
                    employee.id,
                    );

                    return (
                    <button
                        key={employee.id}
                        type="button"
                        onClick={() =>
                        toggleParticipant(employee.id)
                        }
                        className={`flex w-full items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 text-left last:border-b-0 ${
                        selected
                            ? "bg-[var(--color-brand-soft)]"
                            : "hover:bg-[var(--color-surface-hover)]"
                        }`}
                    >
                        <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                            selected
                            ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-black"
                            : "border-[var(--color-border-strong)]"
                        }`}
                        >
                        {selected && (
                            <span className="text-xs font-bold">
                            ✓
                            </span>
                        )}
                        </div>

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-bg)] text-xs font-bold text-[var(--color-brand)]">
                        {employee.name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--color-text)]">
                            {employee.name}
                        </p>

                        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                            {employee.employeeNumber} •{" "}
                            {employee.department}
                        </p>
                        </div>

                        <span className="hidden text-xs text-[var(--color-text-muted)] md:block">
                        {employee.position}
                        </span>
                    </button>
                    );
                })
                )}
            </div>
            </div>

            {/* ERROR */}
            {error && (
            <div className="rounded-lg border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-4 py-3 text-xs text-[var(--color-danger)]">
                {error}
            </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
            <Button
                type="button"
                variant="secondary"
                onClick={onClose}
            >
                Cancel
            </Button>

            <Button type="button" onClick={handleSubmit}>
                <Plus size={16} />
                Save Training Course
            </Button>
            </div>
        </div>
        </ModalShell>
    );
}

function TrainingCourseDetailsModal({
    course,
    employees,
    onClose,
}: {
    course: TrainingCourse;
    employees: TrainingEmployee[];
    onClose: () => void;
}) {
    const participants = employees.filter((employee) => course.participantIds.includes(employee.id));

    return (
        <ModalShell
        title="Training Course Details"
        onClose={onClose}
        maxWidth="max-w-4xl"
        >
        <div className="space-y-6">
            <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                <GraduationCap size={22} />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">
                {course.courseName}
                </h3>

                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {course.trainingType}
                </p>
            </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
                label="Starting Date"
                value={course.startingDate}
            />

            <DetailItem
                label="Ending Date"
                value={course.endingDate}
            />

            <DetailItem
                label="Duration"
                value={`${course.duration} ${
                course.duration === 1 ? "day" : "days"
                }`}
            />

            <DetailItem
                label="Organizer"
                value={course.organizer || "—"}
            />

            <DetailItem
                label="Chief Lecturer"
                value={course.chiefLecturer || "—"}
            />

            <DetailItem
                label="Location"
                value={course.location || "—"}
            />

            <DetailItem
                label="Expertise Needed"
                value={course.expertiseNeeded || "—"}
            />

            <DetailItem
                label="Costs"
                value={formatCurrency(course.costs)}
            />

            <DetailItem
                label="No. of Trainees"
                value={String(course.numberOfTrainees)}
            />
            </div>

            {course.remarks && (
            <div className="border-t border-[var(--color-border)] pt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                Remarks
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                {course.remarks}
                </p>
            </div>
            )}

            {/* PARTICIPANT LIST */}
            <div className="border-t border-[var(--color-border)] pt-5">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                    Participants
                </p>

                <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                    {participants.length} employee
                    {participants.length === 1 ? "" : "s"}
                </p>
                </div>

                <Users
                size={18}
                className="text-[var(--color-brand)]"
                />
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-[var(--color-border)]">
                {participants.map((employee, index) => (
                <div
                    key={employee.id}
                    className={`flex items-center gap-3 px-4 py-3 ${
                    index !== participants.length - 1
                        ? "border-b border-[var(--color-border)]"
                        : ""
                    }`}
                >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[10px] font-bold text-[var(--color-brand)]">
                    {employee.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--color-text)]">
                        {employee.name}
                    </p>

                    <p className="text-xs text-[var(--color-text-muted)]">
                        {employee.employeeNumber} •{" "}
                        {employee.department}
                    </p>
                    </div>

                    <span className="hidden text-xs text-[var(--color-text-secondary)] sm:block">
                    {employee.position}
                    </span>
                </div>
                ))}
            </div>
            </div>

            <div className="flex justify-end border-t border-[var(--color-border)] pt-5">
            <Button variant="secondary" onClick={onClose}>
                Close
            </Button>
            </div>
        </div>
        </ModalShell> 
    );
}

function ModalShell({
    title,
    children,
    onClose,
    maxWidth = "max-w-2xl",
}: {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    maxWidth?: string;
}) {
    return (
        <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
            onClose();
            }
        }}
        >
        <div
            className={`max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] shadow-2xl`}
        >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-6 py-4">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
                {title}
            </h2>

            <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
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

function DetailItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            {label}
        </p>

        <p className="mt-1 text-sm text-[var(--color-text)]">
            {value}
        </p>
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
            <span className="ml-1 text-[var(--color-brand)]">
                *
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

function SectionHeading({
    icon,
    title,
}: {
    icon: React.ReactNode;
    title: string;
}) {
    return (
        <div className="flex items-center gap-2">
        <div className="text-[var(--color-brand)]">{icon}</div>

        <h3 className="text-sm font-semibold text-[var(--color-text)]">
            {title}
        </h3>
        </div>
    );
}