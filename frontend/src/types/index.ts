export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  task_type: string;
  status: "pending" | "running" | "completed" | "failed";
  input_query: string;
  result: AgentResult | null;
  error_message: string | null;
  agent_trace: AgentTraceStep[] | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface AgentResult {
  query: string;
  meeting_summary: string;
  agenda: string[];
  action_items: string[];
  questions: string[];
  email_draft: string;
  ppt_outline: string;
  agent_trace: AgentTraceStep[];
  context: { emails_found: number; events_found: number; notes_found: number; files_found: number };
}

export interface AgentTraceStep {
  agent: string;
  action: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  filename: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  source: string;
  score: number;
  metadata: Record<string, unknown> | null;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  total: number;
}

export interface Activity {
  id: string;
  activity_type: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface AgentStatus {
  name: string;
  status: string;
  description: string;
}
