/**
 * uiHelpers.ts
 *
 * Helper utilities for UI formatting: price localization, safe image retrieval,
 * and robust address handling.
 */

export type AddressDisplay = {
  city?: string;
  country?: string;
  street?: string;
  streetNumber?: string;
  display: string;
};

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/000000/FFFFFF.webp?text=Image+Not+Found&font=Poppins';

/**
 * Format a numeric amount as an Italian localized Euro price.
 *
 * @param amount - Numeric amount in Euros.
 * @returns Localized price string (e.g. "1.200 €").
 * @throws {TypeError} If amount is not a finite number.
 */
export function formatPrice(amount: number): string {
  if (!Number.isFinite(amount)) {
    throw new TypeError('formatPrice expects a finite number');
  }

  const formatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
}

/**
 * Safely retrieve a single image URL for a property.
 *
 * Handles different shapes:
 * - property.imageUrl can be a string or an array of strings
 * - property.firstImageUrl
 * - property.image, property.images arrays
 *
 * Always returns a valid URL string (fallback to placeholder when missing).
 *
 * @param property - Any object representing a property.
 * @returns A string URL safe to use in an <Image> source.
 */
export function getPropertyImage(property: any): string {
  if (!property) return PLACEHOLDER_IMAGE;

  const tryString = (v: any): string | undefined => {
    if (!v) return undefined;
    if (typeof v === 'string' && v.trim().length > 0) return v;
    if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'string' && v[0].trim().length > 0) return v[0];
    return undefined;
  };

  const candidates = [
    tryString(property.imageUrl),
    tryString(property.images),
    tryString(property.image),
    tryString(property.firstImageUrl),
    tryString(property.firstImage),
  ];

  for (const c of candidates) {
    if (c) return c;
  }

  return PLACEHOLDER_IMAGE;
}

/**
 * Safely produce a displayable address representation.
 *
 * Accepts address as a string or an object. When an object is provided,
 * it extracts common fields and builds a readable string while avoiding crashes.
 *
 * @param address - Address value (object or string).
 * @returns AddressDisplay containing parsed fields and a display string.
 */
export function safeGetAddress(address: any): AddressDisplay {
  if (!address) {
    return { display: 'N/D' };
  }

  if (typeof address === 'string') {
    return { display: address };
  }

  const city = typeof address.city === 'string' ? address.city : undefined;
  const country = typeof address.country === 'string' ? address.country : undefined;
  const street = typeof address.street === 'string' ? address.street : undefined;
  const streetNumber = typeof address.streetNumber === 'string' ? address.streetNumber : undefined;

  const parts: string[] = [];
  if (city) parts.push(city);
  if (country) parts.push(`(${country})`);
  if (street) parts.push(street);
  if (streetNumber) parts.push(streetNumber);

  const display = parts.length > 0 ? parts.join(' ') : 'N/D';

  return { city, country, street, streetNumber, display };
}