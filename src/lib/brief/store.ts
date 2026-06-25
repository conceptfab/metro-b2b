"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ALL_FEATURES,
  DECISIONS,
  EXISTING_SERVICES,
  INTEGRATIONS,
  STORAGE_KEY,
  VARIANT_INDEX,
} from "./data";
import type {
  AudienceFilter,
  BriefState,
  DecisionState,
  ExistingServiceState,
  FeatureState,
  IntegrationState,
  Level,
  ProjectInfo,
  VariantKey,
} from "./types";

function buildFeatureDefaults(): Record<string, FeatureState> {
  const out: Record<string, FeatureState> = {};
  for (const f of ALL_FEATURES) {
    out[f.id] = { inScope: false, level: 0, note: "" };
  }
  return out;
}

function buildIntegrationDefaults(): Record<string, IntegrationState> {
  const out: Record<string, IntegrationState> = {};
  for (const i of INTEGRATIONS) {
    out[i.id] = { inScope: false, note: "" };
  }
  return out;
}

function buildExistingServiceDefaults(): Record<string, ExistingServiceState> {
  const out: Record<string, ExistingServiceState> = {};
  for (const s of EXISTING_SERVICES) {
    out[s.id] = { inScope: false, systemName: "", note: "" };
  }
  return out;
}

function buildDecisionDefaults(): Record<string, DecisionState> {
  const out: Record<string, DecisionState> = {};
  for (const d of DECISIONS) {
    out[d.id] = { answer: "", choice: "" };
  }
  return out;
}

function emptyState(): BriefState {
  return {
    project: {
      company: "Metro",
      contact: "",
      email: "",
      date: "",
      title: "Strefa B2B — konfiguracja zakresu",
    },
    variant: null,
    features: buildFeatureDefaults(),
    integrations: buildIntegrationDefaults(),
    existingServices: buildExistingServiceDefaults(),
    decisions: buildDecisionDefaults(),
    generalNotes: "",
    audienceFilter: "all",
  };
}

interface BriefStore extends BriefState {
  hydrated: boolean;
  setHydrated: (v: boolean) => void;

  setProject: (patch: Partial<ProjectInfo>) => void;
  selectVariant: (variant: VariantKey) => void;

  setFeatureInScope: (id: string, inScope: boolean) => void;
  setFeatureLevel: (id: string, level: Level) => void;
  setFeatureNote: (id: string, note: string) => void;

  setIntegrationInScope: (id: string, inScope: boolean) => void;
  setIntegrationNote: (id: string, note: string) => void;

  setExistingService: (
    id: string,
    patch: Partial<ExistingServiceState>,
  ) => void;

  setDecision: (id: string, patch: Partial<DecisionState>) => void;
  setGeneralNotes: (notes: string) => void;
  setAudienceFilter: (filter: AudienceFilter) => void;

  reset: () => void;
}

export const useBriefStore = create<BriefStore>()(
  persist(
    (set) => ({
      ...emptyState(),
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),

      setProject: (patch) =>
        set((s) => ({ project: { ...s.project, ...patch } })),

      // Wybór wariantu wstępnie ustawia poziomy w macierzy i zakres integracji;
      // pojedyncze pozycje (i uwagi) pozostają edytowalne / zachowane.
      selectVariant: (variant) =>
        set((s) => {
          const idx = VARIANT_INDEX[variant];
          const features: Record<string, FeatureState> = { ...s.features };
          for (const f of ALL_FEATURES) {
            const level = f.lv[idx];
            features[f.id] = {
              ...features[f.id],
              level,
              inScope: level > 0,
            };
          }
          const integrations: Record<string, IntegrationState> = {
            ...s.integrations,
          };
          for (const i of INTEGRATIONS) {
            integrations[i.id] = {
              ...integrations[i.id],
              inScope: i.tiers.includes(variant),
            };
          }
          return { variant, features, integrations };
        }),

      setFeatureInScope: (id, inScope) =>
        set((s) => ({
          features: {
            ...s.features,
            [id]: { ...s.features[id], inScope },
          },
        })),

      setFeatureLevel: (id, level) =>
        set((s) => ({
          features: {
            ...s.features,
            // ustawienie poziomu „pełny/ograniczony" implikuje zakres,
            // ustawienie „brak" wyłącza z zakresu
            [id]: { ...s.features[id], level, inScope: level > 0 },
          },
        })),

      setFeatureNote: (id, note) =>
        set((s) => ({
          features: {
            ...s.features,
            [id]: { ...s.features[id], note },
          },
        })),

      setIntegrationInScope: (id, inScope) =>
        set((s) => ({
          integrations: {
            ...s.integrations,
            [id]: { ...s.integrations[id], inScope },
          },
        })),

      setIntegrationNote: (id, note) =>
        set((s) => ({
          integrations: {
            ...s.integrations,
            [id]: { ...s.integrations[id], note },
          },
        })),

      setExistingService: (id, patch) =>
        set((s) => ({
          existingServices: {
            ...s.existingServices,
            [id]: { ...s.existingServices[id], ...patch },
          },
        })),

      setDecision: (id, patch) =>
        set((s) => ({
          decisions: {
            ...s.decisions,
            [id]: { ...s.decisions[id], ...patch },
          },
        })),

      setGeneralNotes: (generalNotes) => set({ generalNotes }),
      setAudienceFilter: (audienceFilter) => set({ audienceFilter }),

      reset: () => set({ ...emptyState() }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // utrzymujemy tylko dane formularza (bez akcji i flagi hydracji)
      partialize: (s): BriefState => ({
        project: s.project,
        variant: s.variant,
        features: s.features,
        integrations: s.integrations,
        existingServices: s.existingServices,
        decisions: s.decisions,
        generalNotes: s.generalNotes,
        audienceFilter: s.audienceFilter,
      }),
      // scalanie zachowuje nowe klucze danych (np. po rozszerzeniu modelu)
      merge: (persisted, current) => {
        const base = emptyState();
        const p = (persisted ?? {}) as Partial<BriefState>;
        return {
          ...current,
          ...base,
          ...p,
          project: { ...base.project, ...(p.project ?? {}) },
          features: { ...base.features, ...(p.features ?? {}) },
          integrations: { ...base.integrations, ...(p.integrations ?? {}) },
          existingServices: {
            ...base.existingServices,
            ...(p.existingServices ?? {}),
          },
          decisions: { ...base.decisions, ...(p.decisions ?? {}) },
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
