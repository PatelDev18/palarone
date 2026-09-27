import React from "react"
import { cn } from "@/lib/utils"

export type StatusType =
  | "operational"
  | "nominal"
  | "active"
  | "success"
  | "warning"
  | "caution"
  | "standby"
  | "critical"
  | "alert"
  | "emergency"
  | "error"
  | "info"
  | "offline"
  | "unknown"

interface StatusBadgeProps {
  status: string
  label?: string
  pulse?: boolean
  showDot?: boolean
  className?: string
  size?: "sm" | "md"
}

export function StatusBadge({
  status,
  label,
  pulse = false,
  showDot = true,
  className,
  size = "md",
}: StatusBadgeProps) {
  const norm = (status || "").toLowerCase().trim()
  const displayLabel = label || status

  let dotColor = "bg-slate-400"
  let badgeClasses =
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700"

  if (["operational", "nominal", "active", "online", "success", "healthy", "ok"].includes(norm)) {
    dotColor = "bg-emerald-500"
    badgeClasses =
      "bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80"
  } else if (["warning", "caution", "standby", "in_transit", "moderate", "review"].includes(norm)) {
    dotColor = "bg-amber-500"
    badgeClasses =
      "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80"
  } else if (["critical", "alert", "emergency", "danger", "error", "severe", "sos"].includes(norm)) {
    dotColor = "bg-rose-500"
    badgeClasses =
      "bg-rose-50 text-rose-800 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80"
  } else if (["info", "planned", "processing", "analyzing"].includes(norm)) {
    dotColor = "bg-cyan-500"
    badgeClasses =
      "bg-cyan-50 text-cyan-800 border-cyan-200/80 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/80"
  }

  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-2 py-0.5 gap-1.5 font-medium"
      : "text-xs px-2.5 py-1 gap-1.5 font-semibold"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border transition-colors select-none tracking-wide",
        sizeClasses,
        badgeClasses,
        className
      )}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                dotColor
              )}
            />
          )}
          <span className={cn("relative inline-flex rounded-full h-2 w-2", dotColor)} />
        </span>
      )}
      <span>{displayLabel}</span>
    </span>
  )
}
