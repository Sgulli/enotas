import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string().optional(),
    DATABASE_URL: z.url().optional(),
  },

  clientPrefix: "VITE_",

  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
    VITE_BETTER_AUTH_URL: z.string().optional(),
  },

  runtimeEnv: import.meta.env,

  emptyStringAsUndefined: true,
});
