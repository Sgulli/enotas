import type { Auth as BetterAuthApi, BetterAuthOptions } from "better-auth";

/**
 * Public auth types for apps that must not import `@repo/auth` (server entry pulls Node-only env loading).
 * Use `import type { Auth, Session } from "@repo/auth/types"` in client code.
 */
export type Auth = BetterAuthApi<BetterAuthOptions>;

export type Session = Auth["$Infer"]["Session"];
