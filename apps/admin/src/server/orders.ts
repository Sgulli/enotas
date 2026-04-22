import { createServerFn } from "@tanstack/react-start";
import { getPrisma } from "@repo/db";
import * as z from "zod";
import { paginationSchema } from "#/lib/pagination";

const getOrdersSchema = paginationSchema.extend({
  status: z.string().optional(),
});

export const getOrders = createServerFn({ method: "GET" })
  .inputValidator(getOrdersSchema)
  .handler(async (ctx) => {
    const { page, pageSize, status } = ctx.data;
    const skip = (page - 1) * pageSize;

    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      getPrisma().order.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: {
            include: {
              product: { select: { id: true, name: true } },
            },
          },
        },
      }),
      getPrisma().order.count({ where }),
    ]);

    return {
      orders: orders.map((o) => ({
        ...o,
        total: o.total.toString(),
        subtotal: o.subtotal.toString(),
        tax: o.tax.toString(),
        shippingCost: o.shippingCost.toString(),
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
        items: o.items.map((i) => ({
          ...i,
          price: i.price.toString(),
          createdAt: i.createdAt.toISOString(),
        })),
      })),
      total,
      page,
      pageSize,
    };
  });

export const getOrderStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const prisma = getPrisma();
    const [totalRevenue, pendingCount, totalCount] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count(),
    ]);

    return {
      totalRevenue: totalRevenue._sum.total?.toString() ?? "0",
      pendingCount,
      totalCount,
    };
  },
);
