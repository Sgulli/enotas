import { createServerFn } from "@tanstack/react-start";
import { getPrisma } from "@repo/db";
import * as z from "zod";
import { paginationSchema } from "#/lib/pagination";

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
});

const updateCategorySchema = categorySchema.extend({ id: z.string() }).partial();

const getCategoriesSchema = paginationSchema.extend({
  parentId: z.string().optional(),
});

export const getCategories = createServerFn({ method: "GET" })
  .inputValidator(getCategoriesSchema)
  .handler(async (ctx) => {
    const { page, pageSize, parentId } = ctx.data;
    const skip = (page - 1) * pageSize;

    const where = parentId ? { parentId } : {};

    const [categories, total] = await Promise.all([
      getPrisma().categories.findMany({
        skip,
        take: pageSize,
        orderBy: { name: "asc" },
        where,
        include: {
          products: { select: { id: true } },
          parent: { select: { name: true } },
        },
      }),
      getPrisma().categories.count({ where }),
    ]);

    return {
      categories: categories.map((c) => ({
        ...c,
        productCount: c.products.length,
        products: undefined,
        parentName: c.parent?.name ?? null,
        parent: undefined,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
      total,
      page,
      pageSize,
    };
  });

export const getCategoryCount = createServerFn({ method: "GET" }).handler(
  async () => {
    const prisma = getPrisma();
    const count = await prisma.categories.count();
    return count;
  },
);

export const getAllCategories = createServerFn({ method: "GET" }).handler(
  async () => {
    const prisma = getPrisma();
    const categories = await prisma.categories.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
    return categories;
  },
);

export const createCategory = createServerFn({ method: "POST" })
  .inputValidator(categorySchema)
  .handler(async (ctx) => {
    const prisma = getPrisma();
    const category = await prisma.categories.create({
      data: ctx.data,
    });
    return {
      ...category,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  });

export const updateCategory = createServerFn({ method: "POST" })
  .inputValidator(updateCategorySchema)
  .handler(async (ctx) => {
    const prisma = getPrisma();
    const { id, ...data } = ctx.data;
    const category = await prisma.categories.update({
      where: { id },
      data,
    });
    return {
      ...category,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async (ctx) => {
    const prisma = getPrisma();
    await prisma.categories.delete({
      where: { id: ctx.data.id },
    });
    return { success: true };
  });
