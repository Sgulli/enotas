import { betterAuth } from "better-auth";
import type { BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getPrisma } from "@repo/db";
import { admin } from "better-auth/plugins";
import { createId } from "@paralleldrive/cuid2";

const prisma = getPrisma();
const database = prismaAdapter(prisma, {
  provider: "postgresql",
  transaction: true,
});

const authConfig = {
  appName: process.env.BETTER_AUTH_NAME,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true },
  database,
  plugins: [admin(), tanstackStartCookies()],
  user: {
    additionalFields: {
      role: { type: "string", input: true },
      banned: { type: "boolean", input: true },
      banReason: { type: "string", input: true },
    },
  },
  experimental: { joins: true },
  advanced: { database: { generateId: () => createId() } },
} satisfies BetterAuthOptions;

export const auth = betterAuth(authConfig);

export type Auth = typeof auth;

export type Session = typeof auth.$Infer.Session;
