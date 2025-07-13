# Copilot Instructions for nomremzade.az

## Project Overview
- **Platform:** Next.js (App Router), React, TypeScript
- **Purpose:** Phone number trading platform for Azerbaijan
- **Key Features:** Premium/Gold/Standard ad system, secure database, user session management, responsive design

## Architecture & Data Flow
- **Pages:** Located in `src/app/` (e.g., `numbers`, `register`, `login`, `post-ad`)
- **Components:** Shared UI and layout in `src/components/`
- **Data:** JSON files in `public/data/` for phone numbers; loaded via fetch in components
- **Database:** Logic in `src/lib/database.ts` (encrypted local storage, Secure Database class)
- **Session/Auth:** Registration/login flows in `src/app/register` and `src/app/login`; session state managed in components and local storage

## Developer Workflow
- **Start Dev Server:** `npm run dev`
- **Build:** `npm run build`
- **Start Production:** `npm run start`
- **Dependencies:** `npm install`
- **Environment:** Set up `.env.local` with `NEXT_PUBLIC_BASE_URL` and `DATABASE_ENCRYPTION_KEY`

## Patterns & Conventions
- **Ad Types:** Premium, Gold, Standard (see `src/app/post-ad/`)
- **Component Props:** Use explicit props for filtering, searching, and rendering ad lists (see `PhonePageTemplate.tsx`, `NumbersPageTemplate.tsx`)
- **Data Loading:** Always fetch JSON from `/data/` using the config array pattern (see `dataFiles` prop)
- **Filtering/Search:** Use controlled inputs and memoized filtering logic for search and prefix/provider selection
- **Security:** Always encrypt user and ad data; validate and sanitize all form inputs
- **Responsive Design:** Use shared CSS and mobile/desktop templates; see `PhonePageTemplate.tsx` and `NumbersPageTemplate.tsx`

## Integration Points
- **External:** No external API calls; all data is local or in public/data/
- **Icons:** Use `lucide-react` for UI icons
- **Session:** LocalStorage for session and user data

## Key Files & Directories
- `src/app/numbers/` — Main ad listing pages
- `src/components/PhonePageTemplate/PhonePageTemplate.tsx` — Mobile ad list logic
- `src/components/NumbersPageTemplate/NumbersPageTemplate.tsx` — Desktop ad list logic
- `public/data/` — JSON data files for ads
- `src/lib/database.ts` — Secure database logic
- `src/app/register/`, `src/app/login/` — Auth flows

## Example: Loading and Filtering Ads
```tsx
const dataFiles = [
  { file: '060.json', key: 'naxtelAds', provider: 'Naxtel', prefix: '060' }
];
<PhonePageTemplate dataFiles={dataFiles} showProviderFilter={false} />
```

## Tips for AI Agents
- Always use the config array pattern for loading ads
- Follow the explicit prop conventions for all components
- Reference `README.md` for build and environment setup
- Use encrypted local storage for all sensitive data
- Validate and sanitize all user input

---
If any section is unclear or missing, ask the user for clarification or examples from their workflow.
