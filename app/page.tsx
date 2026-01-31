"use client";

import { useState, useMemo } from "react";
import {
  Rocket,
  Plus,
  Search,
  ArrowUpDown,
  BarChart3,
  Kanban,
  Settings,
  Briefcase,
  TrendingUp,
  Clock,
  CalendarDays,
} from "lucide-react";
import { Application, Status, STATUSES, STATUS_COLORS, initialApplications, currentUser } from "@/lib/mock-data";
import StatusColumn from "@/components/StatusColumn";
import AddApplicationModal from "@/components/AddApplicationModal";
import SettingsPanel from "@/components/SettingsPanel";

type View = "dashboard" | "kanban";
type SortOption = "date" | "salary" | "company";

export default function Home() {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [view, setView] = useState<View>("dashboard");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("date");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Derived data
  const filtered = useMemo(() => {
    let apps = applications;
    if (search) {
      const q = search.toLowerCase();
      apps = apps.filter(
        (a) => a.company_name.toLowerCase().includes(q) || a.job_title.toLowerCase().includes(q)
      );
    }
    return apps.sort((a, b) => {
      if (sort === "salary") return b.salary_expectation - a.salary_expectation;
      if (sort === "company") return a.company_name.localeCompare(b.company_name);
      return new Date(b.date_applied).getTime() - new Date(a.date_applied).getTime();
    });
  }, [applications, search, sort]);

  const byStatus = (status: Status) => filtered.filter((a) => a.status === status);

  // Stats
  const totalApplied = applications.filter((a) => a.status !== "Saved").length;
  const responseRate = totalApplied
    ? Math.round(
        (applications.filter((a) => ["Interviewing", "Offer", "Rejected"].includes(a.status)).length /
          totalApplied) *
          100
      )
    : 0;
  const pendingInterviews = applications.filter((a) => a.status === "Interviewing").length;
  const offers = applications.filter((a) => a.status === "Offer").length;

  // Weekly activity (mock)
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekActivity = [3, 1, 2, 0, 4, 1, 2];
  const maxActivity = Math.max(...weekActivity, 1);

  // Recent activity
  const recent = [...applications]
    .sort((a, b) => new Date(b.date_applied).getTime() - new Date(a.date_applied).getTime())
    .slice(0, 5);

  // Drag handlers
  function onDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("text/plain", id);
  }
  function onDrop(e: React.DragEvent, newStatus: Status) {
    const id = e.dataTransfer.getData("text/plain");
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  }

  function handleAdd(app: Application) {
    setApplications((prev) => [app, ...prev]);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Rocket size={20} className="text-accent" />
            <span className="font-semibold text-base">Launchpad</span>
            <span className="text-xs text-muted ml-1 hidden sm:inline">/ {currentUser.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                view === "dashboard" ? "bg-accent/15 text-accent" : "text-muted hover:text-foreground"
              }`}
            >
              <BarChart3 size={14} />
              Dashboard
            </button>
            <button
              onClick={() => setView("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                view === "kanban" ? "bg-accent/15 text-accent" : "text-muted hover:text-foreground"
              }`}
            >
              <Kanban size={14} />
              Status Board
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 text-muted hover:text-foreground transition-colors"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-md text-xs font-medium transition-colors ml-1"
            >
              <Plus size={14} />
              Add Job
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-6">
        {view === "dashboard" ? (
          /* ===== DASHBOARD VIEW ===== */
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Total Applications", value: applications.length, icon: Briefcase, color: "text-blue-400" },
                { label: "Response Rate", value: `${responseRate}%`, icon: TrendingUp, color: "text-emerald-400" },
                { label: "Pending Interviews", value: pendingInterviews, icon: Clock, color: "text-amber-400" },
                { label: "Active Offers", value: offers, icon: CalendarDays, color: "text-violet-400" },
              ].map((card) => (
                <div key={card.label} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted">{card.label}</span>
                    <card.icon size={16} className={card.color} />
                  </div>
                  <div className="text-2xl font-bold">{card.value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Activity Chart */}
              <div className="col-span-2 bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-4">Applications This Week</h3>
                <div className="flex items-end gap-3 h-32">
                  {weekDays.map((day, i) => (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full relative flex justify-center" style={{ height: 100 }}>
                        <div
                          className="w-8 bg-accent/70 rounded-t-md absolute bottom-0 transition-all"
                          style={{ height: `${(weekActivity[i] / maxActivity) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted">{day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pipeline Breakdown */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-4">Pipeline Breakdown</h3>
                <div className="space-y-3">
                  {STATUSES.map((status) => {
                    const count = applications.filter((a) => a.status === status).length;
                    const pct = applications.length ? (count / applications.length) * 100 : 0;
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${STATUS_COLORS[status]}`}>
                            {status}
                          </span>
                          <span className="text-xs text-muted">{count}</span>
                        </div>
                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent/60 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-4">Recent Activity</h3>
              <div className="divide-y divide-border">
                {recent.map((app) => (
                  <div key={app.id} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                        {app.company_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{app.company_name}</p>
                        <p className="text-xs text-muted">{app.job_title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[app.status]}`}>
                        {app.status}
                      </span>
                      <span className="text-xs text-muted">
                        {new Date(app.date_applied).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ===== KANBAN VIEW ===== */
          <div>
            {/* Controls */}
            <div className="flex items-center gap-3 mb-5">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search company or title..."
                  className="w-full bg-card border border-border rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent"
                />
              </div>
              <div className="relative">
                <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="bg-card border border-border rounded-lg pl-9 pr-8 py-2 text-sm appearance-none focus:outline-none focus:border-accent cursor-pointer"
                >
                  <option value="date">Sort by Date</option>
                  <option value="salary">Sort by Salary</option>
                  <option value="company">Sort by Company</option>
                </select>
              </div>
            </div>

            {/* Columns */}
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STATUSES.map((status) => (
                <StatusColumn
                  key={status}
                  status={status}
                  applications={byStatus(status)}
                  onDragStart={onDragStart}
                  onDrop={onDrop}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddApplicationModal open={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
        applications={applications}
        onClearAll={() => setApplications([])}
      />
    </div>
  );
}
