// Utilities for image URL generation
// FrontEndTS/DietiEstates/src/utils/imageUtils.ts

/**
 * Generate full image URLs for a property given the firstImageUrl and numberOfImages.
 * @param firstImageUrl - Example: https://dietiestatesstorage.blob.core.windows.net/properties/<ULID>/0.webp
 * @param numberOfImages - Total images to generate
 * @returns Array of image URLs or [] when not possible
 */
export function generatePropertyImageUrls(firstImageUrl: string, numberOfImages: number): string[] {
  // DEBUG: log inputs
  console.log('imageUtils.generatePropertyImageUrls called ->', { firstImageUrl, numberOfImages });

  if (!firstImageUrl && (!numberOfImages || numberOfImages <= 0)) {
    console.log('imageUtils: no firstImageUrl and numberOfImages<=0 -> returning []');
    return [];
  }

  // If API reports zero images but we have a firstImageUrl, return it as a default placeholder
  if (numberOfImages === 0) {
    console.log('imageUtils: numberOfImages === 0, returning firstImageUrl as fallback ->', firstImageUrl);
    return firstImageUrl ? [firstImageUrl] : [];
  }

  if (!firstImageUrl) {
    return [];
  }

  try {
    // Remove query string if present
    const withoutQuery = firstImageUrl.split('?')[0];
    // Find last slash and remove the trailing filename (e.g. /0.webp)
    const lastSlash = withoutQuery.lastIndexOf('/');
    if (lastSlash === -1) {
      console.log('imageUtils: invalid firstImageUrl (no slash) ->', firstImageUrl);
      return [];
    }
    const prefix = withoutQuery.slice(0, lastSlash); // e.g. https://.../dati-folder/ULID
    // Preserve original extension if possible, fallback to .webp
    const extMatch = withoutQuery.match(/\.(\w+)$/);
    const ext = extMatch ? `.${extMatch[1]}` : '.webp';

    const urls: string[] = [];
    for (let i = 0; i < numberOfImages; i++) {
      urls.push(`${prefix}/${i}${ext}`);
    }

    console.log('imageUtils: generated URLs by filename-replace ->', { prefix, ext, urls });
    return urls;
  } catch (err) {
    console.log('imageUtils: unexpected error while generating URLs ->', err, firstImageUrl);
    return [];
  }
}