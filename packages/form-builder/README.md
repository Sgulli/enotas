# @repo/form-builder

A type-safe, schema-driven form builder for React/Next.js applications. Supports both native `FormSchema` definitions and standard **JSON Schema (draft-07)** with full Zod validation in both paths.

## Features

- **Dual schema support** — Use native `FormSchema` or JSON Schema (draft-07), switch between them seamlessly
- **Fully type-safe** — TypeScript inference from schema to form values
- **16 field types** — string, number, boolean, date, datetime, richtext, select, multiselect, textarea, email, url, phone, color, slider, file
- **Built-in validation** — Zod-powered validation with real-time error feedback
- **Rich text editing** — TipTap-based editor with configurable toolbar
- **shadcn/ui components** — All inputs use your existing design system
- **Layout options** — Single, two-column, or three-column grid layouts
- **JSON Schema extensions** — `x-*` keys for UI hints without breaking validation

## Installation

```bash
pnpm add @repo/form-builder
```

## Quick Start

### Using Native FormSchema

```tsx
import { FormBuilder } from "@repo/form-builder";
import type { FormSchema } from "@repo/form-builder";

const schema: FormSchema = {
  title: "Contact Form",
  description: "Get in touch with us",
  layout: "two-column",
  fields: [
    {
      name: "firstName",
      label: "First Name",
      type: "string",
      required: true,
      placeholder: "John",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
    },
    {
      name: "message",
      label: "Message",
      type: "textarea",
      rows: 4,
    },
    {
      name: "subscribe",
      label: "Subscribe to newsletter",
      type: "boolean",
      variant: "switch",
      defaultValue: false,
    },
  ],
};

export function ContactForm() {
  return (
    <FormBuilder
      schema={schema}
      onSubmit={async (values) => {
        console.log(values);
        // { firstName: "John", email: "john@example.com", ... }
      }}
      submitLabel="Send Message"
    />
  );
}
```

### Using JSON Schema

```tsx
import { FormBuilder } from "@repo/form-builder";
import type { JsonSchema } from "@repo/form-builder";

const jsonSchema: JsonSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "contact-form",
  title: "Contact Form",
  description: "Get in touch with us",
  "x-layout": "two-column",
  type: "object",
  properties: {
    firstName: {
      type: "string",
      title: "First Name",
      minLength: 1,
      "x-placeholder": "John",
    },
    email: {
      type: "string",
      format: "email",
      title: "Email",
    },
    message: {
      type: "string",
      title: "Message",
      "x-field-type": "textarea",
      "x-rows": 4,
    },
    subscribe: {
      type: "boolean",
      title: "Subscribe to newsletter",
      "x-variant": "switch",
      default: false,
    },
  },
  required: ["firstName", "email"],
};

export function ContactForm() {
  return (
    <FormBuilder
      jsonSchema={jsonSchema}
      onSubmit={async (values) => {
        console.log(values);
      }}
    />
  );
}
```

## Field Types

| Type | Description | Validation Options |
|------|-------------|-------------------|
| `string` | Basic text input | `min`, `max`, `pattern` |
| `email` | Email with format validation | `min`, `max`, `pattern` |
| `url` | URL with format validation | - |
| `phone` | Phone number input | - |
| `number` | Numeric input | `min`, `max`, `integer`, `step` |
| `slider` | Range slider | `min`, `max`, `step` |
| `boolean` | Checkbox | - |
| `boolean` (variant: `switch`) | Toggle switch | - |
| `date` | Date picker | `min`, `max` (Date objects) |
| `datetime` | Date and time picker | `min`, `max` (Date objects) |
| `textarea` | Multi-line text | `min`, `max`, `pattern`, `rows` |
| `select` | Dropdown single select | `options: SelectOption[]` |
| `multiselect` | Multi-select with badges | `options`, `maxItems` |
| `richtext` | WYSIWYG editor | `toolbar: RichTextToolbarOption[]` |
| `color` | Color picker | `presets: string[]` |
| `file` | File upload | `accept`, `maxSize` |

## JSON Schema Extensions (x-* keys)

Standard JSON Schema keywords drive validation. Use `x-*` extension keys for UI customization:

| Key | Type | Description |
|-----|------|-------------|
| `x-field-type` | `string` | Override inferred type: `"textarea"`, `"richtext"`, `"slider"`, `"color"`, `"phone"`, `"switch"`, `"file"` |
| `x-placeholder` | `string` | Input placeholder text |
| `x-options` | `SelectOption[]` | Custom option list for select/multiselect |
| `x-toolbar` | `RichTextToolbarOption[]` | Richtext toolbar buttons |
| `x-presets` | `string[]` | Color picker preset swatches |
| `x-rows` | `number` | Textarea visible rows |
| `x-step` | `number` | Number/slider step increment |
| `x-variant` | `"checkbox" \| "switch"` | Boolean field render variant |
| `x-class` | `string` | CSS class on field wrapper (e.g., `"sm:col-span-2"`) |
| `x-disabled` | `boolean` | Disable the field in the UI |
| `x-hidden` | `boolean` | Hide from UI but still validate |
| `x-layout` | `"single" \| "two-column" \| "three-column"` | Grid layout (top-level object only) |
| `x-order` | `string[]` | Explicit field rendering order |

### JSON Schema Example with Extensions

```typescript
const schema: JsonSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  "x-layout": "two-column",
  "x-order": ["name", "email", "role", "bio"],
  properties: {
    name: {
      type: "string",
      title: "Full Name",
      "x-placeholder": "Jane Doe",
      "x-class": "sm:col-span-2",
    },
    email: {
      type: "string",
      format: "email",
      title: "Email Address",
    },
    role: {
      type: "string",
      enum: ["admin", "editor", "viewer"],
      title: "Role",
      "x-options": [
        { value: "admin", label: "Administrator", description: "Full access" },
        { value: "editor", label: "Editor", description: "Can edit content" },
        { value: "viewer", label: "Viewer", description: "Read-only access" },
      ],
    },
    bio: {
      type: "string",
      title: "Biography",
      "x-field-type": "richtext",
      "x-toolbar": [
        { type: "bold" },
        { type: "italic" },
        { type: "link" },
        { type: "bulletList" },
        { type: "orderedList" },
      ],
      "x-class": "sm:col-span-2",
    },
    themeColor: {
      type: "string",
      title: "Theme Color",
      "x-field-type": "color",
      "x-presets": ["#ff0000", "#00ff00", "#0000ff"],
    },
    notifications: {
      type: "boolean",
      title: "Enable Notifications",
      "x-variant": "switch",
      default: true,
    },
    avatar: {
      type: "string",
      format: "uri",
      title: "Avatar URL",
      "x-field-type": "file",
      "x-class": "sm:col-span-2",
    },
  },
  required: ["name", "email", "role"],
};
```

## Component API

### FormBuilder

```tsx
type FormBuilderProps =
  | {
      schema: FormSchema;
      jsonSchema?: never;
    }
  | {
      jsonSchema: JsonSchema;
      schema?: never;
    } & {
      onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
      onCancel?: () => void;
      defaultValues?: Partial<Record<string, unknown>>;
      submitLabel?: string;
      cancelLabel?: string;
      disabled?: boolean;
      className?: string;
      footer?: React.ReactNode;
    };
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `schema` | `FormSchema` | - | Native form schema (mutually exclusive with `jsonSchema`) |
| `jsonSchema` | `JsonSchema` | - | JSON Schema draft-07 (mutually exclusive with `schema`) |
| `onSubmit` | `(values) => void \| Promise<void>` | - | Form submission handler |
| `onCancel` | `() => void` | - | Cancel button handler (shows cancel button if provided) |
| `defaultValues` | `Partial<Record<string, unknown>>` | - | Pre-fill form values |
| `submitLabel` | `string` | `"Submit"` | Submit button text |
| `cancelLabel` | `string` | `"Cancel"` | Cancel button text |
| `disabled` | `boolean` | `false` | Disable all form fields |
| `className` | `string` | - | Additional CSS classes on form wrapper |
| `footer` | `React.ReactNode` | - | Custom footer content (replaces default buttons) |

### FieldInputs

Renders a single field input based on field type. Used internally by `FormBuilder`.

```tsx
import { FieldInputs } from "@repo/form-builder";
import type { FieldDefinition } from "@repo/form-builder";

const field: FieldDefinition = {
  name: "email",
  label: "Email",
  type: "email",
  required: true,
};

<FieldInputs
  field={field}
  value={formData.email}
  onChange={(v) => setFormData({ ...formData, email: v })}
  errors={errors.email}
/>;
```

### RichTextEditor

Standalone rich text editor component.

```tsx
import { RichTextEditor } from "@repo/form-builder";

<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Write something..."
  toolbar={[
    { type: "bold" },
    { type: "italic" },
    { type: "underline" },
    { type: "separator" },
    { type: "heading" },
    { type: "bulletList" },
    { type: "orderedList" },
    { type: "separator" },
    { type: "link" },
    { type: "codeBlock" },
  ]}
/>;
```

## Validation

Validation is handled automatically by Zod schemas generated from your schema definition.

### Native FormSchema Validation

```typescript
const schema: FormSchema = {
  fields: [
    {
      name: "username",
      type: "string",
      required: true,
      validation: {
        min: 3,
        max: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
      },
    },
    {
      name: "age",
      type: "number",
      validation: {
        min: 18,
        max: 120,
        integer: true,
      },
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
  ],
};
```

### JSON Schema Validation

All standard JSON Schema validation keywords are supported:

```typescript
const jsonSchema: JsonSchema = {
  properties: {
    username: {
      type: "string",
      minLength: 3,
      maxLength: 20,
      pattern: "^[a-zA-Z0-9_]+$",
    },
    age: {
      type: "integer",
      minimum: 18,
      maximum: 120,
    },
    email: {
      type: "string",
      format: "email",
    },
    website: {
      type: "string",
      format: "uri",
    },
    score: {
      type: "number",
      exclusiveMinimum: 0,
      exclusiveMaximum: 100,
      multipleOf: 0.5,
    },
  },
  required: ["username", "email"],
};
```

## Type Inference

Form values are automatically inferred from your schema:

```typescript
import { FormBuilder, type FormSchema, type InferFormValues } from "@repo/form-builder";

const schema = {
  fields: [
    { name: "name", type: "string" as const, required: true },
    { name: "age", type: "number" as const },
    { name: "active", type: "boolean" as const },
  ],
} satisfies FormSchema;

type FormValues = InferFormValues<typeof schema>;
// type FormValues = {
//   name: string;
//   age?: number;
//   active?: boolean;
// }

function handleSubmit(values: FormValues) {
  // Fully typed!
}
```

## Advanced Patterns

### Conditional Fields

Use `x-hidden` to conditionally hide fields while keeping validation:

```tsx
function DynamicForm({ showAdvanced }: { showAdvanced: boolean }) {
  const schema: JsonSchema = {
    properties: {
      name: { type: "string", title: "Name" },
      advanced: {
        type: "string",
        title: "Advanced Setting",
        "x-hidden": !showAdvanced,
      },
    },
    required: ["name"],
  };

  return <FormBuilder jsonSchema={schema} onSubmit={handleSubmit} />;
}
```

### Custom Field Ordering

Control render order with `x-order`:

```typescript
const schema: JsonSchema = {
  "x-order": ["email", "name", "phone"], // Render in this order
  properties: {
    name: { type: "string" },
    email: { type: "string", format: "email" },
    phone: { type: "string" },
  },
};
```

### Field Dependencies

Set up field dependencies using the component state:

```tsx
function DependentForm() {
  const [country, setCountry] = useState("US");

  const schema: JsonSchema = {
    properties: {
      country: {
        type: "string",
        title: "Country",
        enum: ["US", "CA", "UK"],
        "x-options": [
          { value: "US", label: "United States" },
          { value: "CA", label: "Canada" },
          { value: "UK", label: "United Kingdom" },
        ],
      },
      state: {
        type: "string",
        title: "State/Province",
        "x-disabled": country === "UK", // Disable for UK
      },
    },
    required: ["country"],
  };

  return (
    <FormBuilder
      jsonSchema={schema}
      defaultValues={{ country }}
      onSubmit={handleSubmit}
    />
  );
}
```

## Error Handling

Errors are displayed inline below each field. The form prevents submission until all required fields pass validation.

```tsx
<FormBuilder
  schema={schema}
  onSubmit={async (values) => {
    try {
      await api.submit(values);
    } catch (error) {
      // Handle submission error
      console.error(error);
    }
  }}
/>
```

## Dependencies

- `@tanstack/react-form` — Form state management
- `zod` — Runtime validation
- `@tiptap/react` — Rich text editor
- `date-fns` — Date formatting
- `@repo/ui` — shadcn/ui components
- `lucide-react` — Icons

## License

Private — internal use only.
