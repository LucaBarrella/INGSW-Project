# Problemi Noti

Questo documento elenca i problemi noti nel progetto che richiedono attenzione futura.

## Avviso di Compatibilità React

**Descrizione:** Durante l'avvio dell'applicazione con `npm run start`, viene visualizzato il seguente avviso:
```
The following packages should be updated for best compatibility with the installed expo version:
  react@19.1.0 - expected version: 19.0.0
  react-dom@19.1.0 - expected version: 19.0.0
Your project may not work correctly until you install the expected versions of the packages.
```
Questo indica un disallineamento tra le versioni di `react` e `react-dom` installate e quelle attese da Expo SDK 53.

**Impatto:** L'applicazione sembra avviarsi e funzionare, ma questo avviso indica un ambiente di dipendenze non ottimale che potrebbe causare problemi in futuro.

**Possibile Soluzione:** Un aggiornamento dell'SDK Expo a una versione che supporti nativamente React 19.1.0 (o superiore) è probabilmente necessario per risolvere completamente questo problema.

## Test Automatici Falliti

**Descrizione:** L'esecuzione dei test automatici (`npm test`) fallisce con errori, principalmente nei test relativi a `api.service.test.ts`. Gli errori indicano che le mock functions di `httpClient` non vengono chiamate come previsto.

**Impatto:** I test automatici non forniscono una verifica affidabile del codice del servizio API.

**Possibile Causa:** Il downgrade di `@testing-library/react-native` a `^12.4.0` per risolvere un conflitto di dipendenze durante l'installazione potrebbe aver introdotto incompatibilità con Jest o con la configurazione di testing.

**Possibile Soluzione:** Indagare la compatibilità tra `@testing-library/react-native@^12.4.0`, Jest e l'ambiente Expo/React Native attuale. Potrebbe essere necessario adattare la configurazione di testing o considerare un approccio diverso per la gestione delle dipendenze di testing, o valutare se l'aggiornamento dell'SDK Expo risolverebbe anche questo problema.