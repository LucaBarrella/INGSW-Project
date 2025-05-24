# Piano Architetturale Frontend (React Native)

Questo documento descrive l'architettura proposta per il frontend dell'applicazione DietiEstates, basata su una struttura a livelli per migliorare la manutenibilità, la testabilità e la scalabilità del codice.

## Obiettivi

*   Migliorare la separazione delle responsabilità tra i diversi moduli dell'applicazione.
*   Rendere il codice più modulare e riutilizzabile.
*   Facilitare la comprensione del flusso di dati e delle dipendenze.
*   Semplificare l'implementazione di nuove funzionalità e la manutenzione di quelle esistenti.
*   Migliorare la testabilità del codice.

## Architettura a Livelli

L'architettura proposta è suddivisa nei seguenti livelli principali:

1.  **Livello di Presentazione (UI Components):** Responsabile della visualizzazione dell'interfaccia utente e della gestione dell'input diretto dell'utente.
2.  **Livello di Logica di Presentazione (Custom Hooks / ViewModels):** Contiene la logica specifica della UI, gestisce lo stato della schermata e orchestra le chiamate ai servizi.
3.  **Livello di Logica di Business (Services):** Incapsula la logica centrale dell'applicazione e le regole di business, interagisce con il livello di accesso dati.
4.  **Livello di Accesso Dati:** Gestisce i dettagli tecnici per l'interazione con API esterne e storage locale.
5.  **Livello Esterno (Backend API):** Rappresenta i servizi esterni con cui l'applicazione comunica.

### 1. Livello di Presentazione (UI Components)

*   **Responsabilità:** Renderizzare l'UI, raccogliere input utente, gestire eventi UI semplici.
*   **Dipendenze:** Dipende dal Livello di Logica di Presentazione per i dati e le azioni complesse.
*   **Esempi (File/Cartelle):**
    *   `components/` (componenti riutilizzabili)
    *   `app/(auth)/` (schermate di autenticazione)
    *   `app/(protected)/` (schermate protette, organizzate per ruolo e tab)
    *   `app/+not-found.tsx`
    *   `app/feedback.tsx`

### 2. Livello di Logica di Presentazione (Custom Hooks / ViewModels)

*   **Responsabilità:** Gestire lo stato specifico della UI, validare l'input (se necessario), preparare i dati per la visualizzazione, orchestrare le chiamate ai servizi del Livello 3.
*   **Dipendenze:** Dipende dal Livello di Logica di Business.
*   **Esempi (File/Cartelle):**
    *   `hooks/` (hook personalizzati come `useAuth`, `useProperty`, `useUser`, `useDashboard`, `useVisits`, `useSearch`)

### 3. Livello di Logica di Business (Services)

*   **Responsabilità:** Implementare le regole di business, orchestrare le operazioni complesse, interagire con il Livello di Accesso Dati.
*   **Dipendenze:** Dipende dal Livello di Accesso Dati.
*   **Esempi (File/Cartelle):**
    *   `app/_services/auth.service.ts`
    *   `app/_services/api.service.ts` (potrebbe essere rifattorizzato o sostituito da servizi più specifici)
    *   Nuovi servizi come `propertyService.ts`, `userService.ts`, `visitService.ts`, `dashboardService.ts`.

### 4. Livello di Accesso Dati

*   **Responsabilità:** Gestire i dettagli tecnici della comunicazione con l'esterno (richieste HTTP, storage locale).
*   **Dipendenze:** Nessuna dipendenza da altri livelli del frontend.
*   **Esempi (File/Cartelle):**
    *   `app/_services/httpClient.ts` (configurazione Axios)
    *   Moduli per SecureStore o altri storage locali.

### 5. Livello Esterno (Backend API)

*   **Responsabilità:** Fornire i dati e le funzionalità tramite API REST.
*   **Dipendenze:** Esterno al frontend.
*   **Esempi:** Endpoint API del backend.

## Diagramma Architetturale

```mermaid
graph TD
    subgraph Frontend
        subgraph Presentation [Livello 1: Presentazione (Componenti UI)]
            UI_Components
        end

        subgraph Presentation_Logic [Livello 2: Logica di Presentazione (Custom Hooks)]
            PL_Hooks
        end

        subgraph Business_Logic [Livello 3: Logica di Business (Servizi)]
            BL_Services
        end

        subgraph Data_Access [Livello 4: Accesso Dati]
            DA_Modules
        end
    end

    subgraph Backend [Livello 5: Esterno (Backend API)]
        BE_API
    end

    Presentation --> Presentation_Logic : usa
    Presentation_Logic --> Business_Logic : usa
    Business_Logic --> Data_Access : usa
    Data_Access --> Backend : interagisce con

    %% Styling
    classDef layer fill:#f0f0f0,stroke:#333,stroke-width:2px;
    class Presentation, Presentation_Logic, Business_Logic, Data_Access layer;
    class Backend fill:#c0c0c0,stroke:#333,stroke-width:2px;

    classDef module fill:#e0e0e0,stroke:#666;
    class UI_Components, PL_Hooks, BL_Services, DA_Modules, BE_API module;
```

## Prossimi Passi per la Riorganizzazione

1.  **Creare la struttura di cartelle per i nuovi livelli:**
    *   Creare una cartella `hooks/` nella directory principale di `FrontEndTS/DietiEstates/`.
    *   Riorganizzare i servizi esistenti in `app/_services/` o creare una nuova cartella `services/` se preferito, suddividendoli per dominio (es. `authService.ts`, `propertyService.ts`).

2.  **Implementare i Custom Hooks (Livello 2):**
    *   Per ogni schermata o gruppo di funzionalità, creare un hook personalizzato corrispondente (es. `useRegistration.ts`, `useLogin.ts`, `usePropertyList.ts`, `usePropertyDetails.ts`).
    *   Spostare la logica di gestione dello stato, validazione e le chiamate ai servizi all'interno di questi hook.

3.  **Rifattorizzare i Componenti UI (Livello 1):**
    *   Modificare i componenti UI esistenti (es. `RegistrationForm.tsx`, `LoginForm.tsx`) per utilizzare i nuovi hook personalizzati.
    *   I componenti UI dovrebbero ora limitarsi a renderizzare l'interfaccia e chiamare i metodi esposti dagli hook in risposta agli eventi utente.

4.  **Rifattorizzare i Servizi (Livello 3):**
    *   Suddividere `api.service.ts` in servizi più piccoli e focalizzati (es. `propertyService.ts`, `userService.ts`).
    *   Assicurarsi che i servizi utilizzino `httpClient.ts` per tutte le chiamate di rete.

5.  **Aggiornare il Livello di Accesso Dati (Livello 4):**
    *   Assicurarsi che `httpClient.ts` sia configurato correttamente con URL base, header e interceptor.
    *   Creare un modulo dedicato per l'interazione con SecureStore se necessario.

6.  **Implementare le Funzionalità Mancanti:**
    *   Creare i componenti UI per le interfacce mancanti (Modifica Immobile, Risultati Ricerca con Mappa, Dettagli Immobile).
    *   Creare i custom hook e aggiornare i servizi esistenti per supportare queste nuove funzionalità.

## Esempio di Implementazione (Registrazione)

Per darti un'idea più concreta, ecco come potrebbe apparire il flusso di registrazione con un custom hook:

*   **`app/_services/auth.service.ts`:** Contiene le funzioni `registerBuyer` e `loginBuyer` che usano `httpClient`.
*   **`hooks/useAuth.ts`:**
    ```typescript
    import { useState } from 'react';
    import { authService } from '@/app/_services/auth.service';
    import * as SecureStore from 'expo-secure-store';

    const TOKEN_KEY = 'user_auth_token';

    export const useAuth = () => {
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      const [user, setUser] = useState<any>(null); // Definire un tipo User più specifico

      const register = async (userData: any) => { // Definire un tipo più specifico
        setLoading(true);
        setError(null);
        try {
          const registeredUser = await authService.registerBuyer(userData);
          // Dopo la registrazione, effettua il login automatico
          const token = await authService.loginBuyer({ email: userData.email, password: userData.password });
          await SecureStore.setItemAsync(TOKEN_KEY, token);
          setIsAuthenticated(true);
          setUser(registeredUser); // Potresti voler ottenere i dati utente completi dopo il login se necessario
          setLoading(false);
          return registeredUser;
        } catch (err: any) {
          setError(err.message || 'Errore durante la registrazione');
          setLoading(false);
          throw err; // Rilancia l'errore per la gestione a livello UI
        }
      };

      const login = async (credentials: any) => { // Definire un tipo più specifico
         setLoading(true);
         setError(null);
         try {
           // Assumendo che loginBuyer restituisca { token, roles }
           const { token, roles } = await authService.loginBuyer(credentials);
           await SecureStore.setItemAsync(TOKEN_KEY, token);
           // Potresti voler salvare anche i ruoli o i dati utente
           setIsAuthenticated(true);
           // Recupera i dati utente se necessario
           setLoading(false);
           return { token, roles }; // Restituisce token e ruoli
         } catch (err: any) {
           setError(err.message || 'Errore durante il login');
           setLoading(false);
           throw err;
         }
      };

      // Aggiungere altre funzioni come logout, checkAuthStatus, ecc.

      return {
        register,
        login,
        isAuthenticated,
        user,
        loading,
        error,
      };
    };
    ```
*   **`components/RegistrationForm.tsx`:**
    ```typescript
    import React, { useState } from 'react';
    import { View, Alert, TextInput, Button, Text } from 'react-native'; // Aggiunti import mancanti per l'esempio
    import { useAuth } from '@/hooks/useAuth'; // Importa l'hook
    import { useRouter } from 'expo-router'; // Importa useRouter

    // Definire un tipo per le props se necessario, altrimenti usare ViewProps
    type RegistrationFormProps = ViewProps & {};

    const RegistrationForm: React.FC<RegistrationFormProps> = ({ ...props }) => {
      const [formData, setFormData] = useState<any>({ // Definire tipo più specifico
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        birthdate: '' // Assumendo stringa YYYY-MM-DD
      });
      const { register, loading, error } = useAuth(); // Usa l'hook
      const router = useRouter();

      // Funzione di validazione semplificata per l'esempio
      const validateForm = () => {
          // Implementare logica di validazione qui
          return true; // Per l'esempio, assumiamo sempre valido
      };

      const handleSubmit = async () => {
        if (!validateForm()) {
          return;
        }

        try {
          const registeredUser = await register(formData);
          Alert.alert('Registrazione Completata', `Benvenuto ${registeredUser.firstName}!`, [
            { text: 'OK', onPress: () => router.push('/(protected)/(buyer)/(tabs)/home') }
          ]);
        } catch (err) {
          // L'hook gestisce il salvataggio del token e lo stato di errore
          // Mostra l'errore all'utente
          Alert.alert('Errore Registrazione', error || 'Si è verificato un errore');
        }
      };

      return (
        <View>
          <Text>Email:</Text>
          <TextInput value={formData.email} onChangeText={(text) => setFormData({...formData, email: text})} />

          <Text>Password:</Text>
          <TextInput value={formData.password} onChangeText={(text) => setFormData({...formData, password: text})} secureTextEntry />

          <Text>Nome:</Text>
          <TextInput value={formData.firstName} onChangeText={(text) => setFormData({...formData, firstName: text})} />

          <Text>Cognome:</Text>
          <TextInput value={formData.lastName} onChangeText={(text) => setFormData({...formData, lastName: text})} />

          <Text>Data di nascita (YYYY-MM-DD):</Text>
          <TextInput value={formData.birthdate} onChangeText={(text) => setFormData({...formData, birthdate: text})} placeholder="YYYY-MM-DD" />

          <Button
            title={loading ? 'Registrazione...' : 'Registrati'}
            onPress={handleSubmit}
            disabled={loading}
          />
          {error && <Text style={{ color: 'red' }}>{error}</Text>}
          {/* Link per login */}
          <TouchableOpacity onPress={() => router.push('/(auth)/(buyer)/login')}>
             <Text>Hai già un account? Accedi</Text>
          </TouchableOpacity>
        </View>
      );
    };

    export default RegistrationForm;