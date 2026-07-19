"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusColor } from "@/lib/utils";
import type { Task } from "@/types";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface RecentTasksProps {
  tasks: Task[];
}

export function RecentTasks({ tasks }: RecentTasksProps) {
  const statusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case "running": return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const statusVariant = (status: string): "success" | "warning" | "danger" | "info" | "default" => {
    switch (status) {
      case "completed": return "success";
      case "running": return "info";
      case "failed": return "danger";
      default: return "default";
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">No tasks yet. Start by chatting with AI or creating a task.</p>
      ) : (
        <div className="space-y-3">
          {tasks.slice(0, 5).map((task) => (
            <div key={task.id} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/5 p-3 hover:bg-white/10 transition-colors">
              {statusIcon(task.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{task.title}</p>
                <p className="text-xs text-slate-500">{formatDate(task.created_at)}</p>
              </div>
              <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
