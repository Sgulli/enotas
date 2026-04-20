import { z } from "zod";

export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "richtext"
  | "select"
  | "multiselect"
  | "textarea"
  | "email"
  | "url"
  | "phone"
  | "color"
  | "slider"
  | "file";

export interface StringValidation {
  min?: number;
  max?: number;
  pattern?: RegExp;
}

export interface NumberValidation {
  min?: number;
  max?: number;
  integer?: boolean;
  step?: number;
}

export interface DateValidation {
  min?: Date;
  max?: Date;
}

export interface FileValidation {
  maxSize?: number;
  accept?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RichTextToolbarOption {
  type:
    | "bold"
    | "italic"
    | "underline"
    | "strike"
    | "code"
    | "heading"
    | "bulletList"
    | "orderedList"
    | "blockquote"
    | "codeBlock"
    | "link"
    | "horizontalRule";
  label?: string;
}

export interface BaseField {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  defaultValue?: unknown;
}

export interface StringField extends BaseField {
  type: "string";
  validation?: StringValidation;
}

export interface NumberField extends BaseField {
  type: "number";
  validation?: NumberValidation;
}

export interface BooleanField extends BaseField {
  type: "boolean";
  variant?: "checkbox" | "switch";
}

export interface DateField extends BaseField {
  type: "date";
  validation?: DateValidation;
}

export interface DatetimeField extends BaseField {
  type: "datetime";
  validation?: DateValidation;
}

export interface RichTextField extends BaseField {
  type: "richtext";
  toolbar?: RichTextToolbarOption[];
}

export interface SelectField extends BaseField {
  type: "select";
  options: SelectOption[];
}

export interface MultiselectField extends BaseField {
  type: "multiselect";
  options: SelectOption[];
  maxItems?: number;
}

export interface TextareaField extends BaseField {
  type: "textarea";
  rows?: number;
  validation?: StringValidation;
}

export interface EmailField extends BaseField {
  type: "email";
  validation?: StringValidation;
}

export interface UrlField extends BaseField {
  type: "url";
}

export interface PhoneField extends BaseField {
  type: "phone";
}

export interface ColorField extends BaseField {
  type: "color";
  presets?: string[];
}

export interface SliderField extends BaseField {
  type: "slider";
  min?: number;
  max?: number;
  step?: number;
}

export interface FileField extends BaseField {
  type: "file";
  validation?: FileValidation;
}

export type FieldDefinition =
  | StringField
  | NumberField
  | BooleanField
  | DateField
  | DatetimeField
  | RichTextField
  | SelectField
  | MultiselectField
  | TextareaField
  | EmailField
  | UrlField
  | PhoneField
  | ColorField
  | SliderField
  | FileField;

export interface FormSchema {
  id?: string;
  title?: string;
  description?: string;
  layout?: "single" | "two-column" | "three-column";
  fields: FieldDefinition[];
}

type ZodAnySchema =
  | z.ZodString
  | z.ZodNumber
  | z.ZodBoolean
  | z.ZodDate
  | z.ZodArray<z.ZodString>
  | z.ZodEmail
  | z.ZodURL
  | z.ZodDefault<z.ZodTypeAny>
  | z.ZodOptional<z.ZodTypeAny>
  | z.ZodUnion<[z.ZodTypeAny, z.ZodTypeAny]>
  | z.ZodUnknown
  | z.ZodType;

export function buildZodSchema(
  fields: FieldDefinition[],
): z.ZodObject<Record<string, ZodAnySchema>> {
  const shape: Record<string, ZodAnySchema> = {};

  for (const field of fields) {
    shape[field.name] = buildFieldZod(field);
  }

  return z.object(shape);
}

function buildFieldZod(field: FieldDefinition): ZodAnySchema {
  let schema: ZodAnySchema;

  switch (field.type) {
    case "string":
      schema = buildStringZod(field.validation);
      break;
    case "number":
      schema = buildNumberZod(field.validation);
      break;
    case "boolean":
      schema = z.boolean();
      break;
    case "date": {
      let dateSchema = z.coerce.date() as z.ZodDate;
      if (field.validation?.min) {
        const minDate = field.validation.min;
        dateSchema = dateSchema.refine(
          (d) => d >= minDate,
          "Date must be after minimum date",
        );
      }
      if (field.validation?.max) {
        const maxDate = field.validation.max;
        dateSchema = dateSchema.refine(
          (d) => d <= maxDate,
          "Date must be before maximum date",
        );
      }
      schema = dateSchema;
      break;
    }
    case "datetime": {
      let dtSchema = z.coerce.date() as z.ZodDate;
      if (field.validation?.min) {
        const minDate = field.validation.min;
        dtSchema = dtSchema.refine(
          (d) => d >= minDate,
          "Datetime must be after minimum",
        );
      }
      if (field.validation?.max) {
        const maxDate = field.validation.max;
        dtSchema = dtSchema.refine(
          (d) => d <= maxDate,
          "Datetime must be before maximum",
        );
      }
      schema = dtSchema;
      break;
    }
    case "richtext":
      schema = z.string();
      break;
    case "select":
      schema = z.string();
      break;
    case "multiselect": {
      let arrSchema = z.array(z.string());
      if (field.maxItems) arrSchema = arrSchema.max(field.maxItems);
      schema = arrSchema;
      break;
    }
    case "textarea":
      schema = buildStringZod(field.validation);
      break;
    case "email": {
      let emailSchema = z.email();
      if (field.validation?.min)
        emailSchema = emailSchema.min(field.validation.min);
      if (field.validation?.max)
        emailSchema = emailSchema.max(field.validation.max);
      if (field.validation?.pattern)
        emailSchema = emailSchema.regex(field.validation.pattern);
      schema = emailSchema;
      break;
    }
    case "url":
      schema = z.url();
      break;
    case "phone":
      schema = z.string();
      break;
    case "color":
      schema = z.string();
      break;
    case "slider": {
      let sliderSchema = z.number();
      if (field.min !== undefined) sliderSchema = sliderSchema.min(field.min);
      if (field.max !== undefined) sliderSchema = sliderSchema.max(field.max);
      schema = sliderSchema;
      break;
    }
    case "file":
      schema = z.instanceof(File).or(z.string());
      break;
    default: {
      const _exhaustive: never = field;
      schema = z.unknown();
      break;
    }
  }

  if (field.defaultValue !== undefined) {
    schema = (schema as z.ZodType).default(field.defaultValue) as ZodAnySchema;
  }

  return field.required !== false
    ? ((schema as z.ZodType).optional() as ZodAnySchema)
    : schema;
}

function buildStringZod(validation?: StringValidation): z.ZodString {
  let schema = z.string();
  if (validation?.min) schema = schema.min(validation.min);
  if (validation?.max) schema = schema.max(validation.max);
  if (validation?.pattern) schema = schema.regex(validation.pattern);
  return schema;
}

function buildNumberZod(validation?: NumberValidation): z.ZodNumber {
  let schema = z.number();
  if (validation?.min) schema = schema.min(validation.min);
  if (validation?.max) schema = schema.max(validation.max);
  if (validation?.integer) schema = schema.int();
  return schema;
}

export type InferFormValues<T extends FormSchema> = {
  [K in T["fields"][number]["name"]]: Extract<
    T["fields"][number],
    { name: K }
  > extends { required: false }
    ? Extract<T["fields"][number], { name: K }>["type"] extends "multiselect"
      ? string[] | undefined
      : Extract<T["fields"][number], { name: K }>["type"] extends "boolean"
        ? boolean | undefined
        : string | number | Date | undefined
    : Extract<T["fields"][number], { name: K }>["type"] extends "multiselect"
      ? string[]
      : Extract<T["fields"][number], { name: K }>["type"] extends "boolean"
        ? boolean
        : string | number | Date;
};
