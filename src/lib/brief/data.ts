import type {
  DecisionPoint,
  ExistingService,
  FeatureGroup,
  Integration,
  SecuritySection,
  VariantKey,
  VariantMeta,
} from "./types";

export const STORAGE_KEY = "metro-b2b-brief";

export const VARIANT_INDEX: Record<VariantKey, 0 | 1 | 2> = {
  min: 0,
  base: 1,
  ext: 2,
};

export const VARIANT_SHORT: Record<VariantKey, string> = {
  min: "MIN",
  base: "POD",
  ext: "ROZ",
};

export const LEVEL_LABEL: Record<0 | 1 | 2, string> = {
  0: "Brak",
  1: "Ograniczony",
  2: "Pełny",
};

export const LEVEL_GLYPH: Record<0 | 1 | 2, string> = {
  0: "–",
  1: "◐",
  2: "✓",
};

export const AUDIENCE_LABEL: Record<string, string> = {
  both: "Wszyscy",
  dealer: "Dealerzy",
  arch: "Architekci",
};

// --------------------------------------------------------------------------
// Warianty (krok 1)
// --------------------------------------------------------------------------

export const VARIANTS: VariantMeta[] = [
  {
    key: "min",
    index: 0,
    name: "Minimalny",
    tagline:
      "Szybki start (MVP). Zamknięta strefa z najważniejszymi treściami i cenami.",
    price: "Najniższe ryzyko i koszt · najkrótszy czas",
    bullets: [
      "Logowanie i konta partnerów",
      "Katalog z cenami indywidualnymi (netto)",
      "Biblioteka plików do pobrania",
      "Zapytanie ofertowe (formularz)",
    ],
    rationale:
      "Szybkie uruchomienie i przetestowanie potrzeb partnerów przy najniższym ryzyku i koszcie.",
  },
  {
    key: "base",
    index: 1,
    name: "Podstawowy",
    recommended: true,
    tagline:
      "Pełna obsługa codziennej współpracy — zamówienia, statusy, rabaty, materiały dla architektów.",
    price: "Najlepszy stosunek wartości do nakładu",
    bullets: [
      "Wszystko z wariantu Minimalnego",
      "Składanie zamówień online (koszyk B2B)",
      "Indywidualne cenniki i rabaty z ERP",
      "Statusy i historia zamówień",
      "Konfigurator 3D pCon (osadzony) i biblioteka CAD",
    ],
    rationale:
      "Pokrywa codzienną, operacyjną współpracę z siecią dealerów i architektów przy rozsądnym ryzyku wdrożeniowym.",
  },
  {
    key: "ext",
    index: 2,
    name: "Rozszerzony",
    tagline:
      "Przewaga konkurencyjna — pełny konfigurator 3D, BIM, automatyzacja i personalizacja.",
    price: "Najwyższa wartość · wdrożenie etapowe",
    bullets: [
      "Wszystko z wariantu Podstawowego",
      "Pełny pCon: AR, planer pomieszczeń, koszyk OCI",
      "Eksport BIM/CAD konfiguracji na życzenie",
      "Płatności online i zarządzanie limitami",
      "Personalizacja, raporty i automatyzacja",
    ],
    rationale:
      "Pozycja lidera i odciążenie działu obsługi dzięki pełnemu pCon, BIM, płatnościom i automatyzacji.",
  },
];

// --------------------------------------------------------------------------
// Macierz funkcji (krok 2) — lv = [min, base, ext]; aud = dealer|arch|both
// --------------------------------------------------------------------------

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: "access",
    name: "Dostęp i konta",
    features: [
      {
        id: "login-zone",
        name: "Logowanie i strefa zamknięta",
        desc: "Bezpieczny dostęp tylko dla zweryfikowanych partnerów.",
        aud: "both",
        lv: [2, 2, 2],
      },
      {
        id: "registration",
        name: "Rejestracja z weryfikacją",
        desc: "Wniosek o konto i akceptacja przez Metro.",
        aud: "both",
        lv: [1, 2, 2],
      },
      {
        id: "roles",
        name: "Role i uprawnienia",
        desc: "Inny widok dla dealera, architekta, pracownika Metro.",
        aud: "both",
        lv: [1, 2, 2],
      },
      {
        id: "multi-user",
        name: "Konta wielopoziomowe (wielu użytkowników u dealera)",
        desc: "Wielu użytkowników w ramach jednej firmy dealera.",
        aud: "dealer",
        lv: [0, 1, 2],
      },
    ],
  },
  {
    id: "security",
    name: "Bezpieczeństwo, RODO i logowanie",
    features: [
      {
        id: "login-pw",
        name: "Logowanie e-mail + hasło (polityka haseł)",
        desc: "Bezpieczne uwierzytelnianie, wymogi siły hasła, blokady prób.",
        aud: "both",
        lv: [2, 2, 2],
      },
      {
        id: "login-sso",
        name: "Logowanie SSO (Google / Microsoft Entra)",
        desc: "Jednokrotne logowanie przez dostawcę tożsamości (OAuth2/OIDC).",
        aud: "both",
        lv: [0, 1, 2],
      },
      {
        id: "mfa",
        name: "Uwierzytelnianie dwuskładnikowe (2FA/MFA)",
        desc: "Dodatkowy składnik logowania (TOTP / e-mail / SMS) dla kont wrażliwych.",
        aud: "both",
        lv: [0, 1, 2],
      },
      {
        id: "pw-reset",
        name: "Reset hasła / magic link",
        desc: "Samodzielne odzyskiwanie dostępu, link jednorazowy, bezpieczne sesje.",
        aud: "both",
        lv: [2, 2, 2],
      },
      {
        id: "encryption",
        name: "Szyfrowanie transmisji i danych (TLS, at-rest)",
        desc: "HTTPS (TLS 1.2+), szyfrowanie danych wrażliwych w spoczynku.",
        aud: "both",
        lv: [2, 2, 2],
      },
      {
        id: "audit-log",
        name: "Rejestr zdarzeń i audyt dostępu",
        desc: "Logi logowań i operacji na potrzeby bezpieczeństwa, ochrona przed nadużyciami.",
        aud: "both",
        lv: [0, 1, 2],
      },
      {
        id: "consents",
        name: "Zgody i polityka prywatności (RODO)",
        desc: "Klauzule informacyjne, zgody marketingowe, rejestrowanie zgód.",
        aud: "both",
        lv: [2, 2, 2],
      },
      {
        id: "gdpr-rights",
        name: "Zarządzanie zgodami / prawo do bycia zapomnianym",
        desc: "Cofnięcie zgód, eksport i usunięcie danych na żądanie.",
        aud: "both",
        lv: [1, 2, 2],
      },
      {
        id: "rcpd",
        name: "Rejestr czynności przetwarzania + retencja",
        desc: "RCPD, zasady i okresy przechowywania oraz anonimizacji danych.",
        aud: "both",
        lv: [1, 2, 2],
      },
      {
        id: "backup-dr",
        name: "Kopie zapasowe i plan odtwarzania (DR)",
        desc: "Backup danych i procedura przywracania po awarii (RPO/RTO).",
        aud: "both",
        lv: [1, 2, 2],
      },
    ],
  },
  {
    id: "pricing",
    name: "Ceny i rabaty",
    features: [
      {
        id: "price-individual",
        name: "Ceny indywidualne (netto)",
        desc: "Cennik przypisany do partnera, ukryty przed pozostałymi.",
        aud: "dealer",
        lv: [2, 2, 2],
      },
      {
        id: "discounts",
        name: "Rabaty grupowe i progi",
        desc: "Rabaty per grupa produktowa, progi ilościowe.",
        aud: "dealer",
        lv: [1, 2, 2],
      },
      {
        id: "erp-price-sync",
        name: "Synchronizacja cen z ERP",
        desc: "Ceny i rabaty pobierane automatycznie z systemu.",
        aud: "dealer",
        lv: [0, 2, 2],
      },
      {
        id: "credit-limit",
        name: "Limity kupieckie i saldo",
        desc: "Widoczny limit kredytowy i bieżące saldo partnera.",
        aud: "dealer",
        lv: [0, 1, 2],
      },
    ],
  },
  {
    id: "catalog",
    name: "Katalog i produkty",
    features: [
      {
        id: "catalog",
        name: "Katalog produktów",
        desc: "Pełna oferta z opisami, zdjęciami, wariantami.",
        aud: "both",
        lv: [2, 2, 2],
      },
      {
        id: "stock",
        name: "Stany magazynowe / dostępność",
        desc: "Dostępność i orientacyjne terminy realizacji.",
        aud: "dealer",
        lv: [0, 2, 2],
      },
      {
        id: "pim-data",
        name: "Dane produktowe z PIM/ERP",
        desc: "Automatyczna aktualizacja kart produktów.",
        aud: "both",
        lv: [0, 1, 2],
      },
      {
        id: "compare-fav",
        name: "Porównywarka i ulubione",
        desc: "Listy zakupowe, porównania, szybkie zamawianie.",
        aud: "dealer",
        lv: [0, 1, 2],
      },
    ],
  },
  {
    id: "library",
    name: "Biblioteka dla architektów",
    features: [
      {
        id: "files-download",
        name: "Pliki do pobrania (karty, certyfikaty, instrukcje)",
        desc: "Karty techniczne, certyfikaty, instrukcje (PDF).",
        aud: "arch",
        lv: [2, 2, 2],
      },
      {
        id: "cad-catalog",
        name: "Pliki CAD katalogowe (2D/3D: DWG, 3DS, SKP)",
        desc: "Gotowe modele standardowe do projektu (DWG, 3DS, SKP).",
        aud: "arch",
        lv: [1, 2, 2],
      },
      {
        id: "bim-catalog",
        name: "Pliki BIM katalogowe (Revit/IFC)",
        desc: "Gotowe obiekty parametryczne do projektów BIM.",
        aud: "arch",
        lv: [0, 1, 2],
      },
      {
        id: "samples",
        name: "Próbki i wzorniki tkanin",
        desc: "Przeglądanie i zamawianie próbek materiałów.",
        aud: "arch",
        lv: [0, 1, 2],
      },
      {
        id: "file-generator",
        name: "Generator plików na życzenie",
        desc: "Pliki CAD/BIM tworzone dla konkretnej konfiguracji.",
        aud: "arch",
        lv: [0, 0, 2],
      },
    ],
  },
  {
    id: "pcon",
    name: "Konfigurator 3D (pCon)",
    features: [
      {
        id: "pcon-3d",
        name: "Konfiguracja 3D w czasie rzeczywistym",
        desc: "pCon.cloud — wymiary, kolory, tkaniny, warianty, podgląd 3D.",
        aud: "both",
        lv: [0, 2, 2],
      },
      {
        id: "pcon-lead",
        name: "Tryb lead generation (konfiguruj → zapytanie)",
        desc: "Konfiguracja osadzona na stronie + wysłanie zapytania.",
        aud: "both",
        lv: [1, 2, 2],
      },
      {
        id: "pcon-pricing",
        name: "Automatyczna wycena konfiguracji (dane OFML)",
        desc: "Cena liczona z danych OFML dla wybranych opcji.",
        aud: "dealer",
        lv: [0, 2, 2],
      },
      {
        id: "pcon-info",
        name: "Informacje produktowe w modelu",
        desc: "Karty, certyfikaty, instrukcje montażu, zdjęcia, wideo.",
        aud: "both",
        lv: [0, 2, 2],
      },
      {
        id: "pcon-ar",
        name: "Wizualizacja AR / AR+",
        desc: "Podgląd skonfigurowanego produktu w realnej przestrzeni.",
        aud: "both",
        lv: [0, 1, 2],
      },
      {
        id: "pcon-cad-export",
        name: "Eksport plików CAD konfiguracji (DWG/SKP/3DS/DXF)",
        desc: "DWG, SKP, 3DS, DXF dla konkretnej konfiguracji.",
        aud: "arch",
        lv: [0, 1, 2],
      },
      {
        id: "pcon-bim-export",
        name: "Eksport plików BIM konfiguracji (Revit/IFC)",
        desc: "Obiekty do projektów Revit/IFC z konfiguracji.",
        aud: "arch",
        lv: [0, 0, 2],
      },
      {
        id: "pcon-oci",
        name: "Koszyk / przekazanie do ERP (OCI)",
        desc: "Dodanie konfiguracji do koszyka i handoff pozycji do ERP.",
        aud: "dealer",
        lv: [0, 2, 2],
      },
      {
        id: "pcon-roomplanner",
        name: "Planer pomieszczeń online (pCon.roomplanner)",
        desc: "Aranżacja produktów w układzie pomieszczenia.",
        aud: "arch",
        lv: [0, 0, 2],
      },
      {
        id: "pcon-save",
        name: "Zapis, udostępnianie i rekonfiguracja",
        desc: "Powrót do zapisanej konfiguracji i jej modyfikacja.",
        aud: "both",
        lv: [0, 1, 2],
      },
    ],
  },
  {
    id: "orders",
    name: "Zamówienia i obsługa",
    features: [
      {
        id: "rfq",
        name: "Zapytanie ofertowe (RFQ)",
        desc: "Formularz/koszyk zapytań przekazywany do Metro.",
        aud: "dealer",
        lv: [2, 2, 2],
      },
      {
        id: "order-online",
        name: "Składanie zamówień online (koszyk B2B)",
        desc: "Koszyk B2B i potwierdzenie zamówienia.",
        aud: "dealer",
        lv: [0, 2, 2],
      },
      {
        id: "order-status",
        name: "Statusy i historia zamówień",
        desc: "Śledzenie realizacji, ponawianie zamówień.",
        aud: "dealer",
        lv: [0, 2, 2],
      },
      {
        id: "documents",
        name: "Dokumenty (faktury, WZ)",
        desc: "Pobieranie dokumentów handlowych.",
        aud: "dealer",
        lv: [0, 1, 2],
      },
      {
        id: "payments-online",
        name: "Płatności online",
        desc: "Opłacenie zamówienia kartą / przelewem online.",
        aud: "dealer",
        lv: [0, 0, 2],
      },
      {
        id: "complaints",
        name: "Reklamacje i zgłoszenia",
        desc: "Elektroniczny obieg zgłoszeń serwisowych.",
        aud: "both",
        lv: [0, 1, 2],
      },
    ],
  },
  {
    id: "admin",
    name: "Administracja i rozwój",
    features: [
      {
        id: "news",
        name: "Aktualności i materiały",
        desc: "Komunikaty, promocje, materiały marketingowe.",
        aud: "both",
        lv: [1, 2, 2],
      },
      {
        id: "admin-panel",
        name: "Panel administracyjny",
        desc: "Zarządzanie kontami, treściami, cennikami.",
        aud: "both",
        lv: [1, 2, 2],
      },
      {
        id: "reports",
        name: "Raporty i statystyki",
        desc: "Analiza sprzedaży, aktywności partnerów.",
        aud: "dealer",
        lv: [0, 1, 2],
      },
      {
        id: "personalization",
        name: "Personalizacja i rekomendacje",
        desc: "Dopasowane treści i oferty dla partnera.",
        aud: "both",
        lv: [0, 0, 2],
      },
    ],
  },
];

// --------------------------------------------------------------------------
// Integracje (krok 3)
// --------------------------------------------------------------------------

export const INTEGRATIONS: Integration[] = [
  // --- Wymagane ---
  {
    id: "erp-products",
    name: "ERP — dane produktowe i stany",
    desc: "Źródło katalogu, dostępności i terminów. Warstwa generyczna (API/middleware) niezależna od dostawcy.",
    tiers: ["base", "ext"],
    kind: "required",
  },
  {
    id: "erp-prices",
    name: "ERP — cenniki i rabaty",
    desc: "Indywidualne ceny i rabaty partnerów pobierane automatycznie.",
    tiers: ["base", "ext"],
    kind: "required",
  },
  {
    id: "erp-orders",
    name: "ERP — zamówienia",
    desc: "Przesyłanie zamówień i pobieranie statusów realizacji.",
    tiers: ["base", "ext"],
    kind: "required",
  },
  {
    id: "auth-system",
    name: "System uwierzytelniania (konta/role)",
    desc: "Logowanie, role, bezpieczna sesja partnerów.",
    tiers: ["min", "base", "ext"],
    kind: "required",
  },
  {
    id: "email-tx",
    name: "E-mail transakcyjny",
    desc: "Powiadomienia o kontach, zapytaniach, zamówieniach.",
    tiers: ["min", "base", "ext"],
    kind: "required",
  },
  {
    id: "dam",
    name: "Repozytorium plików (DAM)",
    desc: "Przechowywanie kart, certyfikatów, plików CAD/BIM.",
    tiers: ["min", "base", "ext"],
    kind: "required",
  },
  {
    id: "pcon-cloud",
    name: "pCon.cloud + pCon.login (konfigurator)",
    desc: "Osadzenie webowego konfiguratora 3D i kontrola dostępu do danych.",
    tiers: ["base", "ext"],
    kind: "required",
    pcon: true,
  },
  {
    id: "ofml",
    name: "Dane produktowe OFML (po stronie Metro)",
    desc: "Przygotowanie i utrzymanie danych OFML — warunek działania konfiguratora pCon.",
    tiers: ["base", "ext"],
    kind: "required",
    pcon: true,
  },
  // --- Opcjonalne ---
  {
    id: "sso-idp",
    name: "Dostawca tożsamości / SSO (IdP: Google Workspace / Microsoft Entra)",
    desc: "Logowanie SSO i 2FA przez zewnętrznego dostawcę tożsamości.",
    tiers: ["base", "ext"],
    kind: "optional",
  },
  {
    id: "existing-metro",
    name: "Istniejące usługi Metro (do potwierdzenia)",
    desc: "Obecna strona/CMS, system mailingowy, e-faktura/KSeF, WMS/magazyn, spedycja, Microsoft 365 / Google Workspace, BI/hurtownia danych. Szczegóły poniżej.",
    tiers: ["base", "ext"],
    kind: "optional",
  },
  {
    id: "crm",
    name: "CRM",
    desc: "Synchronizacja partnerów, leadów i historii kontaktów.",
    tiers: ["base", "ext"],
    kind: "optional",
  },
  {
    id: "pcon-roomplanner-int",
    name: "pCon.roomplanner (planer pomieszczeń)",
    desc: "Webowa aranżacja produktów w układzie pomieszczenia.",
    tiers: ["ext"],
    kind: "optional",
    pcon: true,
  },
  {
    id: "pcon-basket",
    name: "pCon.basket (oferty / wyceny)",
    desc: "Listy artykułów, kalkulacja i generowanie ofert na bazie konfiguracji.",
    tiers: ["ext"],
    kind: "optional",
    pcon: true,
  },
  {
    id: "payment-gateway",
    name: "Bramka płatności online",
    desc: "Płatności kartą / szybki przelew dla zamówień.",
    tiers: ["ext"],
    kind: "optional",
  },
  {
    id: "logistics",
    name: "Operatorzy logistyczni / kurierzy",
    desc: "Etykiety, śledzenie przesyłek, awizacja dostaw.",
    tiers: ["ext"],
    kind: "optional",
  },
  {
    id: "bim-cad-generator",
    name: "Generator BIM/CAD (usługa parametryczna)",
    desc: "Tworzenie plików dla konkretnej konfiguracji.",
    tiers: ["ext"],
    kind: "optional",
  },
  {
    id: "viz-engine",
    name: "Silnik wizualizacji 3D",
    desc: "Render i podgląd 3D w konfiguratorze.",
    tiers: ["ext"],
    kind: "optional",
  },
  {
    id: "marketing-automation",
    name: "Marketing automation",
    desc: "Kampanie, newslettery, segmentacja partnerów.",
    tiers: ["ext"],
    kind: "optional",
  },
  {
    id: "analytics",
    name: "Analityka i monitoring",
    desc: "Zachowania użytkowników, lejki, konwersje, monitoring działania.",
    tiers: ["base", "ext"],
    kind: "optional",
  },
  {
    id: "esign",
    name: "E-podpis / akceptacja dokumentów",
    desc: "Cyfrowa akceptacja umów i ofert.",
    tiers: ["ext"],
    kind: "optional",
  },
];

// --------------------------------------------------------------------------
// Istniejące usługi Metro — checkbox + nazwa/wersja systemu (krok 3)
// --------------------------------------------------------------------------

export const EXISTING_SERVICES: ExistingService[] = [
  {
    id: "idp",
    name: "Dostawca tożsamości / SSO",
    hint: "Google Workspace / Microsoft Entra ID",
  },
  {
    id: "cms",
    name: "Obecna strona / CMS",
    hint: "Spójność marki, SSO między serwisami, linkowanie",
  },
  {
    id: "mailing",
    name: "System mailingowy / transakcyjny e-mail",
    hint: "Powiadomienia i komunikacja",
  },
  {
    id: "ksef",
    name: "e-Faktura / KSeF",
    hint: "Faktury ustrukturyzowane — do potwierdzenia",
  },
  {
    id: "wms",
    name: "WMS / system magazynowy",
    hint: "Stany, lokalizacje, kompletacja",
  },
  {
    id: "couriers",
    name: "Operatorzy spedycyjni / kurierzy",
    hint: "Śledzenie i awizacja dostaw",
  },
  {
    id: "m365",
    name: "Microsoft 365 / Google Workspace",
    hint: "Konta pracownicze, kalendarz, pliki",
  },
  {
    id: "bi",
    name: "BI / hurtownia danych",
    hint: "Raportowanie i analityka",
  },
];

// --------------------------------------------------------------------------
// Punkty decyzyjne (krok 4)
// --------------------------------------------------------------------------

export const DECISIONS: DecisionPoint[] = [
  {
    id: "d-variant",
    num: 1,
    question: "Wariant startowy — Minimalny / Podstawowy / Rozszerzony?",
    options: ["Minimalny", "Podstawowy", "Rozszerzony"],
  },
  {
    id: "d-erp",
    num: 2,
    question:
      "System ERP i zakres danych do integracji (stany, cenniki, zamówienia).",
  },
  {
    id: "d-discount-model",
    num: 3,
    question: "Model rabatów — ceny liczone w ERP czy w platformie?",
    options: ["W ERP", "W platformie", "Hybrydowo"],
  },
  {
    id: "d-pcon-scope",
    num: 4,
    question:
      "Konfigurator pCon — które grupy produktowe obejmuje na starcie?",
  },
  {
    id: "d-ofml",
    num: 5,
    question:
      "Dane OFML — kto i w jakim czasie przygotuje dane produktowe dla pCon?",
  },
  {
    id: "d-pcon-mode",
    num: 6,
    question:
      "Tryb pCon — lead generation (zapytanie + CAD) czy shop (koszyk OCI do ERP)?",
    options: ["Lead generation", "Shop (OCI)", "Oba tryby"],
  },
  {
    id: "d-payments",
    num: 7,
    question: "Płatności online — w zakresie czy tylko kredyt kupiecki?",
    options: ["Płatności online", "Tylko kredyt kupiecki", "Oba"],
  },
  {
    id: "d-bim-cad",
    num: 8,
    question: "Pliki BIM/CAD — gotowe pliki czy generator na życzenie?",
    options: ["Gotowe pliki", "Generator na życzenie", "Oba"],
  },
  {
    id: "d-login",
    num: 9,
    question:
      "Forma logowania — e-mail+hasło, SSO (Google/Microsoft Entra), 2FA?",
  },
  {
    id: "d-existing",
    num: 10,
    question:
      "Istniejące usługi do integracji — które systemy Metro (CMS, mailing, e-faktura/KSeF, WMS, M365, BI)?",
  },
  {
    id: "d-data-location",
    num: 11,
    question:
      "Lokalizacja i retencja danych (RODO) — gdzie hostowane, jak długo przechowywane?",
  },
  {
    id: "d-dpa",
    num: 12,
    question:
      "Umowy powierzenia (DPA) — z pCon/EasternGraphics i pozostałymi procesorami.",
  },
];

// --------------------------------------------------------------------------
// Rozdział „Bezpieczeństwo i RODO" — treść przekrojowa do PDF
// --------------------------------------------------------------------------

export const SECURITY_SECTIONS: SecuritySection[] = [
  {
    title: "Logowanie (formy uwierzytelniania)",
    items: [
      "E-mail + hasło z polityką haseł (min. długość, złożoność, blokada po N próbach, hash bcrypt/argon2).",
      "SSO przez dostawcę tożsamości (Google Workspace / Microsoft Entra ID) — OAuth2/OIDC.",
      "2FA / MFA (TOTP lub e-mail/SMS) — wymagane dla ról administracyjnych.",
      "Reset hasła / magic link, sesje z bezpiecznymi cookie (HttpOnly, Secure, SameSite).",
    ],
  },
  {
    title: "Bezpieczeństwo",
    items: [
      "Szyfrowanie transmisji (TLS 1.2+) i danych wrażliwych w spoczynku.",
      "RBAC — role i uprawnienia (dealer, architekt, pracownik Metro, admin).",
      "Rejestr zdarzeń / audyt logowań i operacji; ochrona przed nadużyciami (rate limiting, WAF).",
      "Zarządzanie sekretami (zmienne środowiskowe / vault), zasady OWASP Top 10.",
      "Kopie zapasowe i plan odtwarzania (RPO/RTO do ustalenia), testy bezpieczeństwa (pen-test przed startem).",
    ],
  },
  {
    title: "RODO",
    items: [
      "Podstawa przetwarzania, klauzule informacyjne i zarządzanie zgodami (w tym marketingowymi) z rejestrem zgód.",
      "Realizacja praw: dostęp, sprostowanie, eksport, prawo do bycia zapomnianym.",
      "Rejestr czynności przetwarzania (RCPD), polityka retencji i anonimizacji.",
      "Umowy powierzenia (DPA) z procesorami: pCon/EasternGraphics (pCon.login/cloud), hosting, mailing, analityka.",
      "Lokalizacja danych w UE; ocena DPIA jeśli wymagana.",
    ],
  },
];

// Kontekst domenowy pCon — do tooltipów i PDF.
export const PCON_CONTEXT =
  "Konfigurator opiera się na ekosystemie pCon (EasternGraphics) — branżowym standardzie dla mebli biurowych. W portalu osadzany jest webowy pCon.cloud (konfigurator 3D), opcjonalnie pCon.roomplanner; dostęp i dane kontroluje pCon.login. Modele i ceny pochodzą z danych OFML, które Metro jako producent przygotowuje i utrzymuje (osobny strumień prac, warunkujący działanie konfiguratora). Dwa tryby osadzenia: lead generation (konfiguruj → zapytanie + pobranie CAD) oraz shop (dodaj do koszyka → przekazanie pozycji do ERP przez plik OCI).";

// Spłaszczona lista funkcji (pomocnicza, do inicjalizacji stanu i PDF).
export const ALL_FEATURES = FEATURE_GROUPS.flatMap((g) =>
  g.features.map((f) => ({ ...f, groupId: g.id, groupName: g.name })),
);
