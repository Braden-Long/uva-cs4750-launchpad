"use client";

import { Application, STATUS_COLORS } from "@/lib/mock-data";
import { Calendar, DollarSign, ExternalLink } from "lucide-react";

interface ApplicationCardProps {
  application: Application;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

export default function ApplicationCard({ application, onDragStart }: ApplicationCardProps) {
  const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

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
        <a
          href={application.job_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={14} />
        </a>
      </div>

      <div className="flex items-center gap-2 mb-2.5">
        <span className="inline-flex items-center gap-1 text-[11px] text-muted">
          <Calendar size={11} />
          {new Date(application.date_applied).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-muted">
          <DollarSign size={11} />
          {fmt.format(application.salary_expectation)}
        </span>
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
