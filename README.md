# Launchpad

A visual job application tracker built to replace the typical spreadsheet. Launchpad gives job-seekers a dashboard and Kanban board so they can see where every application stands at a glance.

## Running Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## What You'll See

### Dashboard (default view)

The landing page is a "command center" that answers the questions a job-seeker checks every day:

- **Summary cards** -- total applications, response rate, number of pending interviews, and active offers. These give an instant pulse-check without scrolling through rows.
- **Weekly activity chart** -- a bar chart showing how many applications were sent each day of the week, so you can spot patterns in your momentum.
- **Pipeline breakdown** -- progress bars for each status (Saved, Applied, Interviewing, Offer, Rejected) showing how your applications are distributed across the funnel.
- **Recent activity** -- the five most recently updated applications with their status badges, so you always know what changed last.

### Kanban Board

Switch to the **Status Board** tab to see applications laid out as cards in status columns:

- **Columns** represent each stage: Saved, Applied, Interviewing, Offer, and Rejected.
- **Cards** show the company name, job title, date applied, expected salary, and tags (Remote/Hybrid/On-site, tech stack).
- **Drag and drop** a card between columns to update its status.
- **Search** filters cards by company or title. **Sort** reorders them by date, salary, or company name.

### Add Application

The **Add Job** button opens a form where you enter the company, title, URL, salary range, status, and notes. There's also an "Auto-fill from URL" button that simulates pulling job details from a posting link.

### Data Management

The gear icon opens a settings panel with:

- **Export** -- download your data as CSV or JSON.
- **Import** -- buttons for importing from a CSV file or LinkedIn (visual placeholders for now).
- **Delete All Data** -- clears everything, with a confirmation prompt.

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Lucide React (icons)
- Hardcoded mock data (no database yet)
