"use client";

import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AUDIENCE_LABEL, FEATURE_GROUPS } from "@/lib/brief/data";
import { useBriefStore } from "@/lib/brief/store";
import type { AudienceFilter, Feature, VariantKey } from "@/lib/brief/types";
import {
  LevelLegend,
  LevelSelector,
  TierBadges,
  tiersSrText,
} from "./parts";
import { NoteField } from "./note-field";

const AUD_FILTERS: AudienceFilter[] = ["all", "dealer", "arch"];
const AUD_FILTER_LABEL: Record<AudienceFilter, string> = {
  all: "Wszyscy",
  dealer: "Dealerzy",
  arch: "Architekci",
};

function featureTiers(f: Feature): VariantKey[] {
  const keys: VariantKey[] = ["min", "base", "ext"];
  return keys.filter((_, i) => f.lv[i] > 0);
}

function FeatureRow({ feature }: { feature: Feature }) {
  const fs = useBriefStore((s) => s.features[feature.id]);
  const setInScope = useBriefStore((s) => s.setFeatureInScope);
  const setLevel = useBriefStore((s) => s.setFeatureLevel);
  const setNote = useBriefStore((s) => s.setFeatureNote);

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface-elevated p-3 transition-colors sm:p-4",
        fs.inScope ? "" : "opacity-70",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* lewa: checkbox + nazwa + opis */}
        <div className="flex items-start gap-3">
          <Checkbox
            id={`feat-${feature.id}`}
            checked={fs.inScope}
            onCheckedChange={(c) => setInScope(feature.id, c === true)}
            className="mt-0.5"
            aria-label={`Funkcja „${feature.name}" w zakresie`}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={`feat-${feature.id}`}
                className="cursor-pointer text-sm font-semibold leading-snug"
              >
                {feature.name}
              </label>
              <Tooltip>
                <TooltipTrigger
                  aria-label={`Opis funkcji: ${feature.name}`}
                  className="shrink-0 rounded text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <InfoIcon className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>{feature.desc}</TooltipContent>
              </Tooltip>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {feature.desc}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground/80">
              {AUDIENCE_LABEL[feature.aud]}
            </p>
          </div>
        </div>

        {/* prawa: poziom + dostępność w wariantach */}
        <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
          <LevelSelector
            name={`lvl-${feature.id}`}
            value={fs.level}
            onChange={(lv) => setLevel(feature.id, lv)}
            label={`Poziom realizacji funkcji „${feature.name}"`}
          />
          <span className="sr-only">{tiersSrText(featureTiers(feature))}</span>
          <TierBadges active={featureTiers(feature)} />
        </div>
      </div>

      <div className="mt-2 pl-7">
        <NoteField
          id={`note-${feature.id}`}
          value={fs.note}
          onChange={(v) => setNote(feature.id, v)}
          label={`Uwaga do funkcji „${feature.name}"`}
        />
      </div>
    </div>
  );
}

export function StepMatrix() {
  const audienceFilter = useBriefStore((s) => s.audienceFilter);
  const setAudienceFilter = useBriefStore((s) => s.setAudienceFilter);

  const matchesAud = (f: Feature) =>
    audienceFilter === "all" ||
    f.aud === "both" ||
    f.aud === audienceFilter;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-prose text-sm text-muted-foreground">
          Zaznacz funkcje w zakresie i ustaw poziom realizacji. Znaczniki
          MIN/POD/ROZ pokazują, w którym wariancie funkcja standardowo
          występuje. Uwagi możesz dodać per pozycja.
        </p>

        {/* filtr odbiorcy */}
        <div>
          <span
            id="aud-filter-label"
            className="mb-1.5 block text-xs text-muted-foreground"
          >
            Filtr odbiorcy
          </span>
          <div
            role="group"
            aria-labelledby="aud-filter-label"
            className="inline-flex rounded-full border border-border bg-card p-1"
          >
            {AUD_FILTERS.map((a) => (
              <button
                key={a}
                type="button"
                aria-pressed={audienceFilter === a}
                onClick={() => setAudienceFilter(a)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  audienceFilter === a
                    ? "bg-brand text-brand-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {AUD_FILTER_LABEL[a]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <LevelLegend />
      </div>

      <Accordion
        multiple
        defaultValue={FEATURE_GROUPS.map((g) => g.id)}
        className="space-y-3"
      >
        {FEATURE_GROUPS.map((group) => {
          const visible = group.features.filter(matchesAud);
          if (!visible.length) return null;
          return (
            <AccordionItem
              key={group.id}
              value={group.id}
              className="overflow-hidden rounded-xl border border-border bg-card not-last:border-b"
            >
              <AccordionTrigger className="px-4 hover:no-underline">
                <span className="flex items-baseline gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-foreground">
                    <span className="rounded bg-brand/15 px-2 py-0.5 text-foreground">
                      {group.name}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {visible.length}{" "}
                    {visible.length === 1 ? "funkcja" : "funkcji"}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                <div className="space-y-2.5">
                  {visible.map((f) => (
                    <FeatureRow key={f.id} feature={f} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
