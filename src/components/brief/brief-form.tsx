"use client";

import * as React from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CloudIcon,
  Trash2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { useBriefStore } from "@/lib/brief/store";
import { StepProject } from "./step-project";
import { StepVariant } from "./step-variant";
import { StepMatrix } from "./step-matrix";
import { StepIntegrations } from "./step-integrations";
import { StepDecisions } from "./step-decisions";
import { StepSummary } from "./step-summary";

interface StepDef {
  id: string;
  short: string;
  title: string;
  eyebrow: string;
  Component: React.ComponentType;
}

const STEPS: StepDef[] = [
  {
    id: "project",
    short: "Projekt",
    title: "Dane projektu",
    eyebrow: "Krok 1 z 6",
    Component: StepProject,
  },
  {
    id: "variant",
    short: "Wariant",
    title: "Wybór wariantu bazowego",
    eyebrow: "Krok 2 z 6",
    Component: StepVariant,
  },
  {
    id: "matrix",
    short: "Funkcje",
    title: "Macierz funkcji",
    eyebrow: "Krok 3 z 6",
    Component: StepMatrix,
  },
  {
    id: "integrations",
    short: "Integracje",
    title: "Integracje",
    eyebrow: "Krok 4 z 6",
    Component: StepIntegrations,
  },
  {
    id: "decisions",
    short: "Decyzje",
    title: "Decyzje Zarządu",
    eyebrow: "Krok 5 z 6",
    Component: StepDecisions,
  },
  {
    id: "summary",
    short: "Podsumowanie",
    title: "Podsumowanie i eksport",
    eyebrow: "Krok 6 z 6",
    Component: StepSummary,
  },
];

function FormSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-10">
      <div className="h-8 w-64 rounded bg-muted" />
      <div className="mt-6 h-2 w-full rounded bg-muted" />
      <div className="mt-8 h-64 w-full rounded-xl bg-muted" />
    </div>
  );
}

export function BriefForm() {
  const hydrated = useBriefStore((s) => s.hydrated);
  const reset = useBriefStore((s) => s.reset);
  const [step, setStep] = React.useState(0);

  const topRef = React.useRef<HTMLDivElement>(null);
  const goto = React.useCallback((next: number) => {
    setStep(next);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (!hydrated) return <FormSkeleton />;

  const current = STEPS[step];
  const Current = current.Component;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <div ref={topRef} className="scroll-mt-6" />

      {/* Header */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="size-2.5 rounded-[3px] bg-brand" aria-hidden />
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-foreground">
            Metro · Strefa B2B
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <CloudIcon className="size-3.5 text-success" />
            Zapis automatyczny
          </span>

          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline" size="sm">
                  <Trash2Icon className="size-3.5" />
                  Wyczyść
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Wyczyścić formularz?</DialogTitle>
                <DialogDescription>
                  Usunie to wszystkie wybory i uwagi zapisane lokalnie w tej
                  przeglądarce. Tej operacji nie można cofnąć.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose
                  render={<Button variant="outline">Anuluj</Button>}
                />
                <DialogClose
                  render={
                    <Button
                      variant="destructive"
                      onClick={() => {
                        reset();
                        goto(0);
                      }}
                    >
                      Wyczyść wszystko
                    </Button>
                  }
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <ThemeToggle />
        </div>
      </header>

      {/* Stepper */}
      <nav aria-label="Kroki formularza" className="mb-3">
        <ol className="flex flex-wrap gap-1.5">
          {STEPS.map((st, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <li key={st.id}>
                <button
                  type="button"
                  onClick={() => goto(i)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    active
                      ? "bg-brand text-brand-foreground"
                      : done
                        ? "bg-success/15 text-foreground hover:bg-success/25"
                        : "bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 items-center justify-center rounded-full text-[10px]",
                      active
                        ? "bg-brand-foreground/15"
                        : done
                          ? "bg-success text-success-foreground"
                          : "bg-muted",
                    )}
                  >
                    {done ? <CheckIcon className="size-3" /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{st.short}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <Progress value={progress} className="mb-8 h-1.5" />

      {/* Step heading */}
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {current.eyebrow}
        </p>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          {current.title}
        </h1>
      </div>

      {/* Step body */}
      <div className="min-h-[40vh]">
        <Current />
      </div>

      {/* Nav buttons */}
      <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-5">
        <Button
          variant="outline"
          onClick={() => goto(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <ArrowLeftIcon className="size-4" />
          Wstecz
        </Button>
        <span className="text-xs text-muted-foreground">
          {step + 1} / {STEPS.length}
        </span>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => goto(Math.min(STEPS.length - 1, step + 1))}>
            Dalej
            <ArrowRightIcon className="size-4" />
          </Button>
        ) : (
          <span className="w-[88px]" aria-hidden />
        )}
      </div>
    </div>
  );
}
