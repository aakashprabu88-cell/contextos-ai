"use client";

import { Card } from "@/components/ui/card";
import { formatDate, cn } from "@/lib/utils";
import type { Activity } from "@/types";
import {
  CheckCircle, XCircle, Search, Upload, FileText, Bot, ClipboardPlus,
} from "lucide-react";

interface ActivityTimelineProps {
  activities: Activity[];
}

const iconMap: Record<string, any> = {
  task_created: ClipboardPlus,
  task_completed: CheckCircle,
  task_failed: XCircle,
  search: Search,
  document_uploaded: Upload,
  note_created: FileText,
  agent_executed: Bot,
};

const colorMap: Record<string, string> = {
  task_created: "text-blue-400 bg-blue-500/10",
  task_completed: "text-emerald-400 bg-emerald-500/10",
  task_failed: "text-red-400 bg-red-500/10",
  search: "text-amber-400 bg-amber-500/10",
  document_uploaded: "text-purple-400 bg-purple-500/10",
  note_created: "text-cyan-400 bg-cyan-500/10",
  agent_executed: "text-primary-400 bg-primary-500/10",
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Activity Timeline</h3>
      {activities.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">No activity yet. Start using ContextOS AI!</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = iconMap[activity.activity_type] || Bot;
            const colors = colorMap[activity.activity_type] || "text-slate-400 bg-slate-500/10";
            return (
              <div key={activity.id} className="flex gap-3 animate-fade-in">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg shrink-0", colors)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{activity.title}</p>
                  {activity.description && <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>}
                  <p className="text-xs text-slate-600 mt-1">{formatDate(activity.created_at)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
