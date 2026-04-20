import type { ComponentProps } from "react";
import { Card } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";

const curatorSurface =
	"border-curator-outline-variant/20 bg-curator-surface-container-lowest shadow-[0_20px_40px_-15px_rgba(0,30,64,0.04)] ring-1 ring-curator-outline-variant/10";

export function CuratorCard({
	className,
	...props
}: ComponentProps<typeof Card>) {
	return <Card className={cn(curatorSurface, className)} {...props} />;
}
