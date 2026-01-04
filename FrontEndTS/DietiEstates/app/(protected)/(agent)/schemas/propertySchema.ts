import { z } from 'zod';

export const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_union_discriminator) {
    return { message: 'Seleziona il tipo di immobile' };
  }
  return { message: ctx.defaultError };
};

// Tipi di base
const stringRequired = z.string().min(1, 'Campo richiesto');
const positiveNumber = z.string().regex(/^\d+$/, 'Deve essere un numero positivo');
const numberRequired = z.number({ required_error: 'Campo richiesto' });
const positiveNumberGreaterThanZero = z.string().regex(/^[1-9]\d*$/, 'Deve essere un numero positivo maggiore di zero');
const yearSchema = z.string().regex(/^\d{4}$/, 'Anno non valido');

// Schema base comune
const basePropertySchema = z.object({
  contractType: z.enum(['SALE', 'RENT'], { required_error: 'Seleziona il tipo di annuncio' }),
  description: stringRequired.min(20, 'La descrizione deve essere di almeno 20 caratteri'),
  price: positiveNumber,
  area: positiveNumber,
  energyRating: z.enum(['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G', 'NOT_APPLIABLE'], { required_error: 'Seleziona la classe energetica' }),
  condition: z.enum(["NEW", "GOOD_CONDITION", "RENOVATED", "TO_BE_RENOVATED", "POOR_CONDITION", "UNDER_CONSTRUCTION"], { required_error: 'Seleziona la condizione' }),
  addressRequest: z.object({
    country: stringRequired,
    province: stringRequired,
    city: stringRequired,
    street: stringRequired,
    streetNumber: stringRequired,
    building: z.string().nullable(),
    latitude: numberRequired,
    longitude: numberRequired,
  })
});

// Schema completo (Allineato al componente add-property.tsx e al DB)
export const propertySchema = z.discriminatedUnion('propertyType', [
  // RESIDENTIAL
  z.object({
    propertyType: z.literal('RESIDENTIAL'),
    ...basePropertySchema.shape,
    residentialCategory: z.enum(['Apartment', 'Villa', 'Penthouse', 'Townhouse'], { required_error: 'Seleziona la categoria' }),
    yearBuilt: yearSchema.optional(),
    floor: positiveNumber,
    hasElevator: z.boolean(),
    numberOfRooms: positiveNumberGreaterThanZero,
    numberOfFloors: positiveNumberGreaterThanZero,
    numberOfBathrooms: positiveNumberGreaterThanZero,
    heatingType: z.enum(['Centralized', 'Autonomous', 'Absent'], { required_error: 'Seleziona il riscaldamento' }),
    garden: z.enum(['PRIVATE', 'SHARED', 'ABSENT'], { required_error: 'Seleziona il giardino' }),
    isFurnished: z.boolean(),
    parkingSpaces: positiveNumber,
  }),
  // COMMERCIAL
  z.object({
    propertyType: z.literal('COMMERCIAL'),
    ...basePropertySchema.shape,
    commercialCategory: z.enum(['Office', 'Shop', 'Warehouse', 'Restaurant'], { required_error: 'Seleziona la categoria' }),
    yearBuilt: yearSchema,
    hasDisabledAccess: z.boolean(),
    floor: positiveNumber,
    numberOfFloors: positiveNumberGreaterThanZero,
    numberOfBathrooms: positiveNumberGreaterThanZero,
    numberOfRooms: positiveNumberGreaterThanZero,
  }),
  // GARAGE
  z.object({
    propertyType: z.literal('GARAGE'),
    ...basePropertySchema.shape,
    garageCategory: z.enum(['Single Garage', 'Double Garage', 'Parking Space'], { required_error: 'Seleziona la categoria' }),
    yearBuilt: yearSchema,
    hasSurveillance: z.boolean(),
    numberOfFloors: positiveNumberGreaterThanZero,
    floor: positiveNumber
  }),
  // LAND
  z.object({
    propertyType: z.literal('LAND'),
    ...basePropertySchema.shape,
    landCategory: z.enum(['Building Plot', 'Agricultural Land', 'Industrial Land'], { required_error: 'Seleziona la categoria' }),
    hasRoadAccess: z.boolean(),
  }),
]);

export type PropertyFormData = z.infer<typeof propertySchema>;