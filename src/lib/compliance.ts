import type { ComplianceChecklist } from "./types";

export interface ComplianceFinding {
  term: string;
  rule: string;
  reason: string;
}

const PROHIBITED_PATTERNS: {
  pattern: RegExp;
  label: string;
  rule: string;
  reason: string;
}[] = [
  {
    pattern: /\b(best|leading|top[- ]rated|no\.?\s*1|number\s+one|premier|finest|unmatched|unrivalled)\b/gi,
    label: "Superlative / comparative claim",
    rule: "Rule 4 (Legal Notice 42 of 2014)",
    reason: "Advertising must be objective and dignified without superlatives or comparisons.",
  },
  {
    pattern: /\b(specialist|specialists|expert|experts|expertise\s+guaranteed)\b/gi,
    label: "Unregistered specialist/expert claim",
    rule: "Rule 6 (Legal Notice 42 of 2014)",
    reason: "Do not describe an advocate or firm as a 'specialist' or 'expert' unless on the LSK specialist register.",
  },
  {
    pattern: /\b(free\s+consultation|complimentary\s+consultation|no\s+win\s+no\s+fee|discount|discounted\s+fees)\b/gi,
    label: "Fee inducement / free consultation",
    rule: "Rule 2 & Rule 5(2)(d)",
    reason: "No 'free consultation' offers, fee waivers, or inducements calculated to unfairly attract business.",
  },
  {
    pattern: /\b(we\s+win|guaranteed\s+win|guaranteed\s+outcome|success\s+rate|100%\s+success|assured\s+victory)\b/gi,
    label: "Outcome promise",
    rule: "Rule 5(2)(d)",
    reason: "Do not promise a particular outcome or publish win/success rates.",
  },
];

export function scanTextForCompliance(text: string): ComplianceFinding[] {
  if (!text.trim()) return [];
  const findings: ComplianceFinding[] = [];
  const seen = new Set<string>();

  for (const item of PROHIBITED_PATTERNS) {
    const matches = text.match(item.pattern);
    if (matches) {
      for (const match of matches) {
        const key = `${item.rule}:${match.toLowerCase()}`;
        if (!seen.has(key)) {
          seen.add(key);
          findings.push({
            term: match,
            rule: `${item.label} — ${item.rule}`,
            reason: item.reason,
          });
        }
      }
    }
  }
  return findings;
}

export function isChecklistComplete(checklist?: Partial<ComplianceChecklist>): boolean {
  if (!checklist) return false;
  return Boolean(
    checklist.noClientNames &&
      checklist.noAdvocatePhotos &&
      checklist.noOutcomePromises &&
      checklist.noSuperlatives &&
      checklist.noPreAdmission &&
      checklist.factsVerified
  );
}

export const COMPLIANCE_CHECKLIST_ITEMS: {
  key: keyof ComplianceChecklist;
  label: string;
  rule: string;
}[] = [
  {
    key: "noClientNames",
    label: "No client names, logos, or identifying case details appear in this content.",
    rule: "Rule 5(2)(a)",
  },
  {
    key: "noAdvocatePhotos",
    label: "No photographs of advocates, partners, or employed advocates are included.",
    rule: "Rule 5(2)(b)",
  },
  {
    key: "noOutcomePromises",
    label: "No outcome promises, success rates, 'free consultation', or fee waiver claims.",
    rule: "Rule 2 & Rule 5(2)(d)",
  },
  {
    key: "noSuperlatives",
    label: "Language is objective and factual with no superlatives or unregistered 'specialist'/'expert' claims.",
    rule: "Rule 4 & Rule 6",
  },
  {
    key: "noPreAdmission",
    label: "Any profile details list post-admission roles and verified qualifications only.",
    rule: "Rule 5(1) & 5(2)(c)",
  },
  {
    key: "factsVerified",
    label: "All facts, dates, and statutory references have been verified by the approving Partner.",
    rule: "Rule 10(d)",
  },
];

export const SITE_DISCLAIMER =
  "Information on this website is provided for general informational purposes only and does not constitute legal advice. Submitting an enquiry, requesting a consultation, or contacting the firm through this website does not create an advocate–client relationship until the firm confirms engagement in writing following a conflict check.";

export const FIRM_CONTACT = {
  name: "Imbwaga, Yogo & Partners Advocates",
  shortName: "Imbwaga, Yogo & Partners",
  domain: "iypadvocates.com",
  address: "Gate House, 6th Floor, Suite 603, Mburu Gichua Road, Nakuru",
  city: "Nakuru, Kenya",
  phoneDisplay: "+254 726 111 198",
  phoneHref: "tel:+254726111198",
  whatsappNumber: "254726111198",
  email: "info@iypadvocates.com",
  hours: "Mon – Fri: 8:00 AM – 5:00 PM | Sat: 9:00 AM – 1:00 PM",
  languages: "English, Kiswahili",
  foundedYear: "2017",
};

export function buildWhatsAppUrl(areaName?: string): string {
  const text = areaName
    ? `Hello Imbwaga, Yogo & Partners Advocates, I would like to request a confidential consultation regarding ${areaName}.`
    : "Hello Imbwaga, Yogo & Partners Advocates, I would like to make a confidential enquiry.";
  return `https://wa.me/${FIRM_CONTACT.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
