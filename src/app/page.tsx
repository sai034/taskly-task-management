"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.replace(user ? "/tasks" : "/login");
  }, [ready, user, router]);

  return (
    <div className="grid min-h-screen place-items-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border-strong border-t-accent" />
    </div>
  );
}
