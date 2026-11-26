"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("iyp-cookie-ack", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("iyp-cookie-ack", callback);
  };
}

function getSnapshot(): boolean {
  try {
    return !localStorage.getItem("iyp_cookie_ack");
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function CookieNotice() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie and privacy notice"
      className="fixed bottom-16 md:bottom-4 right-4 left-4 md:left-auto md:max-w-md z-30 rounded-lg border border-[#E4DFD5] bg-white p-4 shadow-lg"
    >
      <p className="text-xs leading-relaxed text-[#3D5260]">
        This website uses essential session cookies and privacy-safe aggregate analytics without
        collecting form contents or personal enquiry details. See our{" "}
        <Link href="/legal#cookies" className="underline font-medium text-[#102430]">
          Cookie &amp; Privacy Notice
        </Link>
        .
      </p>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.setItem("iyp_cookie_ack", "1");
              window.dispatchEvent(new Event("iyp-cookie-ack"));
            } catch {
              // ignore
            }
          }}
          className="min-h-[40px] px-4 rounded bg-[#102430] text-white text-xs font-medium hover:bg-[#1B394B]"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
}
