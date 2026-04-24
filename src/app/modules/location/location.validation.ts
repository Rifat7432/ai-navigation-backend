import { z } from 'zod';

const createLocationZodSchema = z.object({
  body: z.object({
    venue: z.string().optional(),
    zone: z.string().optional(),
    label: z.string().optional(),
    address: z.string().optional(),
    locationType: z.enum(['indoor', 'outdoor']).optional(),
    floor: z.number().optional(),
    gpsCoordinates: z
      .object({
        type: z.literal('Point'),
        coordinates: z.tuple([z.number(), z.number()]),
      })
      .optional(),
    indoorPosition: z
      .object({
        x: z.number().nullable().optional(),
        y: z.number().nullable().optional(),
      })
      .optional(),
    isFavorite: z.boolean().optional(),
  }),
});

const updateLocationZodSchema = z.object({
  body: z.object({
    venue: z.string().optional(),
    zone: z.string().optional(),
    label: z.string().optional(),
    address: z.string().optional(),
    locationType: z.enum(['indoor', 'outdoor']).optional(),
    floor: z.number().optional(),
    gpsCoordinates: z
      .object({
        type: z.literal('Point'),
        coordinates: z.tuple([z.number(), z.number()]),
      })
      .optional(),
    indoorPosition: z
      .object({
        x: z.number().nullable().optional(),
        y: z.number().nullable().optional(),
      })
      .optional(),
    isFavorite: z.boolean().optional(),
  }),
});

export const LocationValidation = {
  createLocationZodSchema,
  updateLocationZodSchema,
};
