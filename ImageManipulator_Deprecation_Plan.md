# Piano di Modifica per `manipulateAsync`

## 1. Obiettivo

Aggiornare la chiamata alla funzione `ImageManipulator.manipulateAsync` nel file `FrontEndTS/DietiEstates/components/Agent/AddPropertySteps/Step5_Photos.tsx` per utilizzare la firma non deprecata, risolvendo così l'avviso TypeScript `ts(6387)`.

## 2. File da Modificare

`FrontEndTS/DietiEstates/components/Agent/AddPropertySteps/Step5_Photos.tsx`

## 3. Modifiche Specifiche

*   Individuare la chiamata a `ImageManipulator.manipulateAsync` all'interno della funzione `resizeAndCompressImage` (attorno alle righe 46-55).
*   **Rimuovere:** Il commento `// @ts-ignore` alla riga 45.
*   **Modificare:** Il primo argomento passato a `manipulateAsync` alla riga 47 da `originalUri` a `{ uri: originalUri }`.

## 4. Verifica Attesa

Dopo l'applicazione della modifica, l'avviso TypeScript `ts(6387)` relativo alla firma deprecata dovrebbe scomparire dall'editor. La funzionalità di manipolazione delle immagini dovrebbe rimanere invariata.

## 5. Strumento Proposto per l'Implementazione

`apply_diff`

## 6. Modalità Proposta per l'Implementazione

`code` (Modalità Codice)

## Diagramma

```mermaid
graph TD
    A[Inizio: Avviso TS(6387) in Step5_Photos.tsx] --> B{Identifica Chiamata Deprecata};
    B --> C[Rimuovi @ts-ignore (riga 45)];
    C --> D[Modifica 1° Argomento: \n originalUri -> { uri: originalUri } (riga 47)];
    D --> E{Applica Modifiche con apply_diff};
    E --> F[Fine: Avviso TS risolto, funzionalità invariata];