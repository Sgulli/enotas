import type { BaseIssue, BaseSchema } from "valibot";
import { toJsonSchema } from "@valibot/to-json-schema";

/**
 * Converts a Valibot schema to a JSON Schema.
 * @param schema - The Valibot schema to convert.
 * @returns The JSON Schema.
 */
export function valibotSchemaToJsonSchema<
  TInput,
  TOutput,
  TIssue extends BaseIssue<unknown>,
>(schema: BaseSchema<TInput, TOutput, TIssue>) {
  return toJsonSchema(schema);
}
