import { createFileRoute } from "@tanstack/react-router";
import { getCarts, getCartStats } from "#/server/carts";
import { ActiveCartsPage } from "#/components/admin/screens/ActiveCartsPage";

export const Route = createFileRoute("/_admin/carts")({
  loader: async () => {
    const [carts, stats] = await Promise.all([getCarts(), getCartStats()]);
    return { carts, stats };
  },
  component: ActiveCartsPage,
});
