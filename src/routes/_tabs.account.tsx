import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  User,
  Building2,
  ShieldCheck,
  Bell,
  Globe,
  Moon,
  CreditCard,
  Receipt,
  MessageCircle,
  HelpCircle,
  FileText,
  ChevronRight,
  LogOut,
  ArrowLeftRight,
} from "lucide-react";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { useApp } from "@/lib/app-context";
import { toast } from "sonner";

export const Route = createFileRoute("/_tabs/account")({
  head: () => ({ meta: [{ title: "Account — MES" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user, signOut, setRole, theme, toggleTheme, language, setLanguage } = useApp();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="pb-10">
      <TopAppBar title="Account" showBell={false} />

      {/* Profile header */}
      <div className="px-5 pb-6 pt-3">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-extrabold text-white"
            style={{ background: user.avatarColor }}
          >
            {user.organization.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-extrabold tracking-tight text-foreground">
              {user.organization}
            </h2>
            <div className="mt-1 flex items-center gap-2 text-xs">
              {user.verified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300">
                  <ShieldCheck size={12} /> Verified
                </span>
              ) : (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">
                  Pending verification
                </span>
              )}
              <span className="text-muted-foreground">{user.city}, Tanzania</span>
            </div>
          </div>
        </div>

        {/* Role toggle (demo) */}
        <button
          onClick={() => {
            const nextRole = user.role === "facility" ? "supplier" : "facility";
            setRole(nextRole);
            toast.success(`Switched to ${nextRole}`);
          }}
          className="press-sm mt-4 flex w-full items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-blue-50 px-4 py-3 text-left dark:bg-blue-950/40"
        >
          <ArrowLeftRight size={18} className="text-primary" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-primary">Demo: switch role</p>
            <p className="text-[11px] text-muted-foreground">
              Currently signed in as <span className="font-bold capitalize">{user.role}</span>
            </p>
          </div>
        </button>
      </div>

      <Section title="Account">
        <Item icon={<User size={18} />} label="My profile" />
        <Item icon={<Building2 size={18} />} label={user.role === "facility" ? "Facility info" : "Supplier info"} />
        <Item icon={<ShieldCheck size={18} />} label="Verification documents" />
      </Section>

      <Section title="Preferences">
        <Item icon={<Bell size={18} />} label="Notification settings" />
        <Item
          icon={<Globe size={18} />}
          label="Language"
          right={
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value as "en" | "sw");
                toast.success(e.target.value === "sw" ? "Lugha: Kiswahili" : "Language: English");
              }}
              className="font-mono-num bg-transparent text-xs font-semibold text-foreground"
            >
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          }
        />
        <Item
          icon={<Moon size={18} />}
          label="Dark mode"
          right={
            <button
              onClick={toggleTheme}
              className={`relative h-7 w-12 rounded-full transition ${
                theme === "dark" ? "bg-primary" : "bg-border"
              }`}
              role="switch"
              aria-checked={theme === "dark"}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                  theme === "dark" ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          }
        />
      </Section>

      <Section title="Payments">
        <Item icon={<CreditCard size={18} />} label="Payment methods" sub="M-Pesa, Airtel, Tigo" />
        <Item icon={<Receipt size={18} />} label="Transaction history" />
      </Section>

      <Section title="Support">
        <Item icon={<MessageCircle size={18} />} label="Contact support" />
        <Item icon={<HelpCircle size={18} />} label="Help & FAQ" />
        <Item icon={<FileText size={18} />} label="Terms & Privacy" />
      </Section>

      <div className="px-5 pt-4">
        <button
          onClick={() => {
            signOut();
            toast.success("Signed out");
            navigate({ to: "/auth" });
          }}
          className="press flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface text-sm font-semibold text-destructive"
        >
          <LogOut size={18} /> Sign out
        </button>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          MES v1.0.0
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-2 px-5">
      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <ul className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
        {children}
      </ul>
    </div>
  );
}

function Item({
  icon,
  label,
  sub,
  right,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <li className="press-sm flex h-14 items-center gap-3 border-b border-border px-4 last:border-b-0">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
      </div>
      {right ?? <ChevronRight size={18} className="text-muted-foreground" />}
    </li>
  );
}
