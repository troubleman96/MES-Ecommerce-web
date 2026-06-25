import type { ReactNode } from "react";

interface BadgeProps {
  tone?: "success" | "warning" | "danger" | "info" | "muted" | "primary";
  children: ReactNode;
  className?: string;
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  success: "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900",
  warning: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  danger: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
  info: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
  muted: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  primary: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
};

export function Badge({ tone = "info", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`font-mono-num inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${toneStyles[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusDot({ tone }: { tone: BadgeProps["tone"] }) {
  const colors: Record<NonNullable<BadgeProps["tone"]>, string> = {
    success: "bg-green-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-sky-500",
    muted: "bg-slate-400",
    primary: "bg-blue-500",
  };
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${colors[tone ?? "info"]}`}
    />
  );
}
