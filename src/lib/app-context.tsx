import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type UserRole = "facility" | "supplier";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  organization: string;
  city: string;
  verified: boolean;
  avatarColor: string;
}

interface AppState {
  user: AppUser | null;
  signIn: (role: UserRole) => void;
  signOut: () => void;
  setRole: (role: UserRole) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  language: "en" | "sw";
  setLanguage: (l: "en" | "sw") => void;
}

const AppContext = createContext<AppState | null>(null);

const FACILITY_USER: AppUser = {
  id: "fac_001",
  name: "Dr. Asha Mwakyusa",
  email: "admin@stmarys.tz",
  phone: "+255 712 345 678",
  role: "facility",
  organization: "St. Mary's Clinic",
  city: "Dar es Salaam",
  verified: true,
  avatarColor: "oklch(0.71 0.15 230)",
};

const SUPPLIER_USER: AppUser = {
  id: "sup_001",
  name: "John Mushi",
  email: "ops@medequip.tz",
  phone: "+255 754 987 321",
  role: "supplier",
  organization: "MedEquip Tanzania",
  city: "Dar es Salaam",
  verified: true,
  avatarColor: "oklch(0.62 0.17 145)",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState<"en" | "sw">("en");

  // Hydrate from localStorage (Capacitor: swap for Preferences API later)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mes:user");
      if (stored) setUser(JSON.parse(stored));
      const t = localStorage.getItem("mes:theme") as "light" | "dark" | null;
      if (t) {
        setTheme(t);
        document.documentElement.classList.toggle("dark", t === "dark");
      }
      const l = localStorage.getItem("mes:lang") as "en" | "sw" | null;
      if (l) setLanguage(l);
    } catch {}
  }, []);

  const persist = (u: AppUser | null) => {
    setUser(u);
    try {
      if (u) localStorage.setItem("mes:user", JSON.stringify(u));
      else localStorage.removeItem("mes:user");
    } catch {}
  };

  const signIn = (role: UserRole) => {
    persist(role === "facility" ? FACILITY_USER : SUPPLIER_USER);
  };
  const signOut = () => persist(null);
  const setRole = (role: UserRole) => {
    persist(role === "facility" ? FACILITY_USER : SUPPLIER_USER);
  };
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("mes:theme", next);
    } catch {}
  };
  const setLang = (l: "en" | "sw") => {
    setLanguage(l);
    try {
      localStorage.setItem("mes:lang", l);
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        user,
        signIn,
        signOut,
        setRole,
        theme,
        toggleTheme,
        language,
        setLanguage: setLang,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
