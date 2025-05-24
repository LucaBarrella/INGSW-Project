## Piano di Implementazione: Miglioramento Persistenza Ricerca

**Obiettivo Principale:** Mantenere lo stato della query di ricerca (`searchQuery`) e dei filtri (`PropertyFilters`) attraverso la navigazione tra schermate (es. Home, Risultati Ricerca, Dettaglio Immobile) e tra diverse sessioni dell'applicazione.

**Strategia Generale:**
1.  **Gestione Stato Globale:** Introdurre un React Context (proposto come `SearchContext`) per memorizzare `searchQuery`, `PropertyFilters` e lo stato dell'interfaccia del pannello filtri (come `selectedMainCategoryInPanel`). Questo context utilizzerà `useReducer` per una gestione strutturata degli aggiornamenti di stato.
2.  **Persistenza Locale:** Sincronizzare lo stato del `SearchContext` con `AsyncStorage` per caricare i valori salvati all'avvio dell'app e per salvare le modifiche apportate dall'utente, garantendo la persistenza tra le sessioni.
3.  **Adattamento Componenti:** Modificare i componenti esistenti coinvolti nel processo di ricerca e filtraggio (`SearchAndFilter.tsx`, la pagina dei risultati `search.tsx`, il servizio API `api.service.ts`, e potenzialmente la schermata Home se include funzionalità di ricerca) per utilizzare il `SearchContext` invece di stati locali o parametri di navigazione per la gestione della query e dei filtri.

---

### Fase 1: Creazione del `SearchContext` e Integrazione con `AsyncStorage`

**1. Definire Tipi, Azioni e Stato Iniziale del Context:**
   *   **Nuovo File:** `FrontEndTS/DietiEstates/context/SearchContext.tsx`
   *   **Interfaccia di Stato (`SearchState`):**
      ```typescript
      interface SearchState {
        searchQuery: string;
        filters: PropertyFilters; // Da types.ts
        selectedMainCategoryInPanel: keyof Omit<PropertyFilters, 'general'> | null; // Per UI FilterPanel
        isLoadingFromStorage: boolean; // Flag per indicare il caricamento da AsyncStorage
        errorStorage: string | null;   // Per eventuali errori durante il caricamento/salvataggio
      }
      ```
   *   **Stato Iniziale (`initialSearchState`):**
      *   `searchQuery`: Stringa vuota.
      *   `filters`: Oggetto `PropertyFilters` inizializzato con i valori di default (es. da `DEFAULT_PRICE_RANGES`, categorie di default definite in `types.ts`).
      *   `selectedMainCategoryInPanel`: `null`.
      *   `isLoadingFromStorage`: `true`.
      *   `errorStorage`: `null`.
   *   **Tipi di Azione (`SearchAction`):** Definire un'unione discriminata per le azioni che modificano lo stato (es. `SET_QUERY`, `SET_FILTERS`, `UPDATE_FILTER`, `RESET_FILTERS`, `SET_SELECTED_MAIN_CATEGORY_IN_PANEL`, `LOAD_STATE_FROM_STORAGE`, `SET_STORAGE_LOADING`, `SET_STORAGE_ERROR`).

**2. Implementare il Reducer (`searchReducer`):**
   *   **File:** `FrontEndTS/DietiEstates/context/SearchContext.tsx`
   *   Creare una funzione reducer che gestisca ogni tipo di `SearchAction` per aggiornare lo stato in modo immutabile.
      *   `UPDATE_FILTER` dovrebbe gestire un deep merge per aggiornamenti parziali dei filtri.
      *   `RESET_FILTERS` dovrebbe riportare i filtri ai valori di default, con un'opzione per mantenere il `transactionType` corrente.

**3. Creare il Provider (`SearchProvider`):**
   *   **File:** `FrontEndTS/DietiEstates/context/SearchContext.tsx`
   *   Utilizzare `useReducer(searchReducer, initialSearchState)` per gestire lo stato.
   *   **Effetto per Caricare da `AsyncStorage` (al mount del Provider):**
      *   All'avvio, tentare di leggere `searchQuery`, `filters`, e `selectedMainCategoryInPanel` da `AsyncStorage`.
      *   Se i dati esistono e sono validi, dispatchare l'azione `LOAD_STATE_FROM_STORAGE` per inizializzare lo stato del context.
      *   Gestire la validazione dei dati caricati (es. assicurarsi che la struttura dei filtri sia compatibile con la versione corrente).
      *   Impostare `isLoadingFromStorage` a `false` dopo il tentativo di caricamento.
      *   Gestire eventuali errori durante la lettura.
   *   **Effetto per Salvare in `AsyncStorage` (quando lo stato rilevante cambia):**
      *   Ogni volta che `state.searchQuery`, `state.filters`, o `state.selectedMainCategoryInPanel` cambiano (e `isLoadingFromStorage` è `false`), salvarli in `AsyncStorage`.
      *   Considerare un debounce per il salvataggio se le performance diventano un problema (per ora, salvataggio diretto).
   *   Esportare `SearchContext` e un hook custom `useSearch = () => useContext(SearchContext)` per un facile accesso al context.

**4. Integrare `SearchProvider` nell'Applicazione:**
   *   **File:** `FrontEndTS/DietiEstates/app/_layout.tsx` (o il file di layout principale dell'applicazione)
   *   Avvolgere il componente radice della navigazione (es. `<Stack>` o il provider di navigazione principale) con `<SearchProvider>` in modo che lo stato sia disponibile in tutta l'app.

---

### Fase 2: Adattamento dei Componenti Esistenti

**1. Modificare `SearchAndFilter.tsx`:**
   *   Rimuovere la gestione dello stato locale per `searchQuery`, `activeFilters`, `tempFilters`, e `selectedMainCategory`.
   *   Utilizzare `useSearch()` per accedere a `state` (es. `state.searchQuery`, `state.filters`) e `dispatch` dal `SearchContext`.
   *   **SearchBar:**
      *   Il valore della barra di ricerca sarà `state.searchQuery`.
      *   `onChangeText` dispatcherà `SET_QUERY`.
      *   `activeFiltersCount` sarà calcolato basandosi su `state.filters`.
   *   **FilterPanel:**
      *   Passare `state.filters` come prop `filters`.
      *   Passare `state.selectedMainCategoryInPanel` come prop `selectedMainCategory`.
      *   Le callback come `onUpdateFilters`, `onResetFilters`, `onSelectMainCategory` dispatcheranno le azioni appropriate al `SearchContext`.
      *   La prop `onApplyFilters` (se ancora necessaria) o il pulsante "Cerca" nel `FilterPanel` non innescheranno più una callback diretta per la ricerca, ma si limiteranno a chiudere il pannello. La pagina dei risultati reagirà ai cambiamenti nel context.
   *   Le props `onSearch` e `onFiltersChange` (precedentemente passate da `SearchResultsView`) non saranno più necessarie per la comunicazione dello stato, poiché `SearchAndFilter` interagirà direttamente con il context.

**2. Modificare `FilterPanel.tsx`:**
   *   Assicurarsi che le modifiche ai filtri (tramite `RangeSlider`, `SegmentedControl`, `CategorySpecificFilters`) chiamino `onUpdateFilters` (che ora dispatcherà `UPDATE_FILTER` al context) con la struttura di dati corretta (idealmente solo la porzione di filtri modificata per un merging efficiente nel reducer).
   *   `handleSelectCategory`: Quando una categoria principale viene selezionata, oltre a dispatchare `SET_SELECTED_MAIN_CATEGORY_IN_PANEL`, potrebbe essere necessario dispatchare `UPDATE_FILTER` per impostare la sottocategoria di default per quella categoria principale (es. `filters.residential.category = RESIDENTIAL_CATEGORIES[0]`).
   *   Il pulsante "Cerca" nel `FilterPanel` si limiterà a chiudere il pannello; l'applicazione dei filtri avviene man mano che vengono modificati nel context (o si può decidere di avere un'azione esplicita 'APPLY_TEMP_FILTERS' se si vuole mantenere una distinzione tra filtri temporanei e attivi nel context, ma per semplicità iniziale si può evitare).

**3. Modificare Pagina Risultati Ricerca (`app/(protected)/(buyer)/search.tsx`):**
   *   Utilizzare `useSearch()` per accedere a `state.searchQuery` e `state.filters`.
   *   **`useLocalSearchParams`:** Questi parametri (es. `category`, `query` dall'URL) possono essere usati per *inizializzare o sovrascrivere* lo stato del `SearchContext` al primo caricamento della pagina o se i parametri URL cambiano esplicitamente (es. navigazione da un link esterno, da una card categoria sulla Home). Questo permette ai link diretti di funzionare.
      *   Un `useEffect` monitorerà `params` e, se cambiano e sono diversi dallo stato corrente del context, dispatcherà le azioni appropriate (`SET_QUERY`, `UPDATE_FILTER`) per aggiornare il context.
   *   **`fetchProperties`:**
      *   La funzione di recupero dati utilizzerà `state.searchQuery` e `state.filters` dal context per costruire i parametri per `ApiService.searchProperties`.
      *   Le dipendenze di `useCallback` per `fetchProperties` saranno `[state.searchQuery, state.filters]`.
      *   L'`useEffect` che chiama `fetchProperties` dipenderà da `[fetchProperties]`.
   *   **`SearchResultsView`:**
      *   Non passerà più `onSearch` a `SearchAndFilter` per la gestione della query.
      *   La navigazione `router.push` per rieseguire la ricerca (come era prima) non sarà più necessaria; la pagina reagirà ai cambiamenti nel `SearchContext` e rieseguirà `fetchProperties`.

**4. Modificare `ApiService.searchProperties`:**
   *   **File:** `FrontEndTS/DietiEstates/app/_services/api.service.ts`
   *   Modificare la firma della funzione per accettare parametri più strutturati: `searchProperties(params: { query: string; filters: PropertyFilters }): Promise<PropertyDetail[]>`
   *   **Logica Mock:** Aggiornare la logica mock per filtrare `MOCK_PROPERTIES` basandosi su tutti i campi rilevanti presenti in `params.filters` (prezzo, dimensione, numero di stanze, tipo di transazione, sottocategorie, ecc.), in aggiunta alla `params.query`.
   *   **Logica Reale (Backend):** Il frontend invierà `params.query` e l'oggetto `params.filters`. Sarà necessario assicurarsi che il backend sia in grado di interpretare questa struttura di filtri. Se il backend si aspetta parametri "flat" (es. `price_min`, `rooms_max`), sarà necessario implementare una funzione di trasformazione in `ApiService` per convertire l'oggetto `PropertyFilters` nel formato atteso dal backend prima di inviare la richiesta. Per ora, si assumerà che il backend (o la logica mock) possa gestire l'oggetto `filters` così com'è.

**5. Modificare Schermata Home (es. `app/(protected)/(buyer)/(tabs)/home.tsx` o simile):**
   *   *Assunzione: La schermata Home ha o avrà un'istanza di `SearchAndFilter` o una sua variante semplificata.*
   *   Se la Home include una barra di ricerca e/o un accesso ai filtri, dovrà anch'essa utilizzare `useSearch()` per leggere e aggiornare `searchQuery` e `filters` dal `SearchContext`.
   *   Quando l'utente avvia una ricerca dalla Home:
      *   I valori di `searchQuery` e `filters` (se modificabili dalla Home) saranno già aggiornati nel context.
      *   La navigazione alla pagina dei risultati (`/(protected)/(buyer)/search`) avverrà senza passare parametri di ricerca nell'URL, poiché la pagina dei risultati leggerà direttamente dal `SearchContext`.

---

### Fase 3: Test e Rifiniture

1.  **Test Funzionali Approfonditi:**
    *   Verificare la persistenza di `searchQuery` e di tutti i `PropertyFilters` (generali e specifici per categoria) durante la navigazione tra la Home, la pagina dei risultati, le pagine di dettaglio degli immobili e dopo essere tornati indietro.
    *   Testare la persistenza dopo la chiusura e riapertura completa dell'applicazione.
    *   Verificare il corretto funzionamento del reset dei filtri (con e senza mantenimento del tipo di transazione).
2.  **Test di Navigazione Diretta:** Assicurarsi che la navigazione a URL specifici (es. `/search?query=villa&category=residential`) imposti correttamente la query e i filtri rilevanti nel `SearchContext` e attivi la ricerca.
3.  **Coerenza UI:**
    *   Verificare che il numero di filtri attivi sia visualizzato correttamente sulla `SearchBar` in tutte le schermate rilevanti.
    *   Assicurarsi che i valori selezionati nel `FilterPanel` riflettano sempre lo stato del `SearchContext`.
4.  **Gestione Errori:** Testare la gestione degli errori durante il caricamento/salvataggio da/in `AsyncStorage`.
5.  **Performance:** Valutare le performance, specialmente per quanto riguarda il salvataggio in `AsyncStorage` ad ogni modifica e l'aggiornamento dei risultati della ricerca. Se necessario, implementare debounce per queste operazioni.
6.  **Code Review e Refactoring:** Rivedere il codice per pulizia, manutenibilità e aderenza alle best practice.

---