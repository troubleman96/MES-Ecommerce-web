import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Hospital, Package, Smartphone } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { MesButton } from "@/components/ui/mes-button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MES — Welcome" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SplashPage,
});

const SLIDES = [
  {
    icon: Hospital,
    title: "Connect with verified suppliers",
    body: "Trusted medical equipment partners across Tanzania, on one platform.",
  },
  {
    icon: Package,
    title: "Browse and book in minutes",
    body: "Ultrasounds, ventilators, monitors — request instantly, get a digital contract.",
  },
  {
    icon: Smartphone,
    title: "Pay with mobile money",
    body: "M-Pesa, Tigo Pesa and Airtel Money — the way Tanzania pays.",
  },
];

function SplashPage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [stage, setStage] = useState<"splash" | "onboard">("splash");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (user) {
      navigate({ to: "/dashboard", replace: true });
      return;
    }
    const t = setTimeout(() => setStage("onboard"), 1400);
    return () => clearTimeout(t);
  }, [user, navigate]);

  if (stage === "splash") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-6 text-primary-foreground">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
          <span className="text-3xl font-extrabold tracking-tight">M</span>
        </div>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight">MES</h1>
        <p className="mt-2 text-sm text-white/80">Medical Equipment Supply</p>
        <div className="mt-10 h-1 w-32 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-1/2 animate-[mes-pulse_1.2s_ease-in-out_infinite] rounded-full bg-white" />
        </div>
      </div>
    );
  }

  const S = SLIDES[slide];
  const Icon = S.icon;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-blue-50 text-primary dark:bg-blue-950/40">
          <Icon size={56} strokeWidth={1.6} />
        </div>
        <h2 className="mt-8 text-2xl font-extrabold tracking-tight text-foreground">
          {S.title}
        </h2>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
          {S.body}
        </p>
      </div>
      <div className="safe-bottom px-6 pb-8">
        <div className="mb-6 flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === slide ? "w-6 bg-primary" : "w-1.5 bg-border"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <MesButton
          fullWidth
          size="lg"
          onClick={() => {
            if (slide < SLIDES.length - 1) setSlide(slide + 1);
            else navigate({ to: "/auth" });
          }}
        >
          {slide < SLIDES.length - 1 ? "Continue" : "Get Started"}
        </MesButton>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            onClick={() => navigate({ to: "/auth" })}
            className="font-semibold text-primary"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
