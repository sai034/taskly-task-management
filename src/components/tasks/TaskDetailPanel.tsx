"use client";

import { DatePicker } from "@/components/pickers/DatePicker";
import { LabelPicker } from "@/components/pickers/LabelPicker";
import { MemberPicker } from "@/components/pickers/MemberPicker";
import { PriorityPicker } from "@/components/pickers/PriorityPicker";
import { StatusPicker } from "@/components/pickers/StatusPicker";
import { TeamPicker, TeamPill } from "@/components/pickers/TeamPicker";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { PriorityTag } from "@/components/ui/Priority";
import { LabelPill, StatusDot } from "@/components/ui/Tags";
import { CURRENT_USER } from "@/lib/seed";
import { useTaskStore } from "@/lib/store";
import { priorityMeta, statusMeta, type Priority, type Status, type Task } from "@/lib/types";
import { formatDate, getMember } from "@/lib/utils";
import { CalendarDays, Plus, Settings2, Tag, Users, UsersRound } from "lucide-react";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[84px_1fr] items-start gap-2 py-1.5">
      <span className="pt-1.5 text-[12px] font-medium text-muted">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function TaskDetailPanel({ task }: { task: Task }) {
  const { updateTask, logActivity } = useTaskStore();
  const reporter = getMember(task.reporterId);

  const changePriority = (p: Priority) => {
    if (p === task.priority) return;
    updateTask(task.id, { priority: p });
    logActivity(task.id, {
      authorId: CURRENT_USER.id,
      kind: "change",
      field: "priority",
      from: priorityMeta(task.priority).label,
      to: priorityMeta(p).label,
    });
  };

  const changeStatus = (s: Status) => {
    if (s === task.status) return;
    updateTask(task.id, { status: s });
    logActivity(task.id, {
      authorId: CURRENT_USER.id,
      kind: "change",
      field: "status",
      from: statusMeta(task.status).label,
      to: statusMeta(s).label,
    });
  };

  return (
    <div className="rounded-xl border border-border-default bg-surface-2 p-3">
      <div className="mb-1 flex items-center justify-between px-1">
        <span className="text-[13px] font-semibold">Details</span>
        <div className="flex items-center gap-0.5 text-faint">
          <button className="grid h-6 w-6 place-items-center rounded-md hover:bg-hover hover:text-text">
            <Plus className="h-4 w-4" />
          </button>
          <button className="grid h-6 w-6 place-items-center rounded-md hover:bg-hover hover:text-text">
            <Settings2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <Row label="Status">
        <StatusPicker value={task.status} onChange={changeStatus}>
          <button className="inline-flex items-center rounded-md px-1.5 py-1 hover:bg-hover">
            <StatusDot status={task.status} />
          </button>
        </StatusPicker>
      </Row>

      <Row label="Priority">
        <PriorityPicker value={task.priority} onChange={changePriority}>
          <button className="inline-flex items-center rounded-md px-1.5 py-1 hover:bg-hover">
            <PriorityTag priority={task.priority} />
          </button>
        </PriorityPicker>
      </Row>

      <Row label="Members">
        <MemberPicker
          value={task.memberIds}
          onChange={(ids) => updateTask(task.id, { memberIds: ids })}
        >
          <button className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] text-muted hover:bg-hover">
            {task.memberIds.length ? (
              <AvatarGroup ids={task.memberIds} />
            ) : (
              <>
                <Users className="h-3.5 w-3.5" />
                <span className="text-faint">Add members</span>
              </>
            )}
          </button>
        </MemberPicker>
      </Row>

      <Row label="Dates">
        <div className="flex items-center gap-1 text-[13px]">
          <DatePicker
            value={task.startDate}
            onChange={(d) => updateTask(task.id, { startDate: d })}
            placeholder="Start"
          />
          <span className="text-faint">→</span>
          <DatePicker
            value={task.dueDate}
            onChange={(d) => updateTask(task.id, { dueDate: d })}
            placeholder="End"
          />
        </div>
      </Row>

      <Row label="Labels">
        <LabelPicker
          value={task.labels}
          onChange={(l) => updateTask(task.id, { labels: l })}
        >
          <button className="flex flex-wrap items-center gap-1 rounded-md px-1.5 py-1 text-left hover:bg-hover">
            {task.labels.length ? (
              task.labels.map((l) => <LabelPill key={l} label={l} />)
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[13px] text-faint">
                <Tag className="h-3.5 w-3.5" /> Add labels
              </span>
            )}
          </button>
        </LabelPicker>
      </Row>

      <Row label="Teams">
        <TeamPicker
          value={task.teams}
          onChange={(t) => updateTask(task.id, { teams: t })}
        >
          <button className="flex flex-wrap items-center gap-1 rounded-md px-1.5 py-1 text-left hover:bg-hover">
            {task.teams.length ? (
              task.teams.map((t) => <TeamPill key={t} team={t} />)
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[13px] text-faint">
                <UsersRound className="h-3.5 w-3.5" /> Add teams
              </span>
            )}
          </button>
        </TeamPicker>
      </Row>

      <Row label="Reporter">
        {reporter ? (
          <span className="inline-flex items-center gap-1.5 px-1.5 py-1 text-[13px]">
            <Avatar member={reporter} size="sm" />
            {reporter.name}
          </span>
        ) : (
          <span className="px-1.5 text-[13px] text-faint">—</span>
        )}
      </Row>

      {task.dueDate && (
        <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-border-default bg-surface px-2.5 py-2 text-[12px] text-muted">
          <CalendarDays className="h-3.5 w-3.5" />
          Due {formatDate(task.dueDate)}
        </div>
      )}
    </div>
  );
}
