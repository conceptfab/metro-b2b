"use client";

import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { VARIANTS } from "@/lib/brief/data";
import { useBriefStore } from "@/lib/brief/store";
import type { VariantKey } from "@/lib/brief/types";

export function StepVariant() {
  const variant = useBriefStore((s) => s.variant);
  const selectVariant = useBriefStore((s) => s.selectVariant);

  return (
    <div>
      <p className="mb-5 text-sm text-muted-foreground">
        Każdy kolejny wariant zawiera wszystko z poprzedniego i dokłada nowe
        możliwości. Wybór wariantu wstępnie ustawia zakres w macierzy funkcji
        (krok 3) — pojedyncze pozycje możesz potem nadpisać.
      </p>

      <RadioGroup
        value={variant ?? ""}
        onValueChange={(v) => selectVariant(v as VariantKey)}
        className="grid gap-4 md:grid-cols-3"
        aria-label="Wybór wariantu bazowego"
      >
        {VARIANTS.map((v) => {
          const selected = variant === v.key;
          const id = `variant-${v.key}`;
          return (
            <Label
              key={v.key}
              htmlFor={id}
              className={cn(
                "relative flex cursor-pointer flex-col items-start gap-0 rounded-xl border bg-card p-5 text-left shadow-sm transition-all",
                "hover:border-brand/60 hover:shadow-md",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                selected
                  ? "border-brand ring-1 ring-brand"
                  : "border-border",
              )}
            >
              {v.recommended && (
                <Badge className="absolute -top-2.5 right-4 bg-brand text-brand-foreground hover:bg-brand">
                  Rekomendowany
                </Badge>
              )}

              <div className="flex w-full items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Wariant {v.index + 1}
                </span>
                <RadioGroupItem id={id} value={v.key} />
              </div>

              <h3 className="mt-2 text-xl font-black tracking-tight">
                {v.name}
              </h3>
              <p className="mt-1 min-h-[40px] text-sm text-muted-foreground">
                {v.tagline}
              </p>
              <p className="mt-3 text-xs font-semibold text-brand-foreground/90">
                <span className="rounded bg-brand/15 px-2 py-1 text-foreground">
                  {v.price}
                </span>
              </p>

              <ul className="mt-4 space-y-2 text-sm">
                {v.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
