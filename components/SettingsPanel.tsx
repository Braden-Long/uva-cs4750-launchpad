"use client";

import { useRef } from "react";
import { X, Upload, Trash2, FileJson, FileSpreadsheet } from "lucide-react";
import { Application } from "@/lib/mock-data";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  applications: Application[];
  onRefresh: () => Promise<void>;
}

export default function SettingsPanel({ open, onClose, applications, onRefresh }: SettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  async function exportCSV() {
    const res = await fetch("/api/export");
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "launchpad-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportJSON() {
    const content = JSON.stringify(applications, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "launchpad-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const res = await fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "text/csv" },
      body: text,
    });
    if (res.ok) {
      const { imported } = await res.json();
      await onRefresh();
      alert(`Imported ${imported} application${imported !== 1 ? "s" : ""}.`);
    }
    e.target.value = "";
  }

  async function handleClearAll() {
    if (!confirm("Delete all your application data? This cannot be undone.")) return;
    await fetch("/api/applications", { method: "DELETE" });
    await onRefresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Data Management</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Export</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-3 py-2.5 bg-background border border-border rounded-lg text-sm hover:border-accent/40 transition-colors"
              >
                <FileSpreadsheet size={15} className="text-emerald-400" />
                Export as CSV
              </button>
              <button
                onClick={exportJSON}
                className="flex items-center gap-2 px-3 py-2.5 bg-background border border-border rounded-lg text-sm hover:border-accent/40 transition-colors"
              >
                <FileJson size={15} className="text-amber-400" />
                Export as JSON
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Import</h3>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2.5 bg-background border border-border rounded-lg text-sm hover:border-accent/40 transition-colors w-full"
            >
              <Upload size={15} className="text-blue-400" />
              Import CSV
            </button>
            <p className="text-xs text-muted mt-1.5">
              CSV must have columns: Company, Title, Status, Date Applied, Salary, Notes, Tags (pipe-separated)
            </p>
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="text-xs font-semibold text-[var(--danger)] uppercase tracking-wider mb-3">Danger Zone</h3>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-3 py-2.5 bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-lg text-sm text-[var(--danger)] hover:bg-[var(--danger)]/20 transition-colors w-full"
            >
              <Trash2 size={15} />
              Delete All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
