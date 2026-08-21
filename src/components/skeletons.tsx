import { Skeleton } from "@/components/ui/Skeleton";

export function BoardSkeleton() {
  return (
    <div className="flex h-full gap-4 overflow-hidden px-3 pb-4 pt-3 sm:px-4">
      {Array.from({ length: 4 }).map((_, c) => (
        <div key={c} className="flex w-[280px] shrink-0 flex-col sm:w-[300px]">
          <div className="mb-2 flex items-center gap-2 px-1">
            <Skeleton className="h-2.5 w-2.5" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 - (c % 2) }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border-default bg-surface p-3"
              >
                <Skeleton className="h-4 w-3/4" />
                <div className="mt-3 flex items-center justify-between">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="space-y-3 px-3 pb-6 pt-3 sm:px-4">
      {Array.from({ length: 3 }).map((_, g) => (
        <div
          key={g}
          className="overflow-hidden rounded-xl border border-border-default bg-surface"
        >
          <div className="flex items-center gap-2 bg-surface-2 px-4 py-2.5">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-28" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 border-t border-border-default px-4 py-3"
            >
              <Skeleton className="h-4 w-1/3" />
              <div className="hidden items-center gap-8 md:flex">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ProjectsSkeleton() {
  return (
    <div className="px-3 py-4 sm:px-4">
      <div className="overflow-hidden rounded-xl border border-border-default bg-surface">
        <div className="flex items-center gap-4 bg-surface-2 px-4 py-2.5">
          <Skeleton className="h-4 w-24" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 border-t border-border-default px-4 py-3.5"
          >
            <Skeleton className="h-4 w-40" />
            <div className="hidden items-center gap-8 md:flex">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TaskDetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_308px]">
        <div className="order-2 min-w-0 lg:order-1">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
          <div className="mt-6 space-y-2.5">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-6 w-72" />
          </div>
          <Skeleton className="mt-6 h-40 w-full rounded-xl" />
          <Skeleton className="mt-6 h-24 w-full rounded-xl" />
        </div>
        <div className="order-1 lg:order-2">
          <div className="space-y-3 rounded-xl border border-border-default bg-surface-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
