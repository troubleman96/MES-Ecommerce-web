import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { StatusDot } from "@/components/ui/mes-badge";
import { notifications } from "@/lib/mock-data";

const TABS = ["All", "Bookings", "Payments", "Returns", "System"] as const;

export const Route = createFileRoute("/_tabs/notifications")({
  head: () => ({ meta: [{ title: "Notifications — MES" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [items, setItems] = useState(notifications);

  const filtered = items.filter((n) => {
    if (tab === "All") return true;
    return n.type === tab.toLowerCase().replace(/s$/, "");
  });

  return (
    <div>
      <TopAppBar
        title="Notifications"
        showBell={false}
        right={
          <button
            onClick={() => setItems(items.map((n) => ({ ...n, unread: false })))}
            className="press-sm h-10 px-3 text-xs font-semibold text-primary"
          >
            Mark all read
          </button>
        }
      />
      <div className="-mx-1 flex gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`press-sm h-9 shrink-0 rounded-full border px-4 text-xs font-semibold ${
              tab === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <ul className="px-5 pb-6">
        {filtered.map((n) => (
          <li
            key={n.id}
            className={`relative -mx-2 flex gap-3 rounded-2xl px-4 py-4 ${
              n.unread ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
            }`}
          >
            {n.unread && (
              <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
            )}
            <div className="pt-1.5">
              <StatusDot
                tone={
                  n.tone === "danger"
                    ? "danger"
                    : n.tone === "success"
                      ? "success"
                      : n.tone === "warning"
                        ? "warning"
                        : "info"
                }
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
              </div>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
