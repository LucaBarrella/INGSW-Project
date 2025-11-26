# Documentazione API: Ricerca Proprietà

Questo documento fornisce al team di frontend una guida chiara e concisa sulla funzionalità di ricerca delle proprietà esposta dal backend.

**Controller e Servizio Responsabili:**
*   **Controller:** [`PropertiesController.java`](src/main/java/com/dieti/dietiestatesbackend/controller/PropertiesController.java)
*   **Servizio:** [`PropertyService.java`](src/main/java/com/dieti/dietiestatesbackend/service/PropertyService.java)

Il metodo principale per la ricerca è `POST /properties/search` nel `PropertiesController`, che delega la logica di business a `searchPropertiesWithFilters` nel `PropertyService`.

## Endpoint di Ricerca

**Endpoint:** `POST /properties/search`
Questo endpoint consente di effettuare ricerche filtrate di proprietà con supporto per la paginazione.

## Parametri Accettati

L'endpoint accetta un oggetto [`FilterRequest`](src/main/java/com/dieti/dietiestatesbackend/dto/request/FilterRequest.java) nel corpo della richiesta (`@RequestBody`) e un oggetto `Pageable` per la paginazione.

### DTO `FilterRequest`

Il DTO [`FilterRequest`](src/main/java/com/dieti/dietiestatesbackend/dto/request/FilterRequest.java) contiene i seguenti campi:

| Nome Parametro        | Tipo di Dato           | Obbligatorio/Facoltativo | Descrizione                                                          |
| :-------------------- | :--------------------- | :----------------------- | :------------------------------------------------------------------- |
| `category`            | String                 | Facoltativo              | Categoria della proprietà (es. "RESIDENTIAL", "COMMERCIAL", "GARAGE", "LAND"). |
| `contract`            | String                 | Facoltativo              | Tipo di contratto (es. "SALE", "RENT").                              |
| `minPrice`            | BigDecimal             | Facoltativo              | Prezzo minimo della proprietà.                                       |
| `maxPrice`            | BigDecimal             | Facoltativo              | Prezzo massimo della proprietà.                                      |
| `minArea`             | Integer                | Facoltativo              | Area minima in metri quadrati.                                       |
| `minYearBuilt`        | Integer                | Facoltativo              | Anno minimo di costruzione.                                          |
| `acceptedCondition`   | List<PropertyCondition> | Facoltativo              | Condizioni accettate della proprietà (es. "NEW", "TO_BE_RESTORED", "GOOD_CONDITION"). |
| `minEnergyRating`     | EnergyRating           | Facoltativo              | Classificazione energetica minima (es. "A", "B", "C", "D", "E", "F", "G"). |
| `centerLatitude`      | BigDecimal             | **Obbligatorio**         | Latitudine del centro della ricerca geografica.                      |
| `centerLongitude`     | BigDecimal             | **Obbligatorio**         | Longitudine del centro della ricerca geografica.                     |
| `radiusInMeters`      | Double                 | **Obbligatorio**         | Raggio di ricerca in metri dal centro specificato.                   |
| `minNumberOfFloors`   | Integer                | Facoltativo              | Numero minimo di piani (per proprietà residenziali/commerciali).     |
| `minNumberOfRooms`    | Integer                | Facoltativo              | Numero minimo di stanze (per proprietà residenziali).                |
| `minNumberOfBathrooms`| Integer                | Facoltativo              | Numero minimo di bagni (per proprietà residenziali).                 |
| `minParkingSpaces`    | Integer                | Facoltativo              | Numero minimo di posti auto (per garage o proprietà con garage).     |
| `heating`             | String                 | Facoltativo              | Tipo di riscaldamento (es. "AUTONOMOUS", "CENTRALIZED", "PELLET").   |
| `acceptedGarden`      | List<Garden>           | Facoltativo              | Tipi di giardino accettati (es. "PRIVATE", "SHARED").                |
| `mustBeFurnished`     | Boolean                | Facoltativo              | `true` se la proprietà deve essere arredata.                         |
| `mustHaveElevator`    | Boolean                | Facoltativo              | `true` se la proprietà deve avere un ascensore.                      |
| `mustHaveWheelchairAccess` | Boolean           | Facoltativo              | `true` se la proprietà deve essere accessibile ai disabili.          |
| `mustHaveSurveillance`| Boolean                | Facoltativo              | `true` se la proprietà deve avere sorveglianza.                      |
| `mustBeAccessibleFromStreet` | Boolean        | Facoltativo              | `true` se il terreno deve essere accessibile dalla strada.           |

**Nota:** La maggior parte dei campi all'interno di `FilterRequest` sono facoltativi, ad eccezione dei parametri geografici (`centerLatitude`, `centerLongitude`, `radiusInMeters`) che sono **obbligatori** per tutte le query di ricerca.

### Oggetto `Pageable`

Il parametro `pageable` è un oggetto `Pageable` di Spring Data e gestisce la paginazione e l'ordinamento dei risultati. Può includere i seguenti parametri come query string o parte del body (a seconda dell'implementazione del client):
*   `page`: Numero della pagina (base 0).
*   `size`: Numero di elementi per pagina.
*   `sort`: Criteri di ordinamento (es. `price,desc` per ordinare per prezzo decrescente).

## Formato della Risposta Atteso

La risposta dell'endpoint `POST /properties/search` è una pagina (`org.springframework.data.domain.Page`) di oggetti [`PropertyResponse`](src/main/java/com/dieti/dietiestatesbackend/dto/response/PropertyResponse.java).

Ogni oggetto `PropertyResponse` include i seguenti campi principali:

| Nome Campo        | Tipo di Dato       | Descrizione                                          |
| :---------------- | :----------------- | :--------------------------------------------------- |
| `id`              | Long               | ID univoco della proprietà.                          |
| `description`     | String             | Descrizione dettagliata della proprietà.             |
| `price`           | BigDecimal         | Prezzo della proprietà.                              |
| `area`            | Integer            | Area della proprietà in metri quadrati.              |
| `yearBuilt`       | Integer            | Anno di costruzione della proprietà.                  |
| `contract`        | String             | Tipo di contratto (es. "SALE", "RENT").              |
| `propertyCategory`| String             | Categoria della proprietà (es. "RESIDENTIAL", "COMMERCIAL"). |
| `condition`       | String             | Condizione della proprietà.                          |
| `energyRating`    | String             | Classificazione energetica.                          |
| `address`         | AddressResponseDTO | Dettagli dell'indirizzo della proprietà.             |
| `agent`           | AgentResponseDTO   | Dettagli dell'agente associato alla proprietà.       |
| `createdAt`       | LocalDateTime      | Data e ora di creazione della proprietà.             |
| `updatedAt`       | LocalDateTime      | Data e ora dell'ultimo aggiornamento della proprietà. |
| `firstImageUrl`   | String             | URL della prima immagine della proprietà.            |
| `numberOfImages`  | int                | Numero totale di immagini disponibili per la proprietà. |

## Esempi Pratici di Filtri e Possibilità di Ricerca

Il sistema consente una ricerca flessibile combinando filtri comuni, specifici per categoria e geografici. La ricerca geografica (`centerLatitude`, `centerLongitude`, `radiusInMeters`) è obbligatoria per tutte le query di filtro.

### Esempio 1: Ricerca di proprietà residenziali in vendita con filtri di prezzo e numero di stanze

```json
{
  "category": "RESIDENTIAL",
  "contract": "SALE",
  "minPrice": 100000,
  "maxPrice": 300000,
  "minNumberOfRooms": 3,
  "centerLatitude": 41.902782,
  "centerLongitude": 12.496366,
  "radiusInMeters": 5000
}
```

### Esempio 2: Ricerca di garage in affitto con sorveglianza e area minima

```json
{
  "category": "GARAGE",
  "contract": "RENT",
  "minArea": 20,
  "mustHaveSurveillance": true,
  "centerLatitude": 45.464203,
  "centerLongitude": 9.189982,
  "radiusInMeters": 2000
}
```

### Esempio 3: Ricerca di terreni accessibili dalla strada

```json
{
  "category": "LAND",
  "mustBeAccessibleFromStreet": true,
  "centerLatitude": 40.8518,
  "centerLongitude": 14.2681,
  "radiusInMeters": 10000
}
```

**Nome del file:** `docs/API_Ricerca_Proprieta.md`

**Restrizioni:**
*   Devi solo eseguire il lavoro descritto in queste istruzioni e non deviare.
*   Al completamento, usa il tool `attempt_completion` per fornire un riepilogo conciso e completo dei tuoi risultati nel parametro `result`. Questo riepilogo sarà la fonte di verità per il tracciamento del progetto.
*   Queste istruzioni sostituiscono qualsiasi istruzione generale che la tua modalità possa avere in conflitto.