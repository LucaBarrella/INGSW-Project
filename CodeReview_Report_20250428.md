# Report Code Review - DietiEstates Client (React Native)

**Data:** 28 Aprile 2025
**Revisore:** Roo (Technical Architect)

## 1. Analisi di Sicurezza

Sono state identificate le seguenti vulnerabilità e problematiche di sicurezza:

*   **Mancanza di Invio Token di Autenticazione (Criticità: ALTA):**
    *   **Descrizione:** Le chiamate API verso endpoint protetti (es. creazione admin/agente, cambio password admin, profilo agente, e presumibilmente tutte le future chiamate API per agenti/acquirenti loggati) vengono effettuate utilizzando `fetch` **senza** includere l'header `Authorization` con il token JWT ottenuto al login.
    *   **Rischio:** Tutte le funzionalità che richiedono autenticazione sono **attualmente non funzionanti**. Il backend rifiuterà le richieste per mancanza di autorizzazione. Questo blocca completamente l'utilizzo delle sezioni protette dell'applicazione.
    *   **Azione Correttiva:** Implementare un **client HTTP centralizzato** (es. usando `axios` o un wrapper attorno a `fetch`) con **interceptor** per:
        1.  Recuperare il token JWT salvato (es. da `AsyncStorage` o un secure storage).
        2.  Aggiungere automaticamente l'header `Authorization: Bearer <token>` a tutte le richieste verso endpoint protetti.
        3.  Gestire globalmente la scadenza e il rinnovo dei token (refresh token), se previsto dal backend.
        4.  Gestire globalmente gli errori 401/403 (Unauthorized/Forbidden), ad esempio reindirizzando al login.
*   **URL API Hardcoded (Criticità: MEDIA):**
    *   **Descrizione:** L'URL base dell'API è hardcoded nel file `api.service.ts`. Attualmente punta a `http://localhost:8080/api`. L'URL di produzione (presumibilmente Azure) è commentato ma presente nel codice.
    *   **Rischio:**
        *   **Esposizione:** Rende visibile l'endpoint di backend nel codice client.
        *   **Configurazione:** Impedisce una gestione flessibile degli ambienti (sviluppo, test, produzione). Il passaggio richiede modifiche manuali al codice, aumentando il rischio di errori e rendendo il deploy macchinoso.
        *   **Sicurezza Trasporto:** L'uso di `http` per localhost è accettabile in sviluppo, ma l'URL di produzione *deve* usare `https` (come sembra essere quello commentato). La mancanza di una gestione centralizzata del client API non garantisce che tutte le chiamate future usino `https` quando necessario.
    *   **Azione Correttiva:** Utilizzare variabili d'ambiente (es. tramite file `.env` e `expo-constants`) per definire gli URL base per i diversi ambienti. Rimuovere completamente gli URL hardcoded dal codice sorgente. Assicurarsi che il client HTTP centralizzato utilizzi `https` per gli ambienti di produzione.
*   **Mancanza di Validazione Input (Criticità: MEDIA - da verificare nel backend):**
    *   **Descrizione:** Il codice frontend analizzato non mostra una validazione robusta degli input utente prima dell'invio al backend (es. nei form). Sebbene la validazione primaria debba avvenire nel backend, una validazione preliminare nel frontend migliora l'esperienza utente e riduce richieste invalide.
    *   **Rischio:** Invio di dati non validi o potenzialmente malevoli al backend. Dipende dalla robustezza della validazione backend.
    *   **Azione Correttiva:** Implementare validazione degli input nei form utilizzando librerie come `react-hook-form` con `zod` o `yup` per definire schemi di validazione.

## 2. Valutazione del Debito Tecnico

Il progetto presenta un **debito tecnico significativo**, stimabile in **almeno 7-10 giorni di lavoro** per un singolo sviluppatore solo per la sua risoluzione (esclusa l'implementazione delle funzionalità mancanti).

**Categorie Principali:**

*   **Architettura e Design (Criticità: ALTA):**
    *   **Mancanza Service Layer API:** Assenza di un client HTTP centralizzato con gestione token, errori e configurazione ambiente. Logica API sparsa nei componenti. (Stima: 2-3 giorni)
    *   **Accoppiamento UI-API:** I componenti UI sono direttamente responsabili delle chiamate `fetch`. (Risolto con il punto precedente)
    *   **Gestione Stato Globale Inadeguata:** Passaggio di filtri complessi via parametri di navigazione invece di uno stato globale. (Stima: 0.5-1 giorno)
*   **Implementazione e Funzionalità (Criticità: ALTA):**
    *   **Mancanza Integrazione API Reale:** Uso estensivo di dati mock hardcoded (Dashboard Agente, Ricerca, Home Buyer). Le funzionalità core non interagiscono con il backend. (Stima: 3-4 giorni, solo per integrare le parti *esistenti* con API reali, escluso sviluppo nuove funzionalità)
    *   **Funzionalità Incomplete/Placeholder:** Numerosi TODO nel codice, logica mancante (export PDF, navigazione dettaglio, gestione filtri ricerca, creazione immobile). (Stima: 1-2 giorni, solo per completare i TODO *esistenti*)
*   **Testing (Criticità: MEDIA - da approfondire):**
    *   Presenza di alcuni test unitari (`__tests__`), ma la loro copertura ed efficacia non sono state valutate in dettaglio. La mancanza di un service layer API rende i test dei componenti più complessi. (Stima: N/A - richiede analisi dedicata)
*   **Configurazione e Build (Criticità: MEDIA):**
    *   Mancanza gestione ambienti per URL API. (Stima: 0.25 giorni)

## 3. Stato di Implementazione e Analisi dei Gap

*   **Sezioni Incomplete / Placeholder / Mock:**
    *   **Dashboard Agente (`PropertyDashboard.tsx`):** Totalmente basata su dati mock hardcoded. Nessuna chiamata API. Export PDF è un `console.log`.
    *   **Ricerca Immobili (`search.tsx`):** Logica di fetching API è un TODO con dati mock. Non gestisce i filtri ricevuti. Navigazione al dettaglio è un TODO.
    *   **Home Acquirente (`home.tsx`):** Sezione "In Evidenza" usa dati mock.
    *   **Creazione Immobile Agente:** Funzionalità completamente assente, solo un pulsante placeholder.
    *   **Chiamate API Protette:** Tutte le chiamate API che richiedono autenticazione (es. `add-admin.tsx`, `add-agent.tsx`, `change-password.tsx`) mancano dell'header `Authorization` e quindi non funzionano.
    *   **Definizione Endpoint (`api.service.ts`):** Contiene TODO, endpoint da rimuovere e potenziali inconsistenze. Mancano molti endpoint necessari.
*   **Funzionalità / Componenti / Schermate Implementate (anche se parzialmente o con mock):**
    *   **Autenticazione UI:** Schermate e form per il login (Buyer, Admin, Agent) e registrazione (Buyer). La logica di chiamata API per la registrazione Buyer esiste (ma senza gestione token post-login). Login Admin/Agent usa endpoint corretti ma manca gestione token.
    *   **Struttura Navigazione:** Impostata con Expo Router, con layout separati per aree pubbliche/(auth) e protette/(protected) e per i diversi ruoli (admin, agent, buyer).
    *   **UI Creazione Utenti (Admin):** Form per creare Admin e Agenti (`UserCreationForm`).
    *   **UI Cambio Password (Admin):** Form presente.
    *   **UI Ricerca/Filtro (`SearchAndFilter.tsx`, `FilterPanel.tsx`, etc.):** Componenti UI per la barra di ricerca e il pannello filtri avanzati sono ben strutturati e funzionali a livello di UI state management.
    *   **Componenti UI Riutilizzabili:** Presenza di componenti tematici (`ThemedView`, `ThemedText`, `ThemedIcon`, `ThemedButton`) e altri componenti UI (es. `StatCard`, `PropertyCard`, `CategoryButton`).
    *   **Hook `useFavorites`:** Implementato con `AsyncStorage` (ma con gestione errori migliorabile).
*   **Gap rispetto allo Scope Target:** Significativo. Vedi punto successivo.

## 4. Verifica Scope Target

Lo stato attuale è **molto lontano** dal raggiungimento dello scope target definito:

*   **Schermata di feedback/successo (post registrazione):** **NON IMPLEMENTATA** (o non verificata, ma probabile assente).
*   **Schermata di creazione/inserimento immobile (Agente):** **NON IMPLEMENTATA**. Esiste solo un pulsante placeholder.
*   **Schermata di visualizzazione dei risultati della ricerca immobili:** **IMPLEMENTATA SOLO COME MOCKUP**. La UI esiste ma usa dati hardcoded, non chiama API reali e non gestisce correttamente i filtri.
*   **Schermata mappa (con visualizzazione geolocalizzata):** **NON IMPLEMENTATA**. Nessuna traccia di componenti mappa o integrazione con servizi di mapping.
*   **Schermata di visualizzazione dei dettagli di un singolo immobile:** **NON IMPLEMENTATA**. La navigazione è un TODO.
*   **Rifiniture Generali UI:** La UI esistente utilizza componenti tematici ma richiede lavoro per raggiungere un livello di rifinitura completo (es. gestione errori API visibile all'utente, stati di caricamento consistenti, ecc.).

## 5. Studio di Fattibilità (1 Sviluppatore, 1 Mese - Scope Completo ~25 Schermate)

*   **Opzione 1 (Salvare e Completare RN - Full Scope):**
    *   **Stima Minima:** 26 - 36+ giorni lavorativi.
    *   **Fattibilità:** **NON FATTIBILE.** Il tempo richiesto supera significativamente il mese disponibile.
*   **Opzione 2 (Ricostruire Web da zero - Full Scope):**
    *   **Stima Minima:** 31 - 42+ giorni lavorativi (include riprogettazione/implementazione UI web).
    *   **Fattibilità:** **NON FATTIBILE.** Ancora più dispendioso in termini di tempo rispetto all'Opzione 1.

## Conclusione Definitiva sulla Fattibilità (Scope Completo)

**Nessuna delle due opzioni è fattibile per completare l'intero scope di ~25 schermate funzionanti nel tempo limite di 1 mese con 1 solo sviluppatore.**

## Raccomandazione Strategica (Alternativa)

Data l'infattibilità di completare l'intero scope in 1 mese, è necessario **ridurre drasticamente lo scope** oppure **aumentare le risorse (tempo/sviluppatori)**.

Se le risorse rimangono fisse (1 mese, 1 dev), consiglio di:

1.  **Definire un MVP (Minimum Viable Product) realistico:** Identificare il sottoinsieme *assolutamente critico* di funzionalità/schermate necessarie per un primo rilascio o test (potrebbero essere le 5 target + login/reg, o un altro set).
2.  **Scegliere l'approccio (Riparare RN vs Ricostruire Web) in base a *quello scope MVP***. Per un MVP limitato, la ricostruzione web potrebbe essere leggermente più pragmatica per ottenere una base pulita, ma se si vuole salvare l'investimento UI RN, si può tentare la riparazione, accettando i rischi.

---