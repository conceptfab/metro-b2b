"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBriefStore } from "@/lib/brief/store";

export function StepProject() {
  const project = useBriefStore((s) => s.project);
  const setProject = useBriefStore((s) => s.setProject);

  const fields: {
    id: keyof typeof project;
    label: string;
    type?: string;
    placeholder?: string;
    autoComplete?: string;
  }[] = [
    {
      id: "company",
      label: "Nazwa firmy",
      placeholder: "Metro",
      autoComplete: "organization",
    },
    {
      id: "contact",
      label: "Osoba kontaktowa",
      placeholder: "Imię i nazwisko",
      autoComplete: "name",
    },
    {
      id: "email",
      label: "E-mail",
      type: "email",
      placeholder: "kontakt@metro.pl",
      autoComplete: "email",
    },
    { id: "date", label: "Data", type: "date" },
    {
      id: "title",
      label: "Tytuł projektu",
      placeholder: "Strefa B2B — konfiguracja zakresu",
    },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <p className="mb-6 text-sm text-muted-foreground">
          Te dane trafiają do nagłówka briefu PDF. Możesz je uzupełnić teraz
          lub wrócić do nich przed eksportem.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((f) => (
            <div
              key={f.id}
              className={f.id === "title" ? "sm:col-span-2" : undefined}
            >
              <Label htmlFor={`project-${f.id}`} className="mb-2">
                {f.label}
              </Label>
              <Input
                id={`project-${f.id}`}
                type={f.type ?? "text"}
                value={project[f.id]}
                placeholder={f.placeholder}
                autoComplete={f.autoComplete}
                onChange={(e) => setProject({ [f.id]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
