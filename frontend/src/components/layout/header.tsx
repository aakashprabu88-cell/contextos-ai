"use client";

import { cn } from "@/lib/utils";
import { Search, Bell, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("contextos_theme");
      if (saved === "light") {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
    } catch {}
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.classList.toggle("light", !next);
    try {
      localStorage.setItem("contextos_theme", next ? "dark" : "light");
    } catch {}
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 px-6 py-4" style={{ background: "rgba(15, 23, 42, 0.9)" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className={cn(
            "relative transition-all duration-200",
            searchFocused ? "w-80" : "w-64"
          )}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            />
          </form>

          <button className="relative p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-500 text-[8px] text-white flex items-center justify-center">3</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
