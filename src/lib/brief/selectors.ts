import {
  DECISIONS,
  EXISTING_SERVICES,
  FEATURE_GROUPS,
  INTEGRATIONS,
  LEVEL_GLYPH,
  LEVEL_LABEL,
  VARIANTS,
} from "./data";
import type { BriefState, Level, VariantMeta } from "./types";

export interface ResolvedFeature {
  id: string;
  name: string;
  desc: string;
  level: Level;
  levelLabel: string;
  glyph: string;
  note: string;
}

export interface ResolvedGroup {
  id: string;
  name: string;
  inScope: ResolvedFeature[];
  outOfScopeCount: number;
}

export interface ResolvedIntegration {
  id: string;
  name: string;
  desc: string;
  note: string;
  pcon?: boolean;
}

export interface ResolvedExistingService {
  id: string;
  name: string;
  hint: string;
  systemName: string;
  note: string;
}

export interface ResolvedDecision {
  num: number;
  question: string;
  choice: string;
  answer: string;
}

export interface ResolvedBrief {
  variant: VariantMeta | null;
  groups: ResolvedGroup[];
  requiredIntegrations: ResolvedIntegration[];
  optionalIntegrations: ResolvedIntegration[];
  existingServices: ResolvedExistingService[];
  decisions: ResolvedDecision[];
  featureCount: number;
  integrationCount: number;
}

export function resolveBrief(state: BriefState): ResolvedBrief {
  const variant = VARIANTS.find((v) => v.key === state.variant) ?? null;

  const groups: ResolvedGroup[] = FEATURE_GROUPS.map((g) => {
    const inScope: ResolvedFeature[] = [];
    let outOfScopeCount = 0;
    for (const f of g.features) {
      const fs = state.features[f.id];
      if (fs?.inScope) {
        inScope.push({
          id: f.id,
          name: f.name,
          desc: f.desc,
          level: fs.level,
          levelLabel: LEVEL_LABEL[fs.level],
          glyph: LEVEL_GLYPH[fs.level],
          note: fs.note.trim(),
        });
      } else {
        outOfScopeCount += 1;
      }
    }
    return { id: g.id, name: g.name, inScope, outOfScopeCount };
  }).filter((g) => g.inScope.length > 0);

  const mapInt = (kind: "required" | "optional"): ResolvedIntegration[] =>
    INTEGRATIONS.filter(
      (i) => i.kind === kind && state.integrations[i.id]?.inScope,
    ).map((i) => ({
      id: i.id,
      name: i.name,
      desc: i.desc,
      note: state.integrations[i.id]?.note.trim() ?? "",
      pcon: i.pcon,
    }));

  const existingServices: ResolvedExistingService[] = EXISTING_SERVICES.filter(
    (s) => state.existingServices[s.id]?.inScope,
  ).map((s) => ({
    id: s.id,
    name: s.name,
    hint: s.hint,
    systemName: state.existingServices[s.id]?.systemName.trim() ?? "",
    note: state.existingServices[s.id]?.note.trim() ?? "",
  }));

  const decisions: ResolvedDecision[] = DECISIONS.map((d) => ({
    num: d.num,
    question: d.question,
    choice: state.decisions[d.id]?.choice ?? "",
    answer: state.decisions[d.id]?.answer.trim() ?? "",
  })).filter((d) => d.choice || d.answer);

  const featureCount = groups.reduce((n, g) => n + g.inScope.length, 0);
  const integrationCount =
    mapInt("required").length + mapInt("optional").length;

  return {
    variant,
    groups,
    requiredIntegrations: mapInt("required"),
    optionalIntegrations: mapInt("optional"),
    existingServices,
    decisions,
    featureCount,
    integrationCount,
  };
}

/** Liczba pozycji w zakresie — do paska postępu / podsumowań. */
export function countScoped(state: BriefState): {
  features: number;
  integrations: number;
} {
  const features = Object.values(state.features).filter(
    (f) => f.inScope,
  ).length;
  const integrations = Object.values(state.integrations).filter(
    (i) => i.inScope,
  ).length;
  return { features, integrations };
}
