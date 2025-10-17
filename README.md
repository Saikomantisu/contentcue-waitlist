## ContentCue Waitlist

Minimal waitlist site built with Astro. Submissions are appended to a Google Sheet via an Astro Server Action. Country is inferred from the submitter's IP using `ipapi.co`.

### Tech stack

- **Framework**: Astro (server output, Vercel adapter)
- **Styling**: Tailwind CSS v4 and Starwind UI components
- **Icons**: Lucide/Tabler
- **Data**: Google Sheets API (via `googleapis`), Google Auth Library

---

### Quick start

1. Install dependencies

```sh
pnpm install
```

2. Create `.env` in the project root

```ini
SHEET_ID=your_google_sheet_id
# Optional if not using Application Default Credentials:
# GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
```

3. Run the dev server

```sh
pnpm dev
```

The site runs at `http://localhost:4321` by default.

---

### Google Sheets setup

- Create a Google Sheet and note its ID (the value between `/d/` and `/edit` in the URL).
- Share the sheet with the service account email (if using a service account) with Editor access.
- The action appends to `Sheet1!A2` with columns: `email`, `timestamp`, `country`.

Authentication options (pick one):

- Application Default Credentials (ADC) on your machine. For local dev with a service account, set `GOOGLE_APPLICATION_CREDENTIALS` to the JSON key path.
- Any other ADC-supported method (e.g., `gcloud auth application-default login`).

---

### Environment variables

Defined with `import.meta.env` in Astro:

- `SHEET_ID` (required): Target Google Sheet ID.
- `GOOGLE_APPLICATION_CREDENTIALS` (optional locally): Path to service account key when not using other ADC methods.

On Vercel, add these in Project Settings → Environment Variables.

---

### Deployment

This project uses the Vercel adapter and server output.

Build and preview locally:

```sh
pnpm build && pnpm preview
```

Deploy on Vercel:

- Push the repo to Git
- Import into Vercel
- Set `SHEET_ID` (and credentials if needed)
- Deploy

---

### Key files

- `src/pages/index.astro`: Landing page and waitlist form
- `src/actions/index.ts`: `server.addNewWaitlist` action that appends to Sheets and enriches with country
- `astro.config.mjs`: Vercel adapter, Tailwind Vite plugin, server output
- `src/components/` and `src/components/starwind/`: UI components

---

### Server Action: addNewWaitlist

Input: `{ email: string }` (validated as a proper email).
Behavior:

- Appends `[email, ISO timestamp, country?]` to the Google Sheet
- Enriches by calling `https://ipapi.co/json/` to resolve country name
  Returns:
- `{ success: true }` on success
- `{ success: false, error: string }` on failure

---

### Troubleshooting

- Missing `SHEET_ID`: Set it in `.env` or Vercel.
- Google API auth errors: Ensure ADC is configured or `GOOGLE_APPLICATION_CREDENTIALS` points to a valid service account key with Sheets scope. Also share the sheet with the service account email.
- Non-200 append response: Check the sheet ID, range, and service account permissions.
- Country missing: `ipapi.co` may not return a country for some IPs; submission still succeeds.

---

### Scripts

```text
pnpm dev       # Start dev server
pnpm build     # Build for production
pnpm preview   # Preview production build
pnpm astro ... # Run Astro CLI commands
```
