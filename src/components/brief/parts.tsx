"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { VARIANT_SHORT } from "@/lib/brief/data";
import type { Level, VariantKey } from "@/lib/brief/types";

const ALL_TIERS: VariantKey[] = ["min", "base", "ext"];

/** Znaczniki MIN/POD/ROZ — podświetla warianty, w których pozycja występuje. */
export function TierBadges({
  active,
  className,
}: {
  active: VariantKey[];
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1", className)} aria-hidden>
      {ALL_TIERS.map((t) => {
        const on = active.includes(t);
        return (
          <span
            key={t}
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide tabular-nums",
              on
                ? "bg-brand/15 text-foreground ring-1 ring-brand/40"
                : "bg-muted text-muted-foreground/50",
            )}
          >
            {VARIANT_SHORT[t]}
          </span>
        );
      })}
    </div>
  );
}

/** Tekstowy opis dostępności wariantów dla czytników ekranu. */
export function tiersSrText(active: VariantKey[]): string {
  if (!active.length) return "Brak w żadnym wariancie";
  const labels: Record<VariantKey, string> = {
    min: "Minimalny",
    base: "Podstawowy",
    ext: "Rozszerzony",
  };
  return "Dostępne w wariantach: " + active.map((t) => labels[t]).join(", ");
}

const LEVELS: { value: Level; glyph: string; label: string }[] = [
  { value: 0, glyph: "–", label: "Brak" },
  { value: 1, glyph: "◐", label: "Ograniczony" },
  { value: 2, glyph: "✓", label: "Pełny" },
];

const LEVEL_ACTIVE: Record<Level, string> = {
  0: "bg-muted text-muted-foreground ring-border",
  1: "bg-warning/15 text-warning ring-warning/40",
  2: "bg-success/15 text-success ring-success/40",
};

/**
 * Dostępny selektor poziomu realizacji (– / ◐ / ✓) zbudowany na natywnych
 * radio-inputach — pełna obsługa klawiatury i czytników ekranu.
 */
export function LevelSelector({
  name,
  value,
  onChange,
  label,
}: {
  name: string;
  value: Level;
  onChange: (level: Level) => void;
  label: string;
}) {
  return (
    <fieldset className="flex items-center gap-1">
      <legend className="sr-only">{label}</legend>
      {LEVELS.map((lv) => {
        const checked = value === lv.value;
        const id = `${name}-${lv.value}`;
        return (
          <label
            key={lv.value}
            htmlFor={id}
            title={lv.label}
            className={cn(
              "relative flex h-8 w-9 cursor-pointer select-none items-center justify-center rounded-md text-sm font-bold ring-1 transition-colors",
              "ring-border hover:bg-accent",
              "focus-within:ring-2 focus-within:ring-ring",
              checked ? LEVEL_ACTIVE[lv.value] : "text-muted-foreground/60",
            )}
          >
            <input
              id={id}
              type="radio"
              name={name}
              className="sr-only"
              checked={checked}
              onChange={() => onChange(lv.value)}
            />
            <span aria-hidden>{lv.glyph}</span>
            <span className="sr-only">{lv.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

/** Mała legenda poziomów. */
export function LevelLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {LEVELS.map((lv) => (
        <span key={lv.value} className="inline-flex items-center gap-1.5">
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded text-[11px] font-bold ring-1",
              LEVEL_ACTIVE[lv.value],
            )}
            aria-hidden
          >
            {lv.glyph}
          </span>
          {lv.label}
        </span>
      ))}
    </div>
  );
}
