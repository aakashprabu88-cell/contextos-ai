import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "completed": return "text-emerald-500";
    case "running": return "text-blue-500";
    case "failed": return "text-red-500";
    default: return "text-slate-400";
  }
}

export function getActivityIcon(type: string): string {
  switch (type) {
    case "task_created": return "clipboard-plus";
    case "task_completed": return "check-circle";
    case "task_failed": return "x-circle";
    case "search": return "search";
    case "document_uploaded": return "upload";
    case "note_created": return "file-text";
    case "agent_executed": return "bot";
    default: return "activity";
  }
}
