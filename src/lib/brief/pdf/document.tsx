import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { SECURITY_SECTIONS } from "../data";
import type { ResolvedBrief } from "../selectors";
import type { BriefState, Level } from "../types";

// ---- Rejestracja czcionki Inter (pełny zakres znaków, w tym polskie) -------
Font.register({
  family: "Inter",
  fonts: [
    { src: "/fonts/Inter-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/Inter-SemiBold.ttf", fontWeight: 600 },
    { src: "/fonts/Inter-Bold.ttf", fontWeight: 700 },
    { src: "/fonts/Inter-Black.ttf", fontWeight: 900 },
  ],
});
// brak automatycznego dzielenia wyrazów (czytelność polskiego tekstu)
Font.registerHyphenationCallback((word) => [word]);

const INK = "#141414";
const MUTED = "#595959";
const BORDER = "#e5e5e5";
const ACCENT = "#ffcd05";
const SUCCESS = "#318153";
const WARNING = "#ca8a04";
const INFO = "#227bc3";

const LEVEL_COLOR: Record<Level, string> = {
  0: "#9aa0aa",
  1: WARNING,
  2: SUCCESS,
};
const LEVEL_WORD: Record<Level, string> = {
  0: "Brak",
  1: "Ograniczony",
  2: "Pełny",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 9.5,
    color: INK,
    paddingTop: 44,
    paddingBottom: 48,
    paddingHorizontal: 44,
    lineHeight: 1.45,
  },
  // --- strona tytułowa ---
  cover: {
    fontFamily: "Inter",
    color: INK,
    padding: 56,
    height: "100%",
    justifyContent: "space-between",
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandDot: { width: 10, height: 10, backgroundColor: ACCENT, borderRadius: 2 },
  brandText: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    color: INK,
  },
  coverTitle: { fontSize: 38, fontWeight: 900, letterSpacing: -1 },
  coverSub: { fontSize: 14, color: MUTED, marginTop: 6 },
  accentBar: {
    width: 64,
    height: 6,
    backgroundColor: ACCENT,
    borderRadius: 3,
    marginTop: 22,
    marginBottom: 22,
  },
  metaGrid: { gap: 6 },
  metaRow: { flexDirection: "row" },
  metaLabel: {
    width: 130,
    fontSize: 10,
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  metaValue: { fontSize: 11, fontWeight: 600 },
  // --- sekcje ---
  eyebrow: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: WARNING,
    marginBottom: 3,
  },
  h2: { fontSize: 15, fontWeight: 900, letterSpacing: -0.3, marginBottom: 8 },
  section: { marginBottom: 20 },
  groupTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    marginTop: 10,
    marginBottom: 4,
    color: INK,
  },
  // --- tabela ---
  tHead: {
    flexDirection: "row",
    backgroundColor: "#f3f3f3",
    borderBottomWidth: 1,
    borderColor: BORDER,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  tHeadCell: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: MUTED,
  },
  tRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: BORDER,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  cFn: { width: "44%", paddingRight: 8 },
  cLvl: { width: "20%", paddingRight: 8 },
  cNote: { width: "36%" },
  fnName: { fontSize: 9.5, fontWeight: 600 },
  fnDesc: { fontSize: 8, color: MUTED, marginTop: 1 },
  lvlPill: { flexDirection: "row", alignItems: "center", gap: 4 },
  lvlDot: { width: 7, height: 7, borderRadius: 2 },
  lvlWord: { fontSize: 9 },
  note: { fontSize: 8.5, color: INK },
  noteEmpty: { fontSize: 8.5, color: "#b0b0b0" },
  // --- integracje / listy ---
  card: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
  intName: { fontSize: 9.5, fontWeight: 700 },
  intDesc: { fontSize: 8.5, color: MUTED, marginTop: 1 },
  intNote: { fontSize: 8.5, marginTop: 3 },
  badge: {
    alignSelf: "flex-start",
    fontSize: 7.5,
    fontWeight: 700,
    color: "#fff",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  bullet: { flexDirection: "row", marginBottom: 3, paddingRight: 4 },
  bulletDot: { width: 10, fontSize: 9.5, color: WARNING },
  bulletText: { flex: 1, fontSize: 9 },
  decRow: { flexDirection: "row", marginBottom: 8 },
  decNum: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#fff7d6",
    color: INK,
    fontSize: 9,
    fontWeight: 700,
    textAlign: "center",
    paddingTop: 3,
    marginRight: 8,
  },
  decQ: { fontSize: 9.5, fontWeight: 600 },
  decChoice: { fontSize: 9, color: INFO, marginTop: 1, fontWeight: 600 },
  decA: { fontSize: 9, marginTop: 2 },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderColor: BORDER,
    paddingTop: 6,
    fontSize: 8,
    color: MUTED,
  },
});

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <View>
      <Text style={s.eyebrow}>{eyebrow}</Text>
      <Text style={s.h2}>{title}</Text>
    </View>
  );
}

function Footer() {
  return (
    <View style={s.footer} fixed>
      <Text>Metro · Strefa B2B — brief</Text>
      <Text
        render={({ pageNumber, totalPages }) =>
          `Strona ${pageNumber} / ${totalPages}`
        }
      />
    </View>
  );
}

interface PdfProps {
  brief: ResolvedBrief;
  project: BriefState["project"];
  generalNotes: string;
}

export function BriefDocument({ brief, project, generalNotes }: PdfProps) {
  const { variant } = brief;

  return (
    <Document
      title={`Brief — Strefa B2B${project.company ? ` · ${project.company}` : ""}`}
      author={project.company || "Metro"}
    >
      {/* === Strona tytułowa === */}
      <Page size="A4" style={s.cover}>
        <View>
          <View style={s.brandRow}>
            <View style={s.brandDot} />
            <Text style={s.brandText}>
              {(project.company || "METRO").toUpperCase()} · MEBLE BIUROWE
            </Text>
          </View>
        </View>

        <View>
          <Text style={s.coverTitle}>Brief — Strefa B2B</Text>
          <Text style={s.coverSub}>
            {project.title || "Konfiguracja zakresu wdrożenia"}
          </Text>
          <View style={s.accentBar} />
          <View style={s.metaGrid}>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>Firma</Text>
              <Text style={s.metaValue}>{project.company || "—"}</Text>
            </View>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>Osoba kontaktowa</Text>
              <Text style={s.metaValue}>{project.contact || "—"}</Text>
            </View>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>E-mail</Text>
              <Text style={s.metaValue}>{project.email || "—"}</Text>
            </View>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>Data</Text>
              <Text style={s.metaValue}>{project.date || "—"}</Text>
            </View>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>Wariant bazowy</Text>
              <Text style={s.metaValue}>{variant ? variant.name : "—"}</Text>
            </View>
          </View>
        </View>

        <Text style={{ fontSize: 9, color: MUTED }}>
          Dokument wygenerowany przez konfigurator zakresu Strefy B2B.
        </Text>
      </Page>

      {/* === Treść === */}
      <Page size="A4" style={s.page}>
        {/* Wariant */}
        <View style={s.section}>
          <SectionHeader eyebrow="Zakres bazowy" title="Wybrany wariant" />
          {variant ? (
            <View
              style={{
                borderWidth: 1,
                borderColor: ACCENT,
                borderRadius: 6,
                padding: 10,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: 900 }}>
                {variant.name}
                {variant.recommended ? "  (rekomendowany)" : ""}
              </Text>
              <Text style={{ fontSize: 9.5, color: MUTED, marginTop: 3 }}>
                {variant.rationale}
              </Text>
            </View>
          ) : (
            <Text style={{ color: MUTED }}>Nie wybrano wariantu bazowego.</Text>
          )}
        </View>

        {/* Tabela zakresu */}
        <View style={s.section}>
          <SectionHeader
            eyebrow="Funkcje w zakresie"
            title="Tabela zakresu"
          />
          {brief.groups.length === 0 ? (
            <Text style={{ color: MUTED }}>
              Nie zaznaczono żadnych funkcji w zakresie.
            </Text>
          ) : (
            <View>
              <View style={s.tHead}>
                <Text style={[s.tHeadCell, s.cFn]}>Funkcja</Text>
                <Text style={[s.tHeadCell, s.cLvl]}>Poziom</Text>
                <Text style={[s.tHeadCell, s.cNote]}>Uwaga</Text>
              </View>
              {brief.groups.map((g) => (
                <View key={g.id} wrap={false}>
                  <Text style={s.groupTitle}>{g.name}</Text>
                  {g.inScope.map((f) => (
                    <View key={f.id} style={s.tRow} wrap={false}>
                      <View style={s.cFn}>
                        <Text style={s.fnName}>{f.name}</Text>
                        <Text style={s.fnDesc}>{f.desc}</Text>
                      </View>
                      <View style={s.cLvl}>
                        <View style={s.lvlPill}>
                          <View
                            style={[
                              s.lvlDot,
                              { backgroundColor: LEVEL_COLOR[f.level] },
                            ]}
                          />
                          <Text style={s.lvlWord}>{LEVEL_WORD[f.level]}</Text>
                        </View>
                      </View>
                      <View style={s.cNote}>
                        {f.note ? (
                          <Text style={s.note}>{f.note}</Text>
                        ) : (
                          <Text style={s.noteEmpty}>—</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Integracje */}
        <View style={s.section}>
          <SectionHeader
            eyebrow="Połączenia z systemami"
            title="Integracje"
          />

          <Text style={[s.groupTitle, { marginTop: 2 }]}>Wymagane</Text>
          {brief.requiredIntegrations.length ? (
            brief.requiredIntegrations.map((i) => (
              <View key={i.id} style={s.card} wrap={false}>
                <Text style={s.intName}>
                  {i.name}
                  {i.pcon ? "  [pCon]" : ""}
                </Text>
                <Text style={s.intDesc}>{i.desc}</Text>
                {i.note ? <Text style={s.intNote}>Uwaga: {i.note}</Text> : null}
              </View>
            ))
          ) : (
            <Text style={{ color: MUTED, fontSize: 9 }}>
              Brak wybranych integracji wymaganych.
            </Text>
          )}

          <Text style={s.groupTitle}>Opcjonalne</Text>
          {brief.optionalIntegrations.length ? (
            brief.optionalIntegrations.map((i) => (
              <View key={i.id} style={s.card} wrap={false}>
                <Text style={s.intName}>
                  {i.name}
                  {i.pcon ? "  [pCon]" : ""}
                </Text>
                <Text style={s.intDesc}>{i.desc}</Text>
                {i.note ? <Text style={s.intNote}>Uwaga: {i.note}</Text> : null}
              </View>
            ))
          ) : (
            <Text style={{ color: MUTED, fontSize: 9 }}>
              Brak wybranych integracji opcjonalnych.
            </Text>
          )}

          {brief.existingServices.length > 0 && (
            <View>
              <Text style={s.groupTitle}>
                Integracje z istniejącymi usługami Metro
              </Text>
              {brief.existingServices.map((svc) => (
                <View key={svc.id} style={s.card} wrap={false}>
                  <Text style={s.intName}>{svc.name}</Text>
                  <Text style={s.intDesc}>{svc.hint}</Text>
                  {svc.systemName ? (
                    <Text style={s.intNote}>
                      System: {svc.systemName}
                    </Text>
                  ) : null}
                  {svc.note ? (
                    <Text style={s.intNote}>Uwaga: {svc.note}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bezpieczeństwo i RODO */}
        <View style={s.section} break>
          <SectionHeader
            eyebrow="Wymóg przekrojowy"
            title="Bezpieczeństwo i RODO"
          />
          <Text style={{ fontSize: 9, color: MUTED, marginBottom: 6 }}>
            Projektowana platforma B2B przetwarza dane partnerów — poniższe
            wymagania obowiązują niezależnie od wybranego wariantu.
          </Text>
          {SECURITY_SECTIONS.map((sec) => (
            <View key={sec.title} style={{ marginBottom: 8 }} wrap={false}>
              <Text style={s.groupTitle}>{sec.title}</Text>
              {sec.items.map((item, idx) => (
                <View key={idx} style={s.bullet}>
                  <Text style={s.bulletDot}>•</Text>
                  <Text style={s.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Decyzje Zarządu — render tylko odpowiedzi (bez nagłówka i pustego stanu) */}
        {brief.decisions.length ? (
          <View style={s.section}>
            {brief.decisions.map((d) => (
              <View key={d.num} style={s.decRow} wrap={false}>
                <Text style={s.decNum}>{d.num}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.decQ}>{d.question}</Text>
                  {d.choice ? (
                    <Text style={s.decChoice}>Wybór: {d.choice}</Text>
                  ) : null}
                  {d.answer ? <Text style={s.decA}>{d.answer}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* Uwagi ogólne */}
        {generalNotes.trim() ? (
          <View style={s.section} wrap={false}>
            <SectionHeader
              eyebrow="Kontekst"
              title="Uwagi ogólne / cele biznesowe"
            />
            <Text style={{ fontSize: 9.5 }}>{generalNotes.trim()}</Text>
          </View>
        ) : null}

        <Footer />
      </Page>
    </Document>
  );
}
