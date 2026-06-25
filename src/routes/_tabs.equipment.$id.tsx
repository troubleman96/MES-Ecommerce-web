import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Star, MapPin, Check, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/mes-badge";
import { MesButton } from "@/components/ui/mes-button";
import { equipment } from "@/lib/mock-data";
import { formatTzs } from "@/lib/format";

export const Route = createFileRoute("/_tabs/equipment/$id")({
  loader: ({ params }) => {
    const item = equipment.find((e) => e.id === params.id);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Equipment"} — MES` },
      { name: "description", content: loaderData?.description ?? "" },
    ],
  }),
  component: EquipmentDetailPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-lg font-bold">Equipment not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This listing may have been removed.
        </p>
      </div>
    </div>
  ),
});

function EquipmentDetailPage() {
  const item = Route.useLoaderData() as (typeof equipment)[number];
  const navigate = useNavigate();
  const [tab, setTab] = useState<"overview" | "specs" | "reviews">("overview");

  return (
    <div className="pb-32">
      {/* Hero */}
      <div className="relative">
        <div
          className="aspect-[16/11] w-full"
          style={{ background: item.image }}
        />
        <button
          onClick={() => navigate({ to: "/equipment" })}
          className="press-sm absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-foreground shadow"
          aria-label="Back"
        >
          <ChevronLeft size={22} />
        </button>
        {item.verified && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-green-700 shadow">
            <ShieldCheck size={14} /> Verified by MES
          </div>
        )}
      </div>

      <div className="px-5 pt-5">
        <div className="flex flex-wrap gap-2">
          <Badge tone="muted">{item.category}</Badge>
          <Badge tone="info">{item.condition}</Badge>
          {item.verified && <Badge tone="success">✓ Verified</Badge>}
        </div>
        <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-foreground">
          {item.name}
        </h1>

        {/* Supplier row */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-primary dark:bg-blue-950/40">
            {item.supplierName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-semibold text-foreground">
                {item.supplierName}
              </p>
              {item.verified && <ShieldCheck size={14} className="text-green-600" />}
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={12} /> {item.city} · Usually responds in 2h
            </p>
          </div>
          <button className="press-sm shrink-0 text-xs font-semibold text-primary">
            View →
          </button>
        </div>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2 text-sm">
          <Star size={16} className="fill-amber-400 stroke-amber-400" />
          <span className="font-mono-num font-bold text-foreground">{item.rating}</span>
          <span className="text-muted-foreground">· {item.rentals} rentals</span>
        </div>

        {/* Tabs */}
        <div className="mt-5 grid grid-cols-3 border-b border-border">
          {(["overview", "specs", "reviews"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`press-sm pb-3 text-sm font-semibold capitalize transition ${
                tab === t
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="pt-5">
          {tab === "overview" && (
            <>
              <p className="text-sm leading-relaxed text-foreground">
                {item.description}
              </p>
              <ul className="mt-5 space-y-3">
                {item.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary dark:bg-blue-950/40">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-sm text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {tab === "specs" && (
            <div className="overflow-hidden rounded-2xl border border-border">
              {item.specs.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i < item.specs.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className="font-mono-num text-sm font-semibold text-foreground">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          )}
          {tab === "reviews" && (
            <div>
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
                <div>
                  <div className="font-mono-num text-3xl font-extrabold text-foreground">
                    {item.rating}
                  </div>
                  <div className="mt-1 flex">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={14}
                        className={
                          n <= Math.round(item.rating)
                            ? "fill-amber-400 stroke-amber-400"
                            : "stroke-border"
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <div key={n} className="flex items-center gap-2">
                      <span className="font-mono-num w-3 text-[10px] text-muted-foreground">
                        {n}
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-amber-400"
                          style={{ width: `${n === 5 ? 78 : n === 4 ? 18 : n === 3 ? 4 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { who: "Muhimbili District Hospital", date: "10 Jun 2025", r: 5, txt: "Worked flawlessly through a 3-week rental. Operator training was excellent." },
                  { who: "Aga Khan Dispensary", date: "28 May 2025", r: 5, txt: "Delivered on time and well-calibrated. Will rent again." },
                ].map((r) => (
                  <div key={r.who} className="rounded-2xl border border-border bg-surface p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{r.who}</p>
                      <span className="font-mono-num text-[11px] text-muted-foreground">
                        {r.date}
                      </span>
                    </div>
                    <div className="mt-1 flex">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={12}
                          className={
                            n <= r.r
                              ? "fill-amber-400 stroke-amber-400"
                              : "stroke-border"
                          }
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-foreground">{r.txt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="safe-bottom fixed bottom-0 left-1/2 z-30 w-full max-w-[440px] -translate-x-1/2 border-t border-border bg-surface p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="font-mono-num text-lg font-extrabold text-primary">
              {formatTzs(item.pricePerDay)}
              <span className="text-xs font-medium text-muted-foreground"> / day</span>
            </div>
          </div>
          <MesButton
            size="lg"
            onClick={() => navigate({ to: "/bookings/new", search: { eq: item.id } })}
            className="flex-1"
          >
            Request rental
          </MesButton>
        </div>
      </div>
    </div>
  );
}
