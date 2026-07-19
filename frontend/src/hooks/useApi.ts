"use client";

import { useCallback, useMemo } from "react";
import { useAuth } from "./useAuth";
import { api } from "@/lib/api";

export function useApi() {
  const { token } = useAuth();

  const authFetch = useCallback(
    async <T,>(fn: (t: string) => Promise<T>): Promise<T> => {
      if (!token) throw new Error("Not authenticated");
      return fn(token);
    },
    [token]
  );

  const listTasks = useCallback((skip?: number, limit?: number) => authFetch((t) => api.listTasks(t, skip, limit)), [authFetch]);
  const createTask = useCallback((data: Parameters<typeof api.createTask>[1]) => authFetch((t) => api.createTask(t, data)), [authFetch]);
  const executeTask = useCallback((taskId: string) => authFetch((t) => api.executeTask(t, taskId)), [authFetch]);
  const deleteTask = useCallback((taskId: string) => authFetch((t) => api.deleteTask(t, taskId)), [authFetch]);
  const listNotes = useCallback((skip?: number, limit?: number) => authFetch((t) => api.listNotes(t, skip, limit)), [authFetch]);
  const createNote = useCallback((data: Parameters<typeof api.createNote>[1]) => authFetch((t) => api.createNote(t, data)), [authFetch]);
  const deleteNote = useCallback((noteId: string) => authFetch((t) => api.deleteNote(t, noteId)), [authFetch]);
  const listDocuments = useCallback(() => authFetch((t) => api.listDocuments(t)), [authFetch]);
  const uploadDocument = useCallback((file: File) => authFetch((t) => api.uploadDocument(t, file)), [authFetch]);
  const deleteDocument = useCallback((docId: string) => authFetch((t) => api.deleteDocument(t, docId)), [authFetch]);
  const search = useCallback((query: string, type?: string, limit?: number) => authFetch((t) => api.search(t, query, type, limit)), [authFetch]);
  const listChatSessions = useCallback(() => authFetch((t) => api.listChatSessions(t)), [authFetch]);
  const createChatSession = useCallback((title?: string) => authFetch((t) => api.createChatSession(t, title)), [authFetch]);
  const getChatSession = useCallback((sessionId: string) => authFetch((t) => api.getChatSession(t, sessionId)), [authFetch]);
  const sendChatMessage = useCallback((sessionId: string, content: string) => authFetch((t) => api.sendChatMessage(t, sessionId, content)), [authFetch]);
  const deleteChatSession = useCallback((sessionId: string) => authFetch((t) => api.deleteChatSession(t, sessionId)), [authFetch]);
  const executeAgent = useCallback((query: string) => authFetch((t) => api.executeAgent(t, query)), [authFetch]);
  const listActivities = useCallback((limit?: number) => authFetch((t) => api.listActivities(t, limit)), [authFetch]);
  const updateUser = useCallback((data: { name?: string; avatar_url?: string }) => authFetch((t) => api.updateUser(t, data)), [authFetch]);

  return useMemo(() => ({
    listTasks,
    createTask,
    executeTask,
    deleteTask,
    listNotes,
    createNote,
    deleteNote,
    listDocuments,
    uploadDocument,
    deleteDocument,
    search,
    listChatSessions,
    createChatSession,
    getChatSession,
    sendChatMessage,
    deleteChatSession,
    executeAgent,
    listActivities,
    updateUser,
  }), [
    listTasks, createTask, executeTask, deleteTask,
    listNotes, createNote, deleteNote,
    listDocuments, uploadDocument, deleteDocument,
    search, listChatSessions, createChatSession, getChatSession,
    sendChatMessage, deleteChatSession, executeAgent,
    listActivities, updateUser,
  ]);
}
