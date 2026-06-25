# Metro Catalogs — Strefa B2B (konfigurator zakresu → brief PDF)

Interaktywny, wielosekcyjny formularz „Konfiguracja zakresu Strefy B2B". Pozwala
interesariuszowi Metro wybrać zakres wdrożenia, dodać uwagi i wygenerować
**brief PDF** dla software house.

Stack: **Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui (Base UI)**.
Stan po stronie klienta (zustand + autosave do `localStorage`), PDF przez
`@react-pdf/renderer`. Light/dark, WCAG AA, mobile-first.

## Uruchomienie

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # produkcyjny build + typecheck
npm run lint
```

## Gdzie jest trasa

| Ścieżka | Plik | Opis |
|---|---|---|
| `/` | [`src/app/page.tsx`](src/app/page.tsx) | landing z linkiem do konfiguratora |
| `/b2b/brief` | [`src/app/b2b/brief/page.tsx`](src/app/b2b/brief/page.tsx) | konfigurator (renderuje `BriefForm`) |

Orkiestrator kroków: [`src/components/brief/brief-form.tsx`](src/components/brief/brief-form.tsx)
(stepper, `Progress`, nawigacja, „Wyczyść", przełącznik motywu). Poszczególne
kroki to `step-project`, `step-variant`, `step-matrix`, `step-integrations`,
`step-decisions`, `step-summary` w [`src/components/brief/`](src/components/brief/).

## Jak działa stan

- Jeden typowany model `BriefState` — [`src/lib/brief/types.ts`](src/lib/brief/types.ts).
- Store: **zustand + `persist`** — [`src/lib/brief/store.ts`](src/lib/brief/store.ts).
  - **Autosave** do `localStorage` pod kluczem `metro-b2b-brief` (stała `STORAGE_KEY`).
  - `selectVariant()` wstępnie ustawia poziomy w macierzy i zakres integracji wg
    wybranego wariantu; pojedyncze pozycje (i uwagi) można potem nadpisać.
  - `merge()` scala zapisany stan z domyślnym — po rozszerzeniu modelu (nowe
    funkcje/integracje) stare zapisy nie psują UI.
  - `hydrated` chroni przed niezgodnością SSR/CSR (formularz renderuje się po
    rehydracji; przycisk „Wyczyść" wywołuje `reset()`).
- Selektory dla podsumowania i PDF (jedno źródło) —
  [`src/lib/brief/selectors.ts`](src/lib/brief/selectors.ts) (`resolveBrief`).

## Jak rozszerzyć dane formularza

**Model jest źródłem prawdy dla UI i PDF.** Wystarczy edytować
[`src/lib/brief/data.ts`](src/lib/brief/data.ts) — UI, podsumowanie i PDF
zaktualizują się same. Każda pozycja ma **stabilne `id`** (klucz stanu) —
nie zmieniaj istniejących `id`, bo rozłączysz zapisany stan.

- **Nowa funkcja** → dodaj obiekt do `features` właściwej grupy w `FEATURE_GROUPS`
  (`id`, `name`, `desc`, `aud: dealer|arch|both`, `lv: [min, base, ext]`,
  gdzie `0`=brak, `1`=ograniczony, `2`=pełny).
- **Nowa grupa** → dodaj wpis do `FEATURE_GROUPS` (renderuje się jako sekcja
  Accordion i nagłówek grupy w tabeli PDF).
- **Nowa integracja** → dopisz do `INTEGRATIONS` (`kind: "required" | "optional"`,
  `tiers: VariantKey[]`, `pcon?: true` dla wyróżnienia pCon/OFML).
- **Istniejąca usługa Metro** (checkbox + pole „nazwa/wersja") → `EXISTING_SERVICES`.
- **Punkt decyzyjny** → `DECISIONS` (opcjonalne `options` renderują szybki wybór
  obok pola odpowiedzi).
- **Rozdział „Bezpieczeństwo i RODO"** w PDF → `SECURITY_SECTIONS`.

Po dodaniu nowych `id` store sam dołoży dla nich domyślny stan przy starcie
(dzięki `merge()` w store).

## Design system / tokeny

Tokeny semantyczne Metro DS są w [`src/app/globals.css`](src/app/globals.css)
(light/dark). Marka `#ffcd05` mapuje się na `--primary` (CTA / stan aktywny,
stosowana punktowo); `--accent` to subtelna powierzchnia pod hovery — dzięki temu
żółć nie staje się dużą płaszczyzną. Dodatkowe tokeny: `--brand`, `--surface`,
`--success`, `--info`, `--warning`, `--danger`. Czcionka **Inter** (UI i PDF).

## PDF

Generowany w przeglądarce (bez backendu) —
[`src/lib/brief/pdf/document.tsx`](src/lib/brief/pdf/document.tsx) +
[`export.tsx`](src/lib/brief/pdf/export.tsx) (dynamiczny import trzyma
`@react-pdf` poza głównym bundlem). Czcionka Inter z `public/fonts/*.ttf`
(pełny zakres znaków, polskie diakrytyki). Plik: `metro-b2b-brief_RRRR-MM-DD.pdf`.
Zawiera: stronę tytułową, wybrany wariant + uzasadnienie, tabelę zakresu
(grupa → funkcja → poziom → uwaga), integracje (wymagane/opcjonalne + usługi
Metro), rozdział „Bezpieczeństwo i RODO", decyzje Zarządu, uwagi ogólne,
numerację stron.
