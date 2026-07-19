"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/loading";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      router.push(user ? "/dashboard" : "/login");
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <LoadingSpinner size="lg" />
    </div>
  );
}
