import { z } from 'zod';

// Tipi di base che saranno utilizzati in più schemi
const stringRequired = z.string().min(1, 'Campo richiesto');
const positiveNumber = z.string().regex(/^\d+$/, 'Deve essere un numero positivo');

// Schema per i dettagli residenziali
const residentialDetailsSchema = z.object({
  residentialCategory: stringRequired,
  rooms: positiveNumber,
  bathrooms: positiveNumber,
  floor: z.string().regex(/^-?\d+$/, 'Deve essere un numero'),
  elevator: z.boolean(),
  pool: z.boolean(),
});

// Schema per i dettagli commerciali
const commercialDetailsSchema = z.object({
  commercialCategory: stringRequired,
  commercialBathrooms: positiveNumber,
  emergencyExit: z.boolean(),
  constructionDate: z.string().regex(/^\d{4}$/, 'Anno non valido'),
});

// Schema per i dettagli industriali
const industrialDetailsSchema = z.object({
  industrialCategory: stringRequired,
  ceilingHeight: z.string().regex(/^\d+(\.\d+)?$/, 'Altezza non valida'),
  fireSystem: z.boolean(),
  floorLoad: positiveNumber,
  offices: positiveNumber,
  structure: stringRequired,
});

// Schema per i dettagli del terreno
const landDetailsSchema = z.object({
  landCategory: stringRequired,
  soilType: stringRequired,
  slope: z.string().regex(/^\d+(\.\d+)?$/, 'Pendenza non valida'),
});

// Schema base comune a tutti i tipi di proprietà
const basePropertySchema = z.object({
  listingType: z.enum(['SALE', 'RENT'], { required_error: 'Seleziona il tipo di annuncio' }),
  propertyType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND'], { required_error: 'Seleziona il tipo di immobile' }),
  title: stringRequired.min(5, 'Il titolo deve essere di almeno 5 caratteri'),
  description: stringRequired.min(20, 'La descrizione deve essere di almeno 20 caratteri'),
  price: positiveNumber,
  size: positiveNumber,
  address: stringRequired,
  city: stringRequired,
  energyClass: z.string().min(1, 'Seleziona una classe energetica'),
  availability: z.boolean(),
});

// Schema completo che discrimina in base al tipo di proprietà
export const propertySchema = z.discriminatedUnion('propertyType', [
  // Schema per proprietà residenziali
  z.object({
    propertyType: z.literal('RESIDENTIAL'),
    ...basePropertySchema.omit({ propertyType: true }).shape, // Ometti propertyType dal base
    ...residentialDetailsSchema.shape,
  }),
  // Schema per proprietà commerciali
  z.object({
    propertyType: z.literal('COMMERCIAL'),
    ...basePropertySchema.omit({ propertyType: true }).shape, // Ometti propertyType dal base
    ...commercialDetailsSchema.shape,
  }),
  // Schema per proprietà industriali
  z.object({
    propertyType: z.literal('INDUSTRIAL'),
    ...basePropertySchema.omit({ propertyType: true }).shape, // Ometti propertyType dal base
    ...industrialDetailsSchema.shape,
  }),
  // Schema per terreni
  z.object({
    propertyType: z.literal('LAND'),
    ...basePropertySchema.omit({ propertyType: true }).shape, // Ometti propertyType dal base
    ...landDetailsSchema.shape,
  }),
]);

export type PropertyFormData = z.infer<typeof propertySchema>;