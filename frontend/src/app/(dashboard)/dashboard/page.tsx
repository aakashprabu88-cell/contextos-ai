"use client";

import { Header } from "@/components/layout/header";
import { RecentTasks } from "@/components/dashboard/recent-tasks";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { AiStatus } from "@/components/dashboard/ai-status";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import type { Task, Activity } from "@/types";

let cachedData: {
  tasks: Task[];
  activities: Activity[];
  stats: { total: number; completed: number; running: number; failed: number };
  docCount: number;
  notesCount: number;
} | null = null;
let cacheTime = 0;
const CACHE_DURATION = 30000;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="skeleton h-64 rounded-xl" />
        <div className="skeleton h-64 rounded-xl" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const api = useApi();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, running: 0, failed: 0 });
  const [docCount, setDocCount] = useState(0);
  const [notesCount, setNotesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (cachedData && Date.now() - cacheTime < CACHE_DURATION) {
      setTasks(cachedData.tasks);
      setActivities(cachedData.activities);
      setStats(cachedData.stats);
      setDocCount(cachedData.docCount);
      setNotesCount(cachedData.notesCount);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [tasksRes, activitiesRes, docsRes, notesRes] = await Promise.allSettled([
        api.listTasks(),
        api.listActivities(),
        api.listDocuments(),
        api.listNotes(),
      ]);

      let tasksList: Task[] = [];
      let activitiesList: Activity[] = [];
      let statsData = { total: 0, completed: 0, running: 0, failed: 0 };
      let docCountVal = 0;
      let notesCountVal = 0;

      if (tasksRes.status === "fulfilled") {
        const data = tasksRes.value as { tasks: Task[]; total: number };
        tasksList = data.tasks;
        statsData = {
          total: data.total,
          completed: data.tasks.filter((t) => t.status === "completed").length,
          running: data.tasks.filter((t) => t.status === "running").length,
          failed: data.tasks.filter((t) => t.status === "failed").length,
        };
        setTasks(tasksList);
        setStats(statsData);
      }

      if (activitiesRes.status === "fulfilled") {
        activitiesList = (activitiesRes.value as { activities: Activity[] }).activities;
        setActivities(activitiesList);
      }

      if (docsRes.status === "fulfilled") {
        docCountVal = (docsRes.value as { total: number }).total;
        setDocCount(docCountVal);
      }

      if (notesRes.status === "fulfilled") {
        const notesData = notesRes.value as { notes: unknown[]; total?: number };
        notesCountVal = notesData.total ?? notesData.notes?.length ?? 0;
        setNotesCount(notesCountVal);
      }

      cachedData = {
        tasks: tasksList,
        activities: activitiesList,
        stats: statsData,
        docCount: docCountVal,
        notesCount: notesCountVal,
      };
      cacheTime = Date.now();

      const anyFailed = [tasksRes, activitiesRes, docsRes, notesRes].some(r => r.status === "rejected");
      if (anyFailed) {
        setError("Some data failed to load. Showing available data.");
      }
    } catch (e) {
      console.error("Failed to load dashboard data:", e);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header title="Dashboard" subtitle="Welcome to your AI productivity layer" />
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div>
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-white">
          {getGreeting()}, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-sm text-slate-400 mt-1">Here&apos;s what&apos;s happening with your productivity today.</p>
      </div>

      {error && (
        <div className="mx-6 mt-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 animate-slide-in-up">
          {error}
        </div>
      )}

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Tasks", value: stats.total, gradient: "from-primary-500 to-primary-600", accent: "bg-primary-500/10 border-primary-500/20" },
            { label: "Completed", value: stats.completed, gradient: "from-emerald-500 to-emerald-600", accent: "bg-emerald-500/10 border-emerald-500/20" },
            { label: "Running", value: stats.running, gradient: "from-blue-500 to-blue-600", accent: "bg-blue-500/10 border-blue-500/20" },
            { label: "Documents", value: docCount, gradient: "from-amber-500 to-orange-600", accent: "bg-amber-500/10 border-amber-500/20" },
          ].map((card, i) => (
            <div
              key={card.label}
              className={cn(
                "rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
                card.accent
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
                </div>
                <div className={cn("h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg", card.gradient)}>
                  <span className="text-lg font-bold">{card.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTasks tasks={tasks} />
          <ActivityTimeline activities={activities} />
        </div>

        <AiStatus />
      </div>
    </div>
  );
}
