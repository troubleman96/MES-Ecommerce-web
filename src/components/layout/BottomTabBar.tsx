import { Link, useLocation } from "@tanstack/react-router";
import {
  Home,
  Search,
  Calendar,
  FileText,
  User,
  Package,
  Wallet,
} from "lucide-react";
import { useApp } from "@/lib/app-context";

interface Tab {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const FACILITY_TABS: Tab[] = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/equipment", label: "Browse", icon: Search },
  { to: "/bookings", label: "Bookings", icon: Calendar },
  { to: "/contracts", label: "Contracts", icon: FileText },
  { to: "/account", label: "Account", icon: User },
];

const SUPPLIER_TABS: Tab[] = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/bookings", label: "Bookings", icon: Calendar },
  { to: "/earnings", label: "Earnings", icon: Wallet },
  { to: "/account", label: "Account", icon: User },
];

export function BottomTabBar() {
  const { user } = useApp();
  const location = useLocation();
  const tabs = user?.role === "supplier" ? SUPPLIER_TABS : FACILITY_TABS;

  return (
    <nav
      className="safe-bottom fixed bottom-0 left-1/2 z-40 w-full max-w-[440px] -translate-x-1/2 border-t border-border bg-surface/95 backdrop-blur"
      aria-label="Primary"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active =
            location.pathname === tab.to ||
            (tab.to !== "/dashboard" && location.pathname.startsWith(tab.to));
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                className={`press-sm flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon size={22} className={active ? "stroke-[2.4]" : ""} />
                <span className="leading-none">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
