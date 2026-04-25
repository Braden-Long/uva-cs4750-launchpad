"use client";

import { useEffect, useRef, useState } from "react";
import { Application, Status, STATUSES } from "@/lib/mock-data";
import { X, Sparkles, Link, Plus, CalendarDays, FileText } from "lucide-react";

type FormData = Omit<Application, "id">;

interface AddApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  editApp?: Application | null;
}

const empty = {
  company_name: "",
  job_title: "",
  job_url: "",
  salary_expectation: "",
  status: "Saved" as Status,
  notes: "",
  job_type: "" as "" | "Internship" | "Full-time",
  duration_months: "",
  equity_offered: "",
  sign_on_bonus: "",
};

function isoToDisplay(iso: string): string {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length !== 3) return "";
  return `${parts[1]}/${parts[2]}/${parts[0]}`;
}

function displayToISO(display: string): string {
  const parts = display.split("/");
  if (parts.length === 3 && parts[2].length === 4) {
    return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
  }
  return new Date().toISOString().split("T")[0];
}

export default function AddApplicationModal({ open, onClose, onSave, editApp }: AddApplicationModalProps) {
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];
  const todayDisplay = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;

  const [form, setForm] = useState(empty);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [autoFilling, setAutoFilling] = useState(false);
  const [saving, setSaving] = useState(false);
  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (editApp) {
        setForm({
          company_name: editApp.company_name,
          job_title: editApp.job_title,
          job_url: editApp.job_url,
          salary_expectation: editApp.salary_expectation ? String(editApp.salary_expectation) : "",
          status: editApp.status,
          notes: editApp.notes,
          job_type: (editApp.job_type as "" | "Internship" | "Full-time") ?? "",
          duration_months: editApp.duration_months ? String(editApp.duration_months) : "",
          equity_offered: editApp.equity_offered ?? "",
          sign_on_bonus: editApp.sign_on_bonus ? String(editApp.sign_on_bonus) : "",
        });
        setTags(editApp.tags);
        // Saved apps have NULL date in DB (API returns today as fallback), show empty so placeholder appears
        setDateInput(editApp.status === "Saved" ? "" : isoToDisplay(editApp.date_applied));
      } else {
        setForm(empty);
        setTags([]);
        setDateInput("");
      }
      setTagInput("");
    }
  }, [open, editApp]);

  if (!open) return null;

  function handleDateTyping(val: string) {
    if (val.length < dateInput.length) {
      // Backspace — allow deletion, strip any trailing slash left behind
      setDateInput(val.replace(/\/$/, ""));
      return;
    }
    const digits = val.replace(/\D/g, "").slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    setDateInput(formatted);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const isoDate = dateInput.length === 10 ? displayToISO(dateInput) : todayISO;
    await onSave({
      company_name: form.company_name,
      job_title: form.job_title,
      status: form.status,
      date_applied: isoDate,
      salary_expectation: Number(form.salary_expectation) || 0,
      job_url: form.job_url,
      notes: form.notes,
      tags,
      job_type: (form.job_type as "Internship" | "Full-time") || null,
      duration_months: form.job_type === "Internship" ? (Number(form.duration_months) || null) : null,
      equity_offered: form.job_type === "Full-time" ? (form.equity_offered || null) : null,
      sign_on_bonus: form.job_type === "Full-time" ? (Number(form.sign_on_bonus) || null) : null,
      documents: editApp?.documents ?? [],
    });
    setSaving(false);
    onClose();
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

  const isEdit = !!editApp;
  const pickerValue = dateInput.length === 10 ? displayToISO(dateInput) : todayISO;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">{isEdit ? "Edit Application" : "Add Application"}</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              {!isEdit && (
                <button
                  type="button"
                  onClick={handleAutoFill}
                  disabled={autoFilling}
                  className="flex items-center gap-1.5 px-3 py-2 bg-accent/10 text-accent border border-accent/20 rounded-lg text-xs font-medium hover:bg-accent/20 transition-colors disabled:opacity-50"
                >
                  <Sparkles size={13} className={autoFilling ? "animate-spin" : ""} />
                  {autoFilling ? "Fetching..." : "Auto-fill from URL"}
                </button>
              )}
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

          <div className="grid grid-cols-3 gap-3">
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
              <label className="block text-xs text-muted mb-1.5">
                Date Applied
                {form.status === "Saved" && (
                  <span className="ml-1 text-muted/50 font-normal">(n/a)</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.status === "Saved" ? "" : dateInput}
                  onChange={(e) => handleDateTyping(e.target.value)}
                  placeholder={form.status === "Saved" ? "Not yet applied" : todayDisplay}
                  maxLength={10}
                  disabled={form.status === "Saved"}
                  className="w-full bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-sm placeholder:text-muted/40 focus:outline-none focus:border-accent disabled:opacity-40 disabled:cursor-not-allowed"
                />
                {/* Label click forwards to the date input, opening the native picker */}
                <label
                  className={`absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center transition-colors ${form.status === "Saved" ? "opacity-30 cursor-not-allowed pointer-events-none" : "cursor-pointer text-muted hover:text-accent"}`}
                  onClick={() => {
                    if (datePickerRef.current) datePickerRef.current.value = pickerValue;
                  }}
                >
                  <CalendarDays size={14} className="pointer-events-none" />
                  <input
                    ref={datePickerRef}
                    type="date"
                    disabled={form.status === "Saved"}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:pointer-events-none"
                    onChange={(e) => {
                      if (e.target.value) setDateInput(isoToDisplay(e.target.value));
                    }}
                  />
                </label>
              </div>
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

          {/* Job Type row — populates internship / full_time tables */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">Job Type</label>
              <select
                value={form.job_type}
                onChange={(e) => setForm({ ...form, job_type: e.target.value as "" | "Internship" | "Full-time" })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              >
                <option value="">N/A</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
              </select>
            </div>
            {form.job_type === "Internship" && (
              <div className="col-span-2">
                <label className="block text-xs text-muted mb-1.5">Duration (months)</label>
                <input
                  type="number"
                  value={form.duration_months}
                  onChange={(e) => setForm({ ...form, duration_months: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent"
                  placeholder="3"
                />
              </div>
            )}
            {form.job_type === "Full-time" && (
              <>
                <div>
                  <label className="block text-xs text-muted mb-1.5">Equity</label>
                  <input
                    type="text"
                    value={form.equity_offered}
                    onChange={(e) => setForm({ ...form, equity_offered: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent"
                    placeholder="100 RSUs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5">Sign-on Bonus</label>
                  <input
                    type="number"
                    value={form.sign_on_bonus}
                    onChange={(e) => setForm({ ...form, sign_on_bonus: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent"
                    placeholder="10000"
                  />
                </div>
              </>
            )}
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

          <div>
            <label className="block text-xs text-muted mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-accent/15 text-accent">
                  {tag}
                  <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-foreground">
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
                    if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
                    setTagInput("");
                  }
                }}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent"
                placeholder="e.g. Remote, React, Python"
              />
              <button
                type="button"
                onClick={() => {
                  if (tagInput.trim() && !tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
                  setTagInput("");
                }}
                className="px-2 py-1.5 bg-background border border-border rounded-lg text-muted hover:text-foreground hover:border-accent/40 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {isEdit && editApp?.documents && editApp.documents.length > 0 && (
            <div>
              <label className="block text-xs text-muted mb-1.5">Submitted Documents</label>
              <div className="flex flex-wrap gap-1.5">
                {editApp.documents.map((doc, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-zinc-500/15 text-zinc-400">
                    <FileText size={10} />
                    {doc.title}
                    <span className="text-zinc-500">· {doc.doc_type}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
