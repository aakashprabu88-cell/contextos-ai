"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, MessageSquare, Search, ListTodo, FileText,
  StickyNote, Settings, LogOut, Bot, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/search", label: "Search", icon: Search },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ onCollapsedChange, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 shadow-lg shadow-primary-500/25 shrink-0">
          <Bot className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-lg font-bold text-gradient">ContextOS</h1>
            <p className="text-[10px] text-slate-500">AI Productivity Layer</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors hidden lg:block"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        <button
          onClick={onClose}
          className="ml-auto p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors lg:hidden"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary-600/20 text-primary-400 shadow-lg shadow-primary-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5 hover:shadow-lg hover:shadow-white/5",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary-400 shadow-lg shadow-primary-400/50" />
              )}
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/5 transition-colors group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-blue-600 text-xs font-bold text-white shrink-0 ring-2 ring-primary-500/20 group-hover:ring-primary-400/40 transition-all">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || ""}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="flex items-center justify-center w-full p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 glass-strong border-r border-white/10 flex flex-col",
          "max-lg:hidden",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          <aside className="absolute left-0 top-0 h-full w-64 glass-strong border-r border-white/10 flex flex-col animate-slide-in-right">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
