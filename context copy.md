# Contesto Applicazione: DietiEstates

Questo documento raccoglie le informazioni chiave sul dominio dell'applicazione DietiEstates e serve come riferimento condiviso. È basato principalmente sul documento `Progetto-INGSW-2024-2025.pdf`.

**Nota:** Per una rappresentazione visiva delle funzionalità e delle interazioni tra i ruoli utente, fare riferimento al diagramma dei casi d'uso: `UseCaseDiagram-2.drawio.html`.

## 1. Obiettivi Principali

Realizzare una piattaforma performante e affidabile per la gestione di servizi immobiliari (DietiEstates25), permettendo ad agenzie di pubblicare inserzioni e agli utenti di visualizzarle e prenotare visite. L'applicazione deve essere intuitiva, rapida e piacevole da usare.

## 2. Concetti Fondamentali

*   **Immobile:** Entità centrale rappresentante una proprietà. Include dettagli come foto, descrizione, prezzo, dimensioni, indirizzo, stanze, piano, ascensore, classe energetica, servizi (portineria, climatizzazione), posizione geografica precisa (mappa interattiva). Categorizzato come "vendita" o "affitto", tipi (Residenziale, Commerciale, Industriale, Terreno). Legato all'Agente Immobiliare che lo ha caricato.
*   **Annuncio/Inserzione:** La pubblicazione di un Immobile sulla piattaforma, visibile agli utenti. Include indicatori automatici di vicinanza a servizi (scuole, parchi, trasporti).
*   **Visita:** Appuntamento prenotato da un Acquirente per visionare un Immobile. Include gestione date (entro 2 settimane), notifiche all'Agente, conferma/rifiuto da parte dell'Agente.
*   **Utente:** Entità generica che interagisce con il sistema. Si specializza nei ruoli Acquirente, Agente Immobiliare, Amministratore.
*   **Autenticazione/Autorizzazione:** Gestione degli accessi tramite credenziali (email/password, provider terzi, codici specifici per Admin/Agent) e token JWT. Salvataggio sicuro delle credenziali. Controllo dei permessi basato sul ruolo.

## 3. Utenza di Riferimento e Ruoli (Focus sui 5 punti selezionati)

*   **Utente non autenticato (Visitatore):**
    *   L'unica azione permessa è la **registrazione come nuovo Acquirente (Punto 1)**. Non è possibile visualizzare contenuti o eseguire altre operazioni senza autenticazione.
*   **Acquirente (User registrato):**
    *   **Registrazione/Login (Standard, Google, Facebook, GitHub) (Punto 1)**
    *   **Ricerca immobili avanzata (Punto 3)** con parametri multipli e visualizzazione su mappa.
    *   Visualizzazione dettagli immobile (inclusa mappa e indicatori servizi - derivato da Punto 2 e 9).
    *   *(Altre funzionalità non prioritarie: Riepilogo attività, Prenotazione visite)*
*   **Agente Immobiliare (User registrato con privilegi specifici):**
    *   **Login (con numero REA) (Punto 1)**
    *   **Caricamento nuovi immobili (Punto 2)** con dettagli completi e posizione geografica.
    *   **Visualizzazione Dashboard con statistiche (visualizzazioni, visite, venduti/affittati) ed esportazione report (PDF/CSV) (Punto 12)** *(Statistiche sulle offerte rimosse)*
    *   *(Altre funzionalità non prioritarie: Gestione visite, Notifiche, Gestione Profilo)*
*   **Amministratore:**
    *   **Login (con codice di autenticazione) (Punto 1)**
    *   **Creazione account Agente Immobiliare (Punto 1)**
    *   **Creazione altri account Amministratore (Punto 1)**
    *   **Modifica password di amministrazione (Punto 1)**

*(Vedere `UseCaseDiagram-2.drawio.html` per la rappresentazione grafica completa)*

## 4. Requisiti Specifici (Focus sui 5 punti selezionati)

*   **Architettura:** Sistema distribuito Back-end (logica e dati, API REST) / Front-end (UI), indipendenti. (Containerizzazione Docker e deploy Cloud auspicabili ma non obbligatori).
*   **Tecnologie:** Linguaggio OO obbligatorio per il back-end. Libertà di scelta per il resto (Java+Spring per BE, React/Angular/Vue/Mobile/Desktop per FE). Motivare le scelte.
*   **Design:** Uso obbligatorio di tool CASE. Design astratto per favorire riutilizzo e estensibilità. Persistenza dati definita (schema DB).
*   **Sicurezza:** Salvataggio sicuro credenziali **(Punto 1)**. Protezione endpoint in base ai ruoli.
*   **Integrazioni Esterne:**
    *   Provider OAuth (Google, Facebook, GitHub): Per login/registrazione **(Punto 1)**.
    *   Mappe Interattive (es. Google Maps): Per caricamento/visualizzazione posizione immobili **(Punto 2, Punto 3)**.
    *   Esportazione PDF/CSV: Per report dashboard agente **(Punto 12)**.
*   **Qualità Codice:** Report da SonarQube (o simile) per il back-end.
*   **Versioning:** Uso obbligatorio di strumenti di versioning (es. Git).

**Elenco Funzionalità Prioritarie (5 punti):**
1.  Gestione Utenti e Autenticazione
2.  Caricamento Immobili (Agente)
3.  Ricerca Immobili (Utente)
9.  Verifica Servizi Esterni (Creazione Annuncio) - *Limitata alla vicinanza servizi*
12. Dashboard Agente Immobiliare

---
*Questo documento è 'vivo' e verrà aggiornato man mano che emergono nuove informazioni o vengono prese decisioni.*