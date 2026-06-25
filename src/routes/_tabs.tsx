import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/lib/app-context";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

export const Route = createFileRoute("/_tabs")({
  component: TabsLayout,
});

function TabsLayout() {
  const { user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/auth", replace: true });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />
      <BottomTabBar />
    </div>
  );
}
