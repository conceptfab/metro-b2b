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
        desc: "Dostęp do portalu wyłącznie dla zweryfikowanych partnerów po zalogowaniu; treści niewidoczne publicznie.",
        aud: "both",
        lv: [2, 2, 2],
      },
      {
        id: "registration",
        name: "Rejestracja z weryfikacją",
        desc: "Partner składa wniosek o konto, Metro je zatwierdza — kontrola, kto otrzymuje dostęp.",
        aud: "both",
        lv: [1, 2, 2],
      },
      {
        id: "roles",
        name: "Role i uprawnienia",
        desc: "Odrębne widoki i uprawnienia dla dealera, architekta i pracownika Metro.",
        aud: "both",
        lv: [1, 2, 2],
      },
      {
        id: "multi-user",
        name: "Konta wielopoziomowe (wielu użytkowników u dealera)",
        desc: "Kilka kont w ramach jednej firmy dealera (np. zakupowiec i handlowiec), każde z własnym loginem.",
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
        desc: "Logowanie e-mailem i hasłem z polityką haseł i blokadą po wielu błędnych próbach.",
        aud: "both",
        lv: [2, 2, 2],
      },
      {
        id: "login-sso",
        name: "Logowanie SSO (Google / Microsoft Entra)",
        desc: "Logowanie kontem Google lub Microsoft, bez osobnego hasła do portalu (SSO).",
        aud: "both",
        lv: [0, 1, 2],
      },
      {
        id: "mfa",
        name: "Uwierzytelnianie dwuskładnikowe (2FA/MFA)",
        desc: "Dodatkowe potwierdzenie logowania kodem (aplikacja, e-mail lub SMS) dla kont wrażliwych.",
        aud: "both",
        lv: [0, 1, 2],
      },
      {
        id: "pw-reset",
        name: "Reset hasła / magic link",
        desc: "Samodzielne odzyskanie dostępu przez jednorazowy link wysłany na e-mail.",
        aud: "both",
        lv: [2, 2, 2],
      },
      {
        id: "encryption",
        name: "Szyfrowanie transmisji i danych (TLS, at-rest)",
        desc: "Szyfrowanie połączenia i przechowywanych danych — ochrona cen i zamówień przed przechwyceniem.",
        aud: "both",
        lv: [2, 2, 2],
      },
      {
        id: "audit-log",
        name: "Rejestr zdarzeń i audyt dostępu",
        desc: "Rejestr logowań i operacji — wykrywanie nadużyć i wyjaśnianie spornych sytuacji.",
        aud: "both",
        lv: [0, 1, 2],
      },
      {
        id: "consents",
        name: "Zgody i polityka prywatności (RODO)",
        desc: "Klauzule informacyjne i zgody (w tym marketingowe) wymagane przez RODO, z rejestrem zgód.",
        aud: "both",
        lv: [2, 2, 2],
      },
      {
        id: "gdpr-rights",
        name: "Zarządzanie zgodami / prawo do bycia zapomnianym",
        desc: "Obsługa praw z RODO: wycofanie zgody oraz eksport i usunięcie danych na żądanie.",
        aud: "both",
        lv: [1, 2, 2],
      },
      {
        id: "rcpd",
        name: "Rejestr czynności przetwarzania + retencja",
        desc: "Dokumentacja RODO: rejestr czynności przetwarzania oraz zasady przechowywania i anonimizacji danych.",
        aud: "both",
        lv: [1, 2, 2],
      },
      {
        id: "backup-dr",
        name: "Kopie zapasowe i plan odtwarzania (DR)",
        desc: "Kopie zapasowe i procedura przywrócenia portalu po awarii (parametry RPO/RTO do ustalenia).",
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
        desc: "Indywidualny cennik netto przypisany do partnera, niewidoczny dla pozostałych.",
        aud: "dealer",
        lv: [2, 2, 2],
      },
      {
        id: "discounts",
        name: "Rabaty grupowe i progi",
        desc: "Rabaty na grupy produktów i progi ilościowe.",
        aud: "dealer",
        lv: [1, 2, 2],
      },
      {
        id: "erp-price-sync",
        name: "Synchronizacja cen z ERP",
        desc: "Ceny i rabaty pobierane automatycznie z systemu handlowego (ERP), bez ręcznej aktualizacji cenników.",
        aud: "dealer",
        lv: [0, 2, 2],
      },
      {
        id: "credit-limit",
        name: "Limity kupieckie i saldo",
        desc: "Widoczny limit kupiecki i bieżące saldo partnera.",
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
        desc: "Pełna oferta z opisami, zdjęciami i wariantami.",
        aud: "both",
        lv: [2, 2, 2],
      },
      {
        id: "stock",
        name: "Stany magazynowe / dostępność",
        desc: "Dostępność towaru i orientacyjny termin realizacji.",
        aud: "dealer",
        lv: [0, 2, 2],
      },
      {
        id: "pim-data",
        name: "Dane produktowe z PIM/ERP",
        desc: "Karty produktów aktualizowane automatycznie z systemów Metro (PIM/ERP).",
        aud: "both",
        lv: [0, 1, 2],
      },
      {
        id: "compare-fav",
        name: "Porównywarka i ulubione",
        desc: "Listy zakupowe, ulubione i porównywanie produktów dla szybszego zamawiania.",
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
        desc: "Karty techniczne, certyfikaty i instrukcje w PDF do pobrania.",
        aud: "arch",
        lv: [2, 2, 2],
      },
      {
        id: "cad-catalog",
        name: "Pliki CAD katalogowe (2D/3D: DWG, 3DS, SKP)",
        desc: "Gotowe modele produktów do programów projektowych (CAD), wstawiane wprost do projektu.",
        aud: "arch",
        lv: [1, 2, 2],
      },
      {
        id: "bim-catalog",
        name: "Pliki BIM katalogowe (Revit/IFC)",
        desc: "Gotowe obiekty do projektów BIM (Revit/IFC) — standard w projektowaniu budynków.",
        aud: "arch",
        lv: [0, 1, 2],
      },
      {
        id: "samples",
        name: "Próbki i wzorniki tkanin",
        desc: "Przeglądanie i zamawianie próbek tkanin i materiałów.",
        aud: "arch",
        lv: [0, 1, 2],
      },
      {
        id: "file-generator",
        name: "Generator plików na życzenie",
        desc: "Pliki CAD/BIM generowane dla konkretnej, wybranej konfiguracji produktu.",
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
        desc: "Dobór wymiarów, kolorów i tkanin z podglądem produktu w 3D (technologia pCon).",
        aud: "both",
        lv: [0, 2, 2],
      },
      {
        id: "pcon-lead",
        name: "Tryb lead generation (konfiguruj → zapytanie)",
        desc: "Klient konfiguruje produkt na stronie i wysyła zapytanie — gotowy lead dla handlowca.",
        aud: "both",
        lv: [1, 2, 2],
      },
      {
        id: "pcon-pricing",
        name: "Automatyczna wycena konfiguracji (dane OFML)",
        desc: "Cena konfiguracji liczona automatycznie z danych produktowych OFML.",
        aud: "dealer",
        lv: [0, 2, 2],
      },
      {
        id: "pcon-info",
        name: "Informacje produktowe w modelu",
        desc: "Karty, certyfikaty, instrukcje montażu, zdjęcia i wideo dostępne przy modelu 3D.",
        aud: "both",
        lv: [0, 2, 2],
      },
      {
        id: "pcon-ar",
        name: "Wizualizacja AR / AR+",
        desc: "Podgląd skonfigurowanego produktu w realnym wnętrzu przez telefon lub tablet (AR).",
        aud: "both",
        lv: [0, 1, 2],
      },
      {
        id: "pcon-cad-export",
        name: "Eksport plików CAD konfiguracji (DWG/SKP/3DS/DXF)",
        desc: "Pobranie plików projektowych (CAD) dla konkretnej konfiguracji.",
        aud: "arch",
        lv: [0, 1, 2],
      },
      {
        id: "pcon-bim-export",
        name: "Eksport plików BIM konfiguracji (Revit/IFC)",
        desc: "Pobranie obiektów BIM (Revit/IFC) dla konkretnej konfiguracji do projektów budynków.",
        aud: "arch",
        lv: [0, 0, 2],
      },
      {
        id: "pcon-oci",
        name: "Koszyk / przekazanie do ERP (OCI)",
        desc: "Przeniesienie konfiguracji do koszyka i przekazanie pozycji do systemu zamówień (połączenie OCI z ERP).",
        aud: "dealer",
        lv: [0, 2, 2],
      },
      {
        id: "pcon-roomplanner",
        name: "Planer pomieszczeń online (pCon.roomplanner)",
        desc: "Rozmieszczanie produktów w planie całego pomieszczenia online.",
        aud: "arch",
        lv: [0, 0, 2],
      },
      {
        id: "pcon-save",
        name: "Zapis, udostępnianie i rekonfiguracja",
        desc: "Zapis konfiguracji, jej udostępnienie i późniejsza zmiana bez zaczynania od nowa.",
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
        desc: "Klient zbiera pozycje i wysyła zapytanie ofertowe do Metro.",
        aud: "dealer",
        lv: [2, 2, 2],
      },
      {
        id: "order-online",
        name: "Składanie zamówień online (koszyk B2B)",
        desc: "Zamówienia składane online przez koszyk B2B, z potwierdzeniem.",
        aud: "dealer",
        lv: [0, 2, 2],
      },
      {
        id: "order-status",
        name: "Statusy i historia zamówień",
        desc: "Śledzenie statusu realizacji, historia i ponawianie zamówień.",
        aud: "dealer",
        lv: [0, 2, 2],
      },
      {
        id: "documents",
        name: "Dokumenty (faktury, WZ)",
        desc: "Pobieranie dokumentów handlowych (faktury, WZ).",
        aud: "dealer",
        lv: [0, 1, 2],
      },
      {
        id: "payments-online",
        name: "Płatności online",
        desc: "Opłacenie zamówienia online kartą lub szybkim przelewem.",
        aud: "dealer",
        lv: [0, 0, 2],
      },
      {
        id: "complaints",
        name: "Reklamacje i zgłoszenia",
        desc: "Elektroniczne zgłaszanie reklamacji i serwisu z obiegiem zgłoszenia.",
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
        desc: "Komunikaty, promocje i materiały marketingowe dla partnerów.",
        aud: "both",
        lv: [1, 2, 2],
      },
      {
        id: "admin-panel",
        name: "Panel administracyjny",
        desc: "Zarządzanie kontami, treściami i cennikami po stronie Metro.",
        aud: "both",
        lv: [1, 2, 2],
      },
      {
        id: "reports",
        name: "Raporty i statystyki",
        desc: "Raporty sprzedaży i aktywności partnerów.",
        aud: "dealer",
        lv: [0, 1, 2],
      },
      {
        id: "personalization",
        name: "Personalizacja i rekomendacje",
        desc: "Dopasowane treści i oferty dla konkretnego partnera.",
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
    desc: "Połączenie z systemem handlowym (ERP) jako źródłem katalogu, dostępności i terminów. Warstwa generyczna, niezależna od marki systemu.",
    tiers: ["base", "ext"],
    kind: "required",
  },
  {
    id: "erp-prices",
    name: "ERP — cenniki i rabaty",
    desc: "Indywidualne ceny i rabaty partnerów pobierane automatycznie z systemu handlowego (ERP).",
    tiers: ["base", "ext"],
    kind: "required",
  },
  {
    id: "erp-orders",
    name: "ERP — zamówienia",
    desc: "Przesyłanie zamówień do systemu handlowego (ERP) i pobieranie statusów realizacji.",
    tiers: ["base", "ext"],
    kind: "required",
  },
  {
    id: "auth-system",
    name: "System uwierzytelniania (konta/role)",
    desc: "Mechanizm logowania, ról i bezpiecznej sesji partnerów.",
    tiers: ["min", "base", "ext"],
    kind: "required",
  },
  {
    id: "email-tx",
    name: "E-mail transakcyjny",
    desc: "Automatyczne powiadomienia: zakładanie kont, zapytania, potwierdzenia zamówień.",
    tiers: ["min", "base", "ext"],
    kind: "required",
  },
  {
    id: "dam",
    name: "Repozytorium plików (DAM)",
    desc: "Miejsce przechowywania kart, certyfikatów oraz plików CAD/BIM.",
    tiers: ["min", "base", "ext"],
    kind: "required",
  },
  {
    id: "pcon-cloud",
    name: "pCon.cloud + pCon.login (konfigurator)",
    desc: "Osadzenie internetowego konfiguratora 3D (pCon) i kontrola dostępu do danych.",
    tiers: ["base", "ext"],
    kind: "required",
    pcon: true,
  },
  {
    id: "ofml",
    name: "Dane produktowe OFML (po stronie Metro)",
    desc: "Dane produktowe w standardzie OFML, przygotowywane przez Metro jako producenta — warunek działania konfiguratora pCon.",
    tiers: ["base", "ext"],
    kind: "required",
    pcon: true,
  },
  // --- Opcjonalne ---
  {
    id: "sso-idp",
    name: "Dostawca tożsamości / SSO (IdP: Google Workspace / Microsoft Entra)",
    desc: "Logowanie kontem Google lub Microsoft (SSO) i dodatkowe potwierdzenie (2FA) przez zewnętrznego dostawcę.",
    tiers: ["base", "ext"],
    kind: "optional",
  },
  {
    id: "existing-metro",
    name: "Istniejące usługi Metro (do potwierdzenia)",
    desc: "Połączenie z systemami już używanymi w Metro: strona/CMS, mailing, e-faktura/KSeF, magazyn, spedycja, Microsoft 365 / Google Workspace, raportowanie. Szczegóły poniżej.",
    tiers: ["base", "ext"],
    kind: "optional",
  },
  {
    id: "crm",
    name: "CRM",
    desc: "Synchronizacja partnerów, leadów i historii kontaktów z systemem CRM.",
    tiers: ["base", "ext"],
    kind: "optional",
  },
  {
    id: "pcon-roomplanner-int",
    name: "pCon.roomplanner (planer pomieszczeń)",
    desc: "Internetowy planer rozmieszczania produktów w pomieszczeniu.",
    tiers: ["ext"],
    kind: "optional",
    pcon: true,
  },
  {
    id: "pcon-basket",
    name: "pCon.basket (oferty / wyceny)",
    desc: "Tworzenie ofert i wycen na podstawie konfiguracji (listy artykułów, kalkulacja).",
    tiers: ["ext"],
    kind: "optional",
    pcon: true,
  },
  {
    id: "payment-gateway",
    name: "Bramka płatności online",
    desc: "Płatności kartą lub szybkim przelewem dla zamówień.",
    tiers: ["ext"],
    kind: "optional",
  },
  {
    id: "logistics",
    name: "Operatorzy logistyczni / kurierzy",
    desc: "Połączenie z kurierami i spedycją: etykiety, śledzenie przesyłek, awizacja dostaw.",
    tiers: ["ext"],
    kind: "optional",
  },
  {
    id: "bim-cad-generator",
    name: "Generator BIM/CAD (usługa parametryczna)",
    desc: "Usługa tworząca pliki projektowe (BIM/CAD) dla konkretnej konfiguracji.",
    tiers: ["ext"],
    kind: "optional",
  },
  {
    id: "viz-engine",
    name: "Silnik wizualizacji 3D",
    desc: "Silnik renderujący podgląd 3D w konfiguratorze.",
    tiers: ["ext"],
    kind: "optional",
  },
  {
    id: "marketing-automation",
    name: "Marketing automation",
    desc: "Automatyczne kampanie, newslettery i segmentacja partnerów.",
    tiers: ["ext"],
    kind: "optional",
  },
  {
    id: "analytics",
    name: "Analityka i monitoring",
    desc: "Pomiar zachowań użytkowników i skuteczności (lejki, konwersje) oraz monitoring działania portalu.",
    tiers: ["base", "ext"],
    kind: "optional",
  },
  {
    id: "esign",
    name: "E-podpis / akceptacja dokumentów",
    desc: "Cyfrowa akceptacja i podpisywanie umów oraz ofert.",
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
