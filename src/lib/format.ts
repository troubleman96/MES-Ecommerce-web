export function formatTzs(amount: number, opts: { compact?: boolean } = {}) {
  if (opts.compact && amount >= 1_000_000) {
    return `TZS ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (opts.compact && amount >= 1_000) {
    return `TZS ${(amount / 1_000).toFixed(0)}K`;
  }
  return `TZS ${amount.toLocaleString("en-US")}`;
}

export function statusTone(
  status: string,
): "success" | "warning" | "danger" | "info" | "muted" {
  switch (status) {
    case "active":
    case "completed":
    case "available":
    case "sent":
      return "success";
    case "due-soon":
    case "pending":
    case "processing":
    case "maintenance":
      return "warning";
    case "overdue":
    case "disputed":
    case "failed":
      return "danger";
    case "expired":
      return "muted";
    default:
      return "info";
  }
}

export function statusLabel(status: string): string {
  return status
    .split("-")
    .map((s) => s[0]?.toUpperCase() + s.slice(1))
    .join(" ");
}
