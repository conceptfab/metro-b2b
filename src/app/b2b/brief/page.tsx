import type { Metadata } from "next";
import { BriefForm } from "@/components/brief/brief-form";

export const metadata: Metadata = {
  title: "Konfiguracja zakresu — Strefa B2B | Metro",
  description:
    "Interaktywny formularz konfiguracji zakresu Strefy B2B Metro. Zaznacz funkcje, integracje i decyzje, a następnie pobierz brief PDF dla software house.",
};

export default function BriefPage() {
  return (
    <main className="flex-1">
      <BriefForm />
    </main>
  );
}
