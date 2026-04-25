"use client";

import { Application, STATUS_COLORS } from "@/lib/mock-data";
import { Calendar, DollarSign, ExternalLink, Pencil, Trash2 } from "lucide-react";

interface ApplicationCardProps {
  application: Application;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

export default function ApplicationCard({ application, onDragStart, onEdit, onDelete }: ApplicationCardProps) {
  const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, application.id)}
      className="group bg-card border border-border rounded-lg p-3.5 cursor-grab active:cursor-grabbing hover:bg-card-hover hover:border-accent/30 transition-all duration-150"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0">
          <h4 className="font-semibold text-sm text-foreground truncate">{application.company_name}</h4>
          <p className="text-xs text-muted truncate">{application.job_title}</p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
          {application.job_url && (
            <a
              href={application.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent p-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={13} />
            </a>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(application); }}
            className="text-muted hover:text-accent p-0.5"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete ${application.company_name} — ${application.job_title}?`)) {
                onDelete(application.id);
              }
            }}
            className="text-muted hover:text-[var(--danger)] p-0.5"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2.5">
        <span className="inline-flex items-center gap-1 text-[11px] text-muted">
          <Calendar size={11} />
          {application.date_applied
            ? new Date(application.date_applied + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : "—"}
        </span>
        {application.salary_expectation > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] text-muted">
            <DollarSign size={11} />
            {fmt.format(application.salary_expectation)}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {application.tags.map((tag) => (
          <span
            key={tag}
            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
              tag === "Remote"
                ? "bg-emerald-500/15 text-emerald-400"
                : tag === "Hybrid"
                ? "bg-amber-500/15 text-amber-400"
                : tag === "On-site"
                ? "bg-blue-500/15 text-blue-400"
                : "bg-zinc-500/15 text-zinc-400"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
