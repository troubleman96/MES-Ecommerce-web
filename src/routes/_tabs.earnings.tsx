import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { Badge } from "@/components/ui/mes-badge";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { MesButton } from "@/components/ui/mes-button";
import {
  earningsRows,
  payoutHistory,
  revenueSeries,
} from "@/lib/mock-data";
import { formatTzs, statusLabel, statusTone } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_tabs/earnings")({
  head: () => ({ meta: [{ title: "Earnings — MES" }] }),
  component: EarningsPage,
});

function EarningsPage() {
  const [showPayout, setShowPayout] = useState(false);
  const [amount, setAmount] = useState("320000");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div>
      <TopAppBar title="Earnings" showBell unreadCount={2} />

      {/* Balance card */}
      <div className="px-5 pt-2">
        <div className="rounded-3xl bg-primary p-5 text-primary-foreground shadow-[var(--shadow-elevated)]">
          <p className="text-xs text-white/80">Available balance</p>
          <p className="font-mono-num mt-1 text-3xl font-extrabold">{formatTzs(320000)}</p>
          <p className="mt-1 text-xs text-white/80">
            Pending: <span className="font-mono-num">{formatTzs(80000)}</span> (48h escrow)
          </p>
          <button
            onClick={() => setShowPayout(true)}
            className="press mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl bg-white text-sm font-bold text-primary"
          >
            Request payout →
          </button>
        </div>
      </div>

      {/* Chart */}
      <section className="px-5 pt-6">
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
          <div className="mb-1 flex items-baseline justify-between">
            <h2 className="text-sm font-bold text-foreground">Revenue (30 days)</h2>
            <span className="font-mono-num text-xs text-muted-foreground">TZS '000</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[...revenueSeries, ...revenueSeries, ...revenueSeries, ...revenueSeries].slice(0, 30).map((d, i) => ({ ...d, day: `${i + 1}` }))} margin={{ left: -20, right: 4, top: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, fontFamily: "JetBrains Mono", fontSize: 12 }} formatter={(v: number) => [`TZS ${v}k`, "Revenue"]} />
                <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Earnings table */}
      <section className="px-5 pt-6">
        <h2 className="mb-3 text-base font-bold text-foreground">Earnings</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-secondary text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5">Equipment</th>
                  <th className="px-3 py-2.5">Facility</th>
                  <th className="px-3 py-2.5">Period</th>
                  <th className="px-3 py-2.5 text-right">Gross</th>
                  <th className="px-3 py-2.5 text-right">Fee</th>
                  <th className="px-3 py-2.5 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {earningsRows.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-3 py-3 font-semibold text-foreground">{r.equipment}</td>
                    <td className="px-3 py-3 text-muted-foreground">{r.facility}</td>
                    <td className="font-mono-num px-3 py-3 text-muted-foreground">{r.period}</td>
                    <td className="font-mono-num px-3 py-3 text-right text-foreground">{formatTzs(r.gross, { compact: true })}</td>
                    <td className="font-mono-num px-3 py-3 text-right text-muted-foreground">−{formatTzs(r.fee, { compact: true })}</td>
                    <td className="font-mono-num px-3 py-3 text-right font-bold text-primary">{formatTzs(r.net, { compact: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Payout history */}
      <section className="px-5 pb-8 pt-6">
        <h2 className="mb-3 text-base font-bold text-foreground">Payout history</h2>
        <div className="space-y-2">
          {payoutHistory.map((p) => (
            <div key={p.ref} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-primary dark:bg-blue-950/40">
                {p.method[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-num text-sm font-bold text-foreground">{formatTzs(p.amount)}</span>
                  <Badge tone={statusTone(p.status)}>{statusLabel(p.status)}</Badge>
                </div>
                <div className="font-mono-num mt-0.5 flex justify-between text-[11px] text-muted-foreground">
                  <span>{p.date} · {p.phone}</span>
                  <span>{p.ref}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BottomSheet
        open={showPayout}
        onClose={() => setShowPayout(false)}
        title="Request payout"
        footer={
          <MesButton
            fullWidth
            size="lg"
            loading={submitting}
            onClick={() => {
              setSubmitting(true);
              setTimeout(() => {
                setSubmitting(false);
                setShowPayout(false);
                toast.success("Payout request sent");
              }, 1200);
            }}
          >
            Confirm & send
          </MesButton>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mobile money method
            </p>
            <div className="grid grid-cols-3 gap-2">
              {["M-Pesa", "Airtel", "Tigo"].map((m, i) => (
                <button
                  key={m}
                  className={`press-sm h-12 rounded-xl border-2 text-sm font-semibold ${
                    i === 0 ? "border-primary bg-blue-50 text-primary dark:bg-blue-950/40" : "border-border bg-surface text-muted-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold">Phone</label>
            <input
              className="font-mono-num h-12 w-full rounded-xl border border-input bg-surface px-4 text-[15px]"
              defaultValue="+255 754 987 321"
            />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between">
              <label className="text-xs font-semibold">Amount (TZS)</label>
              <button onClick={() => setAmount("320000")} className="text-xs font-semibold text-primary">
                Max
              </button>
            </div>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-mono-num h-12 w-full rounded-xl border border-input bg-surface px-4 text-[15px]"
            />
          </div>
          <div className="rounded-2xl bg-secondary p-4 text-center">
            <p className="text-xs text-muted-foreground">You'll receive</p>
            <p className="font-mono-num mt-1 text-xl font-extrabold text-primary">
              {formatTzs(Number(amount) || 0)}
            </p>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
