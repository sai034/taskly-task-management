"use client";

import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth";
import { CURRENT_USER } from "@/lib/seed";
import { useTaskStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { getMember, relativeTime } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";

export function Comments({ task }: { task: Task }) {
  const { addComment } = useTaskStore();
  const { user } = useAuth();
  const [body, setBody] = useState("");

  const send = () => {
    if (!body.trim()) return;
    addComment(task.id, user?.id ?? CURRENT_USER.id, body.trim());
    setBody("");
  };

  return (
    <div>
      <h3 className="mb-3 text-[13px] font-semibold">Comments</h3>

      <div className="space-y-4">
        {task.comments.map((c) => {
          const author = getMember(c.authorId) ?? CURRENT_USER;
          return (
            <div key={c.id} className="flex gap-2.5">
              <Avatar member={author} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium">{author.name}</span>
                  <span className="text-[11px] text-faint">
                    {relativeTime(c.createdAt)}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-muted">{c.body}</p>
              </div>
            </div>
          );
        })}
        {task.comments.length === 0 && (
          <p className="text-[13px] text-faint">No comments yet.</p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border-default bg-surface px-3 py-2 focus-within:border-border-strong">
        <Avatar member={CURRENT_USER} size="md" />
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Add a comment..."
          className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-faint"
        />
        <button
          onClick={send}
          disabled={!body.trim()}
          className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-fg transition-opacity disabled:opacity-40"
          aria-label="Send comment"
        >
          <SendHorizonal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
