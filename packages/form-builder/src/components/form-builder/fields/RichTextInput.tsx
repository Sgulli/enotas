import type { RichTextToolbarOption } from "../../../lib/types.js";
import { RichTextEditor } from "../RichTextEditor.js";

export interface RichTextInputProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  toolbar?: RichTextToolbarOption[];
  errorText?: string;
}

export function RichTextInput({
  value = "",
  onChange,
  disabled,
  placeholder,
  toolbar,
  errorText,
}: RichTextInputProps) {
  return (
    <div className="space-y-2">
      <RichTextEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        toolbar={toolbar}
      />
      {errorText && <p className="text-sm text-destructive">{errorText}</p>}
    </div>
  );
}
