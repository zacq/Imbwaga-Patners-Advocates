import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore, formatCsvExport, appendAuditLog } from "@/lib/store";
import type { StaffUser } from "@/lib/types";

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
  const csv = formatCsvExport(store.enquiries);

  appendAuditLog(store, {
    who: user.name,
    role: user.role,
    action: "EXPORT_CSV",
    entity: `Enquiries (${store.enquiries.length} rows)`,
    details: "Exported enquiry inbox to CSV.",
  });
  writeStore(store);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="iyp-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
