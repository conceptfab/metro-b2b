// ---------------------------------------------------------------------------
// Model danych formularza „Strefa B2B" — pojedyncze źródło prawdy dla UI i PDF.
// ---------------------------------------------------------------------------

/** Warianty bazowe (kroki kart) i kolumny macierzy. */
export type VariantKey = "min" | "base" | "ext";

/** Odbiorca funkcji / filtr widoczności. */
export type Audience = "dealer" | "arch" | "both";

/** Poziom realizacji funkcji w danym wariancie: brak / ograniczony / pełny. */
export type Level = 0 | 1 | 2;

/** Filtr odbiorcy w UI (krok 2). */
export type AudienceFilter = "all" | Exclude<Audience, "both">;

export interface VariantMeta {
  key: VariantKey;
  index: 0 | 1 | 2;
  name: string;
  /** krótki podtytuł */
  tagline: string;
  /** charakterystyka kosztu / ryzyka */
  price: string;
  bullets: string[];
  recommended?: boolean;
  /** 1-zdaniowe uzasadnienie do PDF */
  rationale: string;
}

export interface Feature {
  id: string;
  name: string;
  desc: string;
  aud: Audience;
  /** poziom realizacji per wariant [min, base, ext] */
  lv: [Level, Level, Level];
}

export interface FeatureGroup {
  id: string;
  name: string;
  features: Feature[];
}

export interface Integration {
  id: string;
  name: string;
  desc: string;
  /** w których wariantach integracja jest potrzebna */
  tiers: VariantKey[];
  kind: "required" | "optional";
  /** wyróżnienie zależności pCon/OFML */
  pcon?: boolean;
}

/** Istniejące usługi Metro do potwierdzenia (checkbox + nazwa/wersja). */
export interface ExistingService {
  id: string;
  name: string;
  hint: string;
}

export interface DecisionPoint {
  id: string;
  /** numer porządkowy z dokumentu */
  num: number;
  question: string;
  /** opcjonalne warianty odpowiedzi (RadioGroup) */
  options?: string[];
}

/** Rozdział „Bezpieczeństwo i RODO" — treść przekrojowa do PDF. */
export interface SecuritySection {
  title: string;
  items: string[];
}

// --------------------------- Stan formularza -------------------------------

export interface ProjectInfo {
  company: string;
  contact: string;
  email: string;
  date: string; // YYYY-MM-DD
  title: string;
}

export interface FeatureState {
  inScope: boolean;
  level: Level;
  note: string;
}

export interface IntegrationState {
  inScope: boolean;
  note: string;
}

export interface ExistingServiceState {
  inScope: boolean;
  systemName: string;
  note: string;
}

export interface DecisionState {
  answer: string;
  choice: string;
}

export interface BriefState {
  project: ProjectInfo;
  variant: VariantKey | null;
  features: Record<string, FeatureState>;
  integrations: Record<string, IntegrationState>;
  existingServices: Record<string, ExistingServiceState>;
  decisions: Record<string, DecisionState>;
  generalNotes: string;
  /** filtr odbiorcy w macierzy (krok 2) */
  audienceFilter: AudienceFilter;
}
