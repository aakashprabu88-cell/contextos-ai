"use client";

import { Header } from "@/components/layout/header";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { SuggestedPrompts } from "@/components/chat/suggested-prompts";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/toast";
import { useState, useEffect, useRef } from "react";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import type { ChatSession, ChatMessage as ChatMessageType } from "@/types";

export default function ChatPage() {
  const api = useApi();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadSessions = async () => {
    try {
      const res = (await api.listChatSessions()) as { sessions: ChatSession[] };
      setSessions(res.sessions);
    } catch (e) {
      console.error("Failed to load sessions:", e);
    }
  };

  const handleNewChat = async (initialMessage?: string) => {
    try {
      const session = (await api.createChatSession()) as ChatSession;
      setActiveSession(session);
      setSessions((prev) => [session, ...prev]);
      if (initialMessage) {
        handleSend(initialMessage, session.id);
      }
    } catch (e) {
      console.error("Failed to create session:", e);
    }
  };

  const handleSend = async (content: string, sessionId?: string) => {
    const sid = sessionId || activeSession?.id;
    if (!sid) {
      await handleNewChat(content);
      return;
    }

    const userMsg: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      metadata: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = (await api.sendChatMessage(sid, content)) as ChatMessageType;
      setMessages((prev) => [...prev, response]);
    } catch (e: unknown) {
      const errorMsg: ChatMessageType = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${e instanceof Error ? e.message : "Unknown error"}. Please try again.`,
        metadata: null,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await api.deleteChatSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSession?.id === sessionId) {
        setActiveSession(null);
        setMessages([]);
      }
    } catch (e) {
      console.error("Failed to delete session:", e);
    }
  };

  return (
    <>
      <Header title="AI Chat" subtitle="Intelligent context-aware conversations" />
      <div className="flex h-[calc(100vh-73px)]">
        {/* Sessions sidebar */}
        <div className="w-64 border-r border-white/10 p-4 flex flex-col" style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(24px)" }}>
          <button
            onClick={() => handleNewChat()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-primary-700 transition-colors mb-4"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
          <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                  activeSession?.id === session.id
                    ? "bg-primary-600/20 text-primary-400 border border-primary-500/20"
                    : "text-slate-400 hover:bg-white/5 border border-transparent"
                }`}
                onClick={async () => {
                  setActiveSession(session);
                  try {
                    const res = (await api.getChatSession(session.id)) as ChatSession & { messages: ChatMessageType[] };
                    setMessages(res.messages || []);
                  } catch (e) {
                    console.error("Failed to load session:", e);
                  }
                }}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{session.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 hover:text-red-400 transition-all"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            {sessions.length === 0 && (
              <p className="text-xs text-slate-600 text-center py-4">No chats yet</p>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <SuggestedPrompts onSelect={(text) => handleSend(text)} />
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    role={msg.role as "user" | "assistant"}
                    content={msg.content}
                  />
                ))}
                {isLoading && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shrink-0">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 rounded-full bg-primary-500 animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="border-t border-white/10 p-4" style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(24px)" }}>
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </>
  );
}
