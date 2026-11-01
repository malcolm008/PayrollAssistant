import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Banknote,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  Flag,
  Info,
  Lock,
  RefreshCw,
  X,
} from "lucide-react";

import { type PayrollPeriod, MONTHS, type PayrollPeriodStatus } from "../../types/payrollPeriod";

const STORAGE_KEY = "payroll-periods";
const ACTIVE_PERIOD_KEY = "payroll-active-period";

function localDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function monthName(year: number, month: number) {
  return `${MONTHS[month]} ${year}`;
}

function periodDates(year: number, month: number) {
  const startDate = localDate(year, month, 1);
  const endDate = localDate(year, month, new Date(year, month + 1, 0).getDate());
  return { startDate, endDate };
}

function makePeriod(year: number, month: number): PayrollPeriod {
  const now = new Date().toISOString();
  const { startDate, endDate } = periodDates(year, month);
  return {
    id: `PER-${year}${String(month + 1).padStart(2, "0")}`,
    name: monthName(year, month),
    frequency: "Monthly",
    startDate,
    endDate,
    paymentDate: endDate,
    inputCutoffDate: endDate,
    status: "Open",
    notes: "",
    createdAt: now,
    updatedAt: now,
  };
}

function loadPeriods(): PayrollPeriod[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is PayrollPeriod => Boolean(item) && typeof item.id === "string" && typeof item.startDate === "string" && typeof item.endDate === "string" && ["Open", "Closed", "Locked"].includes(item.status));
  } catch {
    return [];
  }
}

function formatDate(value: string) {
  if (!value) return "—";

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

function getPeriodMonth(period: PayrollPeriod) {
  const date = new Date(`${period.startDate}T00:00:00`);
  return { year: date.getFullYear(), month: date.getMonth() };
}

const pad2 = (value: number) => String(value).padStart(2, "0");

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

const monthIndex = (year: number, month: number) => year * 12 + month;

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

const diffDays = (a: Date, b: Date) => Math.round((a.getTime() - b.getTime()) / 86_400_000);

function getProgress(period: PayrollPeriod, today: Date) {
  const start = parseDate(period.startDate);
  const end = parseDate(period.endDate);
  const totalDays = diffDays(end, start) + 1;
  const fromStart = diffDays(today, start);
 
  if (fromStart < 0) {
    return {
      state: "upcoming" as const,
      totalDays,
      percent: 0,
      label: `Starts in ${plural(-fromStart, "day")}`,
      overdueDays: 0,
    };
  }
 
  const afterEnd = diffDays(today, end);
 
  if (afterEnd > 0) {
    return {
      state: "ended" as const,
      totalDays,
      percent: 100,
      label: `Ended ${plural(afterEnd, "day")} ago`,
      overdueDays: afterEnd,
    };
  }
 
  const elapsed = fromStart + 1;
 
  return {
    state: "current" as const,
    totalDays,
    percent: (elapsed / totalDays) * 100,
    label: `Day ${elapsed} of ${totalDays}`,
    overdueDays: 0,
  };
}
 
function relativeDay(value: string, today: Date) {
  const diff = diffDays(parseDate(value), today);
 
  if (diff === 0) return { text: "Today", tone: "text-[var(--color-brand)]" };
  if (diff > 0) {
    return {
      text: `In ${plural(diff, "day")}`,
      tone: "text-[var(--color-text-secondary)]",
    };
  }
 
  return {
    text: `${plural(-diff, "day")} ago`,
    tone: "text-[var(--color-text-muted)]",
  };
}
 
/* =========================================================
   FEEDBACK: ALERTS + TOASTS
========================================================= */
 
type FeedbackKind = "success" | "warning" | "danger" | "info";
 
const feedbackStyles: Record<
  FeedbackKind,
  {
    Icon: typeof Info;
    box: string;
    icon: string;
    tint: string;
    bar: string;
  }
> = {
  success: {
    Icon: CheckCircle2,
    box: "border-[var(--color-success)]/25 bg-[var(--color-success)]/10",
    icon: "text-[var(--color-success)]",
    tint: "bg-[var(--color-success)]/10",
    bar: "bg-[var(--color-success)]",
  },
  warning: {
    Icon: AlertTriangle,
    box: "border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10",
    icon: "text-[var(--color-warning)]",
    tint: "bg-[var(--color-warning)]/10",
    bar: "bg-[var(--color-warning)]",
  },
  danger: {
    Icon: AlertCircle,
    box: "border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10",
    icon: "text-[var(--color-danger)]",
    tint: "bg-[var(--color-danger)]/10",
    bar: "bg-[var(--color-danger)]",
  },
  info: {
    Icon: Info,
    box: "border-[var(--color-info)]/25 bg-[var(--color-info)]/10",
    icon: "text-[var(--color-info)]",
    tint: "bg-[var(--color-info)]/10",
    bar: "bg-[var(--color-info)]",
  },
};
 
function Alert({
  kind,
  title,
  children,
}: {
  kind: FeedbackKind;
  title: string;
  children?: ReactNode;
}) {
  const { Icon, box, icon } = feedbackStyles[kind];
 
  return (
    <div
      role={kind === "danger" || kind === "warning" ? "alert" : "status"}
      className={`flex gap-3 rounded-xl border p-3.5 ${box}`}
    >
      <Icon size={17} className={`mt-0.5 shrink-0 ${icon}`} />
 
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text)]">
          {title}
        </p>
 
        {children && (
          <p className="mt-0.5 text-xs leading-5 text-[var(--color-text-secondary)]">
            {children}
          </p>
        )}
      </div>
    </div>
  );
}
 
interface ToastMessage {
  id: number;
  kind: FeedbackKind;
  title: string;
  message?: string;
}
 
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}) {
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
 
  const duration =
    toast.kind === "success" || toast.kind === "info" ? 5000 : 7000;
 
  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    const timer = window.setTimeout(() => setLeaving(true), duration);
 
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [duration]);
 
  useEffect(() => {
    if (!leaving) return;
 
    const timer = window.setTimeout(() => onDismiss(toast.id), 200);
    return () => window.clearTimeout(timer);
  }, [leaving, onDismiss, toast.id]);
 
  const { Icon, tint, icon, bar } = feedbackStyles[toast.kind];
 
  return (
    <div
      role="status"
      className={`pointer-events-auto overflow-hidden rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] shadow-2xl transition-all duration-200 ${
        entered && !leaving
          ? "translate-x-0 opacity-100"
          : "translate-x-6 opacity-0"
      }`}
    >
      <div className="flex gap-3 p-4">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tint}`}
        >
          <Icon size={16} className={icon} />
        </div>
 
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            {toast.title}
          </p>
 
          {toast.message && (
            <p className="mt-0.5 text-xs leading-5 text-[var(--color-text-secondary)]">
              {toast.message}
            </p>
          )}
        </div>
 
        <button
          type="button"
          onClick={() => setLeaving(true)}
          aria-label="Dismiss notification"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
        >
          <X size={14} />
        </button>
      </div>
 
      <div className="h-0.5 bg-[var(--color-border)]">
        <div
          className={`h-full ${bar}`}
          style={{
            width: entered ? "0%" : "100%",
            transition: `width ${duration}ms linear`,
          }}
        />
      </div>
    </div>
  );
}
 
function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 top-4 z-[200] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
}
 
/* =========================================================
   SMALL UI PIECES
========================================================= */
 
function StatusBadge({
  status,
}: {
  status: PayrollPeriodStatus | "Active";
}) {
  const styles: Record<string, string> = {
    Active: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
    Open: "bg-[var(--color-info)]/10 text-[var(--color-info)]",
    Closed:
      "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)]",
    Locked: "bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
  };
 
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${styles[status]}`}
    >
      {status === "Active" && (
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
      )}
      {status}
    </span>
  );
}
 
function ModalFrame({
  title,
  subtitle,
  onClose,
  maxWidth = "max-w-md",
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  maxWidth?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
 
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
 
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] p-5">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text)]">
              {title}
            </h2>
 
            {subtitle && (
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {subtitle}
              </p>
            )}
          </div>
 
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
          >
            <X size={18} />
          </button>
        </div>
 
        {children}
      </div>
    </div>
  );
}
 
function PeriodCard({
  label,
  name,
  range,
  highlighted = false,
}: {
  label: string;
  name: string;
  range: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlighted
          ? "border-[var(--color-brand)]/40 bg-[var(--color-brand-soft)]"
          : "border-[var(--color-border)] bg-[var(--color-bg)]"
      }`}
    >
      <p
        className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
          highlighted
            ? "text-[var(--color-brand)]"
            : "text-[var(--color-text-muted)]"
        }`}
      >
        {label}
      </p>
 
      <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
        {name}
      </p>
 
      <p className="mt-1 text-[11px] text-[var(--color-text-secondary)]">
        {range}
      </p>
    </div>
  );
}
 
const monthTagStyles: Record<string, string> = {
  Active: "text-[var(--color-brand)]",
  Open: "text-[var(--color-success)]",
  Closed: "text-[var(--color-text-muted)]",
  Locked: "text-[var(--color-danger)]",
  New: "text-[var(--color-text-muted)]",
};
 
const cycleSteps = [
  { title: "Select period", hint: "Choose the month to process" },
  { title: "Process payroll", hint: "Run and review" },
  { title: "Roll over", hint: "Close and open next month" },
];
 
/* =========================================================
   PAGE
========================================================= */
 
export default function PayrollPeriodPage() {
  const [periods, setPeriods] = useState<PayrollPeriod[]>(loadPeriods);
  const [activePeriodId, setActivePeriodId] = useState<string | null>(() =>
    window.localStorage.getItem(ACTIVE_PERIOD_KEY),
  );
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showRolloverModal, setShowRolloverModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [error, setError] = useState("");
 
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastId = useRef(0);
 
  const pushToast = useCallback(
    (kind: FeedbackKind, title: string, message?: string) => {
      toastId.current += 1;
      const id = toastId.current;
 
      setToasts((current) => [
        ...current.slice(-3),
        { id, kind, title, message },
      ]);
    },
    [],
  );
 
  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);
 
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
  }, [periods]);
 
  useEffect(() => {
    if (activePeriodId) window.localStorage.setItem(ACTIVE_PERIOD_KEY, activePeriodId);
    else window.localStorage.removeItem(ACTIVE_PERIOD_KEY);
  }, [activePeriodId]);
 
  const activePeriod = useMemo(
    () => periods.find((period) => period.id === activePeriodId) ?? null,
    [periods, activePeriodId],
  );
 
  const { minYear, maxYear } = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return { minYear: currentYear - 5, maxYear: currentYear + 5 };
  }, []);
 
  const today = startOfToday();
 
  const progress = activePeriod ? getProgress(activePeriod, today) : null;
 
  const nextPeriod = useMemo(() => {
    if (!activePeriod) return null;
 
    const start = new Date(`${activePeriod.startDate}T00:00:00`);
    const next = new Date(start.getFullYear(), start.getMonth() + 1, 1);
 
    return makePeriod(next.getFullYear(), next.getMonth());
  }, [activePeriod]);
 
  const openChangeModal = () => {
    const month = activePeriod ? getPeriodMonth(activePeriod) : {
      year: new Date().getFullYear(), month: new Date().getMonth(),
    };
    setSelectedYear(month.year);
    setSelectedMonth(month.month);
    setError("");
    setShowChangeModal(true);
  };
 
  const saveSelectedPeriod = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const candidate = makePeriod(selectedYear, selectedMonth);
    const existing = periods.find((period) => period.id === candidate.id);
 
    if (existing?.status === "Locked") {
      setError("This payroll period is locked and cannot be activated.");
      return;
    }
 
    if (existing?.status === "Closed") {
      setError("This payroll period is closed. Reopen it through the system administrator before selecting it.");
      return;
    }
 
    const chosen = existing ?? candidate;
    const previousName = activePeriod?.name;
 
    setPeriods((current) => existing
      ? current.map((period) => period.id === existing.id
          ? { ...period, status: "Open", updatedAt: new Date().toISOString() }
          : period)
      : [...current, chosen]);
    setActivePeriodId(chosen.id);
    setShowChangeModal(false);
    pushToast(
      "success",
      "Payroll period changed",
      previousName
        ? `${previousName} → ${chosen.name}`
        : `${chosen.name} is now the active period`,
    );
  };
 
  const openRolloverModal = () => {
    if (!activePeriod) {
      pushToast(
        "warning",
        "No active period",
        "Select a payroll period before rolling over.",
      );
      return;
    }
    setShowRolloverModal(true);
  };
 
  const confirmRollover = () => {
    if (!activePeriod) return;
    const currentStart = new Date(`${activePeriod.startDate}T00:00:00`);
    const nextMonthDate = new Date(currentStart.getFullYear(), currentStart.getMonth() + 1, 1);
    const next = makePeriod(nextMonthDate.getFullYear(), nextMonthDate.getMonth());
    const existing = periods.find((period) => period.id === next.id);
 
    if (existing?.status === "Locked" || existing?.status === "Closed") {
      pushToast(
        "danger",
        "Rollover blocked",
        `${next.name} already exists and is ${existing.status.toLowerCase()}. It cannot be used for rollover.`,
      );
      setShowRolloverModal(false);
      return;
    }
 
    setPeriods((current) => {
      const closedCurrent = current.map((period) => period.id === activePeriod.id
        ? { ...period, status: "Closed" as const, updatedAt: new Date().toISOString() }
        : period);
      return existing
        ? closedCurrent.map((period) => period.id === existing.id
            ? { ...period, status: "Open" as const, updatedAt: new Date().toISOString() }
            : period)
        : [...closedCurrent, next];
    });
    setActivePeriodId(next.id);
    setShowRolloverModal(false);
    pushToast(
      "success",
      "Payroll rolled over",
      `${activePeriod.name} closed. ${next.name} is now active.`,
    );
  };
 
  /* ---------- change-modal derived state ---------- */
 
  const selectedPeriodName = monthName(selectedYear, selectedMonth);
  const selectedDates = periodDates(selectedYear, selectedMonth);
  const selectedId = `PER-${selectedYear}${pad2(selectedMonth + 1)}`;
  const selectedStored = periods.find((period) => period.id === selectedId);
  const selectedIsActive = selectedId === activePeriodId;
 
  const changeAlerts: { kind: FeedbackKind; title: string; message: string }[] = [];
 
  if (error) {
    changeAlerts.push({
      kind: "danger",
      title: "Can’t activate period",
      message: error,
    });
  } else if (selectedStored?.status === "Locked") {
    changeAlerts.push({
      kind: "danger",
      title: "Period locked",
      message: "This payroll period is locked and can’t be activated.",
    });
  } else if (selectedStored?.status === "Closed") {
    changeAlerts.push({
      kind: "warning",
      title: "Period closed",
      message: "Reopen it through the system administrator before selecting it.",
    });
  } else if (selectedIsActive) {
    changeAlerts.push({
      kind: "info",
      title: "Already active",
      message: `${selectedPeriodName} is the active payroll period.`,
    });
  } else if (activePeriod) {
    const active = getPeriodMonth(activePeriod);
    const diff =
      monthIndex(selectedYear, selectedMonth) -
      monthIndex(active.year, active.month);
 
    if (diff < 0) {
      changeAlerts.push({
        kind: "warning",
        title: "Earlier period",
        message: `${activePeriod.name} stays open while you move back.`,
      });
    } else if (diff > 1) {
      changeAlerts.push({
        kind: "warning",
        title: "Skips ahead",
        message: `${plural(diff - 1, "month")} after ${activePeriod.name}. Use rollover for the next month.`,
      });
    }
  }
 
  const canSubmitChange =
    selectedStored?.status !== "Locked" &&
    selectedStored?.status !== "Closed" &&
    !selectedIsActive;
 
  /* ---------- rollover derived state ---------- */
 
  const existingNext = nextPeriod
    ? periods.find((period) => period.id === nextPeriod.id)
    : undefined;
 
  const rolloverBlocked =
    existingNext?.status === "Locked" || existingNext?.status === "Closed";
 
  const endsInFuture = activePeriod
    ? diffDays(parseDate(activePeriod.endDate), today) > 0
    : false;
 
  const keyDates = activePeriod
    ? [
        { label: "Period start", value: activePeriod.startDate, Icon: Flag },
        { label: "Input cut-off", value: activePeriod.inputCutoffDate, Icon: Clock3 },
        { label: "Payment date", value: activePeriod.paymentDate, Icon: Banknote },
      ]
    : [];
 
  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
 
      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <span>Payroll</span>
            <span>/</span>
            <span className="text-[var(--color-brand)]">Payroll Period</span>
          </div>
 
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Payroll Period
          </h1>
        </div>
 
        <div className="flex items-center gap-2 self-start rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 sm:self-auto">
          <CalendarCheck size={15} className="text-[var(--color-brand)]" />
          <span className="text-xs text-[var(--color-text-secondary)]">Today</span>
          <span className="text-xs font-semibold text-[var(--color-text)]">
            {today.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </header>
 
      {activePeriod && progress && nextPeriod ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* MAIN */}
          <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-[var(--color-brand)]/30 bg-[var(--color-surface)]">
              <div className="relative p-6 sm:p-8">
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--color-brand)]/[0.07] blur-3xl" />
 
                <div className="relative">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-brand)] opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-brand)]" />
                      </span>
                      Active Payroll Period
                    </span>
 
                    <StatusBadge status="Active" />
                  </div>
 
                  <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl">
                    {activePeriod.name}
                  </h2>
 
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    {formatDate(activePeriod.startDate)}
                    <span className="mx-2">—</span>
                    {formatDate(activePeriod.endDate)}
                    <span className="mx-2 text-[var(--color-text-muted)]">·</span>
                    {progress.totalDays} days
                  </p>
 
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--color-text-secondary)]">
                        {progress.label}
                      </span>
                      <span className="text-[var(--color-text-muted)]">
                        {Math.round(progress.percent)}%
                      </span>
                    </div>
 
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          progress.state === "ended"
                            ? "bg-[var(--color-warning)]"
                            : "bg-[var(--color-brand)]"
                        }`}
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                  </div>
 
                  {progress.state === "ended" && (
                    <div className="mt-5">
                      <Alert kind="warning" title="Period has ended">
                        {`${activePeriod.name} ended ${plural(progress.overdueDays, "day")} ago. Roll over once payroll is complete.`}
                      </Alert>
                    </div>
                  )}
                </div>
              </div>
 
              <div className="flex flex-col gap-3 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Next period{" "}
                  <span className="font-semibold text-[var(--color-text-secondary)]">
                    {nextPeriod.name}
                  </span>
                </p>
 
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={openChangeModal}
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-strong)] px-4 py-2.5 text-xs font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-hover)]"
                  >
                    <CalendarDays size={15} />
                    Change Period
                  </button>
 
                  <button
                    type="button"
                    onClick={openRolloverModal}
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-xs font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-90"
                  >
                    <RefreshCw size={15} />
                    Roll Over
                  </button>
                </div>
              </div>
            </section>
 
            {/* KEY DATES */}
            <div className="grid gap-4 sm:grid-cols-3">
              {keyDates.map(({ label, value, Icon }) => {
                const relative = relativeDay(value, today);
 
                return (
                  <div
                    key={label}
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                      <Icon size={17} />
                    </div>
 
                    <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                      {label}
                    </p>
 
                    <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                      {formatDate(value)}
                    </p>
 
                    <p className={`mt-1 text-[11px] font-medium ${relative.tone}`}>
                      {relative.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
 
          {/* RAIL */}
          <aside className="space-y-6">
            <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">
                Details
              </h3>
 
              <dl className="mt-3 divide-y divide-[var(--color-border)]">
                <div className="flex items-center justify-between py-2.5 text-xs">
                  <dt className="text-[var(--color-text-muted)]">Frequency</dt>
                  <dd className="font-medium text-[var(--color-text)]">
                    {activePeriod.frequency}
                  </dd>
                </div>
 
                <div className="flex items-center justify-between py-2.5 text-xs">
                  <dt className="text-[var(--color-text-muted)]">Duration</dt>
                  <dd className="font-medium text-[var(--color-text)]">
                    {progress.totalDays} days
                  </dd>
                </div>
 
                <div className="flex items-center justify-between py-2.5 text-xs">
                  <dt className="text-[var(--color-text-muted)]">Status</dt>
                  <dd>
                    <StatusBadge status={activePeriod.status} />
                  </dd>
                </div>
 
                <div className="flex items-center justify-between py-2.5 text-xs">
                  <dt className="text-[var(--color-text-muted)]">Period ID</dt>
                  <dd className="font-mono font-medium text-[var(--color-text)]">
                    {activePeriod.id}
                  </dd>
                </div>
              </dl>
            </section>
 
            <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">
                Monthly cycle
              </h3>
 
              <ol className="mt-4">
                {cycleSteps.map((step, index) => (
                  <li key={step.title} className="relative flex gap-3 pb-5 last:pb-0">
                    {index < cycleSteps.length - 1 && (
                      <span className="absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-px bg-[var(--color-border)]" />
                    )}
 
                    <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-xs font-semibold text-[var(--color-brand)]">
                      {index + 1}
                    </span>
 
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-text)]">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                        {step.hint}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </div>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand)] ring-8 ring-[var(--color-brand)]/5">
            <CalendarDays size={26} />
          </div>
 
          <h2 className="mt-5 text-lg font-semibold text-[var(--color-text)]">
            No active payroll period
          </h2>
 
          <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--color-text-secondary)]">
            Select the month you’re processing to get started.
          </p>
 
          <button
            type="button"
            onClick={openChangeModal}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-90"
          >
            <CalendarDays size={16} />
            Select Payroll Period
          </button>
        </section>
      )}
 
      {/* CHANGE PERIOD MODAL */}
      {showChangeModal && (
        <ModalFrame
          title="Change Payroll Period"
          subtitle="Select the month to make active."
          onClose={() => setShowChangeModal(false)}
        >
          <form onSubmit={saveSelectedPeriod}>
            <div className="space-y-5 p-5">
              <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-1.5">
                <button
                  type="button"
                  disabled={selectedYear <= minYear}
                  onClick={() => {
                    setSelectedYear((year) => year - 1);
                    setError("");
                  }}
                  aria-label="Previous year"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] disabled:opacity-30"
                >
                  <ChevronLeft size={17} />
                </button>
 
                <span className="text-sm font-semibold text-[var(--color-text)]">
                  {selectedYear}
                </span>
 
                <button
                  type="button"
                  disabled={selectedYear >= maxYear}
                  onClick={() => {
                    setSelectedYear((year) => year + 1);
                    setError("");
                  }}
                  aria-label="Next year"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] disabled:opacity-30"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
 
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {MONTHS.map((month, index) => {
                  const id = `PER-${selectedYear}${pad2(index + 1)}`;
                  const stored = periods.find((period) => period.id === id);
                  const tag =
                    id === activePeriodId ? "Active" : (stored?.status ?? "New");
                  const selected = index === selectedMonth;
 
                  return (
                    <button
                      key={month}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setSelectedMonth(index);
                        setError("");
                      }}
                      className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center transition-colors ${
                        selected
                          ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)]"
                          : "border-[var(--color-border)] bg-[var(--color-surface-raised)] hover:bg-[var(--color-surface-hover)]"
                      }`}
                    >
                      <span
                        className={`text-sm font-semibold ${
                          selected
                            ? "text-[var(--color-brand)]"
                            : "text-[var(--color-text)]"
                        }`}
                      >
                        {month.slice(0, 3)}
                      </span>
 
                      <span
                        className={`flex items-center gap-1 text-[10px] font-medium ${monthTagStyles[tag]}`}
                      >
                        {(tag === "Closed" || tag === "Locked") && (
                          <Lock size={10} />
                        )}
                        {tag}
                      </span>
                    </button>
                  );
                })}
              </div>
 
              <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Selected period
                  </p>
                  <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                    {selectedPeriodName}
                  </p>
                </div>
 
                <p className="text-right text-xs leading-5 text-[var(--color-text-secondary)]">
                  {formatDate(selectedDates.startDate)}
                  <br />
                  {formatDate(selectedDates.endDate)}
                </p>
              </div>
 
              {changeAlerts.map((alert) => (
                <Alert key={alert.title} kind={alert.kind} title={alert.title}>
                  {alert.message}
                </Alert>
              ))}
            </div>
 
            <div className="flex justify-end gap-2 border-t border-[var(--color-border)] p-5">
              <button
                type="button"
                onClick={() => setShowChangeModal(false)}
                className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)]"
              >
                Cancel
              </button>
 
              <button
                type="submit"
                disabled={!canSubmitChange}
                className="rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-xs font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Set Active Period
              </button>
            </div>
          </form>
        </ModalFrame>
      )}
 
      {/* ROLLOVER MODAL */}
      {showRolloverModal && activePeriod && nextPeriod && (
        <ModalFrame
          title="Roll Over Payroll Period"
          onClose={() => setShowRolloverModal(false)}
        >
          <div className="space-y-5 p-5">
            <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
              <PeriodCard
                label="Closing"
                name={activePeriod.name}
                range={`${formatDate(activePeriod.startDate)} — ${formatDate(activePeriod.endDate)}`}
              />
 
              <div className="flex justify-center">
                <ArrowRight
                  size={18}
                  className="rotate-90 text-[var(--color-brand)] sm:rotate-0"
                />
              </div>
 
              <PeriodCard
                label="Opening"
                name={nextPeriod.name}
                range={`${formatDate(nextPeriod.startDate)} — ${formatDate(nextPeriod.endDate)}`}
                highlighted
              />
            </div>
 
            {rolloverBlocked && existingNext && (
              <Alert kind="danger" title="Can’t roll over">
                {`${nextPeriod.name} already exists and is ${existingNext.status.toLowerCase()}.`}
              </Alert>
            )}
 
            {endsInFuture && (
              <Alert kind="warning" title="Period hasn’t ended">
                {`${activePeriod.name} ends on ${formatDate(activePeriod.endDate)}.`}
              </Alert>
            )}
 
            <Alert kind="warning" title="Complete payroll first">
              {`${activePeriod.name} will be closed.`}
            </Alert>
          </div>
 
          <div className="flex justify-end gap-2 border-t border-[var(--color-border)] p-5">
            <button
              type="button"
              onClick={() => setShowRolloverModal(false)}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)]"
            >
              Cancel
            </button>
 
            <button
              type="button"
              onClick={confirmRollover}
              disabled={rolloverBlocked}
              className="rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-xs font-semibold text-[var(--color-bg)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Confirm Rollover
            </button>
          </div>
        </ModalFrame>
      )}
    </div>
  );
}
