# Piano di Miglioramento e Refactoring - DietiEstates RN Client

**Obiettivo Generale:** Rendere la codebase esistente più robusta, comprensibile e manutenibile, risolvendo i problemi critici identificati nella code review e preparando il terreno per future implementazioni.

**Fasi Principali:**

1.  **Fase 1: Stabilizzazione Fondamenta API e Autenticazione (Priorità Massima)**
    *   **Scopo:** Risolvere i problemi bloccanti legati alla comunicazione con il backend e alla gestione dell'autenticazione.
    *   **Azioni Dettagliate:**
        *   [ ] **Configurazione Ambiente:**
            *   Creare file `.env` (e aggiungerlo a `.gitignore`) per definire `API_BASE_URL_DEV` e `API_BASE_URL_PROD`.
            *   Installare `expo-constants` per leggere le variabili d'ambiente.
        *   [ ] **Client HTTP Centralizzato:**
            *   Installare `axios`.
            *   Creare `app/_services/httpClient.ts`:
                *   Configurare un'istanza `axios` con `baseURL` dinamico basato sull'ambiente (letto da `expo-constants`).
                *   Implementare un **interceptor di richiesta** per aggiungere automaticamente l'header `Authorization: Bearer <token>` leggendo il token da `expo-secure-store` (da installare se non presente). Gestire il caso in cui il token non sia presente.
                *   Implementare un **interceptor di risposta** per una gestione base degli errori (es. loggare errori, gestire potenzialmente errori 401/403 in modo centralizzato, come reindirizzare al login o tentare un refresh token se implementato).
        *   [ ] **Refactoring Service Layer Esistente:**
            *   Modificare `app/_services/api.service.ts` per:
                *   Importare e utilizzare l'istanza `httpClient` creata invece di `fetch`.
                *   Rimuovere completamente gli URL base hardcoded.
                *   Rivedere le funzioni esistenti per allinearle all'uso di `axios` (gestione `data`, `params`, ecc.).
        *   [ ] **Gestione Token:**
            *   Assicurarsi che `expo-secure-store` sia installato.
            *   Modificare le funzioni di **Login** (in `LoginForm.tsx`, `AdminLoginForm.tsx`, `AgentLoginForm.tsx` o dove risiede la logica API) per salvare il token JWT ricevuto nella risposta API utilizzando `SecureStore.setItemAsync`.
            *   Implementare/Modificare la funzione di **Logout** per rimuovere il token da SecureStore (`SecureStore.deleteItemAsync`).
    *   **Risultato Atteso Fase 1:** Chiamate API centralizzate tramite `axios`, configurazione ambiente per URL API, gestione automatica dell'header di autorizzazione per le chiamate protette. Le funzionalità che *prima* erano bloccate dall'autenticazione *dovrebbero* ora poter comunicare con il backend (assumendo che il backend e gli endpoint in `api.service.ts` siano corretti).

2.  **Fase 2: Integrazione API Funzionalità Core e Rimozione Mock (Priorità Alta)**
    *   **Scopo:** Rendere funzionanti le schermate chiave che attualmente usano dati mock o hanno logica API incompleta, utilizzando la base API stabilizzata nella Fase 1.
    *   **Azioni Dettagliate (Esempi principali):**
        *   [ ] **Risultati Ricerca (`app/(protected)/(buyer)/search.tsx`):**
            *   Modificare `fetchProperties` per utilizzare la funzione corrispondente in `api.service.ts`.
            *   Assicurarsi che i parametri di ricerca (query e filtri - vedi Fase 4 per miglioramento gestione filtri) siano passati correttamente alla chiamata API.
            *   Rimuovere i dati mock e la simulazione `setTimeout`.
            *   Gestire correttamente gli stati di `isLoading` e visualizzare errori provenienti dalla risposta API.
        *   [ ] **Dashboard Agente (`app/(protected)/(agent)/(tabs)/dashboard.tsx` e `components/Agent/PropertyDashboard/`):**
            *   Identificare le chiamate API necessarie per popolare le statistiche e la tabella immobili.
            *   Aggiungere le funzioni corrispondenti in `api.service.ts` se mancanti.
            *   Modificare il componente per chiamare queste API all'avvio e aggiornare lo stato con i dati reali, rimuovendo i mock.
            *   Implementare la logica per l'export PDF (se mantenuto) o rimuovere il placeholder.
        *   [ ] **Home Acquirente (`app/(protected)/(buyer)/(tabs)/home.tsx`):**
            *   Sostituire i dati mock nella sezione "In Evidenza" con una chiamata API reale (es. API per "immobili recenti" o "consigliati").
        *   [ ] **Altre Schermate con Mock/TODO API:** Identificare e correggere altre schermate che usano mock o hanno TODO relativi all'API (es. `add-admin.tsx`, `add-agent.tsx`, `change-password.tsx` devono usare il nuovo `api.service`).
    *   **Risultato Atteso Fase 2:** Le schermate principali (Dashboard Agente, Ricerca, Home Buyer) mostrano dati reali provenienti dal backend. Le funzionalità di creazione/modifica utenti admin funzionano.

3.  **Fase 3: Implementazione Funzionalità Mancanti (Scope Target)**
    *   **Scopo:** Implementare le 5 funzionalità chiave definite nello scope target iniziale che sono attualmente assenti.
    *   **Azioni Dettagliate:**
        *   [ ] **Creazione/Inserimento Immobile (Agente):**
            *   Creare una nuova schermata/componente per il form di inserimento immobile.
            *   Definire i campi necessari e la UI del form.
            *   Implementare la logica di validazione (vedi Fase 4).
            *   Aggiungere la funzione API per la creazione immobile in `api.service.ts`.
            *   Collegare il form alla chiamata API.
            *   Gestire la navigazione post-successo (es. alla schermata feedback o alla dashboard).
        *   [ ] **Visualizzazione Dettaglio Immobile:**
            *   Creare una nuova schermata per visualizzare i dettagli di un immobile.
            *   Definire la UI per mostrare tutte le informazioni rilevanti.
            *   Aggiungere la funzione API per recuperare i dettagli per ID in `api.service.ts`.
            *   Implementare la chiamata API nella schermata dettaglio.
            *   Aggiornare le liste (Ricerca, Dashboard Agente, Preferiti?) per navigare a questa schermata passando l'ID corretto.
        *   [ ] **Schermata Mappa:**
            *   Installare e configurare `react-native-maps`.
            *   Aggiungere la funzione API per recuperare immobili con coordinate (eventualmente filtrati per area visibile) in `api.service.ts`.
            *   Implementare la logica per caricare gli immobili e visualizzarli come marker sulla mappa.
            *   Gestire interazioni (es. click su marker per mostrare info o navigare al dettaglio).
        *   [ ] **Schermata Feedback/Successo:**
            *   Creare un componente/schermata riutilizzabile per mostrare messaggi di successo o feedback all'utente (es. dopo registrazione, creazione immobile).
    *   **Risultato Atteso Fase 3:** Le 5 funzionalità target sono implementate e funzionanti.

4.  **Fase 4: Miglioramenti Qualità Codice e Affinamento**
    *   **Scopo:** Migliorare la leggibilità, la robustezza e la manutenibilità generale del codice.
    *   **Azioni Dettagliate:**
        *   [ ] **Gestione Stato Filtri Ricerca:**
            *   Valutare e implementare una soluzione di stato globale (es. Zustand, Jotai, o React Context) per gestire i filtri di ricerca.
            *   Modificare `FilterPanel.tsx` per aggiornare lo stato globale.
            *   Modificare `search.tsx` per leggere i filtri dallo stato globale invece che dai parametri di navigazione.
        *   [ ] **Validazione Input Frontend:**
            *   Installare `react-hook-form` e una libreria di validazione (es. `zod` o `yup`).
            *   Applicare la validazione ai form principali (Login, Registrazione, Creazione Utente, Creazione Immobile, Cambio Password).
        *   [ ] **Aggiunta Commenti e Tipi:**
            *   Rivedere componenti e funzioni complesse e aggiungere commenti JSDoc/TSDoc esplicativi.
            *   Cercare e sostituire usi di `any` con tipi più specifici ove possibile.
        *   [ ] **Miglioramento Gestione Errori UI:**
            *   Implementare un modo consistente per mostrare errori API all'utente (es. tramite toast/snackbar globali o messaggi inline nei form/schermate).
        *   [ ] **Risoluzione TODO e Code Smells:**
            *   Cercare sistematicamente `// TODO:` nel codice e risolverli o creare issue specifiche.
            *   Identificare e refactorizzare eventuali altri "code smells" (es. funzioni troppo lunghe, componenti con troppe responsabilità, codice duplicato).
        *   [ ] **Testing:**
            *   Scrivere o aggiornare test unitari/integrazione per le logiche critiche modificate o aggiunte (specialmente per `httpClient`, `api.service`, logica di validazione, gestione stato).
    *   **Risultato Atteso Fase 4:** Codice più pulito, leggibile, robusto, meglio documentato e testato.

---