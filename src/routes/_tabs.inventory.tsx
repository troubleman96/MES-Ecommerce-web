import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, MoreVertical, Package, X } from "lucide-react";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { Badge } from "@/components/ui/mes-badge";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { MesButton } from "@/components/ui/mes-button";
import { equipment } from "@/lib/mock-data";
import { formatTzs, statusLabel, statusTone } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_tabs/inventory")({
  head: () => ({ meta: [{ title: "Inventory — MES" }] }),
  component: InventoryPage,
});

function InventoryPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [step, setStep] = useState(0);

  return (
    <div>
      <TopAppBar
        title="My equipment"
        showBell={false}
        right={
          <button
            onClick={() => {
              setStep(0);
              setShowAdd(true);
            }}
            className="press flex h-10 items-center gap-1 rounded-xl bg-primary px-3 text-sm font-semibold text-primary-foreground"
          >
            <Plus size={16} /> Add
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-2 px-5 py-3">
        <Stat label="Listed" value="24" />
        <Stat label="Available" value="18" tone="success" />
        <Stat label="Rented" value="6" tone="primary" />
        <Stat label="Maint." value="2" tone="warning" />
      </div>

      <div className="space-y-2 px-5 pb-6">
        {equipment.map((e) => (
          <div
            key={e.id}
            className="press-sm flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 shadow-[var(--shadow-card)]"
          >
            <div
              className="h-16 w-16 shrink-0 rounded-xl"
              style={{ background: e.image }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{e.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono-num rounded-md bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {e.category}
                </span>
                <span className="font-mono-num text-xs font-bold text-primary">
                  {formatTzs(e.pricePerDay)}
                  <span className="text-[10px] font-medium text-muted-foreground">/d</span>
                </span>
              </div>
              <div className="mt-1">
                <Badge tone={statusTone(e.availability === "available" ? "available" : e.availability === "in-use" ? "active" : "maintenance")}>
                  {e.availability === "available" ? "Available" : e.availability === "in-use" ? "Rented" : "Maintenance"}
                </Badge>
              </div>
            </div>
            <button
              className="press-sm flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground"
              aria-label="More"
              onClick={() => toast("Menu opened")}
            >
              <MoreVertical size={18} />
            </button>
          </div>
        ))}
      </div>

      <BottomSheet
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add equipment"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <MesButton variant="outline" fullWidth onClick={() => toast("Draft saved")}>
              Save draft
            </MesButton>
            <MesButton
              fullWidth
              onClick={() => {
                if (step < 2) setStep(step + 1);
                else {
                  toast.success("Submitted for review");
                  setShowAdd(false);
                }
              }}
            >
              {step < 2 ? "Next" : "Submit"}
            </MesButton>
          </div>
        }
      >
        <div className="mb-4 flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
        <h3 className="mb-4 text-base font-bold">
          {step === 0 ? "Basic info" : step === 1 ? "Photos" : "Pricing & availability"}
        </h3>

        {step === 0 && (
          <div className="space-y-3">
            <Input label="Equipment name" placeholder="e.g. Portable Ultrasound" />
            <Field label="Category">
              <select className="h-12 w-full rounded-xl border border-input bg-surface px-4 text-sm">
                <option>Diagnostic</option>
                <option>ICU</option>
                <option>Surgical</option>
                <option>Monitoring</option>
                <option>Imaging</option>
                <option>Rehabilitation</option>
              </select>
            </Field>
            <Field label="Description">
              <textarea rows={3} className="mes-input min-h-[88px] py-3" placeholder="Brief description…" />
            </Field>
            <Field label="Condition">
              <select className="h-12 w-full rounded-xl border border-input bg-surface px-4 text-sm">
                <option>New</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
              </select>
            </Field>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <button
                  key={i}
                  className="press-sm flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary text-muted-foreground"
                >
                  <Plus size={20} />
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Upload up to 8 photos. The first photo will be the cover.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <Input label="Daily rate (TZS)" placeholder="45000" />
            <Input label="Weekly rate (TZS, optional)" placeholder="280000" />
            <Input label="Monthly rate (TZS, optional)" placeholder="1100000" />
            <Field label="Deposit required">
              <div className="flex h-12 items-center gap-3 rounded-xl border border-border bg-surface px-4">
                <span className="text-sm font-medium">Require deposit</span>
                <div className="flex-1" />
                <button className="press relative h-7 w-12 rounded-full bg-primary">
                  <span className="absolute left-5 top-0.5 h-6 w-6 rounded-full bg-white shadow" />
                </button>
              </div>
            </Field>
            <Field label="Delivery">
              <input className="mes-input" placeholder="Radius (km), e.g. 25" />
            </Field>
          </div>
        )}
      </BottomSheet>

      <style>{`
        .mes-input { width:100%; height:48px; padding:0 16px; border-radius:12px; border:1px solid var(--color-input); background:var(--color-surface); color:var(--color-foreground); font-size:15px; outline:none; }
        .mes-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 25%, transparent); }
      `}</style>
    </div>
  );
}

function Stat({ label, value, tone = "muted" }: { label: string; value: string; tone?: "muted" | "success" | "primary" | "warning" }) {
  const colors: Record<string, string> = {
    muted: "text-foreground",
    success: "text-green-700 dark:text-green-300",
    primary: "text-primary",
    warning: "text-amber-700 dark:text-amber-300",
  };
  return (
    <div className="rounded-xl border border-border bg-surface p-2 text-center">
      <div className={`font-mono-num text-base font-extrabold ${colors[tone]}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function Input({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <Field label={label}>
      <input className="mes-input" placeholder={placeholder} />
    </Field>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-foreground">{label}</label>
      {children}
    </div>
  );
}

void Package; void X;
