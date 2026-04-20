import type { ComponentProps } from "react";
import { Search } from "lucide-react";
import { Input } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";

export function AdminSearchField({
	className,
	...props
}: ComponentProps<typeof Input>) {
	return (
		<div className="relative max-w-full">
			<Search
				className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-curator-on-surface-variant"
				aria-hidden
			/>
			<Input
				className={cn(
					"h-9 w-full min-w-[12rem] appearance-none rounded-lg border border-curator-outline-variant/25 bg-curator-surface-container-low pl-9 text-sm text-curator-on-surface placeholder:text-curator-on-surface-variant md:w-64",
					"focus-visible:border-curator-primary/45 focus-visible:ring-curator-primary/25",
					className,
				)}
				{...props}
			/>
		</div>
	);
}
