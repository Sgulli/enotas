import { createServerFn } from "@tanstack/react-start";
import { getPrisma } from "@repo/db";

export const getCarts = createServerFn({ method: "GET" }).handler(async () => {
  const prisma = getPrisma();
  const carts = await prisma.cart.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, price: true } },
        },
      },
    },
  });
  return carts.map((c) => ({
    ...c,
    totalValue: c.items
      .reduce((sum, i) => sum + i.quantity * Number(i.product.price), 0)
      .toFixed(2),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    items: c.items.map((i) => ({
      ...i,
      product: {
        ...i.product,
        price: i.product.price.toString(),
      },
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt.toISOString(),
    })),
  }));
});

export const getCartStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const prisma = getPrisma();
    const [cartCount, cartItems] = await Promise.all([
      prisma.cart.count(),
      prisma.cartItems.findMany({
        select: { quantity: true, product: { select: { price: true } } },
      }),
    ]);
    const totalActiveValue = cartItems
      .reduce(
        (sum, i) =>
          sum + i.quantity * i.product.price.toSignificantDigits(2).toNumber(),
        0,
      )
      .toFixed(2);
    return { cartCount, totalActiveValue };
  },
);
