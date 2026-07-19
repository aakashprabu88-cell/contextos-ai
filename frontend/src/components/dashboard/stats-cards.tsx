"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Bot, FileText, Search, AlertCircle } from "lucide-react";

interface StatsCardsProps {
  tasks: { total: number; completed: number; running: number; failed: number };
  documents: number;
  notes: number;
  searchCount: number;
}

export function StatsCards({ tasks, documents, notes, searchCount }: StatsCardsProps) {
  const stats = [
    { label: "Total Tasks", value: tasks.total, icon: Clock, color: "text-blue-400", bg: "from-blue-500/20 to-blue-600/5" },
    { label: "Completed", value: tasks.completed, icon: CheckCircle, color: "text-emerald-400", bg: "from-emerald-500/20 to-emerald-600/5" },
    { label: "Documents", value: documents, icon: FileText, color: "text-purple-400", bg: "from-purple-500/20 to-purple-600/5" },
    { label: "AI Searches", value: searchCount, icon: Search, color: "text-amber-400", bg: "from-amber-500/20 to-amber-600/5" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-5 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br", stat.bg)}>
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
