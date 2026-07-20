"use client";

import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useApi } from "@/hooks/useApi";
import { useState, useEffect } from "react";
import {
  StickyNote, Plus, Trash2, Loader2, X, Tag,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Note } from "@/types";

export default function NotesPage() {
  const api = useApi();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const res = (await api.listNotes()) as { notes: Note[] };
      setNotes(res.notes);
    } catch (e) {
      console.error("Failed to load notes:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setCreating(true);
    try {
      const tags = newTags.split(",").map((t) => t.trim()).filter(Boolean);
      const note = (await api.createNote({
        title: newTitle,
        content: newContent,
        tags,
      })) as Note;
      setNotes((prev) => [note, ...prev]);
      setNewTitle("");
      setNewContent("");
      setNewTags("");
      setShowCreate(false);
    } catch (e) {
      console.error("Failed to create note:", e);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      await api.deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (e) {
      console.error("Failed to delete note:", e);
    }
  };

  return (
    <>
      <Header title="Notes" subtitle="Create and manage notes" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </p>
          <Button onClick={() => setShowCreate(!showCreate)}>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>

        {showCreate && (
          <Card className="p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Create New Note</h3>
              <button
                onClick={() => setShowCreate(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <Input
                label="Title"
                placeholder="Note title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-300">
                  Content
                </label>
                <textarea
                  placeholder="Write your note here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all resize-none"
                />
              </div>
              <Input
                label="Tags (comma separated)"
                placeholder="e.g. meeting, project, idea"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
              />
              <div className="flex gap-3">
                <Button onClick={handleCreate} isLoading={creating}>
                  Create Note
                </Button>
                <Button variant="ghost" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <EmptyState
            icon={<StickyNote className="h-12 w-12" />}
            title="No notes yet"
            description="Create notes to capture ideas, meeting summaries, and more"
            action={
              <Button onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Note
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <Card key={note.id} className="p-5 hover:bg-white/10 transition-all animate-slide-up flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-semibold text-white line-clamp-2 flex-1">
                    {note.title}
                  </h4>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors shrink-0 ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 line-clamp-4 flex-1 mb-3">
                  {note.content}
                </p>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="info">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-600">
                  {formatDate(note.created_at)}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
