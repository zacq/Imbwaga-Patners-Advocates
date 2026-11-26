import { NextRequest, NextResponse } from "next/server";
import {
  readStore,
  writeStore,
  appendAuditLog,
  canPublish,
  generateMonogram,
} from "@/lib/store";
import { isChecklistComplete, scanTextForCompliance } from "@/lib/compliance";
import type { StaffUser, PublishStatus, ComplianceChecklist } from "@/lib/types";

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
  return NextResponse.json({ store });
}

export async function PATCH(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const entityType = String(body?.entityType || "");
    const targetStatus = (body?.status || "draft") as PublishStatus;
    const checklist = body?.checklist as ComplianceChecklist | undefined;
    const textToScan = String(body?.scanText || "");

    const findings = scanTextForCompliance(textToScan);
    if (targetStatus === "published") {
      if (!canPublish(user.role)) {
        return NextResponse.json(
          { error: "CP-3 Compliance Rule: Only Partners can publish changes. Save as Draft for Partner review." },
          { status: 403 }
        );
      }
      if (!isChecklistComplete(checklist)) {
        return NextResponse.json(
          { error: "CP-1 Compliance Rule: All 6 pre-publish compliance checks must be confirmed before publishing." },
          { status: 400 }
        );
      }
      if (findings.length > 0) {
        return NextResponse.json(
          {
            error: `Compliance scanner detected prohibited wording (${findings.map((f) => `"${f.term}"`).join(", ")}). Remove before publishing.`,
            findings,
          },
          { status: 400 }
        );
      }
    }

    const store = readStore();
    const nowIso = new Date().toISOString();

    if (entityType === "practiceArea") {
      const idx = store.practiceAreas.findIndex((p) => p.id === body.id);
      if (idx === -1) return NextResponse.json({ error: "Practice area not found" }, { status: 404 });
      store.practiceAreas[idx] = {
        ...store.practiceAreas[idx],
        summary: String(body.summary ?? store.practiceAreas[idx].summary),
        whoFor: String(body.whoFor ?? store.practiceAreas[idx].whoFor),
        matters: Array.isArray(body.matters) ? body.matters : store.practiceAreas[idx].matters,
        processSteps: Array.isArray(body.processSteps) ? body.processSteps : store.practiceAreas[idx].processSteps,
        documents: Array.isArray(body.documents) ? body.documents : store.practiceAreas[idx].documents,
        status: targetStatus,
        checklist,
        approvedBy: targetStatus === "published" ? user.name : store.practiceAreas[idx].approvedBy,
        updatedAt: nowIso,
      };
      appendAuditLog(store, {
        who: user.name,
        role: user.role,
        action: targetStatus === "published" ? "PUBLISH" : "SAVE_DRAFT",
        entity: `PracticeArea: ${store.practiceAreas[idx].name}`,
        details: `Updated practice area (${targetStatus}).`,
      });
    } else if (entityType === "advocate") {
      const idx = store.advocates.findIndex((a) => a.id === body.id);
      if (idx === -1) return NextResponse.json({ error: "Advocate not found" }, { status: 404 });
      const nextName = String(body.name ?? store.advocates[idx].name);
      store.advocates[idx] = {
        ...store.advocates[idx],
        name: nextName,
        monogram: generateMonogram(nextName),
        admissionDate: String(body.admissionDate ?? store.advocates[idx].admissionDate),
        qualifications: Array.isArray(body.qualifications) ? body.qualifications : store.advocates[idx].qualifications,
        memberships: Array.isArray(body.memberships) ? body.memberships : store.advocates[idx].memberships,
        publications: Array.isArray(body.publications) ? body.publications : store.advocates[idx].publications,
        bioNote: String(body.bioNote ?? store.advocates[idx].bioNote),
        status: targetStatus,
        checklist,
        approvedBy: targetStatus === "published" ? user.name : store.advocates[idx].approvedBy,
        updatedAt: nowIso,
      };
      appendAuditLog(store, {
        who: user.name,
        role: user.role,
        action: targetStatus === "published" ? "PUBLISH" : "SAVE_DRAFT",
        entity: `Advocate: ${nextName}`,
        details: `Updated Rule 5(1) profile fields (${targetStatus}).`,
      });
    } else if (entityType === "insight") {
      if (body.id) {
        const idx = store.insights.findIndex((i) => i.id === body.id);
        if (idx === -1) return NextResponse.json({ error: "Insight not found" }, { status: 404 });
        store.insights[idx] = {
          ...store.insights[idx],
          title: String(body.title ?? store.insights[idx].title),
          excerpt: String(body.excerpt ?? store.insights[idx].excerpt),
          body: Array.isArray(body.body) ? body.body : store.insights[idx].body,
          status: targetStatus,
          checklist,
          approvedBy: targetStatus === "published" ? user.name : store.insights[idx].approvedBy,
        };
        appendAuditLog(store, {
          who: user.name,
          role: user.role,
          action: targetStatus === "published" ? "PUBLISH" : "SAVE_DRAFT",
          entity: `Insight: ${store.insights[idx].title}`,
          details: `Updated insight (${targetStatus}).`,
        });
      } else {
        const title = String(body.title || "Untitled Insight").trim();
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        const author = store.advocates.find((a) => a.id === body.authorId) || store.advocates[0];
        store.insights.unshift({
          id: `ins-${Date.now()}`,
          title,
          slug: `${slug}-${Date.now().toString().slice(-4)}`,
          authorId: author.id,
          authorName: author.name,
          authorProfession: "Advocate of the High Court of Kenya",
          areaTags: Array.isArray(body.areaTags) && body.areaTags.length > 0 ? body.areaTags : ["land-property-conveyancing"],
          excerpt: String(body.excerpt || ""),
          body: Array.isArray(body.body) ? body.body : [String(body.excerpt || "")],
          readingTimeMinutes: 3,
          publishedAt: nowIso.slice(0, 10),
          status: targetStatus,
          checklist,
          approvedBy: targetStatus === "published" ? user.name : undefined,
        });
        appendAuditLog(store, {
          who: user.name,
          role: user.role,
          action: targetStatus === "published" ? "PUBLISH" : "SAVE_DRAFT",
          entity: `Insight: ${title}`,
          details: `Created new insight (${targetStatus}).`,
        });
      }
    } else if (entityType === "career") {
      if (body.id) {
        const idx = store.careers.findIndex((c) => c.id === body.id);
        if (idx !== -1) {
          store.careers[idx].isOpen = Boolean(body.isOpen);
          appendAuditLog(store, {
            who: user.name,
            role: user.role,
            action: "CAREER_UPDATE",
            entity: store.careers[idx].title,
            details: `Set opening status to ${store.careers[idx].isOpen ? "Open" : "Closed"}.`,
          });
        }
      } else if (body.title) {
        store.careers.unshift({
          id: `car-${Date.now()}`,
          title: String(body.title),
          type: body.type || "Pupillage",
          location: "Gate House, Nakuru",
          summary: String(body.summary || ""),
          requirements: Array.isArray(body.requirements) ? body.requirements : [],
          closingDate: String(body.closingDate || "2027-02-28"),
          isOpen: true,
        });
        appendAuditLog(store, {
          who: user.name,
          role: user.role,
          action: "CAREER_CREATE",
          entity: String(body.title),
          details: "Added new career/pupillage opening.",
        });
      }
    } else {
      return NextResponse.json({ error: "Unsupported entityType" }, { status: 400 });
    }

    writeStore(store);
    return NextResponse.json({ ok: true, store, findings });
  } catch {
    return NextResponse.json({ error: "Invalid CMS request" }, { status: 400 });
  }
}
