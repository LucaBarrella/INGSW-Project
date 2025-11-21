import { PhotonFeature } from '../../components/Buyer/SearchIntegration/types';

/**
 * Simple Photon autocomplete client.
 * Returns an array of PhotonFeature with a convenience `label`.
 * Uses the public Photon instance at photon.komoot.io.
 */

const PHOTON_BASE = 'https://photon.komoot.io/api/';

export async function getAutocompleteSuggestions(query: string, limit = 5): Promise<PhotonFeature[]> {
  if (!query || !query.trim()) return [];

  const url = `${PHOTON_BASE}?q=${encodeURIComponent(query.trim())}&limit=${limit}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn('[photon.service] non-OK response from Photon', res.status);
      return [];
    }
    const data = await res.json();

    if (!data || !Array.isArray(data.features)) return [];

    const features: PhotonFeature[] = data.features.map((f: any) => {
      // Build a friendly label from available properties
      const p = f.properties || {};
      const parts: string[] = [];
      if (p.name) parts.push(p.name);
      if (p.street) parts.push(p.street);
      if (p.housenumber) parts.push(p.housenumber);
      if (p.city) parts.push(p.city);
      if (p.state) parts.push(p.state);
      if (p.country) parts.push(p.country);
      const label = parts.length ? parts.join(', ') : f.properties.label || f.properties.osm_value || f.properties.name || '';

      return {
        id: f.id ?? `${f.properties.osm_type}_${f.properties.osm_id}`,
        type: f.type ?? 'Feature',
        geometry: f.geometry,
        properties: f.properties,
        label,
      } as PhotonFeature;
    });

    return features;
  } catch (error) {
    console.error('[photon.service] error fetching suggestions', error);
    return [];
  }
}