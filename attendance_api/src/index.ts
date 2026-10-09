import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";

type AttendanceStatus = "Present" | "Absent" | "Late" | "Leave" | "Half Day";

interface Employee {
    employeeNumber: string;
    name: string;
    department: string;
    position: string;
}

interface AttendanceRecord extends Employee {
    id: string;
    date: string; 
    checkIn: string;
    checkOut: string;
    hoursWorked: number;
    overtime: number;
    status: AttendanceStatus;
    note?: string;
}

interface ScanResult {
    status: number;
    body: Record<string, unknown>;
}


const PORT = Number(process.env.PORT ?? 4000);
const API_KEY = process.env.API_KEY ?? "";
const TIMEZONE = process.env.APP_TIMEZONE ?? "Africa/Dar_es_Salaam";
const LATE_AFTER = process.env.LATE_AFTER ?? "08:15"; 
const STANDARD_HOURS = 8;
const HALF_DAY_BELOW = 6; 
const DUPLICATE_WINDOW_SECONDS = Number(process.env.DUPLICATE_WINDOW_SECONDS ?? 10);

const employeeList: Employee[] = [
  { employeeNumber: "EMP-0001", name: "John Mwangi", department: "Finance", position: "Accountant" },
  { employeeNumber: "EMP-0002", name: "Sarah Johnson", department: "Human Resources", position: "HR Manager" },
  { employeeNumber: "EMP-0003", name: "Michael Smith", department: "Information Technology", position: "Software Engineer" },
  { employeeNumber: "EMP-0004", name: "Amina Hassan", department: "Administration", position: "Administrator" },
  { employeeNumber: "EMP-0005", name: "David Mushi", department: "Operations", position: "Operations Officer" },
  { employeeNumber: "EMP-0006", name: "Grace Joseph", department: "Finance", position: "Finance Officer" },
];
const employees = new Map(employeeList.map((e) => [e.employeeNumber, e]));

// card UID (uppercase hex, no separators) -> employee number
const cards = new Map<string, string>([
  ["AABBCCDD", "EMP-0001"],
  ["11223344", "EMP-0002"],
  ["55667788", "EMP-0003"],
  ["99AABBCC", "EMP-0004"],
  ["DDEEFF00", "EMP-0005"],
  ["01020304", "EMP-0006"],
]);

const records = new Map<string, AttendanceRecord>(); // key: "<date>:<employeeNumber>"
const lastScan = new Map<string, number>(); // employeeNumber -> epoch ms
let nextId = 1;
const makeId = () => `ATT-${String(nextId++).padStart(3, "0")}`;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const normalizeUid = (uid: string) => uid.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
const round1 = (n: number) => Math.round(n * 10) / 10;
const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

function nowParts(d = new Date()): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  const hour = get("hour") === "24" ? "00" : get("hour");
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${hour}:${get("minute")}` };
}

/** Full register for a date: real records plus "Absent" rows for everyone else. */
function registerFor(date: string): AttendanceRecord[] {
  return employeeList.map(
    (emp) =>
      records.get(`${date}:${emp.employeeNumber}`) ?? {
        ...emp,
        id: `ABS-${date}-${emp.employeeNumber}`,
        date,
        checkIn: "-",
        checkOut: "-",
        hoursWorked: 0,
        overtime: 0,
        status: "Absent",
        note: "No attendance recorded",
      },
  );
}

/* ------------------------------------------------------------------ */
/* Core scan logic: first scan of the day = check in, second = out     */
/* ------------------------------------------------------------------ */

function processScan(rawUid: unknown, deviceId: string): ScanResult {
  const uid = typeof rawUid === "string" ? normalizeUid(rawUid) : "";
  if (!uid) {
    return { status: 400, body: { ok: false, error: "card_uid is required" } };
  }

  const employeeNumber = cards.get(uid);
  const employee = employeeNumber ? employees.get(employeeNumber) : undefined;
  if (!employee) {
    console.log(`[scan] UNKNOWN card ${uid} from ${deviceId}  -> register it with POST /api/cards`);
    return { status: 404, body: { ok: false, error: "Unknown card", card_uid: uid } };
  }

  const nowMs = Date.now();
  const last = lastScan.get(employee.employeeNumber);
  if (last !== undefined && nowMs - last < DUPLICATE_WINDOW_SECONDS * 1000) {
    return {
      status: 429,
      body: { ok: false, error: "Duplicate scan, please wait", employee: employee.name },
    };
  }

  const { date, time } = nowParts();
  const key = `${date}:${employee.employeeNumber}`;
  const existing = records.get(key);

  // --- first scan of the day: check in ---
  if (!existing) {
    const late = toMinutes(time) > toMinutes(LATE_AFTER);
    const record: AttendanceRecord = {
      ...employee,
      id: makeId(),
      date,
      checkIn: time,
      checkOut: "-",
      hoursWorked: 0,
      overtime: 0,
      status: late ? "Late" : "Present",
      note: late ? `Arrived at ${time}` : undefined,
    };
    records.set(key, record);
    lastScan.set(employee.employeeNumber, nowMs);
    console.log(`[scan] CHECK-IN  ${employee.name} at ${time} (${record.status}) via ${deviceId}`);
    return { status: 200, body: { ok: true, action: "check_in", employee: employee.name, record } };
  }

  // --- already completed for today ---
  if (existing.checkOut !== "-") {
    return {
      status: 409,
      body: { ok: false, error: "Already checked out today", employee: employee.name, record: existing },
    };
  }

  // --- second scan: check out ---
  const hours = round1(Math.max(0, toMinutes(time) - toMinutes(existing.checkIn)) / 60);
  existing.checkOut = time;
  existing.hoursWorked = hours;
  existing.overtime = round1(Math.max(0, hours - STANDARD_HOURS));
  if (hours < HALF_DAY_BELOW) existing.status = "Half Day";
  lastScan.set(employee.employeeNumber, nowMs);
  console.log(`[scan] CHECK-OUT ${employee.name} at ${time}, ${hours}h (${existing.status}) via ${deviceId}`);
  return { status: 200, body: { ok: true, action: "check_out", employee: employee.name, record: existing } };
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

const app = express();
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Optional shared secret for the device. Only enforced when API_KEY is set.
function requireDeviceKey(req: Request, res: Response, next: NextFunction) {
  if (API_KEY && req.header("x-api-key") !== API_KEY) {
    res.status(401).json({ ok: false, error: "Invalid or missing API key" });
    return;
  }
  next();
}

app.get("/api/health", (_req, res) => {
  const { date, time } = nowParts();
  res.json({ ok: true, serverDate: date, serverTime: time, timezone: TIMEZONE });
});

// Called by the ESP32
app.post("/api/attendance/scan", requireDeviceKey, (req, res) => {
  const deviceId = typeof req.body?.device_id === "string" ? req.body.device_id : "unknown-device";
  const result = processScan(req.body?.card_uid, deviceId);
  res.status(result.status).json(result.body);
});

// Used by the frontend: full register for a date (default today)
app.get("/api/attendance", (req, res) => {
  const q = req.query.date;
  const date = typeof q === "string" && /^\d{4}-\d{2}-\d{2}$/.test(q) ? q : nowParts().date;
  res.json({ date, records: registerFor(date) });
});

app.get("/api/employees", (_req, res) => {
  res.json(
    employeeList.map((e) => ({
      ...e,
      cards: [...cards.entries()].filter(([, num]) => num === e.employeeNumber).map(([uid]) => uid),
    })),
  );
});

// Link a card UID to an employee (use this for the UID the simulator shows)
app.post("/api/cards", (req, res) => {
  const uid = typeof req.body?.card_uid === "string" ? normalizeUid(req.body.card_uid) : "";
  const employeeNumber = req.body?.employee_number;
  if (!uid || typeof employeeNumber !== "string" || !employees.has(employeeNumber)) {
    res.status(400).json({ ok: false, error: "card_uid and a valid employee_number are required" });
    return;
  }
  cards.set(uid, employeeNumber);
  res.json({ ok: true, card_uid: uid, employee_number: employeeNumber });
});

// Dev helper: wipe all attendance records so you can test from scratch
app.delete("/api/attendance", (_req, res) => {
  const count = records.size;
  records.clear();
  lastScan.clear();
  res.json({ ok: true, cleared: count });
});

// Dev helper: scan from the browser address bar, e.g. /api/dev/scan/AABBCCDD
if (process.env.NODE_ENV !== "production") {
  app.get("/api/dev/scan/:uid", (req, res) => {
    const result = processScan(req.params.uid, "browser-test");
    res.status(result.status).json(result.body);
  });
}

// Error handler (bad JSON etc.)
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof SyntaxError) {
    res.status(400).json({ ok: false, error: "Invalid JSON body" });
    return;
  }
  console.error(err);
  res.status(500).json({ ok: false, error: "Server error" });
});

app.listen(PORT, () => {
  const { date, time } = nowParts();
  console.log(`Attendance API listening on http://localhost:${PORT}`);
  console.log(`Server time: ${date} ${time} (${TIMEZONE}), late after ${LATE_AFTER}`);
  console.log(API_KEY ? "API key required for /api/attendance/scan" : "No API key set (testing mode)");
});