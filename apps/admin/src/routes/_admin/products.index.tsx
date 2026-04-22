import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getProducts, getProductCount } from "#/server/products";
import { ProductCatalogPage } from "#/components/admin/screens/ProductCatalogPage";

const searchSchema = z.object({
  page: z.number().int().positive().default(1).catch(1),
  pageSize: z.number().int().positive().max(100).default(20).catch(20),
});

export const Route = createFileRoute("/_admin/products/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [productsResult, totalCount] = await Promise.all([
      getProducts({ data: deps }),
      getProductCount(),
    ]);
    return { ...productsResult, totalCount };
  },
  component: ProductCatalogPage,
});
