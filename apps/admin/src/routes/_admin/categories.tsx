import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getCategories, getCategoryCount } from "#/server/categories";
import { CategoriesManagementPage } from "#/components/admin/screens/CategoriesManagementPage";

const searchSchema = z.object({
  page: z.number().int().positive().default(1).catch(1),
  pageSize: z.number().int().positive().max(100).default(20).catch(20),
});

export const Route = createFileRoute("/_admin/categories")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [categoriesResult, totalCount] = await Promise.all([
      getCategories({ data: deps }),
      getCategoryCount(),
    ]);
    return { ...categoriesResult, totalCount };
  },
  component: CategoriesManagementPage,
});
