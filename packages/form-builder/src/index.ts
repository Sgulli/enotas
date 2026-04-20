export {
  type FieldDefinition,
  type FieldType,
  type BaseField,
  type StringField,
  type NumberField,
  type BooleanField,
  type DateField,
  type DatetimeField,
  type RichTextField,
  type SelectField,
  type MultiselectField,
  type TextareaField,
  type EmailField,
  type UrlField,
  type PhoneField,
  type ColorField,
  type SliderField,
  type FileField,
  type StringValidation,
  type NumberValidation,
  type DateValidation,
  type FileValidation,
  type SelectOption,
  type RichTextToolbarOption,
} from "./lib/types.js";

export {
  JSONSchemaToFields,
  JSONSchemaToFormSchema,
  type JSONSchema,
  type JSONSchemaType,
  type _JSONSchema,
  type Schema,
} from "./lib/json-schema.js";

export {
  applyUiToFields,
  applyUiToField,
  type FormUiFieldOptions,
  type FormFieldType,
} from "./lib/ui-schema.js";

export { FormBuilder } from "./components/form-builder/FormBuilder.js";
export type { FormBuilderProps } from "./components/form-builder/FormBuilder.js";
export { FieldInputs } from "./components/form-builder/FieldInputs.js";
export type { FieldInputsProps } from "./components/form-builder/FieldInputs.js";
export { RichTextEditor } from "./components/form-builder/RichTextEditor.js";
export type { RichTextEditorProps } from "./components/form-builder/RichTextEditor.js";
