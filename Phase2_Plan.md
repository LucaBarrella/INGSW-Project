# Piano Dettagliato - Fase 2: Integrazione API Funzionalità Core e Rimozione Mock

**Obiettivo Principale:** Rendere funzionanti le schermate chiave (Ricerca Acquirente, Dashboard Agente, Home Acquirente) e le funzionalità amministrative (creazione utenti, cambio password) sostituendo i dati mock e la logica API incompleta con chiamate API reali, sfruttando l'infrastruttura (`httpClient.ts`) creata nella Fase 1.

**Piano Dettagliato:**

1.  **Revisione e Completamento `api.service.ts`:**
    *   Identificare tutti gli endpoint API necessari per:
        *   Ricerca immobili (con filtri).
        *   Statistiche e lista immobili per Dashboard Agente.
        *   Immobili "in evidenza" per Home Acquirente.
        *   Creazione Admin/Agente.
        *   Modifica password Admin.
    *   Verificare che le funzioni esistano, usino `httpClient` e abbiano tipi corretti per richieste/risposte.
    *   Aggiungere le funzioni mancanti e rimuovere codice obsoleto/TODO.

2.  **Integrazione API - Schermata Ricerca (`app/(protected)/(buyer)/search.tsx`):**
    *   Modificare la logica di fetching per chiamare la funzione API di ricerca da `api.service.ts`.
    *   Passare correttamente i parametri di query e filtri (gestione stato filtri verrà migliorata in Fase 4).
    *   Rimuovere dati mock e `setTimeout`.
    *   Implementare gestione stati `isLoading` (es. spinner).
    *   Implementare gestione errori API (mostrare messaggi all'utente).
    *   Aggiornare lo stato con i dati reali e renderizzare la lista.

3.  **Integrazione API - Dashboard Agente (`app/(protected)/(agent)/(tabs)/dashboard.tsx` e componenti relativi):**
    *   Modificare la logica per chiamare le API per statistiche e lista immobili da `api.service.ts`.
    *   Rimuovere dati mock per `StatCard` e `PropertyTable`.
    *   Gestire stati `isLoading` ed errori.
    *   Aggiornare lo stato con dati reali.
    *   Rimuovere o implementare correttamente l'export PDF (se supportato dal backend).

4.  **Integrazione API - Home Acquirente (`app/(protected)/(buyer)/(tabs)/home.tsx`):**
    *   Modificare la sezione "In Evidenza" per chiamare l'API appropriata da `api.service.ts`.
    *   Rimuovere dati mock.
    *   Gestire stati `isLoading` ed errori.
    *   Renderizzare le card con dati reali.

5.  **Integrazione API - Funzionalità Admin (`add-admin.tsx`, `add-agent.tsx`, `change-password.tsx`):**
    *   Assicurarsi che i form chiamino le API corrette tramite `api.service.ts`.
    *   Verificare che l'header `Authorization` sia aggiunto automaticamente (grazie a Fase 1).
    *   Gestire risposte API (successo/errore) con feedback all'utente.

6.  **Testing (Obbligatorio da Regole Progetto):**
    *   Scrivere/aggiornare test unitari (Jest) per le funzioni modificate/aggiunte in `api.service.ts`.
    *   Scrivere test di integrazione/componenti (con mock del service) per le schermate modificate, verificando chiamate API, gestione stati (loading/error) e rendering dati.
    *   Assicurarsi che tutti i test passino.

**Diagramma di Flusso (Mermaid):**

```mermaid
graph TD
    A[Inizio Fase 2] --> B{Verifica/Aggiorna api.service.ts};
    B --> C[Identifica Endpoint Mancanti];
    B --> D[Implementa Funzioni API Mancanti];
    B --> E[Rimuovi TODO/Obsoleti];
    E --> F{Integra API Schermate};
    F --> G[Ricerca Immobili (search.tsx)];
    F --> H[Dashboard Agente (dashboard.tsx)];
    F --> I[Home Acquirente (home.tsx)];
    F --> J[Funzioni Admin (add-admin, add-agent, change-password)];
    G --> K[Rimuovi Mock & Integra API];
    H --> K;
    I --> K;
    J --> K;
    K --> L{Scrivi/Aggiorna Test};
    L --> M[Test Unitari (api.service)];
    L --> N[Test Integrazione/Componenti];
    M --> O[Esegui Test];
    N --> O;
    O -- Tutti Passano --> P[Fine Fase 2];
    O -- Falliscono --> L;

    subgraph "Integrazione API Schermate"
        direction LR
        G --- G1[Gestisci isLoading/Errori]
        H --- H1[Gestisci isLoading/Errori]
        I --- I1[Gestisci isLoading/Errori]
        J --- J1[Gestisci isLoading/Errori]
    end

    subgraph "Testing"
        direction LR
        M --- M1[Verifica Chiamate]
        N --- N1[Verifica Rendering Dati/Errori/Loading]
    end

    style P fill:#9f9,stroke:#333,stroke-width:2px