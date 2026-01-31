"use client";

import { useState } from "react";
import { Application, Status, STATUSES } from "@/lib/mock-data";
import { X, Sparkles, Link, Plus } from "lucide-react";

interface AddApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (app: Application) => void;
}

export default function AddApplicationModal({ open, onClose, onAdd }: AddApplicationModalProps) {
  const [form, setForm] = useState({
    company_name: "",
    job_title: "",
    job_url: "",
    salary_expectation: "",
    status: "Saved" as Status,
    notes: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [autoFilling, setAutoFilling] = useState(false);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      id: `app-${Date.now()}`,
      company_name: form.company_name,
      job_title: form.job_title,
      status: form.status,
      date_applied: new Date().toISOString().split("T")[0],
      salary_expectation: Number(form.salary_expectation) || 0,
      job_url: form.job_url,
      notes: form.notes,
      tags,
    });
    onClose();
    setForm({ company_name: "", job_title: "", job_url: "", salary_expectation: "", status: "Saved", notes: "" });
    setTags([]);
    setTagInput("");
  }

  function handleAutoFill() {
    setAutoFilling(true);
    setTimeout(() => {
      setForm((f) => ({
        ...f,
        company_name: f.company_name || "Acme Corp",
        job_title: f.job_title || "Software Engineer",
        salary_expectation: f.salary_expectation || "140000",
      }));
      setAutoFilling(false);
    }, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Add Application</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL + Autofill */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Job URL</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="url"
                  value={form.job_url}
                  onChange={(e) => setForm({ ...form, job_url: e.target.value })}
                  placeholder="https://company.com/jobs/..."
                  className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent"
                />
              </div>
              <button
                type="button"
                onClick={handleAutoFill}
                disabled={autoFilling}
                className="flex items-center gap-1.5 px-3 py-2 bg-accent/10 text-accent border border-accent/20 rounded-lg text-xs font-medium hover:bg-accent/20 transition-colors disabled:opacity-50"
              >
                <Sparkles size={13} className={autoFilling ? "animate-spin" : ""} />
                {autoFilling ? "Fetching..." : "Auto-fill from URL"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1.5">Company Name *</label>
              <input
                required
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent"
                placeholder="Google"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Job Title *</label>
              <input
                required
                value={form.job_title}
                onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent"
                placeholder="Software Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1.5">Expected Salary</label>
              <input
                type="number"
                value={form.salary_expectation}
                onChange={(e) => setForm({ ...form, salary_expectation: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent"
                placeholder="120000"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent resize-none"
              placeholder="Referral, prep notes, deadlines..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs text-muted mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-accent/15 text-accent"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="hover:text-foreground"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    e.preventDefault();
                    if (!tags.includes(tagInput.trim())) {
                      setTags([...tags, tagInput.trim()]);
                    }
                    setTagInput("");
                  }
                }}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent"
                placeholder="e.g. Remote, React, Python"
              />
              <button
                type="button"
                onClick={() => {
                  if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                    setTags([...tags, tagInput.trim()]);
                  }
                  setTagInput("");
                }}
                className="px-2 py-1.5 bg-background border border-border rounded-lg text-muted hover:text-foreground hover:border-accent/40 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
