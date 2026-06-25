import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-6 inline-flex items-center gap-2.5">
          <span className="size-2.5 rounded-[3px] bg-brand" aria-hidden />
          <span className="text-sm font-bold uppercase tracking-[0.18em]">
            Metro · Meble biurowe
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter sm:text-5xl">
          Strefa B2B — konfiguracja zakresu
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          Interaktywny formularz dla Zarządu i product ownera. Wybierz wariant,
          zaznacz funkcje i integracje, rozstrzygnij decyzje — a na końcu
          wygeneruj gotowy <strong>brief PDF</strong> dla software house.
        </p>
        <div className="mt-8">
          <Button
            size="lg"
            render={
              <Link href="/b2b/brief">
                Otwórz konfigurator
                <ArrowRightIcon className="size-4" />
              </Link>
            }
          />
        </div>
      </div>
    </main>
  );
}
