# Last Minute Media Deals

A lead generation and CRM web app for a media buying agency. Built with Next.js, Convex, Tailwind CSS, and Framer Motion.

## Stack

- **Next.js 15** (App Router)
- **Convex** — real-time backend, database, and serverless functions
- **Tailwind CSS** — styling
- **Framer Motion** — quiz step animations
- **@hello-pangea/dnd** — drag-and-drop Kanban board

## Features

- **Quiz Funnel** (`/`) — multi-step lead capture form (interests, cadence, location, budget, booking + contact info). Saves leads to Convex on completion.
- **Admin CRM** (`/admin`) — Kanban board to manage leads through stages: New Lead → Contacted → Proposal Sent → Closed Won / Closed Lost.
- **Lightweight Auth** — email + 6-digit OTP login. Allowed users are managed via the `allowed_users` table in Convex (no third-party auth provider).

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start Convex (keep this terminal running)

```bash
npx convex dev
```

This will prompt you to log in, create a project, and will auto-generate your `.env.local` with `NEXT_PUBLIC_CONVEX_URL`.

### 3. Start the Next.js dev server (second terminal)

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Adding Admin Users

In the [Convex dashboard](https://dashboard.convex.dev), open your project → **Data** → `allowed_users` table and insert a document:

```json
{ "email": "you@example.com" }
```

That email can then log in at `/admin`.

## Project Structure

```
app/
  page.tsx              # Quiz funnel (public)
  admin/
    page.tsx            # Admin entry point (auth guard)
    AdminDashboard.tsx  # CRM dashboard (Convex data + Kanban glue)
    login/page.tsx      # Email + OTP login
  api/auth/             # API routes for OTP send/verify
components/
  quiz/                 # Multi-step quiz funnel components
  ui/kanban/            # Generic, reusable Kanban board component
convex/
  schema.ts             # Database schema (leads, allowed_users, otp_codes)
  leads.ts              # Lead queries & mutations
  auth.ts               # OTP generation & verification
public/
  logo-light.png        # Brand logo
```
