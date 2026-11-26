import { NextRequest, NextResponse } from "next/server";
import { STAFF_USERS } from "@/lib/seed";
import { readStore, writeStore, appendAuditLog } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const pin = String(body?.pin || "").trim();

    const user = STAFF_USERS.find((u) => u.email.toLowerCase() === email);
    if (!user || user.pinCode !== pin) {
      return NextResponse.json(
        { error: "Invalid staff email or 2FA verification PIN." },
        { status: 401 }
      );
    }

    const store = readStore();
    appendAuditLog(store, {
      who: user.name,
      role: user.role,
      action: "LOGIN_2FA",
      entity: "AdminSession",
      details: `Authenticated via 2FA PIN as ${user.role}.`,
    });
    writeStore(store);

    const sessionPayload = Buffer.from(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
      })
    ).toString("base64url");

    const res = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
      },
    });
    res.cookies.set("iyp_staff_session", sessionPayload, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Authentication error" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("iyp_staff_session")?.value;
  if (!cookie) {
    return NextResponse.json({ user: null });
  }
  try {
    const parsed = JSON.parse(Buffer.from(cookie, "base64url").toString("utf8"));
    return NextResponse.json({ user: parsed });
  } catch {
    return NextResponse.json({ user: null });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("iyp_staff_session");
  return res;
}
