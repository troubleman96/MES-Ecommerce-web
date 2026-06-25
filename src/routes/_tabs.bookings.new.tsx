import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Check, Smartphone, ChevronLeft } from "lucide-react";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { MesButton } from "@/components/ui/mes-button";
import { equipment } from "@/lib/mock-data";
import { formatTzs } from "@/lib/format";
import { toast } from "sonner";

const searchSchema = z.object({ eq: z.string().optional() });

export const Route = createFileRoute("/_tabs/bookings/new")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "New booking — MES" }] }),
  component: NewBookingPage,
});

function NewBookingPage() {
  const { eq } = Route.useSearch();
  const navigate = useNavigate();
  const item = equipment.find((e) => e.id === eq) ?? equipment[0];
  const [step, setStep] = useState(0);
  const [start, setStart] = useState("2025-07-01");
  const [end, setEnd] = useState("2025-07-14");
  const [address, setAddress] = useState("St. Mary's Clinic, Dar es Salaam");
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<"mpesa" | "tigo" | "airtel">("mpesa");
  const [phone, setPhone] = useState("712 345 678");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const days = Math.max(
    1,
    Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24),
    ),
  );
  const total = days * item.pricePerDay;

  const next = () => setStep((s) => Math.min(2, s + 1));
  const back = () => (step === 0 ? navigate({ to: "/equipment/$id", params: { id: item.id } }) : setStep((s) => s - 1));

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 1500);
  };

  if (done) return <SuccessScreen item={item} total={total} />;

  return (
    <div className="pb-10">
      <TopAppBar
        title="New booking"
        right={
          <button onClick={back} className="press-sm flex h-12 w-12 items-center justify-center text-foreground" aria-label="Back">
            <ChevronLeft size={22} />
          </button>
        }
        back={false}
        showBell={false}
      />
      <div className="px-5 pt-3">
        {/* Progress */}
        <div className="mb-6 flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Step {step + 1} of 3
        </p>
        <h1 className="text-xl font-extrabold tracking-tight text-foreground">
          {step === 0 ? "Rental details" : step === 1 ? "Review & confirm" : "Payment"}
        </h1>

        {/* Step 0 */}
        {step === 0 && (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-3">
              <div className="flex items-center gap-3">
                <div
                  className="h-16 w-16 shrink-0 rounded-xl"
                  style={{ background: item.image }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.name}
                  </p>
                  <p className="font-mono-num mt-0.5 text-xs text-muted-foreground">
                    {formatTzs(item.pricePerDay)}/day · {item.supplierName}
                  </p>
                </div>
              </div>
            </div>

            <Field label="Start date">
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="mes-input"
              />
            </Field>
            <Field label="End date">
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="mes-input"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Stat label="Duration" value={`${days} days`} />
              <Stat label="Estimated total" value={formatTzs(total, { compact: true })} />
            </div>

            <Field label="Delivery address">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mes-input"
              />
            </Field>
            <Field label="Special requirements">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Operator training, specific accessories, on-site setup time…"
                className="mes-input min-h-[96px] py-3"
              />
            </Field>

            <MesButton fullWidth size="lg" onClick={next}>
              Next
            </MesButton>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex gap-3">
                <div
                  className="h-16 w-16 shrink-0 rounded-xl"
                  style={{ background: item.image }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.supplierName}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <SummaryRow label="Rental period" value={`${start} → ${end}`} mono />
                <SummaryRow label="Days" value={`${days}`} mono />
                <SummaryRow label="Daily rate" value={formatTzs(item.pricePerDay)} mono />
                <SummaryRow label="Delivery to" value={address} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="font-mono-num text-lg font-extrabold text-primary">
                  {formatTzs(total)}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              A digital rental agreement will be auto-generated when both parties confirm.
            </p>
            <MesButton fullWidth size="lg" onClick={next}>
              Confirm request
            </MesButton>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="mt-5 space-y-4">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select payment method
              </p>
              <div className="space-y-2">
                {[
                  { id: "mpesa" as const, label: "M-Pesa", sub: "Vodacom" },
                  { id: "tigo" as const, label: "Tigo Pesa", sub: "Tigo" },
                  { id: "airtel" as const, label: "Airtel Money", sub: "Airtel" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`press-sm flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left ${
                      method === m.id ? "border-primary bg-blue-50 dark:bg-blue-950/40" : "border-border bg-surface"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Smartphone size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.sub}</p>
                    </div>
                    {method === m.id && <Check size={20} className="text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            <Field label="Mobile money number">
              <div className="flex h-12 items-center overflow-hidden rounded-xl border border-input bg-surface focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                <span className="font-mono-num flex h-full items-center gap-1 border-r border-border bg-secondary px-3 text-sm font-semibold">
                  🇹🇿 +255
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="font-mono-num h-full flex-1 bg-transparent px-3 outline-none"
                />
              </div>
            </Field>

            <div className="rounded-2xl bg-blue-50 p-4 text-center dark:bg-blue-950/40">
              <p className="text-xs text-muted-foreground">Amount due</p>
              <p className="font-mono-num mt-1 text-2xl font-extrabold text-primary">
                {formatTzs(total)}
              </p>
            </div>

            <MesButton fullWidth size="lg" loading={submitting} onClick={submit}>
              Pay now
            </MesButton>
            <p className="text-center text-xs text-muted-foreground">
              You'll receive an M-Pesa prompt on your phone.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .mes-input {
          width: 100%; height: 48px; padding: 0 16px;
          border-radius: 12px; border: 1px solid var(--color-input);
          background: var(--color-surface); color: var(--color-foreground);
          font-size: 15px; outline: none;
          transition: border-color 150ms, box-shadow 150ms;
        }
        .mes-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 25%, transparent);
        }
      `}</style>
    </div>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-mono-num mt-1 text-base font-bold text-foreground">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-right text-xs font-semibold text-foreground ${mono ? "font-mono-num" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function SuccessScreen({ item, total }: { item: { name: string }; total: number }) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="animate-fade flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300">
        <Check size={48} strokeWidth={3} />
      </div>
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight">Booking confirmed!</h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Your rental request for <span className="font-semibold text-foreground">{item.name}</span> has been sent to the supplier.
      </p>
      <div className="mt-6 w-full max-w-xs rounded-2xl border border-border bg-surface p-4">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Reference</p>
        <p className="font-mono-num mt-1 text-base font-bold text-foreground">MES-2025-00847</p>
        <p className="font-mono-num mt-3 text-sm text-primary">{formatTzs(total)} paid</p>
      </div>
      <div className="mt-6 grid w-full max-w-xs grid-cols-2 gap-3">
        <MesButton
          variant="outline"
          fullWidth
          onClick={() => navigate({ to: "/dashboard" })}
        >
          Home
        </MesButton>
        <MesButton
          fullWidth
          onClick={() => {
            toast.success("Booking opened");
            navigate({ to: "/bookings" });
          }}
        >
          View booking
        </MesButton>
      </div>
    </div>
  );
}
