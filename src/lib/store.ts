import fs from "fs";
import os from "os";
import path from "path";
import type {
  SiteStore,
  Enquiry,
  EnquiryStatus,
  MessageLog,
  AuditLogEntry,
  StaffRole,
} from "./types";
import { INITIAL_STORE } from "./seed";

const LOCAL_DATA_DIR = path.join(process.cwd(), "data");
const TMP_DATA_DIR = path.join(os.tmpdir(), "iyp-advocates");

declare global {
  var __iypStoreCache: SiteStore | undefined;
}

function resolveStorePath(): string {
  // Netlify and serverless runtimes mount the deployment directory read-only; use os.tmpdir() there.
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(TMP_DATA_DIR, "store.json");
  }
  return path.join(LOCAL_DATA_DIR, "store.json");
}

export function readStore(): SiteStore {
  if (globalThis.__iypStoreCache) {
    return globalThis.__iypStoreCache;
  }

  const primaryPath = resolveStorePath();
  const fallbackPath = path.join(TMP_DATA_DIR, "store.json");

  for (const candidate of [primaryPath, fallbackPath]) {
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ candidate)) {
        const raw = fs.readFileSync(/*turbopackIgnore: true*/ candidate, "utf8");
        const parsed = JSON.parse(raw) as SiteStore;
        globalThis.__iypStoreCache = parsed;
        return parsed;
      }
    } catch {
      // try next candidate
    }
  }

  const seeded = structuredClone(INITIAL_STORE);
  globalThis.__iypStoreCache = seeded;
  writeStore(seeded);
  return seeded;
}

export function writeStore(store: SiteStore): void {
  globalThis.__iypStoreCache = store;

  const candidates =
    process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME
      ? [path.join(TMP_DATA_DIR, "store.json")]
      : [path.join(LOCAL_DATA_DIR, "store.json"), path.join(TMP_DATA_DIR, "store.json")];

  for (const filePath of candidates) {
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(store, null, 2), "utf8");
      return;
    } catch {
      // Fall back to tmpdir or in-memory cache if filesystem is read-only
    }
  }
}

export function appendAuditLog(
  store: SiteStore,
  entry: Omit<AuditLogEntry, "id" | "timestamp">
): AuditLogEntry {
  const log: AuditLogEntry = {
    id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  store.auditLogs.unshift(log);
  if (store.auditLogs.length > 500) {
    store.auditLogs = store.auditLogs.slice(0, 500);
  }
  return log;
}

export function detectConflictHints(store: SiteStore, enquiry: Enquiry): string[] {
  const hints: string[] = [];
  const other = (enquiry.otherParty || "").trim().toLowerCase();
  const client = enquiry.clientName.trim().toLowerCase();

  for (const existing of store.enquiries) {
    if (existing.id === enquiry.id) continue;
    const exClient = existing.clientName.trim().toLowerCase();
    const exOther = (existing.otherParty || "").trim().toLowerCase();

    if (other && other !== "n/a" && (exClient.includes(other) || other.includes(exClient))) {
      hints.push(
        `Other party "${enquiry.otherParty}" matches previous client "${existing.clientName}" (${existing.reference}).`
      );
    }
    if (exOther && exOther !== "n/a" && (client.includes(exOther) || exOther.includes(client))) {
      hints.push(
        `Client "${enquiry.clientName}" was named as other party in ${existing.reference} (${existing.areaName}).`
      );
    }
  }
  return hints;
}

export function isEnquiryOverdue(enquiry: Enquiry, nowMs = Date.now()): boolean {
  if (enquiry.firstResponseAt) return false;
  if (enquiry.status !== "New") return false;
  const createdMs = new Date(enquiry.createdAt).getTime();
  if (Number.isNaN(createdMs)) return false;
  return nowMs - createdMs > 60 * 60 * 1000;
}

export function buildStatusMessage(
  enquiry: Enquiry,
  newStatus: EnquiryStatus
): Omit<MessageLog, "id" | "sentAt"> | null {
  const recipient = enquiry.email || enquiry.phone;
  const channel: MessageLog["channel"] = enquiry.email ? "Email" : "WhatsApp";

  switch (newStatus) {
    case "Consultation offered":
      return {
        enquiryId: enquiry.id,
        enquiryReference: enquiry.reference,
        channel,
        template: "Consultation Time Offered",
        recipient,
        preview: `Thank you for contacting Imbwaga, Yogo & Partners Advocates (Ref: ${enquiry.reference}). Following an initial review, we can offer a ${enquiry.mode || "consultation"} slot on ${enquiry.preferredSlots[0] || "your preferred date"}. Please reply to confirm.`,
      };
    case "Confirmed":
      return {
        enquiryId: enquiry.id,
        enquiryReference: enquiry.reference,
        channel,
        template: "Consultation Confirmed",
        recipient,
        preview: `Your consultation (${enquiry.reference}) regarding ${enquiry.areaName} is confirmed (${enquiry.mode || "Gate House, 6th Floor, Suite 603, Nakuru"}). Please bring your ID and relevant documents listed on our ${enquiry.areaName} page.`,
      };
    case "Declined":
      return {
        enquiryId: enquiry.id,
        enquiryReference: enquiry.reference,
        channel,
        template: "Polite Conflict / Capacity Decline",
        recipient,
        preview: `Thank you for contacting Imbwaga, Yogo & Partners Advocates (Ref: ${enquiry.reference}). Please note that the firm is unable to act in this matter. We recommend seeking alternative independent legal representation promptly.`,
      };
    default:
      return null;
  }
}

export function generateMonogram(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "IY";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function formatCsvExport(enquiries: Enquiry[]): string {
  const headers = [
    "Reference",
    "Type",
    "Status",
    "Client Name",
    "Phone",
    "Email",
    "Area of Practice",
    "Other Party (Conflict Check)",
    "Mode",
    "Preferred Slot 1",
    "Preferred Slot 2",
    "Assigned Advocate",
    "Source Page",
    "Created At",
    "First Response At",
  ];

  const escapeCell = (val: string | undefined) => {
    const str = (val ?? "").replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = enquiries.map((e) =>
    [
      e.reference,
      e.type,
      e.status,
      e.clientName,
      e.phone,
      e.email ?? "",
      e.areaName,
      e.otherParty ?? "",
      e.mode ?? "",
      e.preferredSlots?.[0] ?? "",
      e.preferredSlots?.[1] ?? "",
      e.assignedAdvocateName ?? "",
      e.sourcePage,
      e.createdAt,
      e.firstResponseAt ?? "",
    ]
      .map(escapeCell)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

export function canPublish(role: StaffRole): boolean {
  return role === "Partner";
}
