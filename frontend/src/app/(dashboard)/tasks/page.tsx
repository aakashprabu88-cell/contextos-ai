"use client";

import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { useApi } from "@/hooks/useApi";
import { useState, useEffect } from "react";
import {
  ListTodo, Plus, Play, Trash2, CheckCircle, XCircle,
  Clock, Loader2, ChevronDown, ChevronUp, Bot,
} from "lucide-react";
import { cn, formatDate, getStatusColor } from "@/lib/utils";
import type { Task, AgentResult } from "@/types";

export default function TasksPage() {
  const api = useApi();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newQuery, setNewQuery] = useState("");
  const [executing, setExecuting] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = (await api.listTasks()) as { tasks: Task[] };
      setTasks(res.tasks);
    } catch (e) {
      console.error("Failed to load tasks:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim() || !newQuery.trim()) return;
    setCreating(true);
    try {
      const task = (await api.createTask({
        title: newTitle,
        input_query: newQuery,
        task_type: "planner",
      })) as Task;
      setTasks((prev) => [task, ...prev]);
      setNewTitle("");
      setNewQuery("");
      setShowCreate(false);
    } catch (e) {
      console.error("Failed to create task:", e);
    } finally {
      setCreating(false);
    }
  };

  const handleExecute = async (taskId: string) => {
    setExecuting(taskId);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "running" as const } : t))
    );
    try {
      const result = (await api.executeTask(taskId)) as Task;
      setTasks((prev) => prev.map((t) => (t.id === taskId ? result : t)));
    } catch (e) {
      console.error("Failed to execute task:", e);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: "failed" as const } : t
        )
      );
    } finally {
      setExecuting(null);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (e) {
      console.error("Failed to delete task:", e);
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case "running":
        return <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const statusVariant = (
    s: string
  ): "success" | "warning" | "danger" | "info" | "default" => {
    switch (s) {
      case "completed":
        return "success";
      case "running":
        return "info";
      case "failed":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <>
      <Header title="Tasks" subtitle="Manage AI-powered tasks" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </p>
          <Button onClick={() => setShowCreate(!showCreate)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Create form */}
        {showCreate && (
          <Card className="p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Task</h3>
            <div className="space-y-4">
              <Input
                label="Task Title"
                placeholder="e.g., Prepare Q4 meeting"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-300">
                  AI Query
                </label>
                <textarea
                  placeholder="e.g., Prepare tomorrow's meeting by searching emails, calendar, and notes..."
                  value={newQuery}
                  onChange={(e) => setNewQuery(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCreate} isLoading={creating}>
                  Create Task
                </Button>
                <Button variant="ghost" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Task list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<ListTodo className="h-12 w-12" />}
            title="No tasks yet"
            description="Create a task or start a chat to get AI-powered insights"
            action={
              <Button onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Task
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card key={task.id} className="overflow-hidden animate-slide-up">
                <div
                  className="p-5 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() =>
                    setExpandedTask(
                      expandedTask === task.id ? null : task.id
                    )
                  }
                >
                  <div className="flex items-center gap-4">
                    {statusIcon(task.status)}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatDate(task.created_at)}
                      </p>
                    </div>
                    <Badge variant={statusVariant(task.status)}>
                      {task.status}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {task.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExecute(task.id);
                          }}
                          isLoading={executing === task.id}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Execute
                        </Button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(task.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {expandedTask === task.id ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {expandedTask === task.id && (
                  <div className="border-t border-white/10 p-5 animate-fade-in space-y-4">
                    <div>
                      <p className="text-xs font-medium text-slate-400 mb-1">
                        Query
                      </p>
                      <p className="text-sm text-white bg-white/5 rounded-lg p-3">
                        {task.input_query}
                      </p>
                    </div>

                    {task.agent_trace && task.agent_trace.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-slate-400 mb-2">
                          Agent Trace
                        </p>
                        <div className="space-y-2">
                          {task.agent_trace.map(
                            (step: any, i: number) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-xs"
                              >
                                <Bot className="h-3 w-3 text-primary-400" />
                                <span className="text-primary-400 font-medium">
                                  {step.agent}
                                </span>
                                <span className="text-slate-500">
                                  {step.action}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {task.result && (
                      <div>
                        <p className="text-xs font-medium text-slate-400 mb-2">
                          Result
                        </p>
                        <div className="bg-white/5 rounded-lg p-4 text-sm text-slate-300 space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
                          {task.result.meeting_summary && (
                            <div>
                              <h5 className="font-semibold text-white">
                                Meeting Summary
                              </h5>
                              <p className="whitespace-pre-wrap">
                                {task.result.meeting_summary}
                              </p>
                            </div>
                          )}
                          {task.result.agenda && (
                            <div>
                              <h5 className="font-semibold text-white">
                                Agenda
                              </h5>
                              <ul className="list-disc list-inside">
                                {task.result.agenda.map(
                                  (item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                          {task.result.action_items && (
                            <div>
                              <h5 className="font-semibold text-white">
                                Action Items
                              </h5>
                              <ul className="list-disc list-inside">
                                {task.result.action_items.map(
                                  (item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                          {task.result.email_draft && (
                            <div>
                              <h5 className="font-semibold text-white">
                                Email Draft
                              </h5>
                              <pre className="whitespace-pre-wrap text-xs bg-white/5 rounded p-3">
                                {task.result.email_draft}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {task.error_message && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-sm text-red-400">
                        {task.error_message}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
