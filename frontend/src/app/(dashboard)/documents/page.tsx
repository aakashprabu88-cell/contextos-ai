"use client";

import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/toast";
import { useState, useEffect, useRef } from "react";
import {
  FileText, Upload, Trash2, File, Image, Code, Loader2,
} from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/utils";
import type { Document } from "@/types";

export default function DocumentsPage() {
  const api = useApi();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const res = (await api.listDocuments()) as { documents: Document[] };
      setDocuments(res.documents);
    } catch (e) {
      console.error("Failed to load documents:", e);
      toast("Failed to load documents", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let successCount = 0;
    try {
      for (const file of Array.from(files)) {
        try {
          const doc = (await api.uploadDocument(file)) as Document;
          setDocuments((prev) => [doc, ...prev]);
          successCount++;
        } catch (e) {
          console.error("Failed to upload:", file.name, e);
          toast(`Failed to upload ${file.name}: ${e instanceof Error ? e.message : "Unknown error"}`, "error");
        }
      }
      if (successCount > 0) {
        toast(`${successCount} file${successCount > 1 ? "s" : ""} uploaded successfully`, "success");
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await api.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      toast("Document deleted", "success");
    } catch (e) {
      console.error("Failed to delete:", e);
      toast("Failed to delete document", "error");
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="h-6 w-6 text-red-400" />;
    if (type.includes("image")) return <Image className="h-6 w-6 text-purple-400" />;
    if (type.includes("text") || type.includes("markdown")) return <FileText className="h-6 w-6 text-blue-400" />;
    if (type.includes("code") || type.includes("json")) return <Code className="h-6 w-6 text-emerald-400" />;
    return <File className="h-6 w-6 text-slate-400" />;
  };

  return (
    <>
      <Header title="Documents" subtitle="Upload and manage documents for AI context" />
      <div className="p-6 space-y-6">
        {/* Upload area */}
        <Card
          className="p-8 border-dashed border-2 border-white/10 hover:border-primary-500/30 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleUpload(e.dataTransfer.files);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
            accept=".txt,.md,.pdf,.json,.csv,.doc,.docx"
          />
          <div className="flex flex-col items-center text-center">
            {uploading ? (
              <Loader2 className="h-12 w-12 text-primary-500 animate-spin mb-4" />
            ) : (
              <Upload className="h-12 w-12 text-slate-500 mb-4" />
            )}
            <h3 className="text-lg font-semibold text-white mb-1">
              {uploading ? "Uploading..." : "Upload Documents"}
            </h3>
            <p className="text-sm text-slate-400">
              Drag & drop files here or click to browse
            </p>
            <p className="text-xs text-slate-600 mt-2">
              Supports: TXT, MD, PDF, JSON, CSV, DOC, DOCX
            </p>
          </div>
        </Card>

        {/* Document list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
          </div>
        ) : documents.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title="No documents yet"
            description="Upload documents to give AI context about your projects and work"
            action={
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload First Document
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="p-5 hover:bg-white/10 transition-all animate-slide-up">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 shrink-0">
                    {getFileIcon(doc.file_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {doc.original_filename}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="info">{doc.file_type.split("/").pop()}</Badge>
                      <span className="text-xs text-slate-500">
                        {formatFileSize(doc.file_size)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      Uploaded {formatDate(doc.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
