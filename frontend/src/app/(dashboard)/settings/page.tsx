"use client";

import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { User, Shield, Bot, Database, Palette, Save } from "lucide-react";

export default function SettingsPage() {
  const { user, token } = useAuth();
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      await api.updateUser(token, { name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const agentInfo = [
    { name: "Planner Agent", model: "GPT-4o / Gemini Pro", status: "active" },
    { name: "Mail Agent", model: "GPT-4o Mini", status: "active" },
    { name: "Calendar Agent", model: "GPT-4o Mini", status: "active" },
    { name: "Notes Agent", model: "GPT-4o Mini", status: "active" },
    { name: "File Agent", model: "GPT-4o Mini", status: "active" },
    { name: "Summary Agent", model: "GPT-4o / Gemini Pro", status: "active" },
  ];

  return (
    <div>
      <Header title="Settings" subtitle="Configure your ContextOS AI" />
      <div className="p-6 space-y-6 max-w-3xl">
        {/* Profile */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Profile</h3>
          </div>
          <div className="space-y-4">
            <Input label="Name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
            <Input label="Email" value={user?.email || ""} disabled />
            <div className="flex items-center gap-3">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
              </Button>
              {saved && (
                <span className="text-sm text-emerald-400 animate-fade-in">
                  Changes saved successfully
                </span>
              )}
              {error && (
                <span className="text-sm text-red-400">
                  {error}
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* AI Configuration */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bot className="h-5 w-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">AI Configuration</h3>
          </div>
          <div className="space-y-3">
            {agentInfo.map((agent) => (
              <div key={agent.name} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <p className="text-sm font-medium text-white">{agent.name}</p>
                    <p className="text-xs text-slate-500">{agent.model}</p>
                  </div>
                </div>
                <Badge variant="success">{agent.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Database */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-5 w-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Vector Store</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-3">
              <div>
                <p className="text-sm font-medium text-white">ChromaDB</p>
                <p className="text-xs text-slate-500">Semantic vector search</p>
              </div>
              <Badge variant="success">Connected</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-3">
              <div>
                <p className="text-sm font-medium text-white">PostgreSQL</p>
                <p className="text-xs text-slate-500">Primary database</p>
              </div>
              <Badge variant="success">Connected</Badge>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="h-5 w-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Appearance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-3">
              <div>
                <p className="text-sm font-medium text-white">Theme</p>
                <p className="text-xs text-slate-500">Toggle via the sun/moon icon in the header</p>
              </div>
              <Badge variant="info">Dark/Light</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
