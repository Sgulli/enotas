import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getOrders, getOrderStats } from "#/server/orders";
import { OrdersPage } from "#/components/admin/screens/OrdersPage";

const searchSchema = z.object({
  page: z.number().int().positive().default(1).catch(1),
  pageSize: z.number().int().positive().max(100).default(20).catch(20),
  status: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/_admin/orders")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [ordersResult, stats] = await Promise.all([
      getOrders({ data: deps }),
      getOrderStats(),
    ]);
    return { ...ordersResult, stats };
  },
  component: OrdersPage,
});
