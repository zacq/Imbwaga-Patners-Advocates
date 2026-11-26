import { NextRequest, NextResponse } from "next/server";
import {
  readStore,
  writeStore,
  appendAuditLog,
  buildStatusMessage,
} from "@/lib/store";
import type { EnquiryStatus, StaffUser } from "@/lib/types";

function getSessionUser(req: NextRequest): StaffUser | null {
  const cookie = req.cookies.get("iyp_staff_session")?.value;
  if (!cookie) return null;
  try {
    return JSON.parse(Buffer.from(cookie, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = getSessionUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();
  const store = readStore();
  const idx = store.enquiries.findIndex((e) => e.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  }

  const enquiry = store.enquiries[idx];
  const nowIso = new Date().toISOString();

  if (body.status && body.status !== enquiry.status) {
    const previousStatus = enquiry.status;
    enquiry.status = body.status as EnquiryStatus;
    if (!enquiry.firstResponseAt && enquiry.status !== "New") {
      enquiry.firstResponseAt = nowIso;
    }

    const msgTemplate = buildStatusMessage(enquiry, enquiry.status);
    if (msgTemplate) {
      store.messages.unshift({
        id: `msg-${Date.now()}`,
        sentAt: nowIso,
        ...msgTemplate,
      });
    }

    appendAuditLog(store, {
      who: user.name,
      role: user.role,
      action: "STATUS_CHANGE",
      entity: enquiry.reference,
      details: `Changed status from "${previousStatus}" to "${enquiry.status}".`,
    });
  }

  if (body.assignedAdvocateId !== undefined) {
    const adv = store.advocates.find((a) => a.id === body.assignedAdvocateId);
    enquiry.assignedAdvocateId = adv?.id;
    enquiry.assignedAdvocateName = adv?.name;
    if (!enquiry.firstResponseAt) {
      enquiry.firstResponseAt = nowIso;
    }
    appendAuditLog(store, {
      who: user.name,
      role: user.role,
      action: "ASSIGN_ADVOCATE",
      entity: enquiry.reference,
      details: adv ? `Assigned to ${adv.name}.` : "Unassigned advocate.",
    });
  }

  if (body.note && String(body.note).trim()) {
    enquiry.notes.unshift({
      id: `note-${Date.now()}`,
      author: user.name,
      text: String(body.note).trim(),
      createdAt: nowIso,
    });
    if (!enquiry.firstResponseAt) {
      enquiry.firstResponseAt = nowIso;
    }
  }

  store.enquiries[idx] = enquiry;
  writeStore(store);

  return NextResponse.json({ enquiry });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = getSessionUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await context.params;
  const store = readStore();
  const target = store.enquiries.find((e) => e.id === id);

  if (!target) {
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  }

  store.enquiries = store.enquiries.filter((e) => e.id !== id);
  appendAuditLog(store, {
    who: user.name,
    role: user.role,
    action: "DATA_DELETION",
    entity: target.reference,
    details: `Deleted enquiry record under Kenya Data Protection Act, 2019 retention/erasure request.`,
  });

  writeStore(store);
  return NextResponse.json({ ok: true });
}
