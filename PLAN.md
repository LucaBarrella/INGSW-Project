# Progettazione Architetturale: Timeline Immobili Visitati

Questo documento descrive l'architettura per l'implementazione della funzionalità "Timeline Immobili Visitati" con scroll infinito, in sostituzione della sezione "In Evidenza".

## 1. Obiettivi

-   **Scroll Infinito:** Esperienza utente fluida e continua, simile a quella delle principali app social.
-   **Ordinamento LIFO:** Gli immobili visitati più di recente appaiono per primi.
-   **Gestione Ottimizzata della Memoria:** Meccanismo di paginazione e pulizia della RAM per garantire performance elevate.
-   **Separazione delle Responsabilità:** Codice modulare, testabile e manutenibile.

## 2. Architettura Proposta

L'architettura si basa su tre pilastri: un servizio di storage, un custom hook per la logica di business e il componente `FlatList` di React Native per la UI.

### Diagramma di Flusso

```mermaid
graph TD
    subgraph Schermata Dettaglio Immobile
        A[Apertura di property-detail.tsx] --> B{useEffect};
        B --> C[HistoryStorageService.addPropertyToHistory(id)];
        C --> D[AsyncStorage: Salva ID in testa alla lista];
    end

    subgraph Schermata Home
        E[Apertura di home.tsx] --> F{useInfiniteHistory};
        F --> G[loadInitialHistory];
        G --> H[HistoryStorageService.getHistory(page: 1)];
        H --> I[ApiService.getPropertiesByIds(ids)];
        I --> J[FlatList: Mostra immobili];

        K[Utente scrolla fino alla fine] --> L{onEndReached};
        L --> M[loadMoreHistory];
        M --> N[HistoryStorageService.getHistory(page: n)];
        N --> O[ApiService.getPropertiesByIds(ids)];
        O --> P[Aggiunge immobili alla FlatList];
        P --> Q{RAM > soglia?};
        Q -- Sì --> R[Rimuove immobili vecchi dalla RAM];
        Q -- No --> J;
        R --> J;
    end
```

### 3. Dettagli Implementativi dello Scrolling Infinito

L'implementazione si affida al componente **`FlatList`** di React Native, scelto per le sue performance e le funzionalità native di virtualizzazione.

#### 3.1. `HistoryStorageService`

-   **Percorso:** `FrontEndTS/DietiEstates/app/_services/history.service.ts`
-   **Responsabilità:** Gestire la persistenza degli ID degli immobili visitati su `AsyncStorage`.
-   **Metodi:**
    -   `addPropertyToHistory(propertyId: number): Promise<void>`: Aggiunge un ID in cima alla lista (LIFO).
    -   `getHistory(page: number, limit: number): Promise<number[]>`: Recupera una porzione paginata di ID.
    -   `getHistoryCount(): Promise<number>`: Restituisce il conteggio totale.

#### 3.2. `useInfiniteHistory` (Custom Hook)

-   **Percorso:** `FrontEndTS/DietiEstates/hooks/useInfiniteHistory.ts`
-   **Responsabilità:** Orchestrare il caricamento dei dati, la paginazione e la gestione dello stato in memoria.
-   **Stato:** `properties`, `isLoading`, `isFetchingMore`, `error`, `currentPage`, `hasMore`.
-   **Funzioni:**
    -   `loadInitialHistory()`: Carica il primo set di immobili.
    -   `loadMoreHistory()`: Carica le pagine successive, appende i nuovi risultati all'array `properties` e gestisce la pulizia della RAM se la dimensione supera una soglia (es. `MAX_IN_MEMORY = 50`).

#### 3.3. Schermata `home.tsx` e `FlatList`

-   **Percorso:** `FrontEndTS/DietiEstates/app/(protected)/(buyer)/(tabs)/home.tsx`
-   **Componente UI:** `FlatList`.
-   **Proprietà chiave di `FlatList`:**
    -   `data={properties}`: Collega i dati dall'hook al componente.
    -   `renderItem={({ item }) => <BuyerPropertyCard property={item} />}`: Definisce come renderizzare ogni elemento.
    -   `keyExtractor={(item) => item.id.toString()}`: Fornisce una chiave unica per ogni elemento.
    -   `onEndReached={loadMoreHistory}`: Funzione chiamata quando l'utente si avvicina alla fine della lista.
    -   `onEndReachedThreshold={0.5}`: Determina a che punto dal fondo attivare `onEndReached` (0.5 significa a metà dell'ultima schermata visibile).
    -   `ListFooterComponent`: Mostra un `ActivityIndicator` mentre `isFetchingMore` è `true`.
    -   `ListEmptyComponent`: Renderizza il componente `HistoryPlaceholder` se l'array `properties` è vuoto.

#### 3.4. Schermata `property-detail.tsx`

-   **Percorso:** `FrontEndTS/DietiEstates/app/(protected)/(buyer)/property-detail.tsx`
-   **Modifiche:**
    -   Aggiungere un `useEffect` che, al montaggio, invoca `HistoryStorageService.addPropertyToHistory()` con l'ID dell'immobile.

#### 3.5. `HistoryPlaceholder` (Nuovo Componente)

-   **Percorso:** `FrontEndTS/DietiEstates/components/Buyer/HistoryPlaceholder.tsx`
-   **Responsabilità:** Fornire un feedback visivo quando la cronologia è vuota. Viene renderizzato automaticamente da `FlatList` tramite la prop `ListEmptyComponent` quando non ci sono dati da mostrare.

## 4. Considerazioni sull'Architettura

-   **SOLID:**
    -   **Single Responsibility Principle:** Ogni modulo ha una sola responsabilità.
    -   **Open/Closed Principle:** Il sistema è aperto all'estensione ma chiuso alle modifiche.
-   **Testabilità:** L'astrazione della logica in un servizio e in un hook rende possibile testare la logica di business e di storage in isolamento dalla UI.

Questo piano fornisce una base solida per un'implementazione pulita, performante e manutenibile.