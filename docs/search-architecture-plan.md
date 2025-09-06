# Piano Architetturale Dettagliato: Implementazione Ricerca Immobili

Questo documento descrive il piano per implementare la funzionalità di ricerca immobili nel frontend.

Contesto

- L'API definitiva espone POST /properties/search/{keyword} con payload JSON di filtri.
- Il frontend esistente usa SearchContext e componenti in components/Buyer.

Obiettivi

- Implementare servizio API che chiama POST.
- Integrare UI esistente per raccogliere keyword e filtri.
- Fornire hook per fetching, stato di caricamento, errori e (poi) paginazione.

Sintesi delle fasi

1. Aggiornamento Modello Dati e Tipi
2. Adeguamento Servizio API
3. Estensione SearchContext
4. Potenziamento FilterPanel e UI
5. Implementazione usePropertySearch (data-fetching)
6. Paginazione / Scroll infinito (bloccata fino a backend)
7. Revisione e test end-to-end

Dettaglio per fase

## Fase 1 — Aggiornamento del Modello Dati e dei Tipi

File:

- [`types.ts`](FrontEndTS/DietiEstates/components/Buyer/SearchIntegration/types.ts:1)

Modifiche:

- Aggiungere interfaccia `SearchFilters` che rispecchi la tabella dei filtri (tutti i campi opzionali).
- Mantenere costanti di categoria ma mappare i valori verso quelli attesi dall'API (es. "residential_property").
- Lasciare un alias di compatibilita` temporaneo se altri moduli usano `PropertyFilters`.

Esempio (parziale) di campi in `SearchFilters`:

- keyword?: string
- category?: string
- contract?: "SALE" | "RENT"
- minPrice?: number
- maxPrice?: number
- acceptedStatus?: string[]
- minEnergyRating?: string
- mustBeFurnished?: boolean
- ... (seguire la tabella fornita)

## Fase 2 — Adeguamento del Servizio API

File:

- [`PropertyApiService.ts`](FrontEndTS/DietiEstates/src/data/api/PropertyApiService.ts:1)

Modifiche:

- Riscrivere `searchProperties` con firma: `searchProperties(keyword: string, filters?: SearchFilters, options?: { page?: number, limit?: number })`.
- Costruire URL: `propertyEndpoints.searchProperties + encodeURIComponent(keyword || 'all')`.
- Usare `httpClient.post(url, filters, { params: { page, limit } })` se necessario.
- Gestire mapping da `PropertyDTO` a `PropertyDetail` come oggi.
- Predisporre gestione degli errori e timeouts.

Nota: se il backend non supporta ancora paginazione, implementare `page` opzionale e fallback a unico batch.

## Fase 3 — Estensione dello Stato Globale (SearchContext)

File:

- [`SearchContext.tsx`](FrontEndTS/DietiEstates/context/SearchContext.tsx:1)

Modifiche:

- Sostituire `filters: PropertyFilters` con `filters: SearchFilters`.
- `initialSearchState.filters` → {} (oggetto vuoto o valori minimi).
- Semlice `UPDATE_FILTER` che unisce i campi: `state.filters = { ...state.filters, ...payload }`.
- Mantenere persistenza in AsyncStorage per query e filters.

Considerazione: mantenere backward compatibility con componenti esistenti fintanto che si refactorizza gradualmente.

## Fase 4 — Potenziamento del Pannello Filtri (UI)

File principali:

- [`FilterPanel.tsx`](FrontEndTS/DietiEstates/components/Buyer/SearchIntegration/FilterPanel.tsx:1)
- [`CategorySpecificFilters.tsx`](FrontEndTS/DietiEstates/components/Buyer/SearchIntegration/CategorySpecificFilters.tsx:1)
- [`SearchAndFilter.tsx`](FrontEndTS/DietiEstates/components/Buyer/SearchIntegration/SearchAndFilter.tsx:1)

Modifiche:

- Adattare i controlli per popolare `SearchFilters` (numeric ranges, multiselect, checkbox).
- Creare componenti riutilizzabili: `NumberRangeInput`, `MultiSelect`, `Toggle`.
- Ogni controllo deve dispatchare `UPDATE_FILTER` con un payload parziale.
- Implementare logica per rimuovere chiavi se valore è vuoto/undefined.

UX:

- Visualizzare conteggio filtri attivi (già presente).
- Bottone "Applica" che chiude il pannello e attiva la ricerca (tramite navigation callback o dispatch).

## Fase 5 — Implementazione della Logica di Data-Fetching

File/nuovi artefatti:

- `src/hooks/usePropertySearch.ts` (nuovo)
- Pagina risultati (es. `app/(protected)/(buyer)/(tabs)/search.tsx`)

Modifiche:

- `usePropertySearch` usa `useSearch` per leggere `searchQuery` e `filters`.
- Espone: `{ results, isLoading, error, triggerSearch, loadMore (se implementata) }`.
- Implementare debounce su `searchQuery` e `filters` per evitare chiamate eccessive.
- Gestire mapping e caching minimo (es. cancellare richieste pendenti).

Integrazione:

- Pagina risultati utilizza l'hook e passa `results` a [`SearchResultsView.tsx`](FrontEndTS/DietiEstates/components/Buyer/SearchResults/SearchResultsView.tsx:1).
- Visualizzare loading spinner e messaggi di errore.

## Fase 6 — Paginazione / Scroll Infinito (in attesa backend)

- Progettare API client per supportare parametri `page`/`limit` o `offset`.
- `usePropertySearch` manterrà `page` e `hasMore` e fornirà `loadMore`.
- `SearchResultsView` userà `FlatList` con `onEndReached` per chiamare `loadMore`.
- Se backend non pronto, supporto a caricamento unico (batch).

## Fase 7 — Revisione e Test End-to-End

Attività:

- Test unitari per `PropertyApiService` (mock httpClient).
- Test per `usePropertySearch` (con mock del context e httpClient).
- Test di integrazione per UI (render e interazioni del FilterPanel).
- Manual testing con backend reale e mock.

Considerazioni tecniche e dipendenze

- httpClient: usare timeout e gestione errori coerente (`app/_services/httpClient.ts`).
- Librerie suggerite: `lodash.debounce` o custom debounce hook, `react-query` opzionale per caching/invalidations.
- Accessibilità: etichette e descrizioni nei controlli filtri.
- Performance: evitare stoccaggio pesante in memoria; preferire paginazione e caricamento incrementale.

Rischi e mitigazioni

- Backend non pronto per paginazione → progettare client flessibile (page opzionale).
- Filtri troppo ricchi → validare payload e inviare solo campi necessari.
- State mismatch → aggiungere test e logging.

Prossimi passi operativi

1. Implementare fase 1 (aggiornare tipi) e commit.
2. Riscrivere `searchProperties` per POST (fase 2).
3. Aggiornare `SearchContext` e introdurre `usePropertySearch`.
4. Refactor UI e testare con mock data.

Documento generato automaticamente per il task di ricerca immobili.
