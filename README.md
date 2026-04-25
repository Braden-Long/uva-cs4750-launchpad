# Launchpad

A visual job application tracker built for UVA CS 4750. Replaces the typical spreadsheet with a dashboard and Kanban board backed by a MySQL database.

## Running Locally

Requires a `.env.local` file with valid database credentials and a JWT secret. Must be on the UVA VPN to reach the database host.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

### Authentication

Users register with a username and password. Passwords are hashed with bcrypt. Sessions are stored as HTTP-only JWT cookies. All routes require a valid session.

### Dashboard

The default view shows:

- **Summary cards** -- total applications, response rate, pending interviews, and active offers
- **Weekly activity chart** -- bar chart of applications submitted per week over the past 9 weeks (Saved applications are excluded)
- **Pipeline breakdown** -- per-status counts as proportion bars
- **Recent activity** -- the five most recently applied-to positions

All stats are computed from live database queries.

### Kanban Board

The Status Board view shows applications as draggable cards grouped by status (Saved, Applied, Interviewing, Offer, Rejected). Cards can be dragged between columns to update their status. The board supports search and sort by date, salary, or company name.

### Add / Edit Applications

The form accepts company name, job title, URL, salary, status, date applied, notes, and tags. The date field accepts manual MM/DD/YYYY entry with auto-inserted slashes, or a calendar picker. The date field is disabled when status is Saved, since no application date exists yet.

### Data Management

The settings panel supports CSV export (from the database), CSV import, and a full data wipe.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- MySQL via mysql2, hosted at mysql01.cs.virginia.edu
- JWT authentication via jose, bcrypt via bcryptjs
- Lucide React (icons)
