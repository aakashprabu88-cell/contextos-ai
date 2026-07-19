"use client";

import { Sidebar } from "./sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { LoadingSpinner } from "@/components/ui/loading";
import { Menu } from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCollapsedChange = useCallback((collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl glass border border-white/10 text-slate-400 hover:text-white transition-colors lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Sidebar
        onCollapsedChange={handleCollapsedChange}
        open={mobileOpen}
        onClose={closeMobile}
      />

      <main
        className={sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-64"}
        style={{ transition: "margin-left 0.3s" }}
      >
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
