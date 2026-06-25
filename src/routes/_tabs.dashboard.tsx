import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  ClipboardList,
  CreditCard,
  FileText,
  TrendingUp,
  Package,
  Wallet,
  BarChart3,
  Plus,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useApp } from "@/lib/app-context";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { Badge, StatusDot } from "@/components/ui/mes-badge";
import { formatTzs, statusLabel, statusTone } from "@/lib/format";
import {
  bookings,
  notifications,
  revenueSeries,
  supplierBookings,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_tabs/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MES" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useApp();
  if (!user) return null;
  return user.role === "facility" ? <FacilityHome /> : <SupplierHome />;
}

function FacilityHome() {
  const { user } = useApp();
  const activeRentals = bookings.filter(
    (b) => b.status === "active" || b.status === "due-soon" || b.status === "overdue",
  );
  return (
    <div>
      <TopAppBar
        title=""
        showBell
        unreadCount={notifications.filter((n) => n.unread).length}
      />
      <div className="px-5 pb-6 pt-2">
        <p className="text-sm text-muted-foreground">Good morning</p>
        <h1 className="text-xl font-extrabold tracking-tight text-foreground">
          {user?.organization} 👋
        </h1>
      </div>

      {/* Stats */}
      <div className="-mx-1 flex gap-3 overflow-x-auto px-5 pb-4 [scrollbar-width:none]">
        <StatCard label="Active rentals" value="4" tone="primary" icon={<Package size={18} />} />
        <StatCard label="Upcoming returns" value="2" tone="warning" icon={<ClipboardList size={18} />} />
        <StatCard label="Pending payments" value="1" tone="danger" icon={<CreditCard size={18} />} />
        <StatCard label="Open requests" value="3" tone="info" icon={<FileText size={18} />} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 px-5 pt-2">
        <QuickAction to="/equipment" icon={<Search size={20} />} label="Browse equipment" />
        <QuickAction to="/bookings/new" icon={<ClipboardList size={20} />} label="New request" />
        <QuickAction to="/bookings" icon={<CreditCard size={20} />} label="Make payment" />
        <QuickAction to="/contracts" icon={<FileText size={20} />} label="View contracts" />
      </div>

      {/* Active rentals */}
      <section className="px-5 pt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-bold text-foreground">Active rentals</h2>
          <Link to="/bookings" className="text-xs font-semibold text-primary">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {activeRentals.map((b) => (
            <Link
              key={b.id}
              to="/bookings"
              className="press-sm block rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {b.equipmentName}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{b.supplierName}</p>
                  <p className="font-mono-num mt-2 text-xs text-foreground">
                    {b.startDate} → {b.endDate}
                  </p>
                </div>
                <Badge tone={statusTone(b.status)}>{statusLabel(b.status)}</Badge>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="px-5 pt-8">
        <h2 className="mb-3 text-base font-bold text-foreground">Recent alerts</h2>
        <ul className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
          {notifications.slice(0, 4).map((n, i) => (
            <li
              key={n.id}
              className={`flex items-start gap-3 p-4 ${
                i < 3 ? "border-b border-border" : ""
              }`}
            >
              <StatusDot tone={n.tone === "danger" ? "danger" : n.tone === "success" ? "success" : n.tone === "warning" ? "warning" : "info"} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {n.body}
                </p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function SupplierHome() {
  const { user } = useApp();
  return (
    <div>
      <TopAppBar title="" showBell unreadCount={2} />
      <div className="px-5 pb-6 pt-2">
        <p className="text-sm text-muted-foreground">Hello</p>
        <h1 className="text-xl font-extrabold tracking-tight text-foreground">
          {user?.organization} 👋
        </h1>
      </div>

      <div className="-mx-1 flex gap-3 overflow-x-auto px-5 pb-4 [scrollbar-width:none]">
        <StatCard
          label="Revenue this month"
          value={formatTzs(1240000, { compact: true })}
          tone="primary"
          icon={<TrendingUp size={18} />}
        />
        <StatCard label="Active rentals" value="11" tone="info" icon={<Package size={18} />} />
        <StatCard label="Equipment listed" value="24" tone="success" icon={<BarChart3 size={18} />} />
        <StatCard label="Avg rating" value="4.8 ★" tone="warning" icon={<TrendingUp size={18} />} />
      </div>

      {/* Chart */}
      <section className="px-5 pt-2">
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
          <div className="mb-1 flex items-baseline justify-between">
            <h2 className="text-sm font-bold text-foreground">Revenue (7 days)</h2>
            <span className="font-mono-num text-xs text-muted-foreground">TZS '000</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -20, right: 4, top: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontFamily: "JetBrains Mono",
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`TZS ${v}k`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fill="url(#revGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Recent bookings */}
      <section className="px-5 pt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-bold text-foreground">Recent bookings</h2>
          <Link to="/bookings" className="text-xs font-semibold text-primary">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {supplierBookings.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {b.facility}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {b.equipment}
                  </p>
                  <p className="font-mono-num mt-2 text-xs text-foreground">
                    {b.period} ·{" "}
                    <span className="font-bold text-primary">{formatTzs(b.amount)}</span>
                  </p>
                </div>
                <Badge tone={statusTone(b.status)}>{statusLabel(b.status)}</Badge>
              </div>
              {b.status === "pending" && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button className="press h-10 rounded-xl border border-border bg-surface text-sm font-semibold text-foreground">
                    Decline
                  </button>
                  <button className="press h-10 rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                    Confirm
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-2 gap-3 px-5 pt-6">
        <QuickAction to="/inventory" icon={<Plus size={20} />} label="Add equipment" />
        <QuickAction to="/inventory" icon={<Package size={20} />} label="Manage inventory" />
        <QuickAction to="/earnings" icon={<Wallet size={20} />} label="Request payout" />
        <QuickAction to="/earnings" icon={<BarChart3 size={20} />} label="View analytics" />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: "primary" | "info" | "warning" | "success" | "danger";
  icon: React.ReactNode;
}) {
  const colors: Record<typeof tone, string> = {
    primary: "text-primary bg-blue-50 dark:bg-blue-950/40",
    info: "text-sky-600 bg-sky-50 dark:bg-sky-950/40",
    warning: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
    success: "text-green-600 bg-green-50 dark:bg-green-950/40",
    danger: "text-red-600 bg-red-50 dark:bg-red-950/40",
  };
  return (
    <div className="w-[44%] shrink-0 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${colors[tone]}`}>
        {icon}
      </div>
      <div className="font-mono-num text-xl font-bold text-foreground">{value}</div>
      <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{label}</div>
    </div>
  );
}

function QuickAction({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="press-sm flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-primary dark:bg-blue-950/40">
        {icon}
      </div>
      <span className="text-[13px] font-semibold leading-tight text-foreground">
        {label}
      </span>
    </Link>
  );
}
