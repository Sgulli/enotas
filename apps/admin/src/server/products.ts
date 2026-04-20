import { createServerFn } from "@tanstack/react-start";
import { getPrisma, Prisma } from "@repo/db";
import * as z from "zod";
import { orNull } from "@repo/shared";

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replaceAll(/[^\p{L}\p{N}\s-]/gu, "")
    .replaceAll(/[\s_]+/g, "-")
    .replaceAll(/-+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
  return base || "product";
}

async function uniqueSlug(
  slugBase: string,
  excludeProductId?: string,
): Promise<string> {
  const prisma = getPrisma();
  let slug = slugBase;
  let n = 0;
  for (;;) {
    const existing = await prisma.products.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeProductId) return slug;
    n += 1;
    slug = `${slugBase}-${n}`;
  }
}

function mapProductRow(p: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: Prisma.Decimal;
  compareAtPrice: Prisma.Decimal | null;
  sku: string | null;
  barcode: string | null;
  image: string | null;
  images: string[];
  inventory: number;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}) {
  return {
    ...p,
    price: p.price.toString(),
    compareAtPrice: orNull(p.compareAtPrice?.toString()),
    category: p.category
      ? {
          ...p.category,
          createdAt: p.category.createdAt.toISOString(),
          updatedAt: p.category.updatedAt.toISOString(),
        }
      : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

const productWriteBaseSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  price: z.union([z.string(), z.number()]),
  compareAtPrice: z.union([z.string(), z.number()]).nullable().optional(),
  sku: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  inventory: z.number().int(),
  categoryId: z.string().nullable().optional(),
});

const createProductInputSchema = productWriteBaseSchema;

const updateProductInputSchema = productWriteBaseSchema.extend({
  id: z.string().min(1),
});

const getProductByIdInputSchema = z.object({
  id: z.string().min(1),
});

function toDecimal(
  value: string | number | null | undefined,
): Prisma.Decimal | null {
  if (value === undefined || value === null || value === "") return null;
  return new Prisma.Decimal(String(value));
}

function toDecimalRequired(value: string | number): Prisma.Decimal {
  return new Prisma.Decimal(String(value));
}

export const getProducts = createServerFn({ method: "GET" }).handler(
  async () => {
    const prisma = getPrisma();
    const products = await prisma.products.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    return products.map((p) => mapProductRow(p));
  },
);

export const getProductCount = createServerFn({ method: "GET" }).handler(
  async () => {
    const prisma = getPrisma();
    return prisma.products.count();
  },
);

export const getProductById = createServerFn({ method: "GET" })
  .inputValidator(getProductByIdInputSchema)
  .handler(async (ctx) => {
    const prisma = getPrisma();
    const product = await prisma.products.findUnique({
      where: { id: ctx.data.id },
      include: { category: true },
    });
    if (!product) return null;
    return mapProductRow(product);
  });

export const createProduct = createServerFn({ method: "POST" })
  .inputValidator(createProductInputSchema)
  .handler(async (ctx) => {
    const prisma = getPrisma();
    const d = ctx.data;
    const slugBase = d.slug?.trim() ? slugify(d.slug) : slugify(d.name);
    const slug = await uniqueSlug(slugBase);

    const created = await prisma.products.create({
      data: {
        name: d.name,
        slug,
        description: orNull(d.description),
        price: toDecimalRequired(d.price),
        compareAtPrice: orNull(toDecimal(d.compareAtPrice)),
        sku: orNull(d.sku?.trim()),
        barcode: orNull(d.barcode?.trim()),
        image: orNull(d.image?.trim()),
        images: [],
        inventory: d.inventory,
        categoryId: d.categoryId ?? null,
      },
      include: { category: true },
    });
    return mapProductRow(created);
  });

export const updateProduct = createServerFn({ method: "POST" })
  .inputValidator(updateProductInputSchema)
  .handler(async (ctx) => {
    const prisma = getPrisma();
    const d = ctx.data;
    const existing = await prisma.products.findUnique({ where: { id: d.id } });
    if (!existing) throw new Error("Product not found");

    let slug = existing.slug;
    if (d.slug?.trim()) {
      const candidate = slugify(d.slug);
      slug = await uniqueSlug(candidate, d.id);
    } else if (d.name !== existing.name) {
      const candidate = slugify(d.name);
      slug = await uniqueSlug(candidate, d.id);
    }

    const updated = await prisma.products.update({
      where: { id: d.id },
      data: {
        name: d.name,
        slug,
        description: d.description ?? null,
        price: toDecimalRequired(d.price),
        compareAtPrice: toDecimal(d.compareAtPrice ?? null),
        sku: d.sku?.trim() ? d.sku.trim() : null,
        barcode: d.barcode?.trim() ? d.barcode.trim() : null,
        image: d.image?.trim() ? d.image.trim() : null,
        inventory: d.inventory,
        categoryId: d.categoryId ?? null,
      },
      include: { category: true },
    });
    return mapProductRow(updated);
  });

export type SerializedProduct = ReturnType<typeof mapProductRow>;
export type ProductWritePayload = z.infer<typeof productWriteBaseSchema>;
