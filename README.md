# Launchpad

A visual job application tracker built for UVA CS 4750. Replaces the typical spreadsheet with a dashboard and Kanban board backed by a MySQL database.

## Running Locally

Requires a `.env.local` file with valid database credentials and a JWT secret:

```
DB_HOST=<cloud-sql-ip>
DB_USER=<db-user>
DB_PASSWORD=<db-password>
DB_NAME=launchpad-db
JWT_SECRET=<your-secret>
```

`JWT_SECRET` must be at least 32 characters. It is required — there is no
built-in default, and signing or verifying a session throws if it is unset, so
the same variable must be set on the Cloud Run service (see Deployment below).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

The app is no longer hosted — the Cloud Run deployment and its Cloud SQL
database have been torn down, so there is no live instance to visit.

It was containerized with Docker and deployed to Google Cloud Run, with the
database on Google Cloud SQL (MySQL 8.0) in the `us-east4` region. The steps
below are kept for reference if it is ever stood back up:

```bash
# 1. Build the image for linux/amd64 (required for Cloud Run)
docker build --platform linux/amd64 -t us-east4-docker.pkg.dev/<project-id>/cloud-run-source-deploy/launchpad:latest .

# 2. Push to Artifact Registry
docker push us-east4-docker.pkg.dev/<project-id>/cloud-run-source-deploy/launchpad:latest

# 3. Deploy to Cloud Run
gcloud run deploy launchpad \
  --image us-east4-docker.pkg.dev/<project-id>/cloud-run-source-deploy/launchpad:latest \
  --region us-east4 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "DB_HOST=...,DB_USER=...,DB_PASSWORD=...,DB_NAME=launchpad-db,JWT_SECRET=..."
```

## Features

### Authentication

Users register with a username, password, first name, and last name. Passwords are hashed with bcrypt. Sessions are stored as HTTP-only JWT cookies. All routes require a valid session.

### Dashboard

The default view shows:

- **Summary cards** — total applications, response rate, pending interviews, and active offers
- **Weekly activity chart** — bar chart of applications submitted per week over the past 9 weeks (Saved applications are excluded)
- **Pipeline breakdown** — per-status counts as proportion bars
- **Recent activity** — the five most recently applied-to positions

All stats are computed from live database queries.

### Kanban Board

The Status Board view shows applications as draggable cards grouped by status (Saved, Applied, Interviewing, Offer, Rejected). Cards can be dragged between columns to update their status. The board supports search and sort by date, salary, or company name.

### Add / Edit Applications

The form accepts:
- Company name, job title, job URL, salary expectation, status, date applied, notes, and tags
- **Job type** — Internship (with duration in months) or Full-time (with equity and sign-on bonus)
- **Documents** — attach document records (title and type) to an application; documents can be added or removed

The date field is disabled when status is Saved, since no application date exists yet.

### Data Management

The settings panel supports:
- **CSV export** — exports all applications including tags and job URL
- **CSV import** — imports from a CSV with columns: Company, Title, Status, Date Applied, Salary, Notes, Tags (pipe-separated), Job URL
- **Delete all data** — wipes all application data for the current user

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- MySQL 8.0 via mysql2/promise, hosted on Google Cloud SQL
- JWT authentication via jose, password hashing via bcryptjs
- Lucide React (icons)
