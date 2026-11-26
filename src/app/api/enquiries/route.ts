import { NextRequest, NextResponse } from "next/server";
import {
  readStore,
  writeStore,
  detectConflictHints,
  isEnquiryOverdue,
  appendAuditLog,
} from "@/lib/store";
import type { Enquiry, StaffUser } from "@/lib/types";

// Simple in-memory rate limiter (SC-4)
const rateBucket = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateBucket.get(ip);
  if (!entry || now > entry.resetAt) {
    rateBucket.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 12) return false;
  entry.count += 1;
  return true;
}

function getSessionUser(req: NextRequest): StaffUser | null {
  const cookie = req.cookies.get("iyp_staff_session")?.value;
  if (!cookie) return null;
  try {
    return JSON.parse(Buffer.from(cookie, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const store = readStore();
  const now = Date.now();
  const enriched = store.enquiries.map((e) => ({
    ...e,
    overdue: isEnquiryOverdue(e, now),
    conflictHints: detectConflictHints(store, e),
  }));

  return NextResponse.json({
    enquiries: enriched,
    messages: store.messages,
    channelEvents: store.channelEvents,
  });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a few minutes or call +254 726 111 198." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    // Honeypot bot check (SC-4)
    if (body?.website_url && String(body.website_url).trim().length > 0) {
      return NextResponse.json({ error: "Submission rejected" }, { status: 400 });
    }

    const type = body?.type === "career" ? "career" : body?.type === "enquiry" ? "enquiry" : "consultation";
    const clientName = String(body?.clientName || "").trim();
    const phone = String(body?.phone || "").trim();
    const email = String(body?.email || "").trim();
    const areaSlug = String(body?.areaSlug || "general").trim();
    const summary = String(body?.summary || "").trim();
    const consent = Boolean(body?.consent);

    if (!clientName || !phone || !consent) {
      return NextResponse.json(
        { error: "Full name, phone number, and privacy notice consent are required." },
        { status: 400 }
      );
    }

    if (type !== "career" && !summary) {
      return NextResponse.json(
        { error: "Please provide a brief, non-sensitive summary of your matter." },
        { status: 400 }
      );
    }

    const store = readStore();
    const matchedArea = store.practiceAreas.find((a) => a.slug === areaSlug);
    const areaName =
      type === "career"
        ? "Careers & Pupillage"
        : matchedArea?.name || "General Legal Enquiry";

    const seq = 100 + store.enquiries.length + 1;
    const reference = `IYP-2026-0${seq}`;

    const preferredAdvocate = body?.preferredAdvocateSlug
      ? store.advocates.find((a) => a.slug === String(body.preferredAdvocateSlug))
      : undefined;

    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}`,
      reference,
      type,
      clientName,
      phone,
      email: email || undefined,
      areaSlug,
      areaName,
      preferredAdvocateSlug: preferredAdvocate?.slug,
      otherParty: body?.otherParty ? String(body.otherParty).trim() : undefined,
      summary: summary || `Application for ${body?.openingTitle || "open position"}`,
      preferredSlots: [
        String(body?.slot1 || "").trim(),
        String(body?.slot2 || "").trim(),
      ],
      mode:
        body?.mode === "Virtual (Phone / Video)"
          ? "Virtual (Phone / Video)"
          : "In-person (Gate House, Nakuru)",
      sourcePage: String(body?.sourcePage || "/request-consultation"),
      consent: true,
      status: "New",
      assignedAdvocateId: preferredAdvocate?.id,
      assignedAdvocateName: preferredAdvocate?.name,
      openingId: body?.openingId ? String(body.openingId) : undefined,
      openingTitle: body?.openingTitle ? String(body.openingTitle) : undefined,
      cvFileName: body?.cvFileName ? String(body.cvFileName) : undefined,
      cvSizeLabel: body?.cvSizeLabel ? String(body.cvSizeLabel) : undefined,
      notes: [],
      createdAt: new Date().toISOString(),
    };

    store.enquiries.unshift(newEnquiry);

    // Instant auto-acknowledgement message (within 1 minute target)
    const ackMessage =
      type === "career"
        ? `We have received your application (Ref: ${reference}) for ${newEnquiry.openingTitle || "a position at Imbwaga, Yogo & Partners Advocates"}. Our office will review your details and contact you if shortlisted.`
        : "We have received your request. A member of our team will contact you to confirm a time. This does not yet create an advocate–client relationship.";

    store.messages.unshift({
      id: `msg-${Date.now()}`,
      enquiryId: newEnquiry.id,
      enquiryReference: reference,
      channel: email ? "Email" : "SMS",
      template: "Instant Auto-Acknowledgement",
      recipient: email || phone,
      preview: ackMessage,
      sentAt: new Date().toISOString(),
    });

    // Staff alert log (SC-2: link to inbox only, no full enquiry text in email alert)
    store.messages.unshift({
      id: `msg-staff-${Date.now() + 1}`,
      enquiryId: newEnquiry.id,
      enquiryReference: reference,
      channel: "Email",
      template: "Staff Alert (Inbox Link Only)",
      recipient: preferredAdvocate ? `${preferredAdvocate.name} & Front Office` : "Front Office (info@iypadvocates.com)",
      preview: `New ${type} (${reference}) received for ${areaName}. Sign in to the secure CMS Inbox to run the conflict check and respond within 1 business hour.`,
      sentAt: new Date().toISOString(),
    });

    appendAuditLog(store, {
      who: "Public Intake Form",
      role: "Office",
      action: "CREATE_ENQUIRY",
      entity: reference,
      details: `Received ${type} from ${newEnquiry.sourcePage} for ${areaName}.`,
    });

    writeStore(store);

    return NextResponse.json(
      {
        ok: true,
        reference,
        acknowledgement: ackMessage,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Could not process submission." }, { status: 400 });
  }
}
