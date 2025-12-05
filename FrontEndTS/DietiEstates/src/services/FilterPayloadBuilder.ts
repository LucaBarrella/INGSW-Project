import { FilterRequest, PropertyCategory, PropertyCondition, EnergyRating, Garden, Heating, Contract } from "../dto/request/FilterRequest.dto";
import { RESIDENTIAL_CATEGORIES, COMMERCIAL_CATEGORIES, GARAGE_CATEGORIES, LAND_CATEGORIES } from "../../components/Buyer/SearchIntegration/types";

/**
 * FilterPayloadBuilder
 * - Robust builder that normalizes UI filter shapes (FilterState, primitives, ranges)
 *   and omits optional fields that are not set/modified. Keeps geographic fields only
 *   when numeric values are available.
 */
export class FilterPayloadBuilder {
  build(filters: any, geolocation: any): FilterRequest {
    const safeNumber = (v: any): number | undefined => {
      if (v === null || v === undefined || v === '') return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };

    // Unwrap helper:
    // - If a FilterState-like object has isModified=false, treat it as absent.
    // - If a FilterState-like object has .value, unwrap recursively.
    // - Arrays are normalized element-wise.
    // - Plain objects (e.g. { min, max }) are returned as-is.
    const unwrap = (v: any): any => {
      if (v === null || v === undefined) return undefined;
      if (typeof v !== 'object') return v;
      if ('isModified' in v && typeof v.isModified === 'boolean') {
        return v.isModified ? unwrap(v.value) : undefined;
      }
      if ('value' in v) return unwrap(v.value);
      if (Array.isArray(v)) return v.map(unwrap);
      return v;
    };

    // Support both: whole SearchState ({ filters: SearchCriteria }) or direct criteria object
    const criteria = filters?.filters ?? filters ?? {};
    const general = criteria.general ?? {};

    // Geolocation extraction (priority: explicit geolocation param -> general fields)
    let centerLatitude = safeNumber(unwrap(geolocation?.centerLatitude ?? geolocation?.latitude ?? geolocation?.lat ?? general?.centerLatitude));
    let centerLongitude = safeNumber(unwrap(geolocation?.centerLongitude ?? geolocation?.longitude ?? geolocation?.lon ?? general?.centerLongitude));
    let radiusInMeters = safeNumber(unwrap(geolocation?.radiusInMeters ?? (geolocation?.radiusKm ? Number(geolocation.radiusKm) * 1000 : undefined) ?? general?.radiusInMeters));

    // Fallback: searchRadiusKm (se radiusInMeters ancora undefined)
    try {
      if (radiusInMeters === undefined) {
        const raw = unwrap(general?.searchRadiusKm);
        let km: number | undefined;
        if (raw !== undefined && raw !== null) {
          if (typeof raw === 'object') {
            const candidate = raw.max ?? raw.value?.max ?? raw.value ?? raw;
            km = safeNumber(candidate) ?? safeNumber(raw.min ?? raw.value?.min);
          } else {
            km = safeNumber(raw);
          }
        }
        if (km !== undefined) radiusInMeters = km * 1000;
      }
    } catch (e) {
      console.error('[FilterPayloadBuilder] geolocation fallback error', e);
    }

    // Build a mutable request object; we'll remove undefined keys at the end.
    const requestAny: any = {
      centerLatitude: centerLatitude,
      centerLongitude: centerLongitude,
      radiusInMeters: radiusInMeters,
    };

    // Helper to read a filter value from the SearchCriteria.
    // Search order:
    // 1) If the key exists directly on the top-level criteria (rare, e.g. 'general' or legacy shapes) -> unwrap it.
    // 2) If the key exists inside 'general' -> unwrap(general[key])
    // 3) Otherwise search each category section (residential, commercial, garage, land)
    //    and return the first match found. This fixes loss of category-specific filters
    //    that previously were not read because read() only inspected top-level + general.

    const read = (key: string) => {
      try {
        // Direct top-level (edge cases / legacy)
        if (criteria && Object.prototype.hasOwnProperty.call(criteria, key)) {
          return unwrap(criteria[key]);
        }
        // General filters - pass the FilterState object itself to allow unwrap to check isModified
        if (general && Object.prototype.hasOwnProperty.call(general, key)) {
          const gen = (general as any)[key];
          return unwrap(gen);
        }
        // Category-specific sections - search each section and pass the raw FilterState/object to unwrap
        // NOTE: A key like "minNumberOfFloors" may appear in multiple sections (residential/commercial/garage).
        // We must continue searching other sections if the first match is present but unmodified (unwrap -> undefined).
        const categoryKeys = Object.keys(criteria || {}).filter(k => k !== 'general');
        for (const catKey of categoryKeys) {
          const section = (criteria as any)[catKey];
          if (section && typeof section === 'object' && Object.prototype.hasOwnProperty.call(section, key)) {
            const raw = section[key];
            const val = unwrap(raw);
            if (val !== undefined) {
              return val;
            }
            // otherwise continue searching other sections
          }
        }
      } catch (e) {
        console.error('[FilterPayloadBuilder] read() error', e);
      }
      return undefined;
    };

    // Category: resolve robustly (string or object with slug/id/name) and include only when present.
    const extractCategoryValue = (raw: any): string | undefined => {
      const v = unwrap(raw);
      if (v === undefined || v === null) return undefined;
      if (typeof v === 'string') return v;
      if (typeof v === 'number') return String(v);
      if (typeof v === 'object') {
        // prefer slug/name/id in this order
        if ('slug' in v && v.slug) return String(v.slug);
        if ('name' in v && v.name) return String(v.name);
        if ('id' in v && v.id) return String(v.id);
        // nested value
        if ('value' in v) return extractCategoryValue(v.value);
      }
      return undefined;
    };

    // Determine raw category/subcategory string coming from criteria (could be string or object)
    const directCategoryRaw = extractCategoryValue(criteria?.category);
    const catFromSections = (() => {
      try {
        for (const k of Object.keys(criteria || {})) {
          const item = criteria[k];
          if (item && typeof item === 'object' && Object.prototype.hasOwnProperty.call(item, 'category')) {
            const c = extractCategoryValue(item.category);
            if (typeof c === 'string' && c.length > 0) return c;
          }
        }
        const genCat = extractCategoryValue(general?.category);
        if (typeof genCat === 'string' && genCat.length > 0) return genCat;
        return undefined;
      } catch {
        return undefined;
      }
    })();
    // Prefer explicit criteria.category, then sections, then general
    const rawSubcategoryCandidate = directCategoryRaw ?? catFromSections ?? extractCategoryValue(general?.category);

    // normalizer: map a subcategory string (es. "Appartamento"/"Apartment") to a top-level PropertyCategory
    const normalizeToPropertyCategory = (val: any): PropertyCategory | undefined => {
      if (val === undefined || val === null) return undefined;
      const s = String(val).trim();
      if (!s) return undefined;
      const up = s.toUpperCase();
  
      if (['RESIDENTIAL', 'COMMERCIAL', 'GARAGE', 'LAND', 'INDUSTRIAL'].includes(up)) {
        if (up === 'INDUSTRIAL') return 'COMMERCIAL' as PropertyCategory;
        return up as PropertyCategory;
      }
  
      const lower = s.toLowerCase();
      if (RESIDENTIAL_CATEGORIES.some(c => String(c).toLowerCase() === lower)) return 'RESIDENTIAL';
      if (COMMERCIAL_CATEGORIES.some(c => String(c).toLowerCase() === lower)) return 'COMMERCIAL';
      if (GARAGE_CATEGORIES.some(c => String(c).toLowerCase() === lower)) return 'GARAGE';
      if (LAND_CATEGORIES.some(c => String(c).toLowerCase() === lower)) return 'LAND';
  
      // English / alternate keyword fallbacks (cover UI values in different locales)
      if (['shop', 'store', 'office', 'restaurant', 'commercial', 'industrial', 'retail', 'restaurant'].some(k => lower.includes(k))) return 'COMMERCIAL';
      if (['apartment', 'flat', 'house', 'home', 'villa', 'attic', 'loft', 'residential', 'appart'].some(k => lower.includes(k))) return 'RESIDENTIAL';
      if (['garage', 'parking', 'parking space'].some(k => lower.includes(k))) return 'GARAGE';
      if (['land', 'plot', 'field', 'farm', 'terreno', 'pascolo', 'coltiv', 'edific'].some(k => lower.includes(k))) return 'LAND';
  
      return undefined;
    };

    const resolvedTopCat = normalizeToPropertyCategory(rawSubcategoryCandidate);
    if (resolvedTopCat) {
      requestAny.category = resolvedTopCat as PropertyCategory;
    } else {
      const resolvedFromSections = normalizeToPropertyCategory(catFromSections);
      if (resolvedFromSections) requestAny.category = resolvedFromSections as PropertyCategory;
    }
    
    // If still no top-level category resolved, try UI's selectedMainCategoryInPanel (or similar keys)
    if (!requestAny.category) {
      const uiSelected = (filters && (filters.selectedMainCategoryInPanel ?? (filters as any).selectedMainCategory)) ?? undefined;
      if (typeof uiSelected === 'string' && uiSelected.trim().length > 0) {
        const sel = uiSelected.trim().toLowerCase();
        const mapped = sel === 'residential' ? 'RESIDENTIAL'
          : sel === 'commercial' ? 'COMMERCIAL'
          : sel === 'garage' ? 'GARAGE'
          : sel === 'land' ? 'LAND'
          : sel === 'industrial' ? 'COMMERCIAL'
          : undefined;
        if (mapped) {
          requestAny.category = mapped as PropertyCategory;
        }
      }
    }

    // If a more specific subcategory label exists (es. "Apartment"), include it in the payload
    // as propertySubcategoryName so backend can use it even when category is provided.
    const rawSubcat = rawSubcategoryCandidate ?? (directCategoryRaw ?? catFromSections ?? extractCategoryValue(general?.category));
    if (rawSubcat && typeof rawSubcat === 'string') {
      const upRaw = rawSubcat.trim().toUpperCase();
      const upTop = requestAny.category ? String(requestAny.category).toUpperCase() : undefined;
      // Include when rawSubcat is not simply the top-level category name (best-effort)
      if (!upTop || upRaw !== upTop) {
        requestAny.propertySubcategoryName = String(rawSubcat);
      }
    }

    // Contract (sale/rent)
    const maybeContract = read('contract');
    if (typeof maybeContract === 'string') {
      const mc = maybeContract.toLowerCase();
      if (mc === 'sale' || mc === 'sell') requestAny.contract = "SALE" as Contract;
      else if (mc === 'rent') requestAny.contract = "RENT" as Contract;
    }

    // Price range: accept objects {min,max} or primitives
    const pr = read('priceRange');
    if (pr !== undefined && pr !== null) {
      const raw = (pr && typeof pr === 'object' && ('min' in pr || 'max' in pr)) ? pr : (pr?.value ?? pr);
      const min = safeNumber(raw?.min ?? raw?.minimum);
      const max = safeNumber(raw?.max ?? raw?.maximum);
      if (min !== undefined && min > 0) {
        requestAny.minPrice = min;
      }
      if (max !== undefined) requestAny.maxPrice = max;
    }

    // Numeric fields: include only when numeric value defined
    const nums = [
      { key: 'minYearBuilt', target: 'minYearBuilt' },
      { key: 'minNumberOfFloors', target: 'minNumberOfFloors' },
      { key: 'minNumberOfRooms', target: 'minNumberOfRooms' },
      { key: 'minNumberOfBathrooms', target: 'minNumberOfBathrooms' },
      { key: 'minParkingSpaces', target: 'minParkingSpaces' },
    ];
    for (const nf of nums) {
      const v = read(nf.key);
      const n = safeNumber(v);
      if (n !== undefined && n > 0) requestAny[nf.target] = n;
    }

    // Special handling for 'size' filter which is a range {min, max}
    const size = read('size');
    if (size !== undefined && size !== null) {
      const raw = (size && typeof size === 'object' && ('min' in size || 'max' in size)) ? size : (size?.value ?? size);
      const min = safeNumber(raw?.min);
      // Omit minArea if it's 0 or not defined
      if (min !== undefined && min > 0) requestAny.minArea = min;
    }

    // acceptedCondition (accetta stringa singola o array)
    const ac = read('acceptedCondition');
    if (ac !== undefined && ac !== null) {
      if (Array.isArray(ac) && ac.length > 0) {
        requestAny.acceptedCondition = ac.map((c: any) => String(c).toUpperCase()) as PropertyCondition[];
      } else if (typeof ac === 'string' && ac.trim().length > 0) {
        requestAny.acceptedCondition = [String(ac).toUpperCase()] as PropertyCondition[];
      }
    }
    
    // minEnergyRating
    const mer = read('minEnergyRating');
    if (mer !== undefined && mer !== null && typeof mer === 'string' && mer.trim().length > 0) {
      requestAny.minEnergyRating = mer.toUpperCase() as EnergyRating;
    }
    
    // heating
    const heating = read('heating');
    if (heating !== undefined && heating !== null && typeof heating === 'string' && heating.trim().length > 0) {
      requestAny.heating = heating as Heating;
    }
    
    // acceptedGarden (accetta stringa singola o array)
    const ag = read('acceptedGarden');
    if (ag !== undefined && ag !== null) {
      if (Array.isArray(ag) && ag.length > 0) {
        requestAny.acceptedGarden = ag.map((g: any) => String(g).toUpperCase()) as Garden[];
      } else if (typeof ag === 'string' && ag.trim().length > 0) {
        requestAny.acceptedGarden = [String(ag).toUpperCase()] as Garden[];
      }
    }
    
    // Boolean flags: accetta booleani o stringhe 'true'/'false'
    const boolKeys = [
      'mustBeFurnished',
      'mustHaveElevator',
      'mustHaveWheelchairAccess',
      'mustHaveSurveillance',
      'mustBeAccessibleFromStreet',
    ];
    for (const k of boolKeys) {
      const b = read(k);
      if (typeof b === 'boolean') {
        requestAny[k] = b;
      } else if (typeof b === 'string') {
        const low = b.toLowerCase();
        if (low === 'true' || low === 'false') {
          requestAny[k] = low === 'true';
        }
      }
    }

    // Final cleanup: remove undefined/null optional fields so they are omitted from payload
    for (const k of Object.keys({ ...requestAny })) {
      if (requestAny[k] === undefined || requestAny[k] === null) {
        delete requestAny[k];
      }
    }

    return requestAny as FilterRequest;
  }
}