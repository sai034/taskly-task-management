import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Variant = "solid" | "accent" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  solid:
    "bg-solid text-solid-fg hover:bg-solid-hover shadow-sm",
  accent:
    "bg-accent text-accent-fg hover:bg-accent-hover shadow-sm",
  outline:
    "border border-border-strong bg-surface text-text hover:bg-hover",
  ghost: "text-muted hover:bg-hover hover:text-text",
  danger:
    "border border-p-urgent/30 bg-p-urgent/10 text-p-urgent hover:bg-p-urgent/15",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
  md: "h-9 px-4 text-sm gap-2 rounded-lg",
  icon: "h-8 w-8 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "outline", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex select-none items-center justify-center font-medium",
        "transition-colors duration-150 focus-accent disabled:pointer-events-none disabled:opacity-50",
        "active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
