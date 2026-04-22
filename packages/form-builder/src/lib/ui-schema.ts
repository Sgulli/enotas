import type {
  FieldDefinition,
  SelectOption,
  RichTextToolbarOption,
  BaseField,
  NumberField,
  TextareaField,
} from "./types.js";

export type FormFieldType =
  | "select"
  | "textarea"
  | "richtext"
  | "color"
  | "phone"
  | "file"
  | "slider"
  | "switch";

export interface FormUiFieldOptions {
  fieldType?: FormFieldType;
  placeholder?: string;
  className?: string;
  rows?: number;
  step?: number;
  options?: SelectOption[];
  toolbar?: RichTextToolbarOption[];
  presets?: string[];
  variant?: "checkbox" | "switch";
  disabled?: boolean;
  hidden?: boolean;
}

export interface FormUiSchema {
  layout?: "single" | "two-column" | "three-column";
  order?: readonly string[];
  fields?: Record<string, FormUiFieldOptions>;
}

function applyBaseProps(
  field: FieldDefinition,
  ui: FormUiFieldOptions,
): BaseField {
  const base: BaseField = {
    name: field.name,
    label: field.label,
    description: field.description,
    defaultValue: field.defaultValue,
    required: field.required,
    placeholder: ui.placeholder ?? field.placeholder,
    className: ui.className ?? field.className,
    disabled: ui.disabled ?? field.disabled,
    hidden: ui.hidden ?? field.hidden,
  };
  return base;
}

function applyFieldTypeOverride(
  base: BaseField,
  ui: FormUiFieldOptions,
  original: FieldDefinition,
): FieldDefinition {
  switch (ui.fieldType) {
    case "textarea": {
      const src = original as TextareaField;
      return {
        ...base,
        type: "textarea",
        rows: ui.rows,
        validation: src.validation,
      };
    }
    case "richtext":
      return { ...base, type: "richtext", toolbar: ui.toolbar };
    case "color":
      return { ...base, type: "color", presets: ui.presets };
    case "phone":
      return { ...base, type: "phone" };
    case "file":
      return { ...base, type: "file" };
    case "slider": {
      const src = original as NumberField;
      return {
        ...base,
        type: "slider",
        step: ui.step,
        min: src.validation?.min,
        max: src.validation?.max,
      };
    }
    case "select":
      return { ...base, type: "select", options: ui.options ?? [] };
    case "switch":
      return { ...base, type: "boolean", variant: "switch" };
    default:
      return { ...base, type: original.type } as FieldDefinition;
  }
}

function applyTypeSpecificProps(
  base: BaseField,
  ui: FormUiFieldOptions,
  original: FieldDefinition,
): FieldDefinition {
  // options on a non-select/multiselect field → promote to select
  if (
    ui.options !== undefined &&
    original.type !== "select" &&
    original.type !== "multiselect"
  ) {
    return { ...base, type: "select", options: ui.options };
  }

  switch (original.type) {
    case "number":
      return {
        ...base,
        type: "number",
        validation: {
          ...original.validation,
          ...(ui.step !== undefined && { step: ui.step }),
        },
      };
    case "slider":
      return {
        ...base,
        type: "slider",
        step: ui.step ?? original.step,
        min: original.min,
        max: original.max,
      };
    case "textarea":
      return {
        ...base,
        type: "textarea",
        validation: original.validation,
        rows: ui.rows ?? original.rows,
      };
    case "select":
      return {
        ...base,
        type: "select",
        options: ui.options ?? original.options,
      };
    case "multiselect":
      return {
        ...base,
        type: "multiselect",
        options: ui.options ?? original.options,
        maxItems: original.maxItems,
      };
    case "richtext":
      return {
        ...base,
        type: "richtext",
        toolbar: ui.toolbar ?? original.toolbar,
      };
    case "color":
      return {
        ...base,
        type: "color",
        presets: ui.presets ?? original.presets,
      };
    case "boolean":
      return {
        ...base,
        type: "boolean",
        variant: ui.variant ?? original.variant,
      };
    default:
      return { ...base, type: original.type } as FieldDefinition;
  }
}

export function applyUiToField(
  field: FieldDefinition,
  ui: FormUiFieldOptions,
): FieldDefinition {
  const base = applyBaseProps(field, ui);
  if (ui.fieldType) {
    return applyFieldTypeOverride(base, ui, field);
  }
  return applyTypeSpecificProps(base, ui, field);
}

export function applyUiToFields(
  fields: FieldDefinition[],
  ui?: FormUiSchema,
): FieldDefinition[] {
  if (!ui) return fields;

  const enriched = fields.map((field) => {
    const fieldUi = ui.fields?.[field.name];
    return fieldUi ? applyUiToField(field, fieldUi) : field;
  });

  if (!ui.order) return enriched;

  const byName = new Map(enriched.map((f) => [f.name, f]));
  const orderedSet = new Set(ui.order);
  const ordered = ui.order
    .map((name) => byName.get(name))
    .filter((f): f is FieldDefinition => f !== undefined);
  const remainder = enriched.filter((f) => !orderedSet.has(f.name));
  return [...ordered, ...remainder];
}
