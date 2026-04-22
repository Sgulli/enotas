import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/products")({
  component: ProductsLayout,
});

function ProductsLayout() {
  return <Outlet />;
}
