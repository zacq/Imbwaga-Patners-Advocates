# Imbwaga, Yogo & Partners Advocates (`iypadvocates.com`)

Compliant, mobile-first Next.js App Router website, consultation intake system, and CMS/Enquiry Inbox for **Imbwaga, Yogo & Partners Advocates** (Gate House, 6th Floor, Suite 603, Mburu Gichua Road, Nakuru).

## Key Features

- **LSK Advertising Compliance (Legal Notice 42 of 2014)**:
  - No advocate photographs anywhere (monogram name cards only).
  - No client names, logos, testimonials, outcome claims, `"free consultation"` offers, or superlatives.
  - Built-in CMS pre-publish 6-point checklist (`CP-1`), automated prohibited wording scanner, and Partner-only publishing lock (`CP-3`).
  - Site-wide disclaimer (`CP-4`) and Kenya Data Protection Act, 2019 privacy notice.
- **12 Areas of Practice**: Standardized 8-section pages (`/areas-of-practice/[slug]`) with `LegalService` JSON-LD structured data and SEO metadata.
- **Mobile-First Intake**: Sticky bottom `WhatsApp | Call | Request` bar, 48px+ tap targets, and one-handed consultation request form (`/request-consultation`) capturing conflict-check details (`otherParty`).
- **2FA Staff CMS & Enquiry Inbox (`/admin`)**:
  - Demo Partner login: `grace@iypadvocates.com` / PIN `2017`
  - Demo Associate login (draft-only): `amina@iypadvocates.com` / PIN `1234`
  - Includes conflict-hint detection, >1h overdue flagging, status workflow, CSV export, DPA 2019 deletion, reporting (`RP-1`–`RP-4`), and audit logging.

## Local Development

```bash
npm install
npm run dev
```

## Deploying on Netlify

This repository includes `netlify.toml` configured for Next.js (`npm run build`, `.next` publish directory, Node 22, and security headers).

1. Connect `https://github.com/zacq/Imbwaga-Patners-Advocates.git` in Netlify (`Add new site` -> `Import an existing project`).
2. Netlify will automatically detect Next.js and use `netlify.toml`.
3. Note: Serverless storage in `src/lib/store.ts` automatically falls back to `os.tmpdir()` and in-memory caching when running on Netlify's read-only deployment filesystem. For permanent multi-instance persistence in production, connect a Supabase/Postgres database using the schema in `src/lib/types.ts`.
