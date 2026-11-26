export type StaffRole = "Partner" | "Associate" | "Office";

export type PublishStatus = "published" | "draft";

export interface ComplianceChecklist {
  noClientNames: boolean;
  noAdvocatePhotos: boolean;
  noOutcomePromises: boolean;
  noSuperlatives: boolean;
  noPreAdmission: boolean;
  factsVerified: boolean;
}

export interface Advocate {
  id: string;
  slug: string;
  name: string;
  role: "Partner" | "Associate";
  admissionDate: string;
  qualifications: string[];
  memberships: string[];
  publications: string[];
  areas: string[]; // practice area slugs
  monogram: string;
  bioNote: string;
  status: PublishStatus;
  checklist?: ComplianceChecklist;
  approvedBy?: string;
  updatedAt: string;
}

export interface PracticeArea {
  id: string;
  number: number;
  name: string;
  slug: string;
  summary: string;
  whoFor: string;
  matters: string[];
  processSteps: string[];
  documents: string[];
  seoTitle: string;
  metaDescription: string;
  primarySearchTarget: string;
  status: PublishStatus;
  checklist?: ComplianceChecklist;
  approvedBy?: string;
  updatedAt: string;
}

export interface Insight {
  id: string;
  title: string;
  slug: string;
  authorId: string;
  authorName: string;
  authorProfession: string;
  areaTags: string[]; // practice area slugs
  excerpt: string;
  body: string[]; // paragraphs
  readingTimeMinutes: number;
  publishedAt: string;
  status: PublishStatus;
  checklist?: ComplianceChecklist;
  approvedBy?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  areaSlug: string; // "general" or a practice area slug
  status: PublishStatus;
}

export interface CareerOpening {
  id: string;
  title: string;
  type: "Pupillage" | "Internship" | "Advocate" | "Support";
  location: string;
  summary: string;
  requirements: string[];
  closingDate: string;
  isOpen: boolean;
}

export type EnquiryType = "consultation" | "enquiry" | "career";

export type EnquiryStatus =
  | "New"
  | "Conflict check"
  | "Consultation offered"
  | "Confirmed"
  | "Held"
  | "Engaged"
  | "Not engaged"
  | "Declined";

export interface EnquiryNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  reference: string;
  type: EnquiryType;
  clientName: string;
  phone: string;
  email?: string;
  areaSlug: string;
  areaName: string;
  preferredAdvocateSlug?: string;
  otherParty?: string;
  summary: string;
  preferredSlots: [string, string];
  mode?: "In-person (Gate House, Nakuru)" | "Virtual (Phone / Video)";
  sourcePage: string;
  consent: boolean;
  status: EnquiryStatus;
  assignedAdvocateId?: string;
  assignedAdvocateName?: string;
  notes: EnquiryNote[];
  // Career specific
  openingId?: string;
  openingTitle?: string;
  cvFileName?: string;
  cvSizeLabel?: string;
  createdAt: string;
  firstResponseAt?: string;
}

export interface MessageLog {
  id: string;
  enquiryId: string;
  enquiryReference: string;
  channel: "Email" | "SMS" | "WhatsApp";
  template: string;
  recipient: string;
  preview: string;
  sentAt: string;
}

export interface ChannelClickEvent {
  id: string;
  channel: "whatsapp_click" | "call_click" | "practice_page_view" | "insight_read";
  page: string;
  areaSlug?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  who: string;
  role: StaffRole;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
}

export interface FirmPageContent {
  heroHeadline: string;
  heroSubline: string;
  aboutIntro: string;
  aboutValues: { title: string; description: string }[];
  firmBackground: string;
  hours: string;
  languages: string;
  retentionMonths: number;
  approvedBy: string;
  updatedAt: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  title: string;
  pinCode: string; // 2FA verification PIN for demo/sandbox
}

export interface SiteStore {
  firm: FirmPageContent;
  advocates: Advocate[];
  practiceAreas: PracticeArea[];
  insights: Insight[];
  faqs: FAQ[];
  careers: CareerOpening[];
  enquiries: Enquiry[];
  messages: MessageLog[];
  channelEvents: ChannelClickEvent[];
  auditLogs: AuditLogEntry[];
}
