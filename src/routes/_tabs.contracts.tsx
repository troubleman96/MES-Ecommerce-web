import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Download, AlertCircle, Search } from "lucide-react";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { Badge } from "@/components/ui/mes-badge";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { MesButton } from "@/components/ui/mes-button";
import { contracts, type Contract } from "@/lib/mock-data";
import { formatTzs, statusLabel, statusTone } from "@/lib/format";
import { useApp } from "@/lib/app-context";
import { toast } from "sonner";

export const Route = createFileRoute("/_tabs/contracts")({
  head: () => ({ meta: [{ title: "Contracts — MES" }] }),
  component: ContractsPage,
});

function ContractsPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Contract | null>(null);
  const filtered = contracts.filter((c) =>
    `${c.equipmentName} ${c.supplierName} ${c.facilityName} ${c.id}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <TopAppBar title="Contracts" showBell unreadCount={2} />
      <div className="px-5 pb-3 pt-2">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by equipment or party…"
            className="h-12 w-full rounded-xl border border-input bg-surface pl-11 pr-4 text-[15px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="space-y-3 px-5 pb-8">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            className="press-sm block w-full rounded-2xl border border-border bg-surface p-4 text-left shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="font-mono-num text-xs font-bold text-primary">#{c.id}</div>
              <Badge tone={statusTone(c.status)}>{statusLabel(c.status)}</Badge>
            </div>
            <p className="mt-2 text-sm font-semibold text-foreground">{c.equipmentName}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {c.supplierName} ↔ {c.facilityName}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{c.signedAt ? `Signed ${c.signedAt}` : "Awaiting signature"}</span>
              <span className="font-mono-num font-semibold text-foreground">
                {formatTzs(c.amount, { compact: true })}
              </span>
            </div>
          </button>
        ))}
      </div>

      <BottomSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Contract #${selected.id}` : ""}
        footer={
          selected ? <ContractActions contract={selected} onClose={() => setSelected(null)} /> : null
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center justify-between rounded-2xl bg-secondary p-4">
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge tone={statusTone(selected.status)} className="mt-1">
                  {statusLabel(selected.status)}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total value</p>
                <p className="font-mono-num text-lg font-extrabold text-primary">
                  {formatTzs(selected.amount)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Parties
              </h4>
              <div className="space-y-2">
                <Party name={selected.supplierName} role="Supplier" />
                <Party name={selected.facilityName} role="Facility" />
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Terms summary
              </h4>
              <div className="space-y-2 rounded-2xl border border-border bg-surface p-4 text-sm">
                <Row label="Equipment" value={selected.equipmentName} />
                <Row label="Period" value={`${selected.startDate} → ${selected.endDate}`} mono />
                <Row label="Amount" value={formatTzs(selected.amount)} mono />
                <Row label="Delivery" value="Free within Dar es Salaam" />
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                E-signatures
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <SignatureBox party="Supplier" signed={selected.signedBySupplier} />
                <SignatureBox party="Facility" signed={selected.signedByFacility} />
              </div>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

function ContractActions({ contract, onClose }: { contract: Contract; onClose: () => void }) {
  const { user } = useApp();
  const needsMySig =
    contract.status === "pending" &&
    ((user?.role === "facility" && !contract.signedByFacility) ||
      (user?.role === "supplier" && !contract.signedBySupplier));

  return (
    <div className="space-y-2">
      {needsMySig && (
        <MesButton
          fullWidth
          size="lg"
          onClick={() => {
            toast.success("Contract signed");
            onClose();
          }}
        >
          Sign contract
        </MesButton>
      )}
      <div className="grid grid-cols-2 gap-2">
        <MesButton
          variant="outline"
          fullWidth
          leftIcon={<Download size={16} />}
          onClick={() => toast.success("PDF downloaded")}
        >
          Download
        </MesButton>
        <MesButton
          variant="outline"
          fullWidth
          leftIcon={<AlertCircle size={16} />}
          onClick={() => toast("Issue reported")}
        >
          Report issue
        </MesButton>
      </div>
    </div>
  );
}

function Party({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-primary dark:bg-blue-950/40">
        {name.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
        <p className="text-[11px] text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

function SignatureBox({ party, signed }: { party: string; signed: boolean }) {
  return (
    <div
      className={`flex h-24 flex-col items-center justify-center rounded-2xl border-2 text-center ${
        signed ? "border-green-500/30 bg-green-50 dark:bg-green-950/30" : "border-dashed border-border bg-surface"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {party}
      </p>
      <p className={`mt-1 text-sm font-bold ${signed ? "text-green-700 dark:text-green-300" : "text-muted-foreground"}`}>
        {signed ? "✓ Signed" : "Awaiting"}
      </p>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-right text-xs font-semibold text-foreground ${mono ? "font-mono-num" : ""}`}>
        {value}
      </span>
    </div>
  );
}

// silence unused-import warning safely
void FileText;
