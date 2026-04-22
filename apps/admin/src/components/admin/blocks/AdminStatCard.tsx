import type { ReactNode } from "react";
import { Card, CardContent } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";

interface AdminStatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
  iconClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  className?: string;
}

export function AdminStatCard({
  label,
  value,
  icon,
  footer,
  iconClassName = "rounded-lg bg-curator-primary-fixed/30 p-2 text-curator-primary",
  labelClassName = "text-sm font-semibold uppercase tracking-widest text-curator-on-surface-variant",
  valueClassName = "text-3xl font-bold tracking-tight text-curator-primary",
  className,
}: AdminStatCardProps) {
  return (
    <Card
      className={cn(
        "gap-0 border-curator-outline-variant/20 bg-curator-surface-container-lowest py-0 shadow-[0_20px_40px_-15px_rgba(0,30,64,0.03)] ring-1 ring-curator-outline-variant/10",
        className,
      )}
    >
      <CardContent className="flex flex-col gap-4 px-6 py-6">
        <div className="flex items-start justify-between gap-3">
          <span className={labelClassName}>{label}</span>
          {icon !== undefined && (
            <div className={cn("shrink-0", iconClassName)}>{icon}</div>
          )}
        </div>
        <div>
          <div className={valueClassName}>{value}</div>
          {footer !== undefined && (
            <div className="mt-2 [&_p]:m-0">{footer}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
