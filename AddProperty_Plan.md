# Piano di Implementazione: Creazione/Inserimento Immobile (Agente)

**Obiettivo:** Permettere agli agenti immobiliari autenticati di aggiungere nuovi immobili alla piattaforma attraverso un form multi-step guidato.

**Fasi Principali dell'Implementazione:**

1.  **Struttura dei Componenti e Navigazione:**
    *   **Schermata Principale:** Creare una nuova route/schermata (`app/(protected)/(agent)/add-property.tsx`).
    *   **Componente Wizard/Stepper:** Implementare un componente per gestire gli step.
    *   **Componenti per Step:** Creare componenti specifici per ogni step (`Step1_PropertyType.tsx`, `Step2_BasicDetails.tsx`, `Step3_LocationStatus.tsx`, `Step4_PropertyDetails.tsx`, `Step5_Photos.tsx`).
    *   **Layout Step:** Includere pulsanti "Next" / "Previous" / "Save Property".

2.  **Gestione dello Stato del Form:**
    *   Utilizzare `react-hook-form` per gestire lo stato attraverso tutti gli step.

3.  **Sviluppo UI per Step:**
    *   Implementare l'UI di ogni step basandosi sui mockup e riutilizzando componenti esistenti (`ThemedButton`, `LabelInput`, etc.).
    *   Gestire la visualizzazione dinamica dei campi nello Step 4 in base al tipo di immobile.
    *   Integrare `expo-image-picker` per l'upload delle foto nello Step 5.

4.  **Logica API e Backend:**
    *   Definire il payload JSON per l'API `createProperty`.
    *   Aggiungere la funzione `createProperty(propertyData)` in `api.service.ts` usando `httpClient`.
    *   Chiarire e implementare la strategia di upload delle immagini con il backend.
    *   Chiamare l'API `createProperty` al salvataggio finale.

5.  **Validazione (Preparazione per Fase 4):**
    *   Definire schemi di validazione (`zod`/`yup`) per `react-hook-form`.

6.  **Flusso Utente e Feedback:**
    *   Implementare la navigazione tra gli step.
    *   Gestire il feedback visivo per successo/errore dopo la chiamata API.

**Diagramma di Flusso (Mermaid):**

```mermaid
graph TD
    subgraph "Flusso Creazione Immobile (Agente)"
        direction LR
        Start((Inizio)) --> Step1[/Step 1: Tipo Immobile/];
        Step1 -- Seleziona Tipo --> Step2[/Step 2: Dettagli Base/];
        Step2 -- Avanti --> Step3[/Step 3: Località & Stato/];
        Step2 -- Indietro --> Step1;
        Step3 -- Avanti --> Step4[/Step 4: Dettagli Specifici (Dinamico)/];
        Step3 -- Indietro --> Step2;
        Step4 -- Avanti --> Step5[/Step 5: Foto/];
        Step4 -- Indietro --> Step3;
        Step5 -- Salva Immobile --> API{Chiamata API createProperty};
        Step5 -- Indietro --> Step4;
        API -- Successo --> SuccessFeedback[/Feedback Successo & Navigazione/];
        API -- Errore --> ErrorFeedback[/Mostra Errore/];
        SuccessFeedback --> End((Fine));
        ErrorFeedback --> Step5;
    end