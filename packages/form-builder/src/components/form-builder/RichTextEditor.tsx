"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link2,
  Minus,
} from "lucide-react";
import { useEffect, useCallback } from "react";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";

const lowlight = createLowlight(all);

export interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  toolbar?: {
    type: string;
    label?: string;
  }[];
}

const toolbarButtons: {
  type: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: (e: Editor) => void;
}[] = [
  {
    type: "bold",
    icon: Bold,
    action: (e: Editor) => e.chain().focus().toggleBold().run(),
  },
  {
    type: "italic",
    icon: Italic,
    action: (e: Editor) => e.chain().focus().toggleItalic().run(),
  },
  {
    type: "underline",
    icon: UnderlineIcon,
    action: (e: Editor) => e.chain().focus().toggleUnderline().run(),
  },
  {
    type: "strike",
    icon: Strikethrough,
    action: (e: Editor) => e.chain().focus().toggleStrike().run(),
  },
  { type: "separator" },
  {
    type: "code",
    icon: Code,
    action: (e: Editor) => e.chain().focus().toggleCode().run(),
  },
  {
    type: "heading",
    icon: Heading1,
    action: (e: Editor) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  { type: "separator" },
  {
    type: "bulletList",
    icon: List,
    action: (e: Editor) => e.chain().focus().toggleBulletList().run(),
  },
  {
    type: "orderedList",
    icon: ListOrdered,
    action: (e: Editor) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    type: "blockquote",
    icon: Quote,
    action: (e: Editor) => e.chain().focus().toggleBlockquote().run(),
  },
  { type: "separator" },
  {
    type: "codeBlock",
    icon: Code2,
    action: (e: Editor) => e.chain().focus().toggleCodeBlock().run(),
  },
  {
    type: "link",
    icon: Link2,
    action: (e: Editor) => {
      const url = window.prompt("URL");
      if (url) e.chain().focus().setLink({ href: url }).run();
    },
  },
  {
    type: "horizontalRule",
    icon: Minus,
    action: (e: Editor) => e.chain().focus().setHorizontalRule().run(),
  },
];

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
  disabled = false,
  toolbar,
}: RichTextEditorProps) {
  const visibleButtons = toolbar
    ? toolbarButtons.filter((b) => toolbar.some((t) => t.type === b.type))
    : toolbarButtons;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="rounded-lg border">
      <div className="flex flex-wrap items-center gap-1 border-b p-1.5">
        {visibleButtons.map((btn, i) => {
          if (btn.type === "separator") {
            return (
              <Separator key={i} orientation="vertical" className="mx-1 h-5" />
            );
          }

          const isActive =
            btn.type === "heading"
              ? editor.isActive("heading", { level: 2 })
              : editor.isActive(btn.type);

          const action =
            btn.type === "link" ? handleSetLink : () => btn.action?.(editor);

          return (
            <Button
              key={btn.type}
              type="button"
              variant={isActive ? "secondary" : "ghost"}
              size="icon-xs"
              onClick={action}
              disabled={disabled}
            >
              {btn.icon && <btn.icon className="h-3.5 w-3.5" />}
            </Button>
          );
        })}
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-3 focus:outline-none min-h-[120px]"
      />
    </div>
  );
}
