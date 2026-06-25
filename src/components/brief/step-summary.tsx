"use client";

import * as React from "react";
import { DownloadIcon, FileTextIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { LEVEL_LABEL } from "@/lib/brief/data";
import { downloadBriefPdf } from "@/lib/brief/pdf/export";
import { resolveBrief } from "@/lib/brief/selectors";
import { useShallow } from "zustand/react/shallow";
import { useBriefStore } from "@/lib/brief/store";
import type { BriefState, Level } from "@/lib/brief/types";

const LEVEL_DOT: Record<Level, string> = {
  0: "bg-muted-foreground/40",
  1: "bg-warning",
  2: "bg-success",
};

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export function StepSummary() {
  const generalNotes = useBriefStore((s) => s.generalNotes);
  const setGeneralNotes = useBriefStore((s) => s.setGeneralNotes);
  // pełny stan do PDF (subskrybujemy całość — to ostatni krok).
  // useShallow jest wymagany: bez niego selektor zwraca nowy obiekt przy każdym
  // renderze, co w Zustand v5 powoduje pętlę "Maximum update depth exceeded".
  const state = useBriefStore(
    useShallow(
      (s): BriefState => ({
        project: s.project,
        variant: s.variant,
        features: s.features,
        integrations: s.integrations,
        existingServices: s.existingServices,
        decisions: s.decisions,
        generalNotes: s.generalNotes,
        audienceFilter: s.audienceFilter,
      }),
    ),
  );

  const brief = React.useMemo(() => resolveBrief(state), [state]);
  const [busy, setBusy] = React.useState(false);

  async function handleExport() {
    setBusy(true);
    try {
      await downloadBriefPdf(state);
      toast.success("Brief PDF wygenerowany");
    } catch (err) {
      console.error(err);
      toast.error("Nie udało się wygenerować PDF. Spróbuj ponownie.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Podsumowanie liczbowe + wariant */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileTextIcon className="size-5 text-muted-foreground" />
            <h3 className="text-base font-bold">Podsumowanie konfiguracji</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-x-8 sm:grid-cols-2">
            <div>
              <StatRow
                label="Wariant bazowy"
                value={
                  brief.variant ? (
                    <Badge className="bg-brand text-brand-foreground hover:bg-brand">
                      {brief.variant.name}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">nie wybrano</span>
                  )
                }
              />
              <StatRow label="Funkcje w zakresie" value={brief.featureCount} />
              <StatRow
                label="Integracje w zakresie"
                value={brief.integrationCount}
              />
            </div>
            <div>
              <StatRow
                label="Integracje wymagane"
                value={brief.requiredIntegrations.length}
              />
              <StatRow
                label="Integracje opcjonalne"
                value={brief.optionalIntegrations.length}
              />
              <StatRow
                label="Istniejące usługi Metro"
                value={brief.existingServices.length}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zakres funkcji (read-only) */}
      <Card>
        <CardHeader>
          <h3 className="text-base font-bold">Zakres funkcji</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {brief.groups.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nie zaznaczono jeszcze żadnych funkcji w zakresie.
            </p>
          ) : (
            brief.groups.map((g) => (
              <div key={g.id}>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {g.name}
                </h4>
                <ul className="space-y-1.5">
                  {g.inScope.map((f) => (
                    <li
                      key={f.id}
                      className="flex items-start justify-between gap-3 text-sm"
                    >
                      <span className="flex items-start gap-2">
                        <span
                          className={`mt-1.5 size-2 shrink-0 rounded-full ${LEVEL_DOT[f.level]}`}
                          aria-hidden
                        />
                        <span>
                          {f.name}
                          {f.note && (
                            <span className="text-muted-foreground">
                              {" "}
                              — {f.note}
                            </span>
                          )}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {LEVEL_LABEL[f.level]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Integracje (read-only) */}
      <Card>
        <CardHeader>
          <h3 className="text-base font-bold">Integracje</h3>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Wymagane
            </h4>
            {brief.requiredIntegrations.length ? (
              <ul className="space-y-1 text-sm">
                {brief.requiredIntegrations.map((i) => (
                  <li key={i.id}>
                    {i.name}
                    {i.pcon && (
                      <Badge
                        variant="outline"
                        className="ml-1.5 border-brand/50 text-[10px]"
                      >
                        pCon
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Opcjonalne
            </h4>
            {brief.optionalIntegrations.length ? (
              <ul className="space-y-1 text-sm">
                {brief.optionalIntegrations.map((i) => (
                  <li key={i.id}>{i.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
          {brief.existingServices.length > 0 && (
            <div className="sm:col-span-2">
              <Separator className="mb-4" />
              <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Istniejące usługi Metro
              </h4>
              <ul className="space-y-1 text-sm">
                {brief.existingServices.map((svc) => (
                  <li key={svc.id}>
                    {svc.name}
                    {svc.systemName && (
                      <span className="text-muted-foreground">
                        {" "}
                        — {svc.systemName}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uwagi ogólne */}
      <Card>
        <CardHeader>
          <h3 className="text-base font-bold">Uwagi ogólne / cele biznesowe</h3>
        </CardHeader>
        <CardContent>
          <Label htmlFor="general-notes" className="sr-only">
            Uwagi ogólne
          </Label>
          <Textarea
            id="general-notes"
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            placeholder="Cele biznesowe, ograniczenia, oczekiwany harmonogram, budżet, priorytety…"
            rows={4}
            className="resize-y"
          />
        </CardContent>
      </Card>

      {/* Eksport */}
      <div className="flex flex-col items-start gap-3 rounded-xl border border-brand/40 bg-brand/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">Gotowy brief dla software house</p>
          <p className="text-sm text-muted-foreground">
            Pełna treść (nie skróty), czcionka Inter, osobny rozdział
            „Bezpieczeństwo i RODO”.
          </p>
        </div>
        <Button
          size="lg"
          onClick={handleExport}
          disabled={busy}
          className="bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {busy ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <DownloadIcon className="size-4" />
          )}
          Pobierz brief (PDF)
        </Button>
      </div>
    </div>
  );
}
