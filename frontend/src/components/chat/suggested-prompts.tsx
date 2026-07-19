"use client";

import { Calendar, Mail, FileText, Search, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const prompts = [
  { text: "Prepare tomorrow's meeting", icon: Calendar, color: "from-blue-500 to-primary-600" },
  { text: "Summarize my recent emails", icon: Mail, color: "from-purple-500 to-pink-600" },
  { text: "Find notes about the project roadmap", icon: FileText, color: "from-emerald-500 to-teal-600" },
  { text: "Search for Q4 planning documents", icon: Search, color: "from-amber-500 to-orange-600" },
  { text: "Draft an email reply to the partnership proposal", icon: Mail, color: "from-cyan-500 to-blue-600" },
  { text: "What are my action items this week?", icon: Clock, color: "from-rose-500 to-red-600" },
];

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 shadow-xl shadow-primary-500/25 mb-4">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">ContextOS AI</h2>
        <p className="text-sm text-slate-400 mt-1">
          How can I help you today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
        {prompts.map((prompt) => (
          <button
            key={prompt.text}
            onClick={() => onSelect(prompt.text)}
            className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3 text-left hover:bg-white/10 transition-all group"
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br shrink-0 group-hover:scale-110 transition-transform",
                prompt.color
              )}
            >
              <prompt.icon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-slate-300">{prompt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
