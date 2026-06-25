import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Hospital, Factory } from "lucide-react";
import { useApp, type UserRole } from "@/lib/app-context";
import { MesButton } from "@/components/ui/mes-button";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — MES" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [role, setRole] = useState<UserRole>("facility");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      signIn(role);
      toast.success(mode === "signin" ? "Welcome back" : "Account created");
      navigate({ to: "/dashboard" });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="safe-top px-6 pt-8">
        <Link
          to="/"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
        >
          <span className="text-xl font-extrabold">M</span>
        </Link>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to manage your equipment and bookings"
            : "Get started with MES in under a minute"}
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-xl bg-secondary p-1">
          <button
            onClick={() => setMode("signin")}
            className={`press-sm h-10 rounded-lg text-sm font-semibold transition ${
              mode === "signin" ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("register")}
            className={`press-sm h-10 rounded-lg text-sm font-semibold transition ${
              mode === "register" ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Register
          </button>
        </div>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          {mode === "register" && (
            <Field label="Full name">
              <input
                required
                placeholder="Dr. Asha Mwakyusa"
                className="mes-input"
              />
            </Field>
          )}
          <Field label="Email">
            <input
              required
              type="email"
              defaultValue={mode === "signin" ? "admin@stmarys.tz" : ""}
              placeholder="you@facility.tz"
              className="mes-input"
            />
          </Field>
          {mode === "register" && (
            <Field label="Phone">
              <div className="flex h-12 items-center overflow-hidden rounded-xl border border-input bg-surface focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                <span className="font-mono-num flex h-full items-center gap-1 border-r border-border bg-secondary px-3 text-sm font-semibold text-foreground">
                  🇹🇿 +255
                </span>
                <input
                  required
                  className="font-mono-num h-full flex-1 bg-transparent px-3 text-[15px] outline-none placeholder:text-muted-foreground"
                  placeholder="712 345 678"
                />
              </div>
            </Field>
          )}
          <Field
            label="Password"
            right={
              mode === "signin" && (
                <button type="button" className="text-xs font-semibold text-primary">
                  Forgot?
                </button>
              )
            }
          >
            <div className="relative">
              <input
                required
                type={showPwd ? "text" : "password"}
                defaultValue={mode === "signin" ? "••••••••" : ""}
                placeholder="••••••••"
                className="mes-input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="press-sm absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground"
                aria-label="Toggle password"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>

          {mode === "register" && (
            <>
              <Field label="Confirm password">
                <input required type="password" className="mes-input" />
              </Field>
              <div>
                <span className="mb-2 block text-xs font-semibold text-foreground">
                  I am a…
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <RoleCard
                    icon={<Hospital size={22} />}
                    label="Healthcare Facility"
                    active={role === "facility"}
                    onClick={() => setRole("facility")}
                  />
                  <RoleCard
                    icon={<Factory size={22} />}
                    label="Equipment Supplier"
                    active={role === "supplier"}
                    onClick={() => setRole("supplier")}
                  />
                </div>
              </div>
              <label className="flex items-start gap-3 pt-1">
                <input type="checkbox" required className="mt-0.5 h-5 w-5 rounded" />
                <span className="text-xs text-muted-foreground">
                  I agree to the{" "}
                  <span className="font-semibold text-primary">Terms</span> and{" "}
                  <span className="font-semibold text-primary">Privacy Policy</span>
                </span>
              </label>
            </>
          )}

          {mode === "signin" && (
            <div className="pt-2">
              <span className="mb-2 block text-xs font-semibold text-foreground">
                Demo role
              </span>
              <div className="grid grid-cols-2 gap-3">
                <RoleCard
                  icon={<Hospital size={22} />}
                  label="Facility"
                  active={role === "facility"}
                  onClick={() => setRole("facility")}
                />
                <RoleCard
                  icon={<Factory size={22} />}
                  label="Supplier"
                  active={role === "supplier"}
                  onClick={() => setRole("supplier")}
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <MesButton fullWidth size="lg" type="submit" loading={loading}>
              {mode === "signin" ? "Sign In" : "Create Account"}
            </MesButton>
          </div>

          <div className="flex items-center gap-3 py-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or continue with
            <span className="h-px flex-1 bg-border" />
          </div>

          <MesButton fullWidth variant="outline" size="lg" type="button">
            Continue with Google
          </MesButton>
        </form>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
          By {mode === "signin" ? "signing in" : "creating an account"} you agree to our
          Terms and Privacy Policy.
        </p>
      </div>

      <style>{`
        .mes-input {
          width: 100%;
          height: 48px;
          padding: 0 16px;
          border-radius: 12px;
          border: 1px solid var(--color-input);
          background: var(--color-surface);
          color: var(--color-foreground);
          font-size: 15px;
          outline: none;
          transition: border-color 150ms, box-shadow 150ms;
        }
        .mes-input::placeholder { color: var(--color-muted-foreground); opacity: 0.7; }
        .mes-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 25%, transparent);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  right,
  children,
}: {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">{label}</label>
        {right}
      </div>
      {children}
    </div>
  );
}

function RoleCard({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`press-sm flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition ${
        active
          ? "border-primary bg-blue-50 text-primary dark:bg-blue-950/40"
          : "border-border bg-surface text-muted-foreground"
      }`}
    >
      {icon}
      <span className="text-xs font-semibold leading-tight">{label}</span>
    </button>
  );
}
