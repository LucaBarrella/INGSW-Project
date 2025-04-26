# SearchHeader Mockup Plan

Questo file contiene il piano completo per modificare la searchbar (SearchHeader) e integrare il mockup richiesto. Fai sempre riferimento a questo file per eventuali aggiornamenti e per verificare le specifiche del progetto.

---

## 1. Layout e Struttura

### Pannello Filtri a Comparsa
- **Trigger:**  
  - Un clic sull'icona a forma di imbuto, posta accanto al campo di ricerca, aprirà un pannello laterale.
- **Chiusura:**  
  - Il pannello si chiude cliccando fuori di esso oppure tramite un pulsante "X" in alto a destra.

### Integrazione Mappa e Lista
- **Visualizzazione:**  
  - Sono presenti due schede ("Mappa" e "Lista") posizionate nella parte superiore dell’area risultati.
- **Stile Schede:**  
  - Le schede hanno uno stile sottile (outline o filled) con icone rappresentative per evidenziare quella attiva.
- **Sincronizzazione:**  
  - Selezionare una proprietà sulla mappa evidenzierà la stessa nella lista, e viceversa.

### Organizzazione dei Filtri
- **Raggruppamento:**  
  - I filtri saranno organizzati per categorie. Esempi di categorie:
    - Tipologia
    - Prezzo
    - Camere
    - Bagni
    - Amenità
    - Località

---

## 2. Design e Stile

### Palette di Colori
- **Colors.ts, presente colore primario, secondario, terziario.
- Usare quindi UseThemeColor per usare questi colori e gestire correttamente il tema.

### Tipografia
- **Font:** `Roboto`
  - **Headings:** Roboto Bold (700)
  - **Testo Normale:** Roboto Regular (400)

### Stile Immagini
- Le immagini degli immobili devono essere fotografie di alta qualità:
  - Illuminazione naturale
  - Angolazioni ampie
  - Leggermente desaturate
  - Effetto vignettatura sottile

---

## 3. Interazione e Feedback

### Filtraggio Dinamico
- **Comportamento:**  
  - I risultati si aggiornano istantaneamente mentre l'utente interagisce con i filtri.
- **Indicatori:**  
  - Visualizzazione del numero di risultati accanto a ciascuna opzione di filtro.

### Paginazione
- **Controlli:**  
  - Numerazione delle pagine con pulsanti "Precedente" e "Successivo".
  - Utilizzo di ellissi per indicare pagine saltate (es. "1 ... 5 6 7 ... 10").

### Ordinamento
- **Opzioni Disponibili:**
  - Prezzo (dal più basso al più alto)
  - Prezzo (dal più alto al più basso)
  - Dimensione (dal maggiore al minore)
  - Dimensione (dal minore al maggiore)
  - Nuovi (più recenti)
  - Vecchi (meno recenti)
  - Più Popolari
  - Per Distanza

### Mappa Interattiva
- **Interazioni:**  
  - Zoom e pan tramite gesti del mouse o touch.
  - Clic sui marker per visualizzare un popup con informazioni: immagine, prezzo e indirizzo.
  - Eventuale possibilità di disegnare un’area per delimitare la ricerca.
  - Pulsante "Current Location" o altri controlli di mappa opzionali.

---

## 4. Prompt per il Mockup

### Brief del Progetto
- **Obiettivo:**  
  Creare un’interfaccia utente intuitiva per la ricerca immobiliare che consenta agli utenti di filtrare le proprietà per criteri specifici e visualizzare i risultati sia in formato lista che su mappa.
- **Target:**  
  Utenti interessati all'acquisto o all'affitto di immobili.
- **Funzionalità Chiave:**  
  - Ricerca per località e tipologia.
  - Filtri per prezzo, camere, bagni, amenità.
  - Visualizzazione in due modalità (mappa e lista).
  - Sincronizzazione fra visualizzazioni e filtraggio dinamico.

### Dati di Esempio
- **Immobili:**  
  Esempi dettagliati per proprietà con titolo, descrizione, prezzo, immagini, ecc.
- **Filtri:**  
  Esempi per ciascuna categoria di filtro:
  - Tipologia: Appartamento, Villa, Loft, ecc.
  - Prezzo: Range multipli.
  - Camere, Bagni e Amenità: Checkbox e slider con valori numerici.

### Specifiche delle Interazioni
- **Filtraggio Dinamico:**  
  Aggiornamento istantaneo dei risultati con indicatori di caricamento.
- **Paginazione e Ordinamento:**  
  Dettaglio delle interazioni come descritto sopra.
- **Mappa Interattiva:**  
  Funzionalità come zoom, pan, marker cliccabili e popup informativi.

---

## Riferimento Continuo
**IMPORTANTE:**  
A partire da questo punto, tutte le modifiche e aggiornamenti relativi al mockup e alla searchbar (SearchHeader) faranno riferimento a questo file. Assicurati di consultarlo per avere una visione completa ed aggiornata del piano.

---

*Salva e utilizza questo file come riferimento fondamentale per lo sviluppo e l'iterazione del mockup.*
