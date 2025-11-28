import { z } from 'zod';

// Tipi di base che saranno utilizzati in più schemi
const stringRequired = z.string().min(1, 'Campo richiesto');
const positiveNumber = z.string().regex(/^\d+$/, 'Deve essere un numero positivo');
const numberRequired = z.number({ required_error: 'Campo richiesto' });

// Schema per i dettagli residenziali
const residentialDetailsSchema = z.object({
  residentialCategory: stringRequired,
  floor: positiveNumber,
  elevator: z.boolean(),
  pool: z.boolean(),
  numberOfRooms: positiveNumber,
  numberOfFloors: positiveNumber,
  numberOfBathrooms: positiveNumber,
  heatingType: z.enum(['None', 'Autonomous', 'Centralized'], { required_error: 'Seleziona il tipo di riscaldamento' }),
  garden: z.enum(['ABSENT', 'PRIVATE', 'SHARED'], { required_error: 'Seleziona il tipo di giardino' }),
  isFurnished: z.boolean(),
});

// Schema per i dettagli commerciali
const commercialDetailsSchema = z.object({
  commercialCategory: stringRequired,
  commercialBathrooms: positiveNumber,
  emergencyExit: z.boolean(),
  constructionDate: z.string().regex(/^\d{4}$/, 'Anno non valido'),
});

// Schema per i dettagli garage
const garageDetailsSchema = z.object({
  garageCategory: stringRequired,
  hasSurveillance: z.boolean(),
  numberOfFloors: positiveNumber,
  floor: positiveNumber
});

// Schema per i dettagli del terreno
const landDetailsSchema = z.object({
  landCategory: stringRequired,
  soilType: stringRequired,
  slope: z.string().regex(/^\d+(\.\d+)?$/, 'Pendenza non valida'),
});

// Schema base comune a tutti i tipi di proprietà
const basePropertySchema = z.object({
  contractType: z.enum(['SALE', 'RENT'], { required_error: 'Seleziona il tipo di annuncio' }),
  propertyCategory: z.object({
    propertyType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'GARAGE', 'LAND'], { required_error: 'Seleziona il tipo di immobile' }),
    name: z.enum(['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Office', 'Shop', 'Warehouse', 'Restaurant', 'Single Garage', 'Double Garage', 'Parking Space', 'Building Plot', 'Agricultural Land', 'Industrial Land'], { required_error: 'Seleziona la categoria della proprietà' }),
  }),
  description: stringRequired.min(20, 'La descrizione deve essere di almeno 20 caratteri'),
  price: positiveNumber,
  area: positiveNumber,
  energyClass: z.enum(['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G', 'NOT_APPLIABLE'], { required_error: 'Seleziona la classe energetica' }),
  condition: z.enum(["UNDER_CONSTRUCTION", "NEW", "RENOVATED", "GOOD_CONDITION", "TO_BE_RENOVATED", "POOR_CONDITION"], { required_error: 'Seleziona la condizione della proprietà' }),
  addressRequest: z.object({
    country: stringRequired,
    province: stringRequired,
    city: stringRequired,
    street: stringRequired,
    streetNumber: stringRequired,
    building: z.string(),
    latitude: numberRequired,
    longitude: numberRequired,
  })
});

// Schema completo che discrimina in base al tipo di proprietà
export const propertySchema = z.discriminatedUnion('propertyType', [
  // Schema per proprietà residenziali
  z.object({
    propertyType: z.literal('RESIDENTIAL'),
    ...basePropertySchema.omit({ propertyCategory: true }).shape, // Ometti propertyType dal base
    ...residentialDetailsSchema.shape,
  }),
  // Schema per proprietà commerciali
  z.object({
    propertyType: z.literal('COMMERCIAL'),
    ...basePropertySchema.omit({ propertyCategory: true }).shape, // Ometti propertyType dal base
    ...commercialDetailsSchema.shape,
  }),
  // Schema per garage
  z.object({
    propertyType: z.literal('GARAGE'),
    ...basePropertySchema.omit({ propertyCategory: true }).shape, // Ometti propertyType dal base
    ...garageDetailsSchema.shape,
  }),
  // Schema per terreni
  z.object({
    propertyType: z.literal('LAND'),
    ...basePropertySchema.omit({ propertyCategory: true }).shape, // Ometti propertyType dal base
    ...landDetailsSchema.shape,
  }),
]);

export type PropertyFormData = z.infer<typeof propertySchema>;