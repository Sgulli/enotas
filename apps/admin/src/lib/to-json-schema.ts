import type { JSONSchema } from "@repo/form-builder";
import * as z from "zod";

export function toJsonSchema(schema: z.ZodSchema): JSONSchema {
  return z.toJSONSchema(schema, {
    target: "draft-2020-12",
    unrepresentable: "any",
    reused: "ref",
    cycles: "ref",
  }) as unknown as JSONSchema;
}
