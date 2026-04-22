import type { FieldDefinition, SelectOption, FormSchema } from "./types.js";

export type JSONSchemaType =
  | "object"
  | "array"
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "integer";

export type _JSONSchema = boolean | JSONSchema;

export type JSONSchema = {
  [k: string]: unknown;
  $schema?:
    | "https://json-schema.org/draft/2020-12/schema"
    | "http://json-schema.org/draft-07/schema#"
    | "http://json-schema.org/draft-04/schema#";
  $id?: string;
  $anchor?: string;
  $ref?: string;
  $dynamicRef?: string;
  $dynamicAnchor?: string;
  $vocabulary?: Record<string, boolean>;
  $comment?: string;
  $defs?: Record<string, JSONSchema>;
  type?: JSONSchemaType;
  additionalItems?: _JSONSchema;
  unevaluatedItems?: _JSONSchema;
  prefixItems?: _JSONSchema[];
  items?: _JSONSchema | _JSONSchema[];
  contains?: _JSONSchema;
  additionalProperties?: _JSONSchema;
  unevaluatedProperties?: _JSONSchema;
  properties?: Record<string, _JSONSchema>;
  patternProperties?: Record<string, _JSONSchema>;
  dependentSchemas?: Record<string, _JSONSchema>;
  propertyNames?: _JSONSchema;
  if?: _JSONSchema;
  then?: _JSONSchema;
  else?: _JSONSchema;
  allOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  not?: _JSONSchema;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number | boolean;
  minimum?: number;
  exclusiveMinimum?: number | boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxContains?: number;
  minContains?: number;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  dependentRequired?: Record<string, string[]>;
  enum?: (string | number | boolean | null)[];
  const?: string | number | boolean | null;
  id?: string;
  title?: string;
  description?: string;
  default?: unknown;
  deprecated?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  nullable?: boolean;
  examples?: unknown[];
  format?: string;
  contentMediaType?: string;
  contentEncoding?: string;
  contentSchema?: JSONSchema;
};

export type Schema =
  | ObjectSchema
  | ArraySchema
  | StringSchema
  | NumberSchema
  | IntegerSchema
  | BooleanSchema
  | NullSchema;

export interface ObjectSchema extends JSONSchema {
  type: "object";
}
export interface ArraySchema extends JSONSchema {
  type: "array";
}
export interface StringSchema extends JSONSchema {
  type: "string";
}
export interface NumberSchema extends JSONSchema {
  type: "number";
}
export interface IntegerSchema extends JSONSchema {
  type: "integer";
}
export interface BooleanSchema extends JSONSchema {
  type: "boolean";
}
export interface NullSchema extends JSONSchema {
  type: "null";
}

export function JSONSchemaToFields(schema: JSONSchema): FieldDefinition[] {
  const requiredSet = new Set(schema.required ?? []);
  const order = Object.keys(schema.properties ?? {});
  const fields: FieldDefinition[] = [];

  for (const name of order) {
    const prop = schema.properties?.[name];
    if (!prop || typeof prop === "boolean") continue;
    const field = inferField(name, prop, requiredSet.has(name));
    if (field) fields.push(field);
  }

  return fields;
}

function inferField(
  name: string,
  prop: JSONSchema,
  required: boolean,
): FieldDefinition | null {
  const base = {
    name,
    required,
    label: prop.title ?? toLabel(name),
    description: prop.description,
    defaultValue: prop.default,
  };

  const baseType = prop.type;

  switch (baseType) {
    case "boolean":
      return { ...base, type: "boolean", variant: "checkbox" };

    case "number":
    case "integer":
      return {
        ...base,
        type: "number",
        validation: {
          min: prop.minimum,
          max: prop.maximum,
          integer: baseType === "integer",
        },
      };

    case "array": {
      const items = prop.items;
      const itemSchema = Array.isArray(items) ? items[0] : items;
      const itemProp =
        itemSchema && typeof itemSchema !== "boolean" ? itemSchema : undefined;
      return {
        ...base,
        type: "multiselect",
        options: resolveOptions(prop, itemProp),
        maxItems: prop.maxItems,
      };
    }

    case "string": {
      if (prop.enum) {
        return { ...base, type: "select", options: resolveOptions(prop) };
      }
      switch (prop.format) {
        case "date":
          return { ...base, type: "date" };
        case "date-time":
          return { ...base, type: "datetime" };
        case "email":
        case "idn-email":
          return { ...base, type: "email", validation: stringValidation(prop) };
        case "uri":
        case "uri-reference":
          return { ...base, type: "url" };
        default:
          return {
            ...base,
            type: "string",
            validation: stringValidation(prop),
          };
      }
    }

    case "object":
      return null;

    default:
      if (prop.properties) return null;
      return { ...base, type: "string", validation: stringValidation(prop) };
  }
}

function stringValidation(prop: JSONSchema) {
  const validation: { min?: number; max?: number; pattern?: RegExp } = {};
  if (prop.minLength) validation.min = prop.minLength;
  if (prop.maxLength) validation.max = prop.maxLength;
  if (prop.pattern) validation.pattern = new RegExp(prop.pattern);
  return validation;
}

function resolveOptions(
  prop: JSONSchema,
  itemProp?: JSONSchema,
): SelectOption[] {
  const values = prop.enum ?? itemProp?.enum ?? [];
  return values
    .filter((v) => v !== null)
    .map((v) => ({
      value: String(v),
      label: toLabel(String(v)),
    }));
}

function toLabel(name: string): string {
  return name
    .replaceAll(/([A-Z])/g, " $1")
    .replaceAll(/[_-]/g, " ")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

export function JSONSchemaToFormSchema(schema: JSONSchema): FormSchema {
  return {
    id: schema.$id,
    title: schema.title,
    description: schema.description,
    layout: "single",
    fields: JSONSchemaToFields(schema),
  };
}
