"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { ShellProvider } from "@/components/layout/ShellContext";
import { useAuth } from "@/lib/auth";
import { useTaskStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const hydrated = useTaskStore((s) => s.hydrated);
  const hydrate = useTaskStore((s) => s.hydrate);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  // Load tasks/projects from the API once the user is authenticated.
  useEffect(() => {
    if (ready && user && !hydrated) void hydrate();
  }, [ready, user, hydrated, hydrate]);

  // Gate only on auth; the shell renders immediately and each page shows its
  // own skeleton while the store hydrates from the API.
  if (!ready || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border-strong border-t-accent" />
      </div>
    );
  }

  return (
    <ShellProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </ShellProvider>
  );
}
