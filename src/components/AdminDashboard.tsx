"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { APPROVED_IMAGES } from "@/lib/images";
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Download,
  Trash2,
  LogOut,
  Inbox,
  FileEdit,
  BarChart3,
  History,
  MessageSquare,
  CheckCircle2,
  Lock,
} from "lucide-react";
import type {
  SiteStore,
  StaffRole,
  Enquiry,
  EnquiryStatus,
  ComplianceChecklist,
  PublishStatus,
} from "@/lib/types";
import {
  COMPLIANCE_CHECKLIST_ITEMS,
  scanTextForCompliance,
  isChecklistComplete,
} from "@/lib/compliance";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  title: string;
}

interface EnrichedEnquiry extends Enquiry {
  overdue: boolean;
  conflictHints: string[];
}

const STATUS_OPTIONS: EnquiryStatus[] = [
  "New",
  "Conflict check",
  "Consultation offered",
  "Confirmed",
  "Held",
  "Engaged",
  "Not engaged",
  "Declined",
];

const EMPTY_CHECKLIST: ComplianceChecklist = {
  noClientNames: false,
  noAdvocatePhotos: false,
  noOutcomePromises: false,
  noSuperlatives: false,
  noPreAdmission: false,
  factsVerified: false,
};

export function AdminDashboard() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("grace@iypadvocates.com");
  const [loginPin, setLoginPin] = useState("2017");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin state
  const [tab, setTab] = useState<"inbox" | "cms" | "reporting" | "audit">("inbox");
  const [store, setStore] = useState<SiteStore | null>(null);
  const [enquiries, setEnquiries] = useState<EnrichedEnquiry[]>([]);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [noteText, setNoteText] = useState("");
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // CMS Editor state
  const [cmsSection, setCmsSection] = useState<"areas" | "advocates" | "insights" | "careers">(
    "areas"
  );
  const [selectedAreaId, setSelectedAreaId] = useState<string>("pa-1");
  const [areaSummary, setAreaSummary] = useState("");
  const [areaWhoFor, setAreaWhoFor] = useState("");
  const [selectedAdvId, setSelectedAdvId] = useState<string>("adv-1");
  const [advName, setAdvName] = useState("");
  const [advAdmission, setAdvAdmission] = useState("");
  const [advBio, setAdvBio] = useState("");

  const [newInsightTitle, setNewInsightTitle] = useState("");
  const [newInsightExcerpt, setNewInsightExcerpt] = useState("");
  const [newInsightBody, setNewInsightBody] = useState("");
  const [newInsightAuthor, setNewInsightAuthor] = useState("adv-1");
  const [newInsightArea, setNewInsightArea] = useState("land-property-conveyancing");

  const [checklist, setChecklist] = useState<ComplianceChecklist>({ ...EMPTY_CHECKLIST });
  const [cmsError, setCmsError] = useState<string | null>(null);
  const [cmsSuccess, setCmsSuccess] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const [cmsRes, inbRes] = await Promise.all([
      fetch("/api/cms"),
      fetch("/api/enquiries"),
    ]);
    if (cmsRes.ok) {
      const cmsData = await cmsRes.json();
      setStore(cmsData.store);
      const firstArea = cmsData.store.practiceAreas[0];
      if (firstArea) {
        setSelectedAreaId(firstArea.id);
        setAreaSummary(firstArea.summary);
        setAreaWhoFor(firstArea.whoFor);
      }
      const firstAdv = cmsData.store.advocates[0];
      if (firstAdv) {
        setSelectedAdvId(firstAdv.id);
        setAdvName(firstAdv.name);
        setAdvAdmission(firstAdv.admissionDate);
        setAdvBio(firstAdv.bioNote);
      }
    }
    if (inbRes.ok) {
      const inbData = await inbRes.json();
      setEnquiries(inbData.enquiries);
      if (inbData.enquiries.length > 0 && !selectedEnquiryId) {
        setSelectedEnquiryId(inbData.enquiries[0].id);
      }
    }
  }, [selectedEnquiryId]);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          loadData();
        }
      })
      .finally(() => setLoadingAuth(false));
  }, [loadData]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, pin: loginPin }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoginError(data.error || "Login failed");
    } else {
      setUser(data.user);
      loadData();
    }
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    setUser(null);
    setStore(null);
  }

  const selectedEnquiry = useMemo(
    () => enquiries.find((e) => e.id === selectedEnquiryId) || enquiries[0] || null,
    [enquiries, selectedEnquiryId]
  );

  const filteredEnquiries = useMemo(
    () =>
      statusFilter === "all"
        ? enquiries
        : enquiries.filter((e) => e.status === statusFilter),
    [enquiries, statusFilter]
  );

  async function updateEnquiry(
    id: string,
    payload: { status?: EnquiryStatus; assignedAdvocateId?: string; note?: string }
  ) {
    setActionMsg(null);
    const res = await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setNoteText("");
      setActionMsg("Enquiry updated and logged.");
      await loadData();
    }
  }

  async function deleteEnquiry(id: string) {
    const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSelectedEnquiryId(null);
      setActionMsg("Enquiry permanently deleted under DPA 2019 request.");
      await loadData();
    }
  }

  const activeScanText = useMemo(() => {
    if (cmsSection === "areas") return `${areaSummary}\n${areaWhoFor}`;
    if (cmsSection === "advocates") return `${advName}\n${advAdmission}\n${advBio}`;
    if (cmsSection === "insights")
      return `${newInsightTitle}\n${newInsightExcerpt}\n${newInsightBody}`;
    return "";
  }, [
    cmsSection,
    areaSummary,
    areaWhoFor,
    advName,
    advAdmission,
    advBio,
    newInsightTitle,
    newInsightExcerpt,
    newInsightBody,
  ]);

  const complianceFindings = useMemo(
    () => scanTextForCompliance(activeScanText),
    [activeScanText]
  );

  async function handleCmsSave(targetStatus: PublishStatus) {
    setCmsError(null);
    setCmsSuccess(null);

    let payload: Record<string, unknown> = {
      status: targetStatus,
      checklist,
      scanText: activeScanText,
    };

    if (cmsSection === "areas") {
      payload = {
        ...payload,
        entityType: "practiceArea",
        id: selectedAreaId,
        summary: areaSummary,
        whoFor: areaWhoFor,
      };
    } else if (cmsSection === "advocates") {
      payload = {
        ...payload,
        entityType: "advocate",
        id: selectedAdvId,
        name: advName,
        admissionDate: advAdmission,
        bioNote: advBio,
      };
    } else if (cmsSection === "insights") {
      if (!newInsightTitle.trim() || !newInsightExcerpt.trim()) {
        setCmsError("Title and excerpt are required for a new insight.");
        return;
      }
      payload = {
        ...payload,
        entityType: "insight",
        title: newInsightTitle,
        excerpt: newInsightExcerpt,
        body: newInsightBody
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean),
        authorId: newInsightAuthor,
        areaTags: [newInsightArea],
      };
    }

    const res = await fetch("/api/cms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setCmsError(data.error || "Could not save content.");
    } else {
      setCmsSuccess(
        targetStatus === "published"
          ? "Published with Partner approval and recorded in Audit Log."
          : "Saved as draft."
      );
      if (cmsSection === "insights") {
        setNewInsightTitle("");
        setNewInsightExcerpt("");
        setNewInsightBody("");
      }
      await loadData();
    }
  }

  // Reporting metrics (RP-1..RP-4)
  const reportStats = useMemo(() => {
    const byArea = new Map<string, number>();
    const byStatus = new Map<string, number>();
    const bySource = new Map<string, number>();
    let totalRespMinutes = 0;
    let respCount = 0;

    for (const e of enquiries) {
      byArea.set(e.areaName, (byArea.get(e.areaName) || 0) + 1);
      byStatus.set(e.status, (byStatus.get(e.status) || 0) + 1);
      bySource.set(e.sourcePage, (bySource.get(e.sourcePage) || 0) + 1);
      if (e.firstResponseAt) {
        const diffMin = Math.max(
          1,
          Math.round(
            (new Date(e.firstResponseAt).getTime() - new Date(e.createdAt).getTime()) /
              60000
          )
        );
        totalRespMinutes += diffMin;
        respCount += 1;
      }
    }

    const events = store?.channelEvents || [];
    const whatsappClicks = events.filter((ev) => ev.channel === "whatsapp_click").length;
    const callClicks = events.filter((ev) => ev.channel === "call_click").length;
    const pageViews = events.filter((ev) => ev.channel === "practice_page_view").length;

    return {
      totalEnquiries: enquiries.length,
      overdueCount: enquiries.filter((e) => e.overdue).length,
      avgResponseMin: respCount > 0 ? Math.round(totalRespMinutes / respCount) : 0,
      whatsappClicks,
      callClicks,
      pageViews,
      byArea: Array.from(byArea.entries()).sort((a, b) => b[1] - a[1]),
      byStatus: Array.from(byStatus.entries()),
      bySource: Array.from(bySource.entries()).sort((a, b) => b[1] - a[1]),
    };
  }, [enquiries, store?.channelEvents]);

  if (loadingAuth) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-[#4A5E6B]">
        Verifying staff session...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-lg border border-[#E4DFD5] bg-white p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6E5525]">
              <Lock className="h-4 w-4" aria-hidden="true" />
              <span>2FA Protected Staff Portal</span>
            </div>
            <h1 className="font-serif text-2xl font-medium text-[#102430]">
              CMS &amp; Enquiry Inbox Sign-In
            </h1>
            <p className="text-xs text-[#4A5E6B]">
              Enquiry inbox and publishing controls require staff authentication and 2FA PIN
              verification (SC-1).
            </p>
          </div>

          {loginError && (
            <div
              role="alert"
              className="rounded border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-900"
            >
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="staff-email" className="block text-xs font-semibold text-[#102430] mb-1">
                Staff Account
              </label>
              <select
                id="staff-email"
                value={loginEmail}
                onChange={(e) => {
                  const val = e.target.value;
                  setLoginEmail(val);
                  setLoginPin(val.includes("grace") || val.includes("samuel") ? "2017" : "1234");
                }}
                className="w-full min-h-[48px] rounded border border-[#D4CEC2] bg-white px-3 text-sm"
              >
                <option value="grace@iypadvocates.com">
                  Grace Imbwaga — Partner (Can Publish)
                </option>
                <option value="samuel@iypadvocates.com">
                  Samuel Yogo — Partner (Can Publish)
                </option>
                <option value="amina@iypadvocates.com">
                  Amina Mwangi — Associate (Draft Only)
                </option>
                <option value="frontoffice@iypadvocates.com">
                  Peter Karanja — Front Office (Inbox &amp; Drafts)
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="staff-pin" className="block text-xs font-semibold text-[#102430] mb-1">
                2FA Verification PIN
              </label>
              <input
                id="staff-pin"
                type="password"
                required
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value)}
                className="w-full min-h-[48px] rounded border border-[#D4CEC2] px-3 text-sm"
              />
              <p className="text-[11px] text-[#5B6D78] mt-1">
                Demo PINs: Partners <code>2017</code> · Associate / Office <code>1234</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] rounded bg-[#102430] text-white text-sm font-semibold hover:bg-[#1B394B]"
            >
              Verify &amp; Open Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Top Staff Bar */}
      <div className="rounded-lg border border-[#E4DFD5] bg-[#102430] text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#D4B475] font-semibold">
            {user.role} Access · {user.role === "Partner" ? "Publishing Enabled (CP-3)" : "Draft & Inbox Only (CP-3)"}
          </p>
          <h1 className="font-serif text-xl sm:text-2xl font-medium">
            IYP Advocates — Practice Admin ({user.name})
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={async () => {
              const res = await fetch("/api/enquiries/export");
              if (!res.ok) return;
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `iyp-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded border border-white/25 text-xs font-semibold hover:bg-white/10"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded bg-[#1B394B] text-xs font-semibold hover:bg-[#24495F]"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E4DFD5] pb-3">
        {[
          { id: "inbox", label: `Enquiry Inbox (${enquiries.length})`, icon: Inbox },
          { id: "cms", label: "CMS & Compliance (CP-1)", icon: FileEdit },
          { id: "reporting", label: "Reporting (RP-1..4)", icon: BarChart3 },
          { id: "audit", label: `Audit Log (${store?.auditLogs.length || 0})`, icon: History },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as typeof tab)}
              className={`inline-flex items-center gap-2 min-h-[44px] px-4 rounded text-xs sm:text-sm font-semibold border ${
                tab === item.id
                  ? "bg-[#102430] text-white border-[#102430]"
                  : "bg-white text-[#3D5260] border-[#E4DFD5] hover:border-[#9A7B3E]"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ENQUIRY INBOX */}
      {tab === "inbox" && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <select
                aria-label="Filter enquiries by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-h-[42px] rounded border border-[#D4CEC2] bg-white px-3 text-xs font-semibold"
              >
                <option value="all">All statuses ({enquiries.length})</option>
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              {reportStats.overdueCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded bg-red-100 text-red-900 px-2.5 py-1 text-xs font-semibold">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {reportStats.overdueCount} Overdue (&gt;1h)
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {filteredEnquiries.map((enq) => {
                const active = selectedEnquiry?.id === enq.id;
                return (
                  <button
                    key={enq.id}
                    type="button"
                    onClick={() => setSelectedEnquiryId(enq.id)}
                    className={`w-full text-left rounded-lg border p-4 transition-colors ${
                      active
                        ? "border-[#102430] bg-white shadow-sm ring-1 ring-[#102430]"
                        : "border-[#E4DFD5] bg-white hover:border-[#9A7B3E]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono font-semibold text-[#6E5525]">
                        {enq.reference} · {enq.type.toUpperCase()}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 font-semibold ${
                          enq.overdue
                            ? "bg-red-100 text-red-900"
                            : enq.status === "Confirmed" || enq.status === "Engaged"
                              ? "bg-emerald-100 text-emerald-900"
                              : "bg-[#FAF8F4] text-[#102430] border border-[#E4DFD5]"
                        }`}
                      >
                        {enq.overdue ? "OVERDUE (>1h)" : enq.status}
                      </span>
                    </div>
                    <p className="font-semibold text-sm text-[#102430] mt-1.5">{enq.clientName}</p>
                    <p className="text-xs text-[#4A5E6B] mt-0.5">{enq.areaName}</p>
                    {enq.otherParty && (
                      <p className="text-[11px] text-[#5B6D78] mt-1">
                        Other party: <strong className="text-[#102430]">{enq.otherParty}</strong>
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            {selectedEnquiry ? (
              <div className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E4DFD5] pb-4">
                  <div>
                    <p className="font-mono text-xs font-semibold text-[#6E5525]">
                      {selectedEnquiry.reference} · Source: {selectedEnquiry.sourcePage}
                    </p>
                    <h2 className="font-serif text-2xl font-medium text-[#102430] mt-1">
                      {selectedEnquiry.clientName}
                    </h2>
                    <p className="text-sm text-[#3D5260] mt-1">
                      {selectedEnquiry.phone}
                      {selectedEnquiry.email ? ` · ${selectedEnquiry.email}` : ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteEnquiry(selectedEnquiry.id)}
                    className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded border border-red-200 text-xs font-semibold text-red-800 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Delete (DPA 2019)
                  </button>
                </div>

                {actionMsg && (
                  <div className="rounded bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-900">
                    {actionMsg}
                  </div>
                )}

                {selectedEnquiry.conflictHints.length > 0 && (
                  <div className="rounded border border-amber-300 bg-amber-50 p-3.5 space-y-1">
                    <p className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                      Possible Conflict Hint Detected
                    </p>
                    {selectedEnquiry.conflictHints.map((hint) => (
                      <p key={hint} className="text-xs text-amber-900">
                        {hint}
                      </p>
                    ))}
                  </div>
                )}

                <dl className="grid gap-3 sm:grid-cols-2 text-sm bg-[#FAF8F4] rounded border border-[#E4DFD5] p-4">
                  <div>
                    <dt className="text-xs font-semibold text-[#5B6D78]">Area of Practice</dt>
                    <dd className="font-medium text-[#102430]">{selectedEnquiry.areaName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-[#5B6D78]">
                      Other Party (Conflict Check)
                    </dt>
                    <dd className="font-semibold text-[#102430]">
                      {selectedEnquiry.otherParty || "None specified"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-[#5B6D78]">Preferred Format</dt>
                    <dd className="text-[#102430]">{selectedEnquiry.mode || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-[#5B6D78]">Preferred Slots</dt>
                    <dd className="text-[#102430]">
                      {selectedEnquiry.preferredSlots.filter(Boolean).join(" / ") || "Flexible"}
                    </dd>
                  </div>
                  {selectedEnquiry.cvFileName && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-semibold text-[#5B6D78]">Career CV Attached</dt>
                      <dd className="text-[#102430]">
                        {selectedEnquiry.cvFileName} ({selectedEnquiry.cvSizeLabel})
                      </dd>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold text-[#5B6D78]">Summary</dt>
                    <dd className="text-[#3D5260] mt-0.5">{selectedEnquiry.summary}</dd>
                  </div>
                </dl>

                {/* Status & Assignment Controls */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#102430] mb-1">
                      Workflow Status (IN-3)
                    </label>
                    <select
                      value={selectedEnquiry.status}
                      onChange={(e) =>
                        updateEnquiry(selectedEnquiry.id, {
                          status: e.target.value as EnquiryStatus,
                        })
                      }
                      className="w-full min-h-[44px] rounded border border-[#D4CEC2] bg-white px-3 text-sm"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#102430] mb-1">
                      Assigned Advocate (IN-4)
                    </label>
                    <select
                      value={selectedEnquiry.assignedAdvocateId || ""}
                      onChange={(e) =>
                        updateEnquiry(selectedEnquiry.id, {
                          assignedAdvocateId: e.target.value,
                        })
                      }
                      className="w-full min-h-[44px] rounded border border-[#D4CEC2] bg-white px-3 text-sm"
                    >
                      <option value="">Unassigned</option>
                      {store?.advocates.map((adv) => (
                        <option key={adv.id} value={adv.id}>
                          {adv.name} ({adv.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#102430]">
                    Internal Conflict &amp; Follow-up Notes
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Record conflict check outcome or call note..."
                      className="flex-1 min-h-[44px] rounded border border-[#D4CEC2] px-3 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateEnquiry(selectedEnquiry.id, { note: noteText })
                      }
                      className="min-h-[44px] px-4 rounded bg-[#102430] text-white text-xs font-semibold"
                    >
                      Add Note
                    </button>
                  </div>

                  {selectedEnquiry.notes.length > 0 && (
                    <ul className="space-y-2 pt-2">
                      {selectedEnquiry.notes.map((n) => (
                        <li
                          key={n.id}
                          className="rounded border border-[#E4DFD5] bg-[#FAF8F4] px-3 py-2 text-xs"
                        >
                          <span className="font-semibold text-[#102430]">{n.author}</span>{" "}
                          <span className="text-[#5B6D78]">
                            ({new Date(n.createdAt).toLocaleString()})
                          </span>
                          : {n.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Automated Client/Staff Messages Log for this enquiry */}
                <div className="space-y-2 border-t border-[#E4DFD5] pt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6E5525] flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                    Automated Messages &amp; Alerts Sent
                  </h3>
                  <div className="space-y-2">
                    {(store?.messages || [])
                      .filter((m) => m.enquiryId === selectedEnquiry.id)
                      .map((m) => (
                        <div
                          key={m.id}
                          className="rounded border border-[#E4DFD5] p-3 text-xs space-y-1"
                        >
                          <div className="flex justify-between font-semibold text-[#102430]">
                            <span>
                              [{m.channel}] {m.template} → {m.recipient}
                            </span>
                            <span className="text-[#5B6D78]">
                              {new Date(m.sentAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-[#3D5260]">{m.preview}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-[#E4DFD5] bg-white p-8 text-center text-sm text-[#4A5E6B]">
                Select an enquiry to view conflict details and manage status.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CMS & COMPLIANCE */}
      {tab === "cms" && store && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-5">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "areas", label: "12 Practice Areas" },
                  { id: "advocates", label: "Advocates (Rule 5(1))" },
                  { id: "insights", label: "New Insight (Rule 8)" },
                ] as const
              ).map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    setCmsSection(sec.id);
                    setCmsError(null);
                    setCmsSuccess(null);
                  }}
                  className={`min-h-[40px] px-3.5 rounded text-xs font-semibold border ${
                    cmsSection === sec.id
                      ? "bg-[#102430] text-white border-[#102430]"
                      : "bg-[#FAF8F4] text-[#3D5260] border-[#E4DFD5]"
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {cmsError && (
              <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-900">
                {cmsError}
              </div>
            )}
            {cmsSuccess && (
              <div className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                {cmsSuccess}
              </div>
            )}

            {cmsSection === "areas" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102430] mb-1">
                    Select Practice Area
                  </label>
                  <select
                    value={selectedAreaId}
                    onChange={(e) => {
                      const next = store.practiceAreas.find((a) => a.id === e.target.value);
                      setSelectedAreaId(e.target.value);
                      if (next) {
                        setAreaSummary(next.summary);
                        setAreaWhoFor(next.whoFor);
                      }
                    }}
                    className="w-full min-h-[44px] rounded border border-[#D4CEC2] bg-white px-3 text-sm"
                  >
                    {store.practiceAreas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.number}. {a.name} ({a.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102430] mb-1">
                    One-sentence factual summary
                  </label>
                  <textarea
                    rows={3}
                    value={areaSummary}
                    onChange={(e) => setAreaSummary(e.target.value)}
                    className="w-full rounded border border-[#D4CEC2] p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102430] mb-1">
                    Who this is for
                  </label>
                  <textarea
                    rows={3}
                    value={areaWhoFor}
                    onChange={(e) => setAreaWhoFor(e.target.value)}
                    className="w-full rounded border border-[#D4CEC2] p-3 text-sm"
                  />
                </div>
              </div>
            )}

            {cmsSection === "advocates" && (
              <div className="space-y-4">
                <div className="rounded border border-[#E4DFD5] bg-[#FAF8F4] p-3 text-xs text-[#3D5260]">
                  <strong>CP-2 Portrait Lock:</strong> Advocate portrait upload is disabled by
                  design under Rule 5(2)(b). Monograms are auto-generated from the advocate&apos;s
                  name.
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102430] mb-1">
                    Select Advocate
                  </label>
                  <select
                    value={selectedAdvId}
                    onChange={(e) => {
                      const adv = store.advocates.find((a) => a.id === e.target.value);
                      setSelectedAdvId(e.target.value);
                      if (adv) {
                        setAdvName(adv.name);
                        setAdvAdmission(adv.admissionDate);
                        setAdvBio(adv.bioNote);
                      }
                    }}
                    className="w-full min-h-[44px] rounded border border-[#D4CEC2] bg-white px-3 text-sm"
                  >
                    {store.advocates.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.role} · {a.monogram})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#102430] mb-1">
                      Full Name (Rule 5(1))
                    </label>
                    <input
                      type="text"
                      value={advName}
                      onChange={(e) => setAdvName(e.target.value)}
                      className="w-full min-h-[44px] rounded border border-[#D4CEC2] px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#102430] mb-1">
                      Date of Admission (Rule 5(1))
                    </label>
                    <input
                      type="text"
                      value={advAdmission}
                      onChange={(e) => setAdvAdmission(e.target.value)}
                      className="w-full min-h-[44px] rounded border border-[#D4CEC2] px-3 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102430] mb-1">
                    Post-admission practice note (No pre-admission roles per Rule 5(2)(c))
                  </label>
                  <textarea
                    rows={3}
                    value={advBio}
                    onChange={(e) => setAdvBio(e.target.value)}
                    className="w-full rounded border border-[#D4CEC2] p-3 text-sm"
                  />
                </div>
              </div>
            )}

            {cmsSection === "insights" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102430] mb-1">
                    Article Title
                  </label>
                  <input
                    type="text"
                    value={newInsightTitle}
                    onChange={(e) => setNewInsightTitle(e.target.value)}
                    placeholder="e.g. Key Documents Needed for Land Control Board Consent"
                    className="w-full min-h-[44px] rounded border border-[#D4CEC2] px-3 text-sm"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#102430] mb-1">
                      Author (Rule 8 attribution)
                    </label>
                    <select
                      value={newInsightAuthor}
                      onChange={(e) => setNewInsightAuthor(e.target.value)}
                      className="w-full min-h-[44px] rounded border border-[#D4CEC2] bg-white px-3 text-sm"
                    >
                      {store.advocates.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#102430] mb-1">
                      Area of Practice Tag
                    </label>
                    <select
                      value={newInsightArea}
                      onChange={(e) => setNewInsightArea(e.target.value)}
                      className="w-full min-h-[44px] rounded border border-[#D4CEC2] bg-white px-3 text-sm"
                    >
                      {store.practiceAreas.map((p) => (
                        <option key={p.slug} value={p.slug}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102430] mb-1">
                    Excerpt
                  </label>
                  <textarea
                    rows={2}
                    value={newInsightExcerpt}
                    onChange={(e) => setNewInsightExcerpt(e.target.value)}
                    className="w-full rounded border border-[#D4CEC2] p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102430] mb-1">
                    Article Body (separate paragraphs with a blank line)
                  </label>
                  <textarea
                    rows={5}
                    value={newInsightBody}
                    onChange={(e) => setNewInsightBody(e.target.value)}
                    className="w-full rounded border border-[#D4CEC2] p-3 text-sm"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2 border-t border-[#E4DFD5]">
              <button
                type="button"
                onClick={() => handleCmsSave("draft")}
                className="min-h-[44px] px-4 rounded border border-[#102430] text-xs font-semibold text-[#102430]"
              >
                Save Draft
              </button>
              <button
                type="button"
                disabled={user.role !== "Partner" || !isChecklistComplete(checklist) || complianceFindings.length > 0}
                onClick={() => handleCmsSave("published")}
                className="min-h-[44px] px-5 rounded bg-[#102430] text-white text-xs font-semibold disabled:opacity-45"
              >
                {user.role === "Partner"
                  ? "Approve Checklist & Publish"
                  : "Partner Role Required to Publish (CP-3)"}
              </button>
            </div>
          </div>

          {/* Right Panel: Live Automated Compliance Scanner + CP-1 Checklist */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#102430]">
                <ShieldCheck className="h-5 w-5 text-[#9A7B3E]" aria-hidden="true" />
                <span>Automated Rules Scanner (LN 42 of 2014)</span>
              </div>
              {complianceFindings.length === 0 ? (
                <p className="text-xs text-[#1B5E3F] bg-[#F1F6F3] border border-[#1B5E3F]/30 rounded p-3">
                  No prohibited superlatives, specialist claims, free-consultation inducements, or
                  outcome promises detected in the current draft.
                </p>
              ) : (
                <div className="space-y-2">
                  {complianceFindings.map((f) => (
                    <div
                      key={`${f.term}-${f.rule}`}
                      className="rounded border border-red-300 bg-red-50 p-3 text-xs text-red-900"
                    >
                      <strong className="block">Flagged: &ldquo;{f.term}&rdquo;</strong>
                      <span>{f.rule}</span>
                      <p className="mt-1">{f.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-3">
              <h3 className="text-sm font-semibold text-[#102430]">
                CP-1 Mandatory Pre-Publish Checklist
              </h3>
              <p className="text-xs text-[#5B6D78]">
                Every item must be confirmed by a Partner before publishing.
              </p>
              <div className="space-y-2.5 pt-1">
                {COMPLIANCE_CHECKLIST_ITEMS.map((item) => (
                  <label key={item.key} className="flex items-start gap-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={checklist[item.key]}
                      onChange={(e) =>
                        setChecklist((prev) => ({ ...prev, [item.key]: e.target.checked }))
                      }
                      className="mt-0.5 h-4 w-4 accent-[#102430]"
                    />
                    <span className="text-[#3D5260]">
                      <strong className="text-[#102430]">{item.rule}:</strong> {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#E4DFD5] bg-white p-6 space-y-3">
              <h3 className="text-sm font-semibold text-[#102430]">
                CP-2 Approved Image Library
              </h3>
              <p className="text-xs text-[#5B6D78]">
                Restricted to Office, Nakuru, and Legal Library categories. Portrait uploads are
                disabled per Rule 5(2)(b).
              </p>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {Object.values(APPROVED_IMAGES).map((img) => (
                  <div
                    key={img.src}
                    className="rounded border border-[#E4DFD5] overflow-hidden bg-[#FAF8F4]"
                  >
                    <div className="relative h-20 w-full">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="180px"
                        className="object-cover"
                      />
                    </div>
                    <p className="px-2 py-1 text-[10px] font-semibold text-[#102430] truncate">
                      {img.category} · {img.src.replace("/images/", "")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REPORTING (RP-1..RP-4) */}
      {tab === "reporting" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-[#E4DFD5] bg-white p-5">
              <p className="text-xs font-semibold text-[#5B6D78]">Total Enquiries &amp; Requests</p>
              <p className="font-serif text-3xl font-semibold text-[#102430] mt-1">
                {reportStats.totalEnquiries}
              </p>
            </div>
            <div className="rounded-lg border border-[#E4DFD5] bg-white p-5">
              <p className="text-xs font-semibold text-[#5B6D78]">Avg First Response Time (RP-3)</p>
              <p className="font-serif text-3xl font-semibold text-[#102430] mt-1">
                {reportStats.avgResponseMin} min
              </p>
              <p className="text-[11px] text-[#5B6D78] mt-1">Target: under 60 min</p>
            </div>
            <div className="rounded-lg border border-[#E4DFD5] bg-white p-5">
              <p className="text-xs font-semibold text-[#5B6D78]">WhatsApp &amp; Call Clicks (RP-1)</p>
              <p className="font-serif text-3xl font-semibold text-[#102430] mt-1">
                {reportStats.whatsappClicks + reportStats.callClicks}
              </p>
              <p className="text-[11px] text-[#5B6D78] mt-1">
                {reportStats.whatsappClicks} WhatsApp · {reportStats.callClicks} Calls
              </p>
            </div>
            <div className="rounded-lg border border-[#E4DFD5] bg-white p-5">
              <p className="text-xs font-semibold text-[#5B6D78]">Practice Page Views</p>
              <p className="font-serif text-3xl font-semibold text-[#102430] mt-1">
                {reportStats.pageViews}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-[#E4DFD5] bg-white p-5 space-y-3">
              <h2 className="font-serif text-lg font-medium text-[#102430]">
                Enquiries by Area (RP-1)
              </h2>
              <ul className="space-y-2 text-xs">
                {reportStats.byArea.map(([area, count]) => (
                  <li key={area} className="flex justify-between border-b border-[#E4DFD5] pb-1.5">
                    <span className="text-[#3D5260]">{area}</span>
                    <strong className="text-[#102430]">{count}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-[#E4DFD5] bg-white p-5 space-y-3">
              <h2 className="font-serif text-lg font-medium text-[#102430]">
                Consultation Funnel (RP-2)
              </h2>
              <ul className="space-y-2 text-xs">
                {reportStats.byStatus.map(([status, count]) => (
                  <li key={status} className="flex justify-between border-b border-[#E4DFD5] pb-1.5">
                    <span className="text-[#3D5260]">{status}</span>
                    <strong className="text-[#102430]">{count}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-[#E4DFD5] bg-white p-5 space-y-3">
              <h2 className="font-serif text-lg font-medium text-[#102430]">
                Top Source Pages (RP-4)
              </h2>
              <ul className="space-y-2 text-xs">
                {reportStats.bySource.map(([src, count]) => (
                  <li key={src} className="flex justify-between border-b border-[#E4DFD5] pb-1.5">
                    <span className="font-mono text-[#3D5260] truncate max-w-[200px]">{src}</span>
                    <strong className="text-[#102430]">{count}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG */}
      {tab === "audit" && store && (
        <div className="rounded-lg border border-[#E4DFD5] bg-white overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F4] border-b border-[#E4DFD5] text-[#102430]">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Staff / Actor</th>
                <th className="p-3">Action</th>
                <th className="p-3">Entity</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DFD5]">
              {store.auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="p-3 whitespace-nowrap text-[#5B6D78]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 font-semibold text-[#102430]">
                    {log.who} ({log.role})
                  </td>
                  <td className="p-3 font-mono text-[#6E5525]">{log.action}</td>
                  <td className="p-3 text-[#102430]">{log.entity}</td>
                  <td className="p-3 text-[#3D5260]">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
