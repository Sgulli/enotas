import { Archive, BookOpen, SquarePen } from "lucide-react";
import { Button, Card, CardContent, CardFooter } from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { StatusBadge } from "../shared/StatusBadge";

export type CatalogProduct = {
  dept: string;
  title: string;
  pages: string;
  author: string;
  status: "Available" | "Checked Out" | "Draft";
  muted?: boolean;
  blurb: string;
  cover: string;
};

const STATUS_MAP = {
  Available: "product-available",
  "Checked Out": "product-checked-out",
  Draft: "product-draft",
} as const;

interface ProductCatalogItemCardProps {
  product: CatalogProduct;
}

export function ProductCatalogItemCard({
  product,
}: ProductCatalogItemCardProps) {
  const p = product;
  return (
    <Card
      className={cn(
        "group relative h-full gap-0 overflow-hidden border-curator-outline-variant/20 bg-curator-surface-container-lowest py-6 shadow-[0_15px_40px_-5px_rgba(0,30,64,0.06)] ring-1 ring-curator-outline-variant/10 transition hover:-translate-y-1",
      )}
    >
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-curator-primary to-curator-primary-container opacity-0 transition group-hover:opacity-100" />
      <CardContent className="relative z-10 flex flex-col gap-6 px-6">
        <div className="flex gap-5">
          <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg border border-curator-outline-variant/20 bg-curator-surface-container-low">
            <img
              src={p.cover}
              alt=""
              className={cn(
                "h-full w-full object-cover grayscale transition group-hover:grayscale-0",
                p.muted === true && "opacity-50",
              )}
            />
            {p.muted === true && (
              <div className="absolute inset-0 flex items-center justify-center bg-curator-secondary/10 backdrop-blur-sm">
                <BookOpen className="h-8 w-8 text-curator-secondary" />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between py-1">
            <div>
              <span className="mb-1 block text-[11px] font-medium uppercase tracking-widest text-curator-primary">
                {p.dept}
              </span>
              <h3 className="mb-2 text-sm font-bold leading-tight text-curator-primary">
                {p.title}
              </h3>
              <div className="flex items-center gap-3 text-xs font-medium text-curator-secondary">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" /> {p.pages}
                </span>
                <span className="h-1 w-1 rounded-full bg-curator-outline-variant" />
                <span>{p.author}</span>
              </div>
            </div>
            <div className="mt-2">
              <StatusBadge variant={STATUS_MAP[p.status]} label={p.status} />
            </div>
          </div>
        </div>
        <p
          className={cn(
            "line-clamp-2 text-xs leading-relaxed text-curator-on-surface-variant",
            p.muted === true && "opacity-70",
          )}
        >
          {p.blurb}
        </p>
      </CardContent>
      <CardFooter className="relative z-10 mt-0 justify-end gap-2 border-curator-surface-container-high bg-transparent px-6 pt-0">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-curator-primary hover:bg-curator-primary/5"
          aria-label="Edit"
        >
          <SquarePen />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-curator-secondary hover:bg-curator-error/10 hover:text-curator-error"
          aria-label="Archive"
        >
          <Archive />
        </Button>
      </CardFooter>
    </Card>
  );
}
