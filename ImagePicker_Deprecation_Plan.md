# Piano per Risolvere la Deprecazione di `ImagePicker.MediaTypeOptions`

**Obiettivo:** Aggiornare il codice del client React Native (`FrontEndTS/DietiEstates/`) per utilizzare la nuova API `ImagePicker.MediaType` al posto della deprecata `ImagePicker.MediaTypeOptions`, risolvendo il warning `(NOBRIDGE) WARN [expo-image-picker] \`ImagePicker.MediaTypeOptions\` have been deprecated. Use \`ImagePicker.MediaType\` or an array of \`ImagePicker.MediaType\` instead.`

**Contesto:**
La ricerca web ha confermato che `ImagePicker.MediaTypeOptions` è stato deprecato nelle recenti versioni di `expo-image-picker` e deve essere sostituito da `ImagePicker.MediaType`.

**Passaggi del Piano:**

1.  **Identificazione dei File Interessati:**
    *   Utilizzare lo strumento `search_files` per localizzare tutte le occorrenze di `ImagePicker.MediaTypeOptions` all'interno della directory `FrontEndTS/DietiEstates/`.
    *   **Comando Esempio (per riferimento):**
        ```xml
        <search_files>
          <path>FrontEndTS/DietiEstates/</path>
          <regex>ImagePicker\.MediaTypeOptions</regex>
          <file_pattern>*.tsx</file_pattern>
        </search_files>
        ```

2.  **Analisi del Codice:**
    *   Esaminare i file identificati nel passaggio precedente.
    *   Comprendere come `MediaTypeOptions` viene attualmente utilizzato (es., per specificare solo immagini, solo video, o entrambi).

3.  **Consultazione Documentazione Ufficiale:**
    *   Fare riferimento alla documentazione ufficiale di Expo ImagePicker per l'uso corretto di `ImagePicker.MediaType`: [https://docs.expo.dev/versions/latest/sdk/imagepicker/](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
    *   Identificare i valori enum corretti (es. `ImagePicker.MediaType.Images`, `ImagePicker.MediaType.Videos`) e come usarli singolarmente o in un array (es. `[ImagePicker.MediaType.Images, ImagePicker.MediaType.Videos]`).

4.  **Modifica del Codice:**
    *   Sostituire ogni utilizzo di `ImagePicker.MediaTypeOptions` con l'equivalente `ImagePicker.MediaType` appropriato, basandosi sull'analisi del codice e sulla documentazione.
    *   Assicurarsi che la logica circostante rimanga coerente con la nuova API.

5.  **Testing:**
    *   Dopo aver applicato le modifiche, testare manualmente la funzionalità di selezione delle immagini/video nelle parti dell'applicazione interessate per assicurarsi che funzioni come previsto.
    *   Eseguire eventuali test automatici pertinenti, se disponibili.

**Prossimo Passo (dopo salvataggio piano):**
Eseguire la ricerca dei file come descritto nel Passaggio 1. Successivamente, richiedere il passaggio alla modalità "Code" per implementare le modifiche (Passaggio 4).