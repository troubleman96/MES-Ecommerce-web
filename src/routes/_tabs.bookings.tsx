import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { Badge } from "@/components/ui/mes-badge";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { MesButton } from "@/components/ui/mes-button";
import { EmptyState } from "@/components/ui/empty-state";
import { bookings, equipment, type Booking } from "@/lib/mock-data";
import { formatTzs, statusLabel, statusTone } from "@/lib/format";
import { useApp } from "@/lib/app-context";
import { toast } from "sonner";

const FILTERS = ["All", "Pending", "Active", "Completed", "Disputed"] as const;

export const Route = createFileRoute("/_tabs/bookings")({
  head: () => ({ meta: [{ title: "Bookings — MES" }] }),
  component: BookingsPage,
});

function BookingsPage() {
  const { user } = useApp();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [selected, setSelected] = useState<Booking | null>(null);

  const list = useMemo(() => {
    if (filter === "All") return bookings;
    if (filter === "Active")
      return bookings.filter((b) =>
        ["active", "due-soon", "overdue"].includes(b.status),
      );
    return bookings.filter((b) => b.status === filter.toLowerCase());
  }, [filter]);

  return (
    <div>
      <TopAppBar title="My bookings" showBell unreadCount={2} />
      <div className="-mx-1 flex gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none]">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`press-sm h-9 shrink-0 rounded-full border px-4 text-xs font-semibold ${
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-5 pb-6">
        {list.length === 0 ? (
          <EmptyState
            icon={<Calendar size={32} />}
            title="No bookings yet"
            description="Start browsing equipment to make your first booking."
          />
        ) : (
          list.map((b) => {
            const eq = equipment.find((e) => e.id === b.equipmentId);
            return (
              <button
                key={b.id}
                onClick={() => setSelected(b)}
                className="press-sm flex w-full gap-3 rounded-2xl border border-border bg-surface p-3 text-left shadow-[var(--shadow-card)]"
              >
                <div
                  className="h-20 w-20 shrink-0 rounded-xl"
                  style={{ background: eq?.image ?? "linear-gradient(135deg,#1D4ED8,#0EA5E9)" }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
                      {b.equipmentName}
                    </h3>
                    <Badge tone={statusTone(b.status)}>{statusLabel(b.status)}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {user?.role === "supplier" ? b.facilityName : b.supplierName}
                  </p>
                  <p className="font-mono-num mt-1.5 text-[11px] text-muted-foreground">
                    {b.startDate} → {b.endDate}
                  </p>
                  <p className="font-mono-num mt-1 text-sm font-bold text-primary">
                    {formatTzs(b.amount)}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      <BottomSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Booking details"
        footer={
          selected ? (
            <BookingActions booking={selected} role={user?.role} onClose={() => setSelected(null)} />
          ) : null
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-secondary p-4">
              <p className="text-xs text-muted-foreground">Reference</p>
              <p className="font-mono-num mt-1 text-base font-bold text-foreground">
                {selected.ref}
              </p>
            </div>
            <Row label="Equipment" value={selected.equipmentName} />
            <Row label="Supplier" value={selected.supplierName} />
            <Row label="Facility" value={selected.facilityName} />
            <Row label="Period" value={`${selected.startDate} → ${selected.endDate}`} mono />
            <Row label="Days" value={`${selected.days}`} mono />
            <Row label="Amount" value={formatTzs(selected.amount)} mono />
            <Row label="Status" value={statusLabel(selected.status)} />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button className="press h-11 rounded-xl border border-border text-sm font-semibold">
                Contract PDF
              </button>
              <button className="press h-11 rounded-xl border border-border text-sm font-semibold">
                Payment receipt
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-right text-sm font-semibold text-foreground ${mono ? "font-mono-num" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function BookingActions({
  booking,
  role,
  onClose,
}: {
  booking: Booking;
  role?: "facility" | "supplier";
  onClose: () => void;
}) {
  const act = (label: string) => {
    toast.success(label);
    onClose();
  };
  if (booking.status === "pending" && role === "supplier") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <MesButton variant="outline" fullWidth onClick={() => act("Booking declined")}>
          Decline
        </MesButton>
        <MesButton fullWidth onClick={() => act("Booking confirmed")}>
          Confirm
        </MesButton>
      </div>
    );
  }
  if (["active", "due-soon", "overdue"].includes(booking.status)) {
    return role === "supplier" ? (
      <MesButton fullWidth size="lg" onClick={() => act("Marked as returned")}>
        Mark as returned
      </MesButton>
    ) : (
      <div className="grid grid-cols-2 gap-3">
        <MesButton variant="outline" fullWidth onClick={() => act("Issue reported")}>
          Report issue
        </MesButton>
        <MesButton fullWidth onClick={() => act("Return confirmed")}>
          Confirm return
        </MesButton>
      </div>
    );
  }
  return (
    <MesButton fullWidth variant="outline" onClick={onClose}>
      Close
    </MesButton>
  );
}
