import { betterAuth } from "better-auth";
import type { BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { loadEnvPackage } from "@repo/shared";
import { getEnv } from "./env.js";
import { getPrisma } from "@repo/db";
import { admin } from "better-auth/plugins";
import { createId } from "@paralleldrive/cuid2";

/** Narrow plugin tuple so `auth.api` includes admin methods (`listUsers`, …). */

loadEnvPackage(import.meta.url);

const { BETTER_AUTH_URL, BETTER_AUTH_SECRET, BETTER_AUTH_NAME } = getEnv();

const prisma = getPrisma();
const database = prismaAdapter(prisma, {
  provider: "postgresql",
  transaction: true,
});

const authConfig = {
  appName: BETTER_AUTH_NAME,
  secret: BETTER_AUTH_SECRET,
  baseURL: BETTER_AUTH_URL,
  emailAndPassword: { enabled: true },
  database,
  plugins: [admin(), tanstackStartCookies()],
  experimental: { joins: true },
  advanced: { database: { generateId: () => createId() } },
} satisfies BetterAuthOptions;

export const auth = betterAuth(authConfig);

export type Auth = typeof auth;
