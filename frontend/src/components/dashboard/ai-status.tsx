"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bot, Zap } from "lucide-react";
import { useState, useEffect } from "react";

interface AgentInfo {
  name: string;
  status: string;
  description: string;
}

export function AiStatus() {
  const [agents, setAgents] = useState<AgentInfo[]>([
    { name: "Planner Agent", status: "active", description: "Query routing" },
    { name: "Mail Agent", status: "active", description: "Email search" },
    { name: "Calendar Agent", status: "active", description: "Schedule lookup" },
    { name: "Notes Agent", status: "active", description: "Semantic search" },
    { name: "File Agent", status: "active", description: "Doc retrieval" },
    { name: "Summary Agent", status: "active", description: "Output generation" },
  ]);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-primary-400" />
        <h3 className="text-lg font-semibold text-white">AI Agents</h3>
        <Badge variant="success" className="ml-auto">All Operational</Badge>
      </div>
      <div className="space-y-2">
        {agents.map((agent) => (
          <div key={agent.name} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/5 p-3">
            <div className={cn("h-2 w-2 rounded-full", agent.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-red-400")} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{agent.name}</p>
              <p className="text-xs text-slate-500">{agent.description}</p>
            </div>
            <Badge variant="success">{agent.status}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
