"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { DECISIONS } from "@/lib/brief/data";
import { useBriefStore } from "@/lib/brief/store";
import type { DecisionPoint } from "@/lib/brief/types";

function DecisionRow({ decision }: { decision: DecisionPoint }) {
  const state = useBriefStore((s) => s.decisions[decision.id]);
  const setDecision = useBriefStore((s) => s.setDecision);

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex gap-3">
          <span
            aria-hidden
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand/15 text-sm font-bold text-foreground"
          >
            {decision.num}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug">
              {decision.question}
            </p>

            {decision.options && (
              <RadioGroup
                value={state.choice}
                onValueChange={(v) =>
                  setDecision(decision.id, { choice: String(v) })
                }
                className="mt-3 flex flex-wrap gap-2"
                aria-label={`Wybór dla: ${decision.question}`}
              >
                {decision.options.map((opt) => {
                  const id = `${decision.id}-${opt}`;
                  const active = state.choice === opt;
                  return (
                    <Label
                      key={opt}
                      htmlFor={id}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
                        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                        active
                          ? "border-brand bg-brand/10 font-medium"
                          : "border-border hover:bg-accent",
                      )}
                    >
                      <RadioGroupItem id={id} value={opt} />
                      {opt}
                    </Label>
                  );
                })}
              </RadioGroup>
            )}

            <div className="mt-3">
              <Label
                htmlFor={`ans-${decision.id}`}
                className="mb-1.5 text-xs text-muted-foreground"
              >
                Odpowiedź / uzasadnienie
              </Label>
              <Textarea
                id={`ans-${decision.id}`}
                value={state.answer}
                onChange={(e) =>
                  setDecision(decision.id, { answer: e.target.value })
                }
                placeholder="Rozstrzygnięcie, kontekst, osoby odpowiedzialne…"
                rows={2}
                className="resize-y text-sm"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StepDecisions() {
  return (
    <div>
      <p className="mb-5 text-sm text-muted-foreground">
        Otwarte pytania, które brief ma rozstrzygnąć. Każdy punkt ma pole
        odpowiedzi, część — także szybki wybór.
      </p>
      <div className="space-y-3">
        {DECISIONS.map((d) => (
          <DecisionRow key={d.id} decision={d} />
        ))}
      </div>
    </div>
  );
}
