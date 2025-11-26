import { PhotonFeature } from '@/components/Buyer/SearchIntegration/types';
import httpClient from '@/src/core/httpClient';

const PHOTON_BASE = 'https://photon.komoot.io/api/';

export default class PhotonApi {
  static async getAutocompleteSuggestions(query: string, limit = 6): Promise<PhotonFeature[]> {
    if (!query || !query.trim()) return [];

    const q = query.trim();
    const url = `${PHOTON_BASE}?q=${encodeURIComponent(q)}&limit=${limit}`;

    try {
      const res = await httpClient.get(url);
      const data = (res && (res as any).data) || null;

      if (!data || !Array.isArray(data.features)) return [];

      const features: PhotonFeature[] = (data.features as any[]).map((f: any) => {
        const p = f.properties || {};
        const parts: string[] = [];
        if (p.name) parts.push(p.name);
        if (p.street) parts.push(p.street);
        if (p.housenumber) parts.push(p.housenumber);
        if (p.city) parts.push(p.city);
        if (p.state) parts.push(p.state);
        if (p.country) parts.push(p.country);
        const label = parts.length ? parts.join(', ') : p.label || p.osm_value || p.name || '';

        return {
          id: f.id ?? `${p.osm_type}_${p.osm_id}`,
          type: f.type ?? 'Feature',
          geometry: f.geometry,
          properties: p,
          label,
        } as PhotonFeature;
      });

      return features;
    } catch (error) {
      console.error('[PhotonApi] error fetching suggestions', error);
      return [];
    }
  }
}