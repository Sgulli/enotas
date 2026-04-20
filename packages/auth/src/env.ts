import * as v from "valibot";

export const envSchema = v.object({
  BETTER_AUTH_SECRET: v.pipe(v.string(), v.nonEmpty()),
  BETTER_AUTH_URL: v.optional(v.pipe(v.string(), v.url())),
  BETTER_AUTH_NAME: v.optional(v.pipe(v.string(), v.nonEmpty())),
});

export const databaseUrlSchema = v.pipe(v.string(), v.url(), v.nonEmpty());

type Env = v.InferOutput<typeof envSchema>;
type DatabaseUrl = v.InferOutput<typeof databaseUrlSchema>;
type EnvWithDatabaseUrl = Env & { DATABASE_URL: DatabaseUrl };

export function getEnv(): EnvWithDatabaseUrl {
  const env = v.parse(envSchema, process.env);
  const databaseUrl = v.parse(databaseUrlSchema, process.env.DATABASE_URL);
  return { ...env, DATABASE_URL: databaseUrl };
}
