import { SearchCriteria, DEFAULT_CENTER_LATITUDE, DEFAULT_CENTER_LONGITUDE, DEFAULT_RADIUS_IN_METERS, Geolocation } from '@/src/dto/SearchDTO';

export interface SearchPayload {
  centerLatitude?: number;
  centerLongitude?: number;
  radiusInMeters?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  contract?: 'rent' | 'sale';
  [key: string]: any;
}

/**
 * FilterPayloadBuilder
 * - Costruisce il payload piatto che sarà inviato all'API a partire dallo stato dei filtri UI (SearchCriteria).
 * - Regole principali:
 *   - centerLatitude/centerLongitude/radiusInMeters sempre inizializzati (radius > 0, fallback al default)
 *   - priceRange/size inclusi solo se isModified === true
 *   - tutti gli altri filtri inclusi solo se isModified === true
 */
export class FilterPayloadBuilder {
  static build(filters: SearchCriteria, geolocation?: Geolocation | null): SearchPayload {
    if (!filters) {
      throw new Error('FilterPayloadBuilder.build: filters is required');
    }

    const payload: SearchPayload = {};

    // Geolocalizzazione: priorità a geolocation (da Photon), poi filters, poi default
    const lat = geolocation?.lat ?? filters.general?.centerLatitude?.value ?? DEFAULT_CENTER_LATITUDE;
    const lon = geolocation?.lon ?? filters.general?.centerLongitude?.value ?? DEFAULT_CENTER_LONGITUDE;
    
    // Logica Raggio:
    // La priorità è:
    // 1. Valore modificato dall'utente nello slider.
    // 2. Raggio suggerito da Photon (se presente).
    // 3. Valore di default.
    let radius = DEFAULT_RADIUS_IN_METERS;
    console.log(`[FilterPayloadBuilder] Inizio calcolo raggio. Default: ${radius}`);
    console.log(`[FilterPayloadBuilder] geolocation?.radiusKm: ${geolocation?.radiusKm}`);
    console.log(`[FilterPayloadBuilder] filters.general?.searchRadiusKm?.isModified: ${filters.general?.searchRadiusKm?.isModified}`);
    console.log(`[FilterPayloadBuilder] filters.general?.searchRadiusKm?.value: ${JSON.stringify(filters.general?.searchRadiusKm?.value)}`);

    if (filters.general?.searchRadiusKm?.isModified && filters.general.searchRadiusKm.value) {
      radius = filters.general.searchRadiusKm.value.max * 1000;
      console.log(`[FilterPayloadBuilder] Raggio impostato da searchRadiusKm (modificato): ${radius}`);
    } else if (geolocation?.radiusKm) {
      radius = geolocation.radiusKm * 1000;
      console.log(`[FilterPayloadBuilder] Raggio impostato da geolocation: ${radius}`);
    } else {
      console.log(`[FilterPayloadBuilder] Nessuna condizione valida, si usa il default: ${radius}`);
    }

    if (!Number.isFinite(radius) || radius <= 0) {
      radius = DEFAULT_RADIUS_IN_METERS;
    }

    payload.centerLatitude = lat;
    payload.centerLongitude = lon;
    payload.radiusInMeters = radius;

    // Price range: includi solo se modificato dall'utente
    const price = filters.general?.priceRange;
    if (price?.isModified && price.value) {
      const { min, max } = price.value;
      if (typeof min === 'number') payload.minPrice = min;
      if (typeof max === 'number') payload.maxPrice = max;
    }

    // Size -> minArea (invia solo il minimo come faceva l'API precedente)
    const size = filters.general?.size;
    if (size?.isModified && size.value && typeof size.value.min === 'number') {
      payload.minArea = size.value.min;
    }

    // Contract (rent|sale)
    if (filters.general?.contract?.isModified) {
      payload.contract = filters.general.contract.value;
    }

    // Helper generico per aggiungere campi di categoria (residential/commercial/garage/land).
    // Saltare i campi già gestiti o di controllo.
    const addCategoryFields = (category: any) => {
      if (!category) return;
      for (const k of Object.keys(category)) {
        if (['priceRange', 'size', 'centerLatitude', 'centerLongitude', 'radiusInMeters', 'enabled', 'searchRadiusKm'].includes(k)) {
          continue;
        }
        const state = category[k];
        // I nostri FilterState sono oggetti { value, defaultValue, isModified }
        if (state && typeof state === 'object' && 'isModified' in state) {
          if (state.isModified) {
            payload[k] = state.value;
          }
        }
      }
    };

    addCategoryFields(filters.residential);
    addCategoryFields(filters.commercial);
    addCategoryFields(filters.garage);
    addCategoryFields(filters.land);

    return payload;
  }
}

export default FilterPayloadBuilder;