import { env } from "#/env";
import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { Auth } from "@repo/auth/types";

const baseURL = env.VITE_BETTER_AUTH_URL ?? "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL,
  plugins: [adminClient(), inferAdditionalFields<Auth>()],
});

export const { useSession } = authClient;
