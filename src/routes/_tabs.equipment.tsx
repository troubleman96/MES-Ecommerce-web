import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Inbox } from "lucide-react";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { EmptyState } from "@/components/ui/empty-state";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { MesButton } from "@/components/ui/mes-button";
import { equipment, type EquipmentCategory } from "@/lib/mock-data";

const CATEGORIES: (EquipmentCategory | "All")[] = [
  "All",
  "Diagnostic",
  "ICU",
  "Surgical",
  "Rehabilitation",
  "Monitoring",
  "Imaging",
];

export const Route = createFileRoute("/_tabs/equipment")({
  head: () => ({ meta: [{ title: "Browse equipment — MES" }] }),
  component: BrowsePage,
});

function BrowsePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [showFilter, setShowFilter] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  const items = useMemo(() => {
    return equipment.filter((e) => {
      if (cat !== "All" && e.category !== cat) return false;
      if (availableOnly && e.availability !== "available") return false;
      if (q && !`${e.name} ${e.supplierName} ${e.category}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      return true;
    });
  }, [q, cat, availableOnly]);

  return (
    <div>
      <TopAppBar
        title="Browse equipment"
        right={
          <button
            onClick={() => setShowFilter(true)}
            className="press-sm flex h-12 w-12 items-center justify-center rounded-full text-foreground"
            aria-label="Filters"
          >
            <SlidersHorizontal size={20} />
          </button>
        }
      />

      <div className="sticky top-14 z-20 bg-background/95 px-5 pb-3 pt-3 backdrop-blur">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search equipment, category…"
            className="h-12 w-full rounded-xl border border-input bg-surface pl-11 pr-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none]">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`press-sm h-9 shrink-0 rounded-full border px-4 text-xs font-semibold transition ${
                cat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-3 text-xs">
        <span className="text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{items.length}</span> items
        </span>
        <button className="font-semibold text-primary">Sort: Most available ▾</button>
      </div>

      <div className="space-y-4 px-5 pb-8">
        {items.length === 0 ? (
          <EmptyState
            icon={<Inbox size={32} />}
            title="No equipment found"
            description="Try adjusting your filters or search terms."
            action={
              <MesButton fullWidth variant="secondary" onClick={() => { setQ(""); setCat("All"); setAvailableOnly(false); }}>
                Clear filters
              </MesButton>
            }
          />
        ) : (
          items.map((e) => <EquipmentCard key={e.id} item={e} />)
        )}
      </div>

      <BottomSheet
        open={showFilter}
        onClose={() => setShowFilter(false)}
        title="Filters"
        footer={
          <MesButton fullWidth size="lg" onClick={() => setShowFilter(false)}>
            Apply filters
          </MesButton>
        }
      >
        <FilterSection label="Category">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.filter((c) => c !== "All").map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`press-sm h-10 rounded-full border px-4 text-xs font-semibold ${
                  cat === c
                    ? "border-primary bg-blue-50 text-primary dark:bg-blue-950/40"
                    : "border-border bg-surface text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </FilterSection>
        <FilterSection label="Price per day (TZS)">
          <input
            type="range"
            min={0}
            max={500000}
            step={5000}
            defaultValue={250000}
            className="w-full accent-[var(--color-primary)]"
          />
          <div className="font-mono-num mt-1 flex justify-between text-xs text-muted-foreground">
            <span>TZS 0</span>
            <span>TZS 500,000</span>
          </div>
        </FilterSection>
        <FilterSection label="Availability">
          <label className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
            <span className="text-sm font-medium text-foreground">Available now only</span>
            <Switch checked={availableOnly} onChange={setAvailableOnly} />
          </label>
        </FilterSection>
        <FilterSection label="Location">
          <select className="h-12 w-full rounded-xl border border-input bg-surface px-4 text-sm">
            <option>All cities</option>
            <option>Dar es Salaam</option>
            <option>Arusha</option>
            <option>Dodoma</option>
            <option>Mwanza</option>
          </select>
        </FilterSection>
        <FilterSection label="Condition">
          <div className="grid grid-cols-3 gap-2">
            {["New", "Excellent", "Good"].map((c) => (
              <button
                key={c}
                className="press-sm h-10 rounded-xl border border-border bg-surface text-xs font-semibold text-foreground"
              >
                {c}
              </button>
            ))}
          </div>
        </FilterSection>
      </BottomSheet>
    </div>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </h4>
      {children}
    </div>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition ${
        checked ? "bg-primary" : "bg-border"
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
          checked ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}
