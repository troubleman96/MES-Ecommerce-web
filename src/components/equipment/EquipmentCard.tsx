import { Link } from "@tanstack/react-router";
import type { Equipment } from "@/lib/mock-data";
import { Badge, StatusDot } from "@/components/ui/mes-badge";
import { formatTzs } from "@/lib/format";
import { Star } from "lucide-react";

export function EquipmentCard({ item }: { item: Equipment }) {
  return (
    <Link
      to="/equipment/$id"
      params={{ id: item.id }}
      className="press-sm block overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]"
    >
      <div
        className="relative aspect-[16/10] w-full"
        style={{ background: item.image }}
      >
        <div className="absolute left-3 top-3 flex gap-2">
          {item.verified && <Badge tone="success">✓ Verified</Badge>}
          {item.isNew && <Badge tone="primary">New</Badge>}
        </div>
        <div className="absolute right-3 top-3">
          <Badge tone="muted">{item.category}</Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-[15px] font-semibold leading-tight text-foreground">
          {item.name}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/60" />
          <span className="truncate">@{item.supplierName}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
          {item.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="font-mono-num rounded-md bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="font-mono-num text-base font-bold text-primary">
              {formatTzs(item.pricePerDay)}
              <span className="text-xs font-medium text-muted-foreground">/day</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <StatusDot
                  tone={item.availability === "available" ? "success" : "warning"}
                />
                {item.availability === "available"
                  ? "Available now"
                  : `Free ${item.availableFrom}`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-foreground">
            <Star size={14} className="fill-amber-400 stroke-amber-400" />
            <span className="font-mono-num">{item.rating}</span>
            <span className="text-muted-foreground">({item.rentals})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
