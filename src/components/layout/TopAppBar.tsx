import { Link, useRouter } from "@tanstack/react-router";
import { Bell, ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface TopAppBarProps {
  title?: string;
  back?: boolean;
  backTo?: string;
  right?: ReactNode;
  showBell?: boolean;
  unreadCount?: number;
  transparent?: boolean;
}

export function TopAppBar({
  title,
  back,
  backTo,
  right,
  showBell = true,
  unreadCount = 2,
  transparent,
}: TopAppBarProps) {
  const router = useRouter();
  return (
    <header
      className={`safe-top sticky top-0 z-30 flex h-14 items-center justify-between px-3 ${
        transparent
          ? "bg-transparent"
          : "border-b border-border bg-surface/95 backdrop-blur"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1">
        {back ? (
          backTo ? (
            <Link
              to={backTo}
              className="press-sm flex h-12 w-12 items-center justify-center rounded-full text-foreground"
              aria-label="Back"
            >
              <ChevronLeft size={24} />
            </Link>
          ) : (
            <button
              onClick={() => router.history.back()}
              className="press-sm flex h-12 w-12 items-center justify-center rounded-full text-foreground"
              aria-label="Back"
            >
              <ChevronLeft size={24} />
            </button>
          )
        ) : (
          <div className="w-3" />
        )}
        {title && (
          <h1 className="truncate text-base font-semibold text-foreground">
            {title}
          </h1>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {right}
        {showBell && (
          <Link
            to="/notifications"
            className="press-sm relative flex h-12 w-12 items-center justify-center rounded-full text-foreground"
            aria-label="Notifications"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="font-mono-num absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
