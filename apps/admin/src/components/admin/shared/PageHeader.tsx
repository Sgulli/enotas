import type { ReactNode } from "react";
import { CardDescription } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";

interface PageHeaderProps {
	title: string;
	description?: string;
	eyebrow?: string;
	actions?: ReactNode;
	titleClassName?: string;
	descriptionClassName?: string;
	className?: string;
}

export function PageHeader({
	title,
	description,
	eyebrow,
	actions,
	titleClassName = "text-3xl font-bold tracking-tight text-curator-on-background",
	descriptionClassName,
	className = "",
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				"mb-10 flex flex-col items-start justify-between gap-4",
				actions !== undefined && "md:flex-row md:items-center",
				className,
			)}
		>
			<div className="max-w-2xl">
				{eyebrow && (
					<div className="mb-3 flex items-center gap-2">
						<span className="h-px w-4 bg-curator-primary/40" />
						<span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-curator-primary">
							{eyebrow}
						</span>
					</div>
				)}
				<h2 className={titleClassName}>{title}</h2>
				{description && (
					<CardDescription
						className={cn(
							"mt-2 text-sm leading-relaxed text-curator-on-surface-variant/80",
							descriptionClassName,
						)}
					>
						{description}
					</CardDescription>
				)}
			</div>
			{actions && (
				<div className="flex flex-wrap gap-3">{actions}</div>
			)}
		</div>
	);
}