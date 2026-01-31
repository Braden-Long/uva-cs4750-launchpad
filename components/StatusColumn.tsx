"use client";

import { Application, Status, STATUS_COLORS } from "@/lib/mock-data";
import ApplicationCard from "./ApplicationCard";

interface StatusColumnProps {
  status: Status;
  applications: Application[];
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDrop: (e: React.DragEvent, status: Status) => void;
}

export default function StatusColumn({ status, applications, onDragStart, onDrop }: StatusColumnProps) {
  return (
    <div
      className="flex flex-col min-w-[260px] w-[260px] shrink-0"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${STATUS_COLORS[status]}`}>
          {status}
        </span>
        <span className="text-xs text-muted">{applications.length}</span>
      </div>
      <div className="flex flex-col gap-2 flex-1 p-1 rounded-lg border border-transparent hover:border-border/50 transition-colors min-h-[120px]">
        {applications.map((app) => (
          <ApplicationCard key={app.id} application={app} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
}
