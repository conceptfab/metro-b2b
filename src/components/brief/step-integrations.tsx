"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  EXISTING_SERVICES,
  INTEGRATIONS,
  PCON_CONTEXT,
} from "@/lib/brief/data";
import { useBriefStore } from "@/lib/brief/store";
import type { Integration } from "@/lib/brief/types";
import { TierBadges, tiersSrText } from "./parts";
import { NoteField } from "./note-field";

function IntegrationRow({ integration }: { integration: Integration }) {
  const state = useBriefStore((s) => s.integrations[integration.id]);
  const setInScope = useBriefStore((s) => s.setIntegrationInScope);
  const setNote = useBriefStore((s) => s.setIntegrationNote);

  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-colors",
        integration.pcon
          ? "border-brand/50 bg-brand/5"
          : "border-border bg-surface-elevated",
        state.inScope ? "" : "opacity-70",
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          id={`int-${integration.id}`}
          checked={state.inScope}
          onCheckedChange={(c) => setInScope(integration.id, c === true)}
          className="mt-0.5"
          aria-label={`Integracja „${integration.name}" w zakresie`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor={`int-${integration.id}`}
              className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold leading-snug"
            >
              {integration.name}
              {integration.pcon && (
                <Badge
                  variant="outline"
                  className="border-brand/50 text-[10px] text-foreground"
                >
                  pCon
                </Badge>
              )}
            </label>
            <span className="sr-only">{tiersSrText(integration.tiers)}</span>
            <TierBadges active={integration.tiers} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {integration.desc}
          </p>
          <div className="mt-2">
            <NoteField
              id={`int-note-${integration.id}`}
              value={state.note}
              onChange={(v) => setNote(integration.id, v)}
              label={`Uwaga do integracji „${integration.name}"`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ExistingServices() {
  const existing = useBriefStore((s) => s.existingServices);
  const setExisting = useBriefStore((s) => s.setExistingService);

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Do potwierdzenia</Badge>
          <h3 className="text-base font-bold">
            Integracje z istniejącymi usługami Metro
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Zaznacz systemy do integracji i wskaż nazwę/wersję — brief jednoznacznie
          rozdzieli, co jest wymagane, a co opcjonalne dla wybranego wariantu.
        </p>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {EXISTING_SERVICES.map((svc) => {
          const st = existing[svc.id];
          return (
            <div
              key={svc.id}
              className={cn(
                "rounded-lg border border-border bg-surface-elevated p-3",
                st.inScope ? "" : "opacity-70",
              )}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`svc-${svc.id}`}
                  checked={st.inScope}
                  onCheckedChange={(c) =>
                    setExisting(svc.id, { inScope: c === true })
                  }
                  className="mt-0.5"
                  aria-label={`Usługa „${svc.name}" do integracji`}
                />
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor={`svc-${svc.id}`}
                    className="cursor-pointer text-sm font-semibold leading-snug"
                  >
                    {svc.name}
                  </label>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {svc.hint}
                  </p>
                  {st.inScope && (
                    <div className="mt-2 space-y-2">
                      <div>
                        <Label
                          htmlFor={`svc-name-${svc.id}`}
                          className="mb-1 text-xs text-muted-foreground"
                        >
                          Nazwa / wersja systemu
                        </Label>
                        <Input
                          id={`svc-name-${svc.id}`}
                          value={st.systemName}
                          placeholder="np. nazwa, wersja, właściciel, priorytet"
                          onChange={(e) =>
                            setExisting(svc.id, { systemName: e.target.value })
                          }
                          className="h-9 text-sm"
                        />
                      </div>
                      <NoteField
                        id={`svc-note-${svc.id}`}
                        value={st.note}
                        onChange={(v) => setExisting(svc.id, { note: v })}
                        label={`Uwaga do „${svc.name}"`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function StepIntegrations() {
  const required = INTEGRATIONS.filter((i) => i.kind === "required");
  const optional = INTEGRATIONS.filter((i) => i.kind === "optional");

  return (
    <div>
      <p className="mb-5 text-sm text-muted-foreground">
        Konkretny system ERP potwierdzany jest na etapie briefu — opisany
        generycznie (warstwa niezależna od dostawcy). Znaczniki MIN/POD/ROZ
        wskazują, w którym wariancie integracja jest potrzebna.
      </p>

      {/* callout pCon */}
      <div className="mb-6 rounded-xl border border-brand/50 border-l-4 border-l-brand bg-brand/5 p-4">
        <div className="flex flex-wrap items-start gap-3">
          <span className="rounded-md bg-brand/15 px-3 py-1.5 text-sm font-extrabold text-foreground">
            pCon
          </span>
          <p className="min-w-0 flex-1 text-sm text-muted-foreground">
            {PCON_CONTEXT}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge className="bg-danger text-danger-foreground hover:bg-danger">
                Wymagane
              </Badge>
              <h3 className="text-base font-bold">
                Bez tego platforma nie działa
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Fundament — dane, ceny, tożsamość i komunikacja transakcyjna.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {required.map((i) => (
              <IntegrationRow key={i.id} integration={i} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge className="bg-info text-info-foreground hover:bg-info">
                Opcjonalne
              </Badge>
              <h3 className="text-base font-bold">
                Rozwijają wartość i automatyzację
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Dokładane stopniowo wraz z dojrzewaniem platformy.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {optional.map((i) => (
              <IntegrationRow key={i.id} integration={i} />
            ))}
          </CardContent>
        </Card>
      </div>

      <ExistingServices />
    </div>
  );
}
