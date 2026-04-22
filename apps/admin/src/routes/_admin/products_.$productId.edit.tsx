import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/products_/$productId/edit")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/products/$productId",
      params: { productId: params.productId },
    });
  },
});
