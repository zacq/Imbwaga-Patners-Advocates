import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/store";
import type { ChannelClickEvent } from "@/lib/types";

const ALLOWED_CHANNELS = new Set([
  "whatsapp_click",
  "call_click",
  "practice_page_view",
  "insight_read",
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const channel = String(body?.channel || "");
    if (!ALLOWED_CHANNELS.has(channel)) {
      return NextResponse.json({ error: "Invalid event channel" }, { status: 400 });
    }

    const store = readStore();
    const event: ChannelClickEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      channel: channel as ChannelClickEvent["channel"],
      page: String(body?.page || "/").slice(0, 120),
      areaSlug: body?.areaSlug ? String(body.areaSlug).slice(0, 80) : undefined,
      createdAt: new Date().toISOString(),
    };
    store.channelEvents.unshift(event);
    if (store.channelEvents.length > 2000) {
      store.channelEvents = store.channelEvents.slice(0, 2000);
    }
    writeStore(store);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
