"use client";

import { X, Download, Upload, Trash2, FileJson, FileSpreadsheet, Linkedin } from "lucide-react";
import { Application } from "@/lib/mock-data";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  applications: Application[];
  onClearAll: () => void;
}

export default function SettingsPanel({ open, onClose, applications, onClearAll }: SettingsPanelProps) {
  if (!open) return null;

  function exportCSV() {
    const headers = "Company,Title,Status,Date Applied,Salary,URL,Notes";
    const rows = applications.map((a) =>
      [a.company_name, a.job_title, a.status, a.date_applied, a.salary_expectation, a.job_url, `"${a.notes}"`].join(",")
    );
    const csv = [headers, ...rows].join("\n");
    downloadFile(csv, "launchpad-export.csv", "text/csv");
  }

  function exportJSON() {
    downloadFile(JSON.stringify(applications, null, 2), "launchpad-export.json", "application/json");
  }

  function downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
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
          {/* Export */}
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

          {/* Import */}
          <div>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Import</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center gap-2 px-3 py-2.5 bg-background border border-border rounded-lg text-sm hover:border-accent/40 transition-colors">
                <Upload size={15} className="text-blue-400" />
                Import CSV
              </button>
              <button className="flex items-center gap-2 px-3 py-2.5 bg-background border border-border rounded-lg text-sm hover:border-accent/40 transition-colors">
                <Linkedin size={15} className="text-blue-400" />
                From LinkedIn
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-border pt-5">
            <h3 className="text-xs font-semibold text-danger uppercase tracking-wider mb-3">Danger Zone</h3>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete all application data? This cannot be undone.")) {
                  onClearAll();
                  onClose();
                }
              }}
              className="flex items-center gap-2 px-3 py-2.5 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger hover:bg-danger/20 transition-colors w-full"
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
