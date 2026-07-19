"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import React from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-base font-semibold text-white mt-3 mb-1">
          {parseInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-lg font-bold text-white mt-4 mb-2">
          {parseInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="text-xl font-bold text-white mt-4 mb-2">
          {parseInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    if (line.startsWith("---")) {
      elements.push(<hr key={i} className="border-white/10 my-3" />);
      i++;
      continue;
    }

    if (line.match(/^\d+\.\s/)) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        const itemText = lines[i].replace(/^\d+\.\s/, "");
        listItems.push(
          <li key={`ol-${i}`} className="flex gap-2 ml-1">
            <span className="text-primary-400 font-mono text-xs mt-0.5 shrink-0">
              {lines[i].match(/^(\d+)\./)?.[1]}.
            </span>
            <span>{parseInline(itemText)}</span>
          </li>
        );
        i++;
      }
      elements.push(
        <ol key={`ol-block-${i}`} className="list-none space-y-1 my-1 ml-1">
          {listItems}
        </ol>
      );
      continue;
    }

    if (line.startsWith("- ")) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        listItems.push(
          <li key={`ul-${i}`} className="flex gap-2 ml-1">
            <span className="text-primary-400 mt-0.5 shrink-0">&#8226;</span>
            <span>{parseInline(lines[i].slice(2))}</span>
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-block-${i}`} className="list-none space-y-1 my-1 ml-1">
          {listItems}
        </ul>
      );
      continue;
    }

    if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
      i++;
      continue;
    }

    elements.push(
      <p key={i} className="leading-relaxed">
        {parseInline(line)}
      </p>
    );
    i++;
  }

  return elements;
}

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    let earliest = -1;
    let matchType = "";
    let matchIndex = remaining.length;

    const boldIdx = remaining.indexOf("**");
    if (boldIdx !== -1 && boldIdx < matchIndex) {
      matchIndex = boldIdx;
      matchType = "bold";
    }

    const italicIdx = remaining.indexOf("*");
    if (italicIdx !== -1 && italicIdx < matchIndex && italicIdx !== boldIdx) {
      matchIndex = italicIdx;
      matchType = "italic";
    }

    const codeIdx = remaining.indexOf("`");
    if (codeIdx !== -1 && codeIdx < matchIndex) {
      matchIndex = codeIdx;
      matchType = "code";
    }

    const linkIdx = remaining.indexOf("[");
    if (linkIdx !== -1 && linkIdx < matchIndex) {
      matchIndex = linkIdx;
      matchType = "link";
    }

    if (matchType === "") {
      parts.push(remaining);
      break;
    }

    if (matchIndex > 0) {
      parts.push(remaining.slice(0, matchIndex));
    }

    if (matchType === "bold") {
      const endIdx = remaining.indexOf("**", matchIndex + 2);
      if (endIdx !== -1) {
        parts.push(
          <strong key={`b-${keyIdx++}`} className="font-semibold text-white">
            {remaining.slice(matchIndex + 2, endIdx)}
          </strong>
        );
        remaining = remaining.slice(endIdx + 2);
      } else {
        parts.push("**");
        remaining = remaining.slice(matchIndex + 2);
      }
    } else if (matchType === "italic") {
      const endIdx = remaining.indexOf("*", matchIndex + 1);
      if (endIdx !== -1) {
        parts.push(
          <em key={`i-${keyIdx++}`} className="italic text-slate-300">
            {remaining.slice(matchIndex + 1, endIdx)}
          </em>
        );
        remaining = remaining.slice(endIdx + 1);
      } else {
        parts.push("*");
        remaining = remaining.slice(matchIndex + 1);
      }
    } else if (matchType === "code") {
      const endIdx = remaining.indexOf("`", matchIndex + 1);
      if (endIdx !== -1) {
        parts.push(
          <code
            key={`c-${keyIdx++}`}
            className="px-1.5 py-0.5 rounded-md bg-white/10 text-primary-300 text-xs font-mono border border-white/10"
          >
            {remaining.slice(matchIndex + 1, endIdx)}
          </code>
        );
        remaining = remaining.slice(endIdx + 1);
      } else {
        parts.push("`");
        remaining = remaining.slice(matchIndex + 1);
      }
    } else if (matchType === "link") {
      const closeBracket = remaining.indexOf("]", matchIndex + 1);
      const openParen = remaining.indexOf("(", closeBracket + 1);
      if (closeBracket !== -1 && openParen === closeBracket + 1) {
        const closeParen = remaining.indexOf(")", openParen + 1);
        if (closeParen !== -1) {
          const linkText = remaining.slice(matchIndex + 1, closeBracket);
          const linkUrl = remaining.slice(openParen + 1, closeParen);
          parts.push(
            <a
              key={`a-${keyIdx++}`}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 underline underline-offset-2 decoration-primary-400/30 hover:decoration-primary-300/50 transition-colors"
            >
              {linkText}
            </a>
          );
          remaining = remaining.slice(closeParen + 1);
        } else {
          parts.push("[");
          remaining = remaining.slice(matchIndex + 1);
        }
      } else {
        parts.push("[");
        remaining = remaining.slice(matchIndex + 1);
      }
    }
  }

  return parts;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1">
      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary-400" />
      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary-400" />
      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary-400" />
    </div>
  );
}

function ChatMessageComponent({ role, content, streaming }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-in-up",
        isUser ? "flex-row-reverse" : ""
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full shrink-0 shadow-lg",
          isUser
            ? "bg-primary-600 shadow-primary-500/25"
            : "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/25"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary-600/20 border border-primary-500/20"
            : "bg-white/5 border border-white/10 shadow-xl"
        )}
      >
        <div className="text-sm text-slate-200 space-y-1 leading-relaxed">
          {streaming && !content ? (
            <TypingIndicator />
          ) : (
            <>{parseMarkdown(content)}</>
          )}
        </div>
        {streaming && content && (
          <span className="inline-block w-0.5 h-4 bg-primary-400 ml-0.5 animate-pulse" />
        )}
      </div>
    </div>
  );
}

export const ChatMessage = React.memo(ChatMessageComponent);
