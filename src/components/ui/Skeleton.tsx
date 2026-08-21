import { cn } from "@/lib/utils";

/** Pulsing placeholder block used while data loads. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-hover", className)}
      aria-hidden
    />
  );
}

/** Small inline spinner. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
      aria-hidden
    />
  );
}
