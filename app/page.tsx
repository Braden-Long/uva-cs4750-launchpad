"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Rocket, Plus, Search, ArrowUpDown, BarChart3, Kanban,
  Settings, Briefcase, TrendingUp, Clock, CalendarDays, LogOut, Users,
} from "lucide-react";
import { Application, Status, STATUSES, STATUS_COLORS } from "@/lib/mock-data";
import StatusColumn from "@/components/StatusColumn";
import AddApplicationModal from "@/components/AddApplicationModal";
import SettingsPanel from "@/components/SettingsPanel";

type View = "dashboard" | "kanban";
type SortOption = "date" | "salary" | "company";

interface DashboardStats {
  total: number;
  responseRate: number;
  pendingInterviews: number;
  offers: number;
  weekly: Array<{ date: string; count: number }>;
  pipeline: Array<{ status: string; count: number }>;
}

export default function Home() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recruiters, setRecruiters] = useState<{ recruiter_id: number; first_name: string; last_name: string; email: string; company_name: string }[]>([]);
  const [user, setUser] = useState<{ username: string; first_name: string; last_name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("dashboard");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("date");
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editApp, setEditApp] = useState<Application | null>(null);

  const fetchData = useCallback(async () => {
    const [appsRes, dashRes, recRes] = await Promise.all([
      fetch("/api/applications"),
      fetch("/api/dashboard"),
      fetch("/api/recruiters"),
    ]);
    if (appsRes.ok) setApplications(await appsRes.json());
    if (dashRes.ok) setStats(await dashRes.json());
    if (recRes.ok) setRecruiters(await recRes.json());
  }, []);

  useEffect(() => {
    async function init() {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) { router.push("/login"); return; }
      const { user: me } = await meRes.json();
      setUser(me);
      await fetchData();
      setLoading(false);
    }
    init();
  }, [router, fetchData]);

  // Derived / filtered
  const filtered = useMemo(() => {
    let apps = [...applications];
    if (search) {
      const q = search.toLowerCase();
      apps = apps.filter(
        (a) => a.company_name.toLowerCase().includes(q) || a.job_title.toLowerCase().includes(q)
      );
    }
    return apps.sort((a, b) => {
      if (sort === "salary") return b.salary_expectation - a.salary_expectation;
      if (sort === "company") return a.company_name.localeCompare(b.company_name);
      const ta = a.date_applied ? new Date(a.date_applied + "T00:00:00").getTime() : 0;
      const tb = b.date_applied ? new Date(b.date_applied + "T00:00:00").getTime() : 0;
      return tb - ta;
    });
  }, [applications, search, sort]);

  const byStatus = (status: Status) => filtered.filter((a) => a.status === status);

  // Summary stats (use API stats when available, fall back to local)
  const totalApps = stats?.total ?? applications.length;
  const responseRate = stats?.responseRate ?? 0;
  const pendingInterviews = stats?.pendingInterviews ?? applications.filter((a) => a.status === "Interviewing").length;
  const offers = stats?.offers ?? applications.filter((a) => a.status === "Offer").length;

  // Weekly chart — last 9 Monday-anchored weeks to cover older data
  const last9Weeks = (() => {
    const today = new Date();
    const day = today.getDay(); // 0=Sun … 6=Sat
    const daysToMonday = day === 0 ? 6 : day - 1;
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - daysToMonday);
    thisMonday.setHours(0, 0, 0, 0);
    return Array.from({ length: 9 }, (_, i) => {
      const w = new Date(thisMonday);
      w.setDate(thisMonday.getDate() - (8 - i) * 7);
      return w.toISOString().split("T")[0];
    });
  })();
  const weeklyMap = new Map((stats?.weekly ?? []).map((w) => [w.date, w.count]));
  const weekActivity = last9Weeks.map((d) => weeklyMap.get(d) ?? 0);
  const dayLabels = last9Weeks.map((d) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
  );
  const maxActivity = Math.max(...weekActivity, 1);

  // Recent activity
  const recent = [...applications]
    .filter((a) => a.date_applied)
    .sort((a, b) => new Date(b.date_applied + "T00:00:00").getTime() - new Date(a.date_applied + "T00:00:00").getTime())
    .slice(0, 5);

  // Pipeline from DB stats (or computed from local state)
  const pipelineCounts: Record<string, number> = {};
  if (stats?.pipeline.length) {
    for (const p of stats.pipeline) pipelineCounts[p.status] = p.count;
  } else {
    for (const s of STATUSES) pipelineCounts[s] = applications.filter((a) => a.status === s).length;
  }

  // Drag handlers
  function onDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("text/plain", id);
  }
  async function onDrop(e: React.DragEvent, newStatus: Status) {
    const id = e.dataTransfer.getData("text/plain");
    const app = applications.find((a) => a.id === id);
    if (!app || app.status === newStatus) return;
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...app, status: newStatus }),
    });
    fetch("/api/dashboard").then((r) => r.json()).then(setStats);
  }

  // CRUD handlers
  async function handleSave(data: Omit<Application, "id">) {
    if (editApp) {
      await fetch(`/api/applications/${editApp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setApplications((prev) =>
        prev.map((a) => (a.id === editApp.id ? { ...a, ...data } : a))
      );
    } else {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newApp: Application = await res.json();
        setApplications((prev) => [newApp, ...prev]);
      }
    }
    fetch("/api/dashboard").then((r) => r.json()).then(setStats);
    setEditApp(null);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
    setApplications((prev) => prev.filter((a) => a.id !== id));
    fetch("/api/dashboard").then((r) => r.json()).then(setStats);
  }

  function openEdit(app: Application) {
    setEditApp(app);
    setShowModal(true);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Rocket size={20} className="text-accent" />
            <span className="font-semibold text-base">Launchpad</span>
            {user && (
              <span className="text-xs text-muted ml-1 hidden sm:inline">
                / {user.first_name} {user.last_name}
              </span>
            )}
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
              title="Settings"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={handleLogout}
              className="p-1.5 text-muted hover:text-foreground transition-colors"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
            <button
              onClick={() => { setEditApp(null); setShowModal(true); }}
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
                { label: "Total Applications", value: totalApps, icon: Briefcase, color: "text-blue-400" },
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

            <div className="grid grid-cols-4 gap-4">
              {/* Activity Chart */}
              <div className="col-span-3 bg-card border border-border rounded-xl p-5 flex flex-col">
                <h3 className="text-sm font-semibold mb-4">Weekly Activity</h3>
                <div className="flex items-end gap-1.5 flex-1">
                  {last9Weeks.map((weekStart, i) => {
                    const barPx = weekActivity[i] > 0
                      ? Math.max(6, Math.round((weekActivity[i] / maxActivity) * 80))
                      : 0;
                    return (
                      <div key={weekStart} className="flex-1 flex flex-col items-center">
                        <div className="relative w-full flex justify-center" style={{ height: 100 }}>
                          <div
                            className="w-full max-w-[24px] bg-accent/70 rounded-t-sm absolute bottom-0 transition-all"
                            style={{ height: barPx }}
                          />
                          {weekActivity[i] > 0 && (
                            <span
                              className="absolute text-[10px] font-medium text-accent leading-none"
                              style={{ bottom: barPx + 5 }}
                            >
                              {weekActivity[i]}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted mt-3 whitespace-nowrap">{dayLabels[i]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pipeline Breakdown */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-4">Pipeline Breakdown</h3>
                <div className="space-y-3">
                  {STATUSES.map((status) => {
                    const count = pipelineCounts[status] ?? 0;
                    const pct = totalApps ? (count / totalApps) * 100 : 0;
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
              {recent.length === 0 ? (
                <p className="text-sm text-muted">No applications yet. Add your first job!</p>
              ) : (
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
                        <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[app.status as Status] ?? ""}`}>
                          {app.status}
                        </span>
                        <span className="text-xs text-muted">
                          {new Date(app.date_applied + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recruiter Network */}
            {recruiters.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={14} className="text-muted" />
                  <h3 className="text-sm font-semibold">Recruiter Network</h3>
                  <span className="ml-auto text-xs text-muted">{recruiters.length} contact{recruiters.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {recruiters.map((r) => (
                    <div key={r.recruiter_id} className="flex flex-col gap-0.5 p-2.5 rounded-lg bg-background border border-border">
                      <span className="text-xs font-medium truncate">{r.first_name} {r.last_name}</span>
                      <span className="text-[11px] text-muted truncate">{r.company_name}</span>
                      {r.email && (
                        <a href={`mailto:${r.email}`} className="text-[11px] text-accent/80 hover:text-accent truncate transition-colors">
                          {r.email}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ===== KANBAN VIEW ===== */
          <div>
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

            <div className="flex gap-4 overflow-x-auto pb-4">
              {STATUSES.map((status) => (
                <StatusColumn
                  key={status}
                  status={status}
                  applications={byStatus(status)}
                  onDragStart={onDragStart}
                  onDrop={onDrop}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <AddApplicationModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditApp(null); }}
        onSave={handleSave}
        editApp={editApp}
      />
      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
        applications={applications}
        onRefresh={fetchData}
      />
    </div>
  );
}
