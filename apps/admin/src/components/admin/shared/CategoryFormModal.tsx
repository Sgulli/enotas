"use client";

import { useState, useMemo } from "react";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@repo/ui/components/dialog";
import { FormBuilder } from "@repo/form-builder";
import { Loader2 } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { toJsonSchema } from "#/lib/to-json-schema";
import * as z from "zod";

const categorySchema = z.object({
  name: z.string().min(1).meta({ title: "Name" }),
  slug: z.string().min(1).meta({ title: "Slug" }),
  description: z.string().optional().meta({ title: "Description" }),
  parentId: z.string().optional().meta({ title: "Parent Category" }),
});

const categoryFormSchema = toJsonSchema(categorySchema);

const dialogSurface =
  "font-curator border-curator-outline-variant/20 bg-curator-surface-container-lowest text-curator-on-surface shadow-[0_20px_40px_-15px_rgba(0,30,64,0.12)] ring-1 ring-curator-outline-variant/10";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string | null;
  parentId?: string;
  parentName?: string | null;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  parentOptions?: { id: string; name: string }[];
  onSubmit: (values: Pick<Category, "name" | "slug" | "description" | "parentId">) => Promise<void>;
}

export function CategoryFormModal({
  open,
  onOpenChange,
  category,
  parentOptions,
  onSubmit,
}: CategoryFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!category;

  const defaultValues = useMemo(
    () => ({
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description || "",
      parentId: category?.parentId ?? "",
    }),
    [category],
  );

  const handleSubmit = async (
    values: Pick<Category, "name" | "slug" | "description" | "parentId">,
  ) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields: Record<string, any> = {
    name: { placeholder: "Category name" },
    slug: { placeholder: "category-slug" },
    description: { placeholder: "Optional description" },
  };

  if (parentOptions && parentOptions.length > 0) {
    fields.parentId = {
      options: [
        { value: "", label: "None" },
        ...parentOptions.map((p) => ({ value: p.id, label: p.name })),
      ],
    };
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          dialogSurface,
          "sm:max-w-md [&_[data-slot=dialog-close]]:text-curator-on-surface-variant [&_[data-slot=dialog-close]]:hover:bg-curator-surface-container-low",
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-curator-on-surface">
            {isEditing ? "Edit Category" : "Create Category"}
          </DialogTitle>
          <DialogDescription className="text-curator-on-surface-variant">
            {isEditing
              ? "Update the category details."
              : "Add a new category to the catalog."}
          </DialogDescription>
        </DialogHeader>

        <FormBuilder
          schema={categoryFormSchema}
          fields={fields}
          defaultValues={defaultValues}
          onSubmit={(data) =>
            handleSubmit(
              data as Pick<Category, "name" | "slug" | "description" | "parentId">,
            )
          }
          disabled={isSubmitting}
          className="space-y-5"
          footer={
            <DialogFooter
              showCloseButton={false}
              className="border-curator-outline-variant/10 bg-curator-surface-container-low/70"
            >
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  className="cursor-pointer border-curator-outline-variant/35 bg-curator-surface-container-lowest text-curator-on-surface hover:bg-curator-surface-container-low"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer bg-gradient-to-br from-curator-primary to-curator-primary-container text-curator-on-primary shadow-[0_4px_12px_-4px_rgba(0,30,64,0.35)] hover:opacity-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Create Category"
                )}
              </Button>
            </DialogFooter>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
