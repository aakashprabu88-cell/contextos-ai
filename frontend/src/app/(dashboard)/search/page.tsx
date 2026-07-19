"use client";

import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, Mail, Calendar, FileText, File, Loader2 } from "lucide-react";
import { cn, truncate } from "@/lib/utils";
import type { SearchResult } from "@/types";

const sourceIcons: Record<string, any> = {
  email: Mail,
  calendar: Calendar,
  notes: FileText,
  files: File,
};

const sourceColors: Record<string, string> = {
  email: "text-blue-400 bg-blue-500/10",
  calendar: "text-emerald-400 bg-emerald-500/10",
  notes: "text-amber-400 bg-amber-500/10",
  files: "text-purple-400 bg-purple-500/10",
};

export default function SearchPage() {
  const api = useApi();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(urlQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleSearch = async (searchType?: string, overrideQuery?: string) => {
    const q = overrideQuery ?? query;
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = (await api.search(q, searchType ?? activeFilter)) as { results: SearchResult[] };
      setResults(res.results);
    } catch (e) {
      console.error("Search failed:", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
      handleSearch("all", urlQuery);
    }
  }, [urlQuery]);

  const filters = [
    { key: "all", label: "All Sources" },
    { key: "email", label: "Emails" },
    { key: "calendar", label: "Calendar" },
    { key: "notes", label: "Notes" },
    { key: "files", label: "Files" },
  ];

  return (
    <>
      <Header title="Search" subtitle="Semantic search across all your data" />
      <div className="p-6 space-y-6">
        {/* Search bar */}
        <Card className="p-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search emails, calendar, notes, files..."
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
              />
            </div>
            <Button onClick={() => handleSearch()} isLoading={loading} size="lg">
              Search
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-4">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setActiveFilter(f.key);
                  if (searched) handleSearch(f.key);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  activeFilter === f.key
                    ? "bg-primary-600/20 text-primary-400 border border-primary-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
          </div>
        ) : searched && results.length === 0 ? (
          <Card className="p-12 text-center">
            <SearchIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300">No results found</h3>
            <p className="text-sm text-slate-500 mt-1">Try a different query or filter</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {searched && (
              <p className="text-sm text-slate-400">
                Found {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
              </p>
            )}
            {results.map((result) => {
              const Icon = sourceIcons[result.source] || File;
              return (
                <Card key={result.id} className="p-5 hover:bg-white/10 transition-all cursor-pointer animate-slide-up">
                  <div className="flex items-start gap-4">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl shrink-0", sourceColors[result.source] || "text-slate-400 bg-slate-500/10")}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-white">{result.title}</h4>
                        <Badge variant="info">{result.source}</Badge>
                        <Badge variant={result.score > 0.5 ? "success" : "default"}>
                          {Math.round(result.score * 100)}% match
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2">{truncate(result.content, 200)}</p>
                      {result.metadata && (
                        <div className="flex gap-4 mt-2">
                          {Object.entries(result.metadata).map(([key, val]) => (
                            <span key={key} className="text-xs text-slate-600">
                              {key}: {String(val).slice(0, 50)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
