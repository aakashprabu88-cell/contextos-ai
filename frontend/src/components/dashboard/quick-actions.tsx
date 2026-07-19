"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { MessageSquare, Search, Upload, Plus, Calendar, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { label: "AI Chat", description: "Ask AI to prepare for a meeting", href: "/chat", icon: MessageSquare, color: "from-blue-500 to-primary-600" },
  { label: "Search", description: "Semantic search across all data", href: "/search", icon: Search, color: "from-purple-500 to-pink-600" },
  { label: "Upload Docs", description: "Add documents for AI context", href: "/documents", icon: Upload, color: "from-emerald-500 to-teal-600" },
  { label: "View Tasks", description: "See all your AI tasks", href: "/tasks", icon: Plus, color: "from-amber-500 to-orange-600" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((action) => (
        <Link key={action.label} href={action.href}>
          <Card className="p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br mb-3 group-hover:scale-110 transition-transform", action.color)}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-sm font-semibold text-white">{action.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
