"use client";

import * as React from "react";
import { MessageSquarePlusIcon, MessageSquareTextIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

/** Zwijane pole uwag — domyślnie zwinięte, otwiera się gdy jest treść. */
export function NoteField({
  id,
  value,
  onChange,
  label,
  placeholder = "Uwagi, doprecyzowanie zakresu…",
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(value.trim().length > 0);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <MessageSquarePlusIcon className="size-3.5" />
        Dodaj uwagę
      </button>
    );
  }

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
      >
        <MessageSquareTextIcon className="size-3.5" />
        {label}
      </label>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="min-h-0 resize-y text-sm"
      />
    </div>
  );
}
