"use client";

import { CURRENT_USER } from "@/lib/seed";
import type { Task } from "@/lib/types";
import { formatShort, getMember } from "@/lib/utils";
import { ArrowRightLeft, MessageSquareText } from "lucide-react";

function authorName(id: string) {
  if (id === CURRENT_USER.id) return "You";
  return getMember(id)?.name ?? "Someone";
}

export function UpdatesFeed({ task }: { task: Task }) {
  return (
    <div className="mt-3 rounded-xl border border-border-default bg-surface-2 p-3">
      <div className="mb-2 px-1 text-[13px] font-semibold">Updates</div>

      {task.activity.length === 0 ? (
        <p className="px-1 pb-1 text-[12px] text-faint">No updates yet.</p>
      ) : (
        <ol className="space-y-3">
          {task.activity.map((a) => (
            <li key={a.id} className="flex gap-2.5">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface text-muted">
                {a.kind === "change" ? (
                  <ArrowRightLeft className="h-3 w-3" />
                ) : (
                  <MessageSquareText className="h-3 w-3" />
                )}
              </span>
              <div className="min-w-0 flex-1 text-[12px] leading-relaxed">
                {a.kind === "change" ? (
                  <p className="text-muted">
                    <span className="font-medium text-text">{authorName(a.authorId)}</span>{" "}
                    changed {a.field} from{" "}
                    <span className="font-medium text-text">{a.from}</span> to{" "}
                    <span className="font-medium text-text">{a.to}</span>
                  </p>
                ) : (
                  <p className="text-muted">
                    <span className="font-medium text-text">{authorName(a.authorId)}</span>{" "}
                    {a.note}
                  </p>
                )}
                <span className="text-[11px] text-faint">{formatShort(a.createdAt)}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
