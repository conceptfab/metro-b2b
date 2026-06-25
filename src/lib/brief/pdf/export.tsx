"use client";

import type { BriefState } from "../types";

function fileDate(input: string): string {
  // akceptuj YYYY-MM-DD z formularza; w przeciwnym razie dzisiejsza data
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Generuje i pobiera brief PDF po stronie klienta. */
export async function downloadBriefPdf(state: BriefState): Promise<void> {
  const [{ pdf }, { BriefDocument }, { resolveBrief }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./document"),
    import("../selectors"),
  ]);

  const brief = resolveBrief(state);
  const blob = await pdf(
    <BriefDocument
      brief={brief}
      project={state.project}
      generalNotes={state.generalNotes}
    />,
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `metro-b2b-brief_${fileDate(state.project.date)}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // zwolnij URL po krótkiej chwili (po rozpoczęciu pobierania)
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
