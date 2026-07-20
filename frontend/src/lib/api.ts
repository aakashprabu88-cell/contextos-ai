const API_URL = "";

interface RequestOptions extends RequestInit {
  token?: string;
}

interface CacheEntry {
  data: any;
  timestamp: number;
}

class ApiClient {
  private baseUrl: string;
  private cache = new Map<string, CacheEntry>();
  private CACHE_TTL = 30000;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getCacheKey(endpoint: string, token?: string): string {
    return `${token || ""}:${endpoint}`;
  }

  private clearCache(): void {
    this.cache.clear();
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    const method = (fetchOptions.method || "GET").toUpperCase();

    if (method !== "GET") {
      this.clearCache();
    }

    if (method === "GET") {
      const cacheKey = this.getCacheKey(endpoint, token);
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data as T;
      }
    }

    const headers: Record<string, string> = {
      ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Request failed" }));
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      if (response.status === 204) return undefined as T;
      const data = await response.json();

      if (method === "GET") {
        const cacheKey = this.getCacheKey(endpoint, token);
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
      }

      return data;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Auth
  async register(email: string, name: string, password: string) {
    return this.request("/api/auth/register", { method: "POST", body: JSON.stringify({ email, name, password }) });
  }

  async login(email: string, password: string) {
    return this.request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  }

  async getMe(token: string) {
    return this.request("/api/auth/me", { token });
  }

  async updateUser(token: string, data: { name?: string; avatar_url?: string }) {
    return this.request("/api/auth/me", { method: "PUT", token, body: JSON.stringify(data) });
  }

  // Tasks
  async listTasks(token: string, skip = 0, limit = 20) {
    return this.request(`/api/tasks?skip=${skip}&limit=${limit}`, { token });
  }

  async createTask(token: string, data: { title: string; description?: string; task_type: string; input_query: string }) {
    return this.request("/api/tasks", { method: "POST", token, body: JSON.stringify(data) });
  }

  async executeTask(token: string, taskId: string) {
    return this.request(`/api/tasks/${taskId}/execute`, { method: "POST", token });
  }

  async deleteTask(token: string, taskId: string) {
    return this.request(`/api/tasks/${taskId}`, { method: "DELETE", token });
  }

  // Notes
  async listNotes(token: string, skip = 0, limit = 50) {
    return this.request(`/api/notes?skip=${skip}&limit=${limit}`, { token });
  }

  async createNote(token: string, data: { title: string; content: string; tags?: string[] }) {
    return this.request("/api/notes", { method: "POST", token, body: JSON.stringify(data) });
  }

  async deleteNote(token: string, noteId: string) {
    return this.request(`/api/notes/${noteId}`, { method: "DELETE", token });
  }

  async updateNote(token: string, noteId: string, data: { title?: string; content?: string; tags?: string[] }) {
    return this.request(`/api/notes/${noteId}`, { method: "PUT", token, body: JSON.stringify(data) });
  }

  // Documents
  async listDocuments(token: string) {
    return this.request("/api/documents", { token });
  }

  async uploadDocument(token: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.request("/api/documents/upload", { method: "POST", token, body: formData });
  }

  async deleteDocument(token: string, docId: string) {
    return this.request(`/api/documents/${docId}`, { method: "DELETE", token });
  }

  // Search
  async search(token: string, query: string, searchType = "all", limit = 10) {
    return this.request("/api/search", { method: "POST", token, body: JSON.stringify({ query, search_type: searchType, limit }) });
  }

  // Chat
  async listChatSessions(token: string) {
    return this.request("/api/chat/sessions", { token });
  }

  async createChatSession(token: string, title?: string) {
    return this.request("/api/chat/sessions", { method: "POST", token, body: JSON.stringify({ title: title || "New Chat" }) });
  }

  async getChatSession(token: string, sessionId: string) {
    return this.request(`/api/chat/sessions/${sessionId}`, { token });
  }

  async sendChatMessage(token: string, sessionId: string, content: string) {
    return this.request(`/api/chat/sessions/${sessionId}/messages`, { method: "POST", token, body: JSON.stringify({ content }) });
  }

  async deleteChatSession(token: string, sessionId: string) {
    return this.request(`/api/chat/sessions/${sessionId}`, { method: "DELETE", token });
  }

  // Agents
  async executeAgent(token: string, query: string) {
    return this.request("/api/agents/execute", { method: "POST", token, body: JSON.stringify({ query }) });
  }

  async getAgentStatus() {
    return this.request("/api/agents/status");
  }

  // Activities
  async listActivities(token: string, limit = 20) {
    return this.request(`/api/activities?limit=${limit}`, { token });
  }
}

export const api = new ApiClient(API_URL);
