import { Badge } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";

type StatusVariant =
  | "user-active"
  | "user-inactive"
  | "order-completed"
  | "order-pending"
  | "order-refunded"
  | "category-active"
  | "category-review"
  | "product-available"
  | "product-checked-out"
  | "product-draft";

interface VariantConfig {
  className: string;
  dot?: string;
}

const VARIANT_STYLES: Record<StatusVariant, VariantConfig> = {
  "user-active": {
    className:
      "h-auto gap-1.5 rounded-full border-0 bg-curator-surface-container-high px-2.5 py-1 text-xs font-medium text-curator-on-surface",
    dot: "bg-curator-primary",
  },
  "user-inactive": {
    className:
      "h-auto gap-1.5 rounded-full border-0 bg-curator-surface-container-high px-2.5 py-1 text-xs font-medium text-curator-on-surface-variant opacity-70",
    dot: "bg-curator-outline-variant",
  },
  "order-completed": {
    className:
      "h-auto gap-1.5 rounded-md border-0 bg-curator-surface-container px-2.5 py-1 text-xs font-semibold text-curator-secondary",
    dot: "bg-curator-secondary",
  },
  "order-pending": {
    className:
      "h-auto gap-1.5 rounded-md border-0 bg-curator-primary-fixed/50 px-2.5 py-1 text-xs font-semibold text-curator-primary",
    dot: "bg-curator-primary",
  },
  "order-refunded": {
    className:
      "h-auto gap-1.5 rounded-md border-0 bg-curator-error-container/50 px-2.5 py-1 text-xs font-semibold text-curator-error",
    dot: "bg-curator-error",
  },
  "category-active": {
    className:
      "h-auto rounded-full border-0 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700",
  },
  "category-review": {
    className:
      "h-auto rounded-full border-0 bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700",
  },
  "product-available": {
    className:
      "h-auto rounded-full border-0 bg-curator-primary-fixed px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-curator-on-primary-fixed-variant",
  },
  "product-checked-out": {
    className:
      "h-auto rounded-full border-0 bg-curator-error-container px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-curator-on-error-container",
  },
  "product-draft": {
    className:
      "h-auto rounded-full border-0 bg-curator-surface-container-high px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-curator-on-surface-variant",
  },
};

interface StatusBadgeProps {
  variant: StatusVariant;
  label: string;
}

export function StatusBadge({ variant, label }: StatusBadgeProps) {
  const cfg = VARIANT_STYLES[variant];
  return (
    <Badge
      variant="outline"
      className={cn("inline-flex items-center", cfg.className)}
    >
      {cfg.dot !== undefined && (
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", cfg.dot)} />
      )}
      {label}
    </Badge>
  );
}
