import { PhotonFeature } from '@/components/Buyer/SearchIntegration/types';
import SearchRepository from '@/src/repositories/SearchRepository';
import SuggestionsRepository from '@/src/repositories/SuggestionsRepository';
import SearchStateRepository from '@/src/repositories/SearchStateRepository';
import { SearchState } from '@/context/SearchContext';

/**
 * SearchService
 * - Contiene logica di business leggera relativa alla ricerca e ai filtri.
 * - Non fa chiamate HTTP dirette: delega al repository.
 * - Espone helper per:
 *    * orchestrare persistenza tramite il repository
 *    * invocare ricerche costruendo il payload tramite FilterPayloadBuilder
 */

import FilterPayloadBuilder from '@/src/services/FilterPayloadBuilder';
import type { SearchCriteria, Geolocation } from '@/src/dto/SearchDTO';
import type { PropertyDetailDTO } from '@/src/dto/PropertyDetailsDTO';

/** Carica lo stato (parte) persistito tramite il repository */
export async function loadPersistedState(): Promise<Partial<SearchState>> {
  return SearchStateRepository.loadStateFromStorage();
}

/** Salva lo stato corrente tramite repository */
export async function persistState(state: SearchState): Promise<void> {
  await SearchStateRepository.saveStateToStorage(state);
}

/** Invoca la ricerca tramite repository (costruendo il payload dai FilterState UI) */
export async function searchProperties(filters: SearchCriteria, geolocation?: Geolocation | null) {
  // Costruiamo il payload solo a partire dai filtri UI.
  // NOTA: non includiamo più `query` nel payload — il backend deve ricevere solo
  // centerLatitude/centerLongitude/radiusInMeters e gli altri filtri.
  const payload = FilterPayloadBuilder.build(filters, geolocation);
  return SearchRepository.searchProperties(payload as any);
}

/** Recupera suggerimenti delegando al repository */
export async function getSuggestions(query: string): Promise<PhotonFeature[]> {
  return SuggestionsRepository.getSuggestions(query);
}

/** Salva i suggerimenti delegando al repository */
export async function saveSuggestions(query: string, suggestions: PhotonFeature[]): Promise<void> {
  return SuggestionsRepository.saveSuggestions(query, suggestions);
}

/** Recupera i dettagli delle proprietà a partire dagli id (delegato al repository) */
export async function getPropertiesByIds(propertyIds: string[]): Promise<PropertyDetailDTO[]> {
  return SearchRepository.getPropertiesByIds(propertyIds);
}

export default {
  loadPersistedState,
  persistState,
  searchProperties,
  getSuggestions,
  saveSuggestions,
};
